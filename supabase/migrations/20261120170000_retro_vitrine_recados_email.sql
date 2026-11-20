-- TsuLiPa⭐World · mais pessoal (20/11/2026, PR #124)
--   1) Retrospectiva do mês: o mês de cada pessoa em números (só a própria conta lê a sua).
--   2) Vitrine do perfil: card favorito, insígnia de destaque e "música do coração", conferidos no servidor.
--   3) Caixa de recados para o TsuLiPa: mensagens dos jogadores que só a moderação lê.
--   4) Email mensal opcional: a pessoa liga ou desliga; o envio é de uma Edge Function (supabase/functions/email-mensal),
--      que só é publicada quando a dona criar a chave do serviço de email.
-- Aplicada no merge pela integração GitHub–Supabase.

begin;

-- ---------- 1) Retrospectiva do mês ----------
-- núcleo (também usado pela Edge Function do email mensal, com a chave de serviço)
create or replace function private.retro_de(v_uid uuid, p_mes date default null)
 returns json
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare
  v_hoje date := public.hoje_br();
  v_ini date := date_trunc('month', coalesce(p_mes, (date_trunc('month', public.hoje_br()) - interval '1 day')::date))::date;
  v_fim date;
  r json;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  -- só meses que já acabaram (o atual vale como "até agora") e no máximo um ano para trás
  if v_ini > date_trunc('month', v_hoje)::date or v_ini < (date_trunc('month', v_hoje) - interval '12 months')::date then
    return json_build_object('ok', false, 'erro', 'mes');
  end if;
  v_fim := least((v_ini + interval '1 month' - interval '1 day')::date, v_hoje);
  select json_build_object(
    'ok', true, 'mes', v_ini, 'ate', v_fim,
    'nick', (select nick from public.players where id = v_uid),
    'dias', (select count(distinct d) from (
        select (created_at at time zone 'America/Sao_Paulo')::date d from public.star_log where user_id = v_uid
        union select (created_at at time zone 'America/Sao_Paulo')::date from public.leaderboard where user_id = v_uid
        union select dia from private.kt_runs where player_id = v_uid and finished_at is not null
        union select (finished_at at time zone 'America/Sao_Paulo')::date from private.sora_history where player_id = v_uid
        union select dia from public.duo_log where de = v_uid) x where d between v_ini and v_fim),
    'corridas', (select count(*) from public.leaderboard where user_id = v_uid and (created_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim),
    'melhor', (select coalesce(max(score), 0) from public.leaderboard where user_id = v_uid and (created_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim),
    'musicas', (select count(*) from private.kt_runs where player_id = v_uid and finished_at is not null and dia between v_ini and v_fim),
    'sora', (select coalesce(max(score), 0) from private.sora_history where player_id = v_uid and (finished_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim),
    'estrelas', (select coalesce(sum(delta), 0) from public.star_log where user_id = v_uid and delta > 0 and (created_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim),
    'cards', (select count(*) from public.gacha where user_id = v_uid and tipo = 'card' and dia between v_ini and v_fim),
    'fotos', (select count(*) from private.studio_mural where user_id = v_uid and dia between v_ini and v_fim),
    'duo', (select count(*) from public.duo_log where de = v_uid and dia between v_ini and v_fim),
    'battles', (select count(*) from private.battle_partidas where player_id = v_uid and dia between v_ini and v_fim),
    'idol', (select n from (select jsonb_array_elements_text(unit) n from private.battle_partidas
                             where player_id = v_uid and dia between v_ini and v_fim and jsonb_typeof(unit) = 'array') u
             group by n order by count(*) desc, n limit 1),
    'show', (select count(*) from private.show_sabado where user_id = v_uid and sabado between v_ini and v_fim)
  ) into r;
  return r;
end $function$;
revoke all on function private.retro_de(uuid, date) from public, anon, authenticated;
create or replace function public.retro_mes(p_mes date default null)
 returns json language sql stable security definer set search_path to 'public'
as $function$ select private.retro_de(auth.uid(), p_mes) $function$;
revoke all on function public.retro_mes(date) from public, anon;
grant execute on function public.retro_mes(date) to authenticated;

-- ---------- 2) Vitrine do perfil ----------
alter table public.players add column if not exists vitrine jsonb;

create or replace function public.salvar_vitrine(p_card text, p_insignia text, p_musica text)
 returns json
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_uid uuid := auth.uid(); v_card text := nullif(btrim(coalesce(p_card, '')), ''); v_ins text := nullif(btrim(coalesce(p_insignia, '')), '');
        v_mus text := nullif(btrim(coalesce(p_musica, '')), ''); v jsonb;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if v_card is not null and not exists (select 1 from json_array_elements(public.album_cards()) x where lower(x->'card'->>'nick') = lower(v_card)) then
    return json_build_object('ok', false, 'erro', 'card');
  end if;
  if v_ins is not null and not (v_ins = any(coalesce(public.insignias(v_uid), '{}'))) then
    return json_build_object('ok', false, 'erro', 'insignia');
  end if;
  -- a música vem da lista do Karaoke⭐Time! no aparelho; aqui só o tamanho e nada de link
  if v_mus is not null and (char_length(v_mus) > 60 or v_mus ~* '(https?:|www\.|\.com|<|>)') then
    return json_build_object('ok', false, 'erro', 'musica');
  end if;
  v := jsonb_strip_nulls(jsonb_build_object('card', v_card, 'insignia', v_ins, 'musica', v_mus));
  update public.players set vitrine = case when v = '{}'::jsonb then null else v end, updated_at = now() where id = v_uid;
  return json_build_object('ok', true, 'vitrine', v);
end $function$;
revoke all on function public.salvar_vitrine(text, text, text) from public, anon;
grant execute on function public.salvar_vitrine(text, text, text) to authenticated;

-- a própria vitrine (o Perfil da pessoa usa meu_perfil, que não muda)
create or replace function public.minha_vitrine()
 returns json language sql stable security definer set search_path to 'public'
as $function$
  select json_build_object('vitrine', p.vitrine, 'insignias', public.insignias(p.id),
    'vitrine_card', case when p.vitrine ? 'card' then public.gacha_card((select q.nick from public.players q where lower(q.nick) = lower(p.vitrine->>'card') limit 1)) end)
  from public.players p where p.id = auth.uid()
$function$;
revoke all on function public.minha_vitrine() from public, anon;
grant execute on function public.minha_vitrine() to authenticated;

-- a vitrine aparece no perfil público (mesmo conteúdo da migração de 20/11 + 'vitrine')
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
    'vitrine', p.vitrine,
    'vitrine_card', case when p.vitrine ? 'card' then public.gacha_card((select q.nick from public.players q where lower(q.nick) = lower(p.vitrine->>'card') limit 1)) end,
    'admin_ver', public.eh_admin() and p.id is distinct from auth.uid(),
    'bloqueado', case when public.eh_admin() then p.bloqueado end
  ) from public.players p
  where lower(p.nick) = lower(btrim(coalesce(p_nick, '')))
    and (not coalesce(p.bloqueado, false) or p.id = auth.uid() or public.eh_admin());
$function$;

-- ---------- 3) Caixa de recados para o TsuLiPa ----------
create table if not exists private.recados_tsulipa (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.players(id) on delete cascade,
  texto text not null check (char_length(texto) between 2 and 500),
  criado timestamptz not null default now(),
  lido boolean not null default false
);
create index if not exists recados_tsulipa_criado_idx on private.recados_tsulipa (criado desc);
create index if not exists recados_tsulipa_user_idx on private.recados_tsulipa (user_id, criado desc);
alter table private.recados_tsulipa enable row level security;
revoke all on private.recados_tsulipa from anon, authenticated;

create or replace function public.recado_tsulipa_enviar(p_texto text)
 returns json
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_uid uuid := auth.uid(); v_txt text := btrim(coalesce(p_texto, ''));
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if not exists (select 1 from public.players where id = v_uid and not coalesce(bloqueado, false)) then return json_build_object('ok', false, 'erro', 'conta'); end if;
  if char_length(v_txt) < 2 or char_length(v_txt) > 500 then return json_build_object('ok', false, 'erro', 'tamanho'); end if;
  if (select count(*) from private.recados_tsulipa where user_id = v_uid and criado > now() - interval '1 day') >= 3 then
    return json_build_object('ok', false, 'erro', 'limite');
  end if;
  insert into private.recados_tsulipa (user_id, texto) values (v_uid, v_txt);
  return json_build_object('ok', true);
end $function$;
revoke all on function public.recado_tsulipa_enviar(text) from public, anon;
grant execute on function public.recado_tsulipa_enviar(text) to authenticated;

create or replace function public.admin_recados_tsulipa(p_marcar_lido bigint default null)
 returns json
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if not public.eh_admin() then return json_build_object('ok', false, 'erro', 'admin'); end if;
  if p_marcar_lido is not null then update private.recados_tsulipa set lido = true where id = p_marcar_lido; end if;
  return json_build_object('ok', true,
    'novos', (select count(*) from private.recados_tsulipa where not lido),
    'recados', coalesce((select json_agg(json_build_object('id', r.id, 'nick', p.nick, 'texto', r.texto, 'criado', r.criado, 'lido', r.lido) order by r.criado desc)
                         from (select * from private.recados_tsulipa order by criado desc limit 60) r join public.players p on p.id = r.user_id), '[]'::json));
end $function$;
revoke all on function public.admin_recados_tsulipa(bigint) from public, anon;
grant execute on function public.admin_recados_tsulipa(bigint) to authenticated;

-- ---------- 4) Email mensal opcional ----------
alter table public.players add column if not exists email_mensal boolean not null default false;
alter table public.players add column if not exists email_mensal_em timestamptz;

