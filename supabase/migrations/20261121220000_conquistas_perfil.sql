-- 21/11/2026 · PR das melhorias (quinta parte): conquistas à vista no Perfil
-- Os níveis das insígnias já existem (public.insignias devolve "chave:nível"); faltava a pessoa ver QUANTO falta.
-- meu_progresso_conquistas() devolve os mesmos contadores que public.insignias usa, mais o que falta para o
-- perfil ficar completo. A pessoa escolhe até 5 insígnias que já tem para aparecer em destaque no topo do perfil.
-- Nada aqui mexe em estrelas.

alter table public.players add column if not exists ins_destaque text[] not null default '{}';

create or replace function public.meu_progresso_conquistas()
 returns json language sql stable security definer set search_path to 'public'
as $$
  select json_build_object(
    'dias', greatest((select count(distinct (l.created_at at time zone 'America/Sao_Paulo')::date) from public.leaderboard l where l.user_id = p.id), coalesce(p.dias_jogados, 0)),
    'corridas', greatest((select count(*) from public.leaderboard l where l.user_id = p.id), coalesce(p.corridas_total, 0)),
    'recebidos', (select count(*) from public.coracoes c where c.para = p.id),
    'dados', (select count(*) from public.coracoes c where c.de = p.id),
    'recados', (select count(*) from public.recados r where r.de = p.id),
    'recados_rec', (select count(*) from public.recados r where r.para = p.id),
    'compras', coalesce(array_length(p.visuais, 1), 0),
    'duos', (select count(*) from public.duo_log d where d.de = p.id),
    'best', coalesce(p.best, 0),
    'sora', coalesce((select max(s.score) filter (where s.period_type = 'all') from private.sora_scores s where s.player_id = p.id), 0),
    'completo', json_build_object(
      'foto', p.avatar is not null and not coalesce((p.avatar->>'auto')::boolean, false),
      'emoji', coalesce(btrim(p.emoji), '') <> '',
      'cor', coalesce(p.cor, '') ~* '^#[0-9a-f]{6}$',
      'frase', coalesce(btrim(p.frase), '') <> '',
      'oshi', p.oshi is not null,
      'aniver', p.aniver is not null,
      'destaque', coalesce(array_length(p.ins_destaque, 1), 0) > 0
    ),
    'destaque', p.ins_destaque,
    'insignias', public.insignias(p.id)
  ) from public.players p where p.id = auth.uid();
$$;

-- Até 5 insígnias, sem repetir, e só as que a pessoa já tem (o nível vem de public.insignias na hora de mostrar).
create or replace function public.salvar_destaques(p_ins text[])
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_tem text[]; v_ok text[];
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if coalesce(array_length(p_ins, 1), 0) > 5 then return json_build_object('ok', false, 'erro', 'max'); end if;
  select coalesce(array_agg(split_part(x, ':', 1)), '{}') into v_tem from unnest(public.insignias(v_uid)) x;
  select coalesce(array_agg(k order by o), '{}') into v_ok
    from (select k, min(o) o from unnest(coalesce(p_ins, '{}')) with ordinality u(k, o) where k = any(v_tem) group by k) a;
  update public.players set ins_destaque = v_ok where id = v_uid and not coalesce(bloqueado, false);
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  return json_build_object('ok', true, 'destaque', v_ok);
end $$;

-- Os destaques de qualquer perfil (público, como o resto do perfil): só as que a pessoa ainda tem, com o nível.
create or replace function public.destaques_de(p_nick text)
 returns text[] language sql stable security definer set search_path to 'public'
as $$
  select coalesce((
    select array_agg(t.x order by d.o)
    from public.players p
    cross join lateral unnest(p.ins_destaque) with ordinality d(k, o)
    cross join lateral (select x from unnest(public.insignias(p.id)) x where split_part(x, ':', 1) = d.k limit 1) t
    where lower(p.nick) = lower(p_nick) and not coalesce(p.bloqueado, false)
  ), '{}');
$$;

revoke all on function public.meu_progresso_conquistas() from public, anon;
revoke all on function public.salvar_destaques(text[]) from public, anon;
grant execute on function public.meu_progresso_conquistas() to authenticated;
grant execute on function public.salvar_destaques(text[]) to authenticated;
grant execute on function public.destaques_de(text) to anon, authenticated;

-- Passatempos do dia (inspirados nos jogos antigos do site da Turma da Mônica): caça-palavras, 5 diferenças e
-- labirinto. Cada um vale ★5 uma vez por dia (Brasília). O jogo roda no aparelho; aqui só se registra e se paga.
create table if not exists private.passatempos (
  user_id uuid not null references public.players(id) on delete cascade,
  dia date not null,
  tipo text not null check (tipo in ('caca', 'dif', 'lab')),
  em timestamptz not null default now(),
  primary key (user_id, dia, tipo)
);
alter table private.passatempos enable row level security;

create or replace function public.passatempos_hoje()
 returns json language sql stable security definer set search_path to 'public'
as $$
  select json_build_object(
    'feitos', coalesce((select json_agg(tipo order by em) from private.passatempos where user_id = auth.uid() and dia = public.hoje_br()), '[]'::json),
    'total', (select count(*) from private.passatempos where user_id = auth.uid()),
    'premio', 5);
$$;

create or replace function public.passatempo_feito(p_tipo text)
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_stars int; v_pago boolean := false;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if p_tipo is null or p_tipo not in ('caca', 'dif', 'lab') then return json_build_object('ok', false, 'erro', 'tipo'); end if;
  perform 1 from public.players where id = v_uid and not coalesce(bloqueado, false) for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  insert into private.passatempos (user_id, dia, tipo) values (v_uid, public.hoje_br(), p_tipo) on conflict do nothing;
  if found then
    v_pago := true;
    update public.players set stars = stars + 5, updated_at = now() where id = v_uid returning stars into v_stars;
    insert into public.star_log (user_id, delta, reason) values (v_uid, 5, 'passatempo');
  end if;
  return json_build_object('ok', true, 'pago', v_pago, 'premio', case when v_pago then 5 else 0 end, 'stars', v_stars,
    'total', (select count(*) from private.passatempos where user_id = v_uid));
end $$;

revoke all on function public.passatempos_hoje() from public, anon;
revoke all on function public.passatempo_feito(text) from public, anon;
grant execute on function public.passatempos_hoje() to authenticated;
grant execute on function public.passatempo_feito(text) to authenticated;
