-- 21/11/2026 · PR das melhorias
-- 1) Convite com prêmio para as duas: link pessoal (?convite=CODIGO). A conta nova aceita o convite depois de entrar
--    com Google; quando ela termina a primeira corrida, as duas ganham ★30 e quem convidou ganha a insígnia "convite".
--    Regras contra abuso: só conta criada há até 7 dias aceita convite, não vale o próprio código, uma pessoa só aceita
--    um convite, e quem convida recebe prêmio de no máximo 10 pessoas por mês (a convidada sempre recebe).
-- 2) Concurso de visual da semana: tema por semana (segunda a domingo, horário de Brasília). Cada conta inscreve o
--    visual salvo na nuvem e dá até 3 votos por semana em visuais de outras pessoas. Na semana seguinte, quem teve
--    mais votos (empate: todo mundo empatado) resgata ★50 e a insígnia "look_semana" — com pelo menos 2 inscrições
--    e 1 voto na semana.

-- ───────────────────────── Convite ─────────────────────────
create table if not exists private.convite_codigos (
  user_id uuid primary key references public.players(id) on delete cascade,
  codigo text not null unique,
  criado_em timestamptz not null default now()
);
create table if not exists private.convites (
  convidada uuid primary key references public.players(id) on delete cascade,
  madrinha uuid not null references public.players(id) on delete cascade,
  aceito_em timestamptz not null default now(),
  premiado_em timestamptz,
  madrinha_premiada boolean not null default false
);
create index if not exists convites_madrinha_idx on private.convites (madrinha);
alter table private.convite_codigos enable row level security;
alter table private.convites enable row level security;

create or replace function public.convite_meu()
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_cod text; v_i int := 0;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if not exists (select 1 from public.players where id = v_uid and not coalesce(bloqueado, false)) then
    return json_build_object('ok', false, 'erro', 'sem_conta');
  end if;
  select codigo into v_cod from private.convite_codigos where user_id = v_uid;
  while v_cod is null and v_i < 8 loop
    v_i := v_i + 1;
    -- 6 letras/números sem os que confundem (0/O, 1/I/L)
    v_cod := (select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random() * 31)::int, 1), '') from generate_series(1, 6));
    begin
      insert into private.convite_codigos (user_id, codigo) values (v_uid, v_cod);
    exception when unique_violation then
      v_cod := null;
      select codigo into v_cod from private.convite_codigos where user_id = v_uid;
    end;
  end loop;
  return json_build_object('ok', v_cod is not null, 'codigo', v_cod, 'premio', 30,
    'aceitos', (select count(*) from private.convites where madrinha = v_uid),
    'premiados', (select count(*) from private.convites where madrinha = v_uid and premiado_em is not null));
end $$;

create or replace function public.convite_aceitar(p_codigo text)
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_madrinha uuid; v_criada timestamptz;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  select created_at into v_criada from public.players where id = v_uid and not coalesce(bloqueado, false);
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  select user_id into v_madrinha from private.convite_codigos where codigo = upper(btrim(coalesce(p_codigo, '')));
  if v_madrinha is null then return json_build_object('ok', false, 'erro', 'codigo'); end if;
  if v_madrinha = v_uid then return json_build_object('ok', false, 'erro', 'proprio'); end if;
  if exists (select 1 from public.players where id = v_madrinha and coalesce(bloqueado, false)) then
    return json_build_object('ok', false, 'erro', 'codigo');
  end if;
  if coalesce(v_criada, '-infinity') < now() - interval '7 days' then return json_build_object('ok', false, 'erro', 'conta_antiga'); end if;
  insert into private.convites (convidada, madrinha) values (v_uid, v_madrinha) on conflict (convidada) do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'ja_aceito'); end if;
  return json_build_object('ok', true, 'madrinha', (select nick from public.players where id = v_madrinha), 'premio', 30);
end $$;

