-- TsuLiPa⭐World · Auditoria de segurança e leveza do Supabase (20/11/2026)
-- Vai junto da PR #124 e é aplicada pela integração GitHub–Supabase no merge.
-- Nada aqui apaga dados de jogadores. Só fecha acessos que o site não usa e
-- troca o crédito dos minijogos do camarim por início + fim de partida no servidor.
--
-- O que NÃO muda, de propósito:
--   · Teto de importação do save local: segue ★1.000 (decisão da migração
--     20261027034657 v212_teto_importacao_1000, posterior à nota de ★2.000).
--   · Os 11 índices nunca usados ficam: o volume ainda é pequeno.
--   · Proteção contra senhas vazadas: o login é só com Google; é ajuste do painel Auth.
--   · RPCs de leitura pública que o modo visitante usa (ranking, vitrine, outdoors,
--     perfil público, calendário, presença, notícias, pódios) continuam abertas para anon:
--     elas só devolvem o que a página de privacidade já diz que é público.

begin;

-- 1) Ranking antigo: ninguém lê a tabela direto (o site usa top_scores e perfil_publico,
--    que são SECURITY DEFINER). Sem SELECT, user_id e device_id deixam de ficar expostos.
drop policy if exists "ler ranking" on public.leaderboard;
drop policy if exists "ler ranking logado" on public.leaderboard;
revoke select on public.leaderboard from anon, authenticated;

-- 2) Segunda camada: o site escreve só por RPC. Tira escrita direta das tabelas
--    que ainda tinham os grants padrão (o RLS sem policy já bloqueava).
do $$
declare t text;
begin
  foreach t in array array[
    'admin_log','aniver_presentes','camarim_coracoes','duo_avisos','duo_log','duo_presentes',
    'encontros','gacha','leaderboard','missoes_feitas','players','presentes','presentes_resgates',
    'runs','star_log','visitas']
  loop
    if to_regclass('public.' || t) is not null then
      execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;

-- 3) RPCs que só funcionam com login não precisam aceitar visitante.
revoke execute on function public.encontro_hoje(integer) from public, anon;
revoke execute on function public.camarim_coracao(text) from public, anon;
grant execute on function public.encontro_hoje(integer) to authenticated;
grant execute on function public.camarim_coracao(text) to authenticated;

--    Perfil público: conta bloqueada pela moderação não aparece para os outros
--    (a busca, o tour e os outdoors já filtravam; o perfil direto não).
create or replace function public.perfil_publico(p_nick text)
 returns json
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select json_build_object(
    'nick', p.nick, 'best', p.best, 'desde', p.created_at, 'avatar', p.avatar, 'oshi', p.oshi, 'frase', p.frase, 'recados_on', p.recados_on,
    'emoji', p.emoji, 'cor', p.cor, 'grupo', p.grupo, 'time', p.time,
    'duo_on', p.duo_on and not coalesce(p.bloqueado, false),
    'aniver_hoje', public.aniver_hoje(p.aniver),
    'cards', public.ultimos_cards(p.id),
    'pets', (select coalesce(json_agg(json_build_object('k', k, 'nome', v->>'nome', 'xp', (v->>'xp'), 'acc', v->>'acc', 'cfg', v->'cfg')), '[]'::json)
             from jsonb_each(coalesce(p.nuvem_pet->'pets', '{}'::jsonb)) as e(k, v)),
    'ativo', p.nuvem_pet->>'ativo',
    'corridas', greatest(p.corridas_total, (select count(*) from public.leaderboard l where l.user_id = p.id)),
    'pos_geral', case when p.best > 0 then (select count(*) + 1 from public.players o where o.best > p.best) end,
    'ultimas', (select coalesce(json_agg(r), '[]'::json) from (select l.id, l.score, l."char", l.created_at from public.leaderboard l where l.user_id = p.id order by l.created_at desc limit 5) r),
    'melhores', (select coalesce(json_agg(r), '[]'::json) from (select l.id, l.score, l."char", l.created_at from public.leaderboard l where l.user_id = p.id order by l.score desc, l.created_at limit 5) r),
    'coracoes', (select count(*) from public.coracoes c where c.para = p.id),
    'dei_coracao', exists (select 1 from public.coracoes c where c.para = p.id and c.de = auth.uid() and c.dia = public.hoje_br()),
    'recado_hoje', exists (select 1 from public.recados r where r.para = p.id and r.de = auth.uid() and r.dia = public.hoje_br()),
    'eu', p.id = auth.uid(),
    'recados', public.recados_de(p.id),
    'insignias', public.insignias(p.id),
    'mini', public.mini_resumo(p.id),
    'admin_ver', public.eh_admin() and p.id is distinct from auth.uid(),
    'bloqueado', case when public.eh_admin() then p.bloqueado end
  ) from public.players p
  where lower(p.nick) = lower(btrim(coalesce(p_nick, '')))
    and (not coalesce(p.bloqueado, false) or p.id = auth.uid() or public.eh_admin());