create or replace function public.email_mensal(p_ligar boolean default null)
 returns json
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_uid uuid := auth.uid(); v boolean;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if p_ligar is not null then
    update public.players set email_mensal = p_ligar, email_mensal_em = now(), updated_at = now() where id = v_uid returning email_mensal into v;
  else
    select email_mensal into v from public.players where id = v_uid;
  end if;
  return json_build_object('ok', true, 'ligado', coalesce(v, false));
end $function$;
revoke all on function public.email_mensal(boolean) from public, anon;
grant execute on function public.email_mensal(boolean) to authenticated;

-- lista usada só pela Edge Function (chave de serviço): quem pediu o email, com o endereço do login Google
create or replace function private.email_mensal_lista()
 returns table(user_id uuid, nick text, email text)
 language sql stable security definer set search_path to ''
as $$
  select p.id, p.nick, u.email::text from public.players p join auth.users u on u.id = p.id
   where p.email_mensal and not coalesce(p.bloqueado, false) and u.email is not null
$$;
revoke all on function private.email_mensal_lista() from public, anon, authenticated;
-- pacote do mês para a Edge Function: só a chave de serviço chama (anon e contas logadas não)
create or replace function public.email_mensal_pacote(p_mes date default null)
 returns json language sql stable security definer set search_path to 'public'
as $function$
  select coalesce(json_agg(json_build_object('nick', l.nick, 'email', l.email, 'retro', private.retro_de(l.user_id, p_mes))), '[]'::json)
    from private.email_mensal_lista() l
$function$;
revoke all on function public.email_mensal_pacote(date) from public, anon, authenticated;
grant execute on function public.email_mensal_pacote(date) to service_role;

commit;