-- Chamada pela convidada (ao abrir o site): paga as duas quando ela já tem uma corrida terminada.
create or replace function public.convite_conferir()
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); c private.convites; v_stars int; v_mad boolean := false;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  select * into c from private.convites where convidada = v_uid for update;
  if not found then return json_build_object('ok', true, 'convite', false); end if;
  if c.premiado_em is not null then return json_build_object('ok', true, 'convite', true, 'pago', true); end if;
  if coalesce((select corridas_total from public.players where id = v_uid), 0) < 1
     and not exists (select 1 from public.leaderboard where user_id = v_uid) then
    return json_build_object('ok', true, 'convite', true, 'pago', false, 'falta', 'corrida',
      'madrinha', (select nick from public.players where id = c.madrinha));
  end if;
  update public.players set stars = stars + 30, updated_at = now() where id = v_uid returning stars into v_stars;
  insert into public.star_log (user_id, delta, reason) values (v_uid, 30, 'convite');
  -- quem convidou: no máximo 10 prêmios por mês (horário de Brasília)
  if (select count(*) from private.convites where madrinha = c.madrinha and madrinha_premiada
        and date_trunc('month', premiado_em at time zone 'America/Sao_Paulo') = date_trunc('month', now() at time zone 'America/Sao_Paulo')) < 10
     and exists (select 1 from public.players where id = c.madrinha and not coalesce(bloqueado, false)) then
    update public.players set stars = stars + 30, updated_at = now(),
      insignias_extra = (select array_agg(distinct x) from unnest(coalesce(insignias_extra, '{}') || array['convite']) x)
     where id = c.madrinha;
    insert into public.star_log (user_id, delta, reason) values (c.madrinha, 30, 'convite');
    v_mad := true;
  end if;
  update private.convites set premiado_em = now(), madrinha_premiada = v_mad where convidada = v_uid;
  return json_build_object('ok', true, 'convite', true, 'pago', true, 'agora', true, 'premio', 30, 'stars', v_stars,
    'madrinha', (select nick from public.players where id = c.madrinha));
end $$;

revoke all on function public.convite_meu(), public.convite_aceitar(text), public.convite_conferir() from public, anon;
grant execute on function public.convite_meu(), public.convite_aceitar(text), public.convite_conferir() to authenticated;