$function$;

-- 5) Minijogos do camarim (Ritmo e Corda): o servidor marca o início e confere o tempo.
--    Mesmo teto de antes: até ★40 por partida e ★50 por dia (PET_MINI_CAP).
create table if not exists private.mini_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.players(id) on delete cascade,
  jogo text not null check (jogo in ('ritmo', 'corda')),
  started_at timestamptz not null default now()
);
create index if not exists mini_runs_user_idx on private.mini_runs (user_id, started_at desc);
alter table private.mini_runs enable row level security;
revoke all on private.mini_runs from anon, authenticated;

create or replace function public.mini_run_start(p_jogo text)
 returns json
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare v_uid uuid := auth.uid(); v_id uuid;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if coalesce(p_jogo, '') not in ('ritmo', 'corda') then return json_build_object('ok', false, 'erro', 'jogo'); end if;
  if not exists (select 1 from public.players p where p.id = v_uid and not coalesce(p.bloqueado, false)) then
    return json_build_object('ok', false, 'erro', 'sem_conta');
  end if;
  -- partidas esquecidas (aba fechada) somem; no máximo uma aberta por conta
  delete from private.mini_runs where user_id = v_uid;
  insert into private.mini_runs (user_id, jogo) values (v_uid, p_jogo) returning id into v_id;
  return json_build_object('ok', true, 'run', v_id);
end $function$;

create or replace function public.mini_run_finish(p_run uuid, p_qtd integer)
 returns json
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_inicio timestamptz;
  v_seg numeric;
  v_hoje date := (now() at time zone 'America/Sao_Paulo')::date;
  v_ja integer;
  v_dar integer;
  v_stars integer;
begin
  if v_uid is null or p_run is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  perform 1 from public.players where id = v_uid for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  delete from private.mini_runs where id = p_run and user_id = v_uid returning started_at into v_inicio;
  if v_inicio is null then return json_build_object('ok', false, 'erro', 'partida'); end if;
  v_seg := extract(epoch from now() - v_inicio);
  if v_seg < 8 or v_seg > 900 then return json_build_object('ok', false, 'erro', 'partida'); end if;
  select coalesce(sum(delta), 0) into v_ja from public.star_log
   where user_id = v_uid and reason = 'minijogo' and (created_at at time zone 'America/Sao_Paulo')::date = v_hoje;
  -- ★ por partida limitadas pelo tempo jogado (a música do Ritmo dura ~46 s e dá até ★40)
  v_dar := greatest(0, least(coalesce(p_qtd, 0), 40, floor(v_seg)::integer, 50 - v_ja));
  if v_dar > 0 then
    update public.players set stars = stars + v_dar, updated_at = now() where id = v_uid returning stars into v_stars;
    insert into public.star_log (user_id, delta, reason) values (v_uid, v_dar, 'minijogo');
  else
    select stars into v_stars from public.players where id = v_uid;
  end if;
  return json_build_object('ok', true, 'stars', v_stars, 'dadas', v_dar);
end $function$;

revoke all on function public.mini_run_start(text) from public, anon;
revoke all on function public.mini_run_finish(uuid, integer) from public, anon;
grant execute on function public.mini_run_start(text) to authenticated;
grant execute on function public.mini_run_finish(uuid, integer) to authenticated;

-- O crédito antigo (quantidade enviada pelo navegador) sai de uso.
revoke execute on function public.ganhar_minijogo(integer) from public, anon, authenticated;

-- 6) Recordes de Handshake e Café numa chamada só (antes eram duas na abertura).
create or replace function public.meus_recordes_jogos()
 returns json
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select json_build_object('hand', public.meus_recordes_jogo('hand'), 'cafe', public.meus_recordes_jogo('cafe'));
$function$;
revoke all on function public.meus_recordes_jogos() from public, anon;
grant execute on function public.meus_recordes_jogos() to authenticated;

-- 7) Sora: chave primária própria (as chaves únicas por período continuam iguais).
alter table private.sora_scores add column if not exists id bigint generated always as identity;
do $$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'private.sora_scores'::regclass and contype = 'p') then
    alter table private.sora_scores add constraint sora_scores_pkey primary key (id);
  end if;
end $$;

commit;