-- ───────────────────────── Concurso de visual da semana ─────────────────────────
create table if not exists private.concurso_inscricoes (
  semana date not null,
  user_id uuid not null references public.players(id) on delete cascade,
  visual jsonb not null,
  criado_em timestamptz not null default now(),
  primary key (semana, user_id)
);
create table if not exists private.concurso_votos (
  semana date not null,
  eleitor uuid not null references public.players(id) on delete cascade,
  candidato uuid not null references public.players(id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (semana, eleitor, candidato)
);
create index if not exists concurso_votos_candidato_idx on private.concurso_votos (semana, candidato);
create table if not exists private.concurso_premios (
  semana date not null,
  user_id uuid not null references public.players(id) on delete cascade,
  resgatado_em timestamptz not null default now(),
  primary key (semana, user_id)
);
alter table private.concurso_inscricoes enable row level security;
alter table private.concurso_votos enable row level security;
alter table private.concurso_premios enable row level security;

-- Tema da semana: 8 temas em rodízio (o texto mora no site, nos 6 idiomas)
create or replace function private.concurso_tema(p_semana date)
 returns int language sql immutable set search_path to ''
as $$ select (((p_semana - date '2026-11-16') / 7) % 8 + 8)::int % 8 $$;

-- Só o que o desenho do Idol usa: chaves conhecidas, texto curto (cores e nomes de peças)
create or replace function private.concurso_visual_limpo(p jsonb)
 returns jsonb language sql immutable set search_path to ''
as $$
  select coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
    from jsonb_each(case when jsonb_typeof(p) = 'object' then p else '{}'::jsonb end) e(k, v)
   where k in ('hair','hair2','lado2','skin','eye','outcol','legcol','img','back','front','det','out','hat','gl',
               'mecha','streak','baixo','olho','boca','bochecha','sobrancelha')
     and (jsonb_typeof(v) = 'boolean' or (jsonb_typeof(v) = 'string' and length(v #>> '{}') <= 32))
$$;

create or replace function private.concurso_vencedores(p_semana date)
 returns table(user_id uuid, votos bigint) language sql stable set search_path to ''
as $$
  with v as (
    select i.user_id, count(vt.eleitor) votos
      from private.concurso_inscricoes i
      left join private.concurso_votos vt on vt.semana = i.semana and vt.candidato = i.user_id
     where i.semana = p_semana
     group by i.user_id)
  select v.user_id, v.votos from v
   where (select count(*) from v) >= 2 and v.votos >= 1 and v.votos = (select max(votos) from v)
$$;

create or replace function public.concurso_estado()
 returns json language plpgsql stable security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_sem date := private.segunda_da_semana(public.hoje_br()); v_ant date;
begin
  v_ant := v_sem - 7;
  return json_build_object('ok', true, 'semana', v_sem, 'ate', v_sem + 6, 'tema', private.concurso_tema(v_sem),
    'votos_max', 3,
    'eu_inscrito', v_uid is not null and exists (select 1 from private.concurso_inscricoes where semana = v_sem and user_id = v_uid),
    'meus_votos', (select count(*) from private.concurso_votos where semana = v_sem and eleitor = v_uid),
    'inscritos', coalesce((select json_agg(x order by x.votos desc, x.nick) from (
        select p.nick, i.visual, (select count(*) from private.concurso_votos vt where vt.semana = v_sem and vt.candidato = i.user_id) votos,
               i.user_id = v_uid eu,
               exists (select 1 from private.concurso_votos vt where vt.semana = v_sem and vt.candidato = i.user_id and vt.eleitor = v_uid) votei
          from private.concurso_inscricoes i join public.players p on p.id = i.user_id
         where i.semana = v_sem and not coalesce(p.bloqueado, false)
         order by votos desc, p.nick limit 60) x), '[]'::json),
    'anterior', json_build_object('semana', v_ant, 'tema', private.concurso_tema(v_ant),
      'vencedores', coalesce((select json_agg(p.nick order by p.nick) from private.concurso_vencedores(v_ant) w
                                join public.players p on p.id = w.user_id), '[]'::json),
      'posso_resgatar', v_uid is not null
        and exists (select 1 from private.concurso_vencedores(v_ant) w where w.user_id = v_uid)
        and not exists (select 1 from private.concurso_premios where semana = v_ant and user_id = v_uid)),
    'premio', 50);
end $$;

create or replace function public.concurso_inscrever()
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_sem date := private.segunda_da_semana(public.hoje_br()); v_vis jsonb;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  select private.concurso_visual_limpo(coalesce(nuvem_visual->'cu2', avatar->'c')) into v_vis
    from public.players where id = v_uid and not coalesce(bloqueado, false);
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  if v_vis is null or v_vis = '{}'::jsonb then return json_build_object('ok', false, 'erro', 'sem_visual'); end if;
  insert into private.concurso_inscricoes (semana, user_id, visual) values (v_sem, v_uid, v_vis)
    on conflict (semana, user_id) do update set visual = excluded.visual, criado_em = now();
  return json_build_object('ok', true, 'semana', v_sem);
end $$;

-- Liga/desliga o voto num visual (até 3 por semana, nunca no próprio)
create or replace function public.concurso_votar(p_nick text)
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_sem date := private.segunda_da_semana(public.hoje_br()); v_alvo uuid;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if not exists (select 1 from public.players where id = v_uid and not coalesce(bloqueado, false)) then
    return json_build_object('ok', false, 'erro', 'sem_conta');
  end if;
  select i.user_id into v_alvo from private.concurso_inscricoes i join public.players p on p.id = i.user_id
   where i.semana = v_sem and p.nick = p_nick and not coalesce(p.bloqueado, false);
  if v_alvo is null then return json_build_object('ok', false, 'erro', 'inscricao'); end if;
  if v_alvo = v_uid then return json_build_object('ok', false, 'erro', 'proprio'); end if;
  perform 1 from public.players where id = v_uid for update;   -- um voto por vez por conta
  delete from private.concurso_votos where semana = v_sem and eleitor = v_uid and candidato = v_alvo;
  if found then return json_build_object('ok', true, 'votei', false); end if;
  if (select count(*) from private.concurso_votos where semana = v_sem and eleitor = v_uid) >= 3 then
    return json_build_object('ok', false, 'erro', 'limite');
  end if;
  insert into private.concurso_votos (semana, eleitor, candidato) values (v_sem, v_uid, v_alvo);
  return json_build_object('ok', true, 'votei', true);
end $$;

create or replace function public.concurso_resgatar()
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_ant date := private.segunda_da_semana(public.hoje_br()) - 7; v_stars int;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if not exists (select 1 from private.concurso_vencedores(v_ant) w where w.user_id = v_uid) then
    return json_build_object('ok', false, 'erro', 'nao_venceu');
  end if;
  perform 1 from public.players where id = v_uid for update;
  insert into private.concurso_premios (semana, user_id) values (v_ant, v_uid) on conflict do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'feito'); end if;
  update public.players set stars = stars + 50, updated_at = now(),
    insignias_extra = (select array_agg(distinct x) from unnest(coalesce(insignias_extra, '{}') || array['look_semana']) x)
   where id = v_uid returning stars into v_stars;
  insert into public.star_log (user_id, delta, reason) values (v_uid, 50, 'concurso_visual');
  return json_build_object('ok', true, 'stars', v_stars, 'premio', 50);
end $$;

revoke all on function private.concurso_tema(date), private.concurso_visual_limpo(jsonb), private.concurso_vencedores(date) from public, anon, authenticated;
revoke all on function public.concurso_estado(), public.concurso_inscrever(), public.concurso_votar(text), public.concurso_resgatar() from public, anon;
grant execute on function public.concurso_estado() to anon, authenticated;   -- visitante vê a galeria (nick e visual, já públicos no ranking/perfil)
grant execute on function public.concurso_inscrever(), public.concurso_votar(text), public.concurso_resgatar() to authenticated;
