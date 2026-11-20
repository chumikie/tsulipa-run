-- TsuLiPa⭐World · "Esta semana" (20/11/2026, PR #124)
--   1) Show de sábado: quem termina uma música no Karaoke⭐Time! no sábado (Brasília) entra na plateia da semana
--      e ganha ★20 uma vez por semana. Assíncrono: sem sala online.
--   2) Festa no mapa: na primeira semana de cada tema da temporada, quem passa pelo mapa guarda de graça o
--      cenário do camarim daquele tema (o mesmo item que custa ★60 na loja). Uma vez por festa e por ano.
--   3) Jogo da semana: o jogo menos jogado na semana anterior vira destaque. A missão nível 1 do dia prefere ele
--      e vale ★5 a mais. Para a moderação, admin_uso_jogos(p_dias) mostra quantas pessoas jogaram cada jogo.
-- Aplicada no merge pela integração GitHub–Supabase.

begin;

-- ---------- 1) Show de sábado ----------
create table if not exists private.show_sabado (
  user_id uuid not null references public.players(id) on delete cascade,
  sabado date not null,
  em timestamptz not null default now(),
  primary key (user_id, sabado)
);
alter table private.show_sabado enable row level security;
revoke all on private.show_sabado from anon, authenticated;

-- sábado da semana (domingo a sábado, como os rankings do jogo)
create or replace function private.show_sabado_da_semana(d date)
 returns date language sql immutable set search_path to ''
as $$ select d + (6 - extract(dow from d)::int) $$;

create or replace function public.show_sabado_estado()
 returns json
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  with h as (select public.hoje_br() dia),
  s as (select private.show_sabado_da_semana((select dia from h)) sab,
               -- plateia mostrada: a do sábado desta semana; de domingo a sexta, a do último sábado
               case when extract(dow from (select dia from h)) = 6 then (select dia from h)
                    else private.show_sabado_da_semana((select dia from h)) - 7 end ultimo)
  select json_build_object(
    'hoje', (select dia from h),
    'hoje_sabado', extract(dow from (select dia from h)) = 6,
    'sabado', (select sab from s),
    'plateia_de', (select ultimo from s),
    'premio', 20,
    'eu', exists (select 1 from private.show_sabado x where x.user_id = auth.uid() and x.sabado = (select sab from s)),
    'total', (select count(*) from private.show_sabado x join public.players p on p.id = x.user_id
               where x.sabado = (select ultimo from s) and not coalesce(p.bloqueado, false)),
    'plateia', coalesce((select json_agg(json_build_object('nick', q.nick, 'avatar', q.avatar) order by q.em) from (
        select p.nick, p.avatar, x.em from private.show_sabado x join public.players p on p.id = x.user_id
         where x.sabado = (select ultimo from s) and not coalesce(p.bloqueado, false) and p.avatar is not null
         order by x.em limit 12) q), '[]'::json));
$function$;
revoke all on function public.show_sabado_estado() from public;
grant execute on function public.show_sabado_estado() to anon, authenticated;

create or replace function public.show_sabado_marcar()
 returns json
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br(); v_stars integer;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if extract(dow from v_dia) <> 6 then return json_build_object('ok', false, 'erro', 'dia'); end if;
  if not exists (select 1 from public.players where id = v_uid and not coalesce(bloqueado, false)) then
    return json_build_object('ok', false, 'erro', 'sem_conta');
  end if;
  -- prova: uma música do Karaoke⭐Time! terminada hoje, registrada pelo servidor
  if not exists (select 1 from private.kt_runs r where r.player_id = v_uid and r.dia = v_dia and r.finished_at is not null) then
    return json_build_object('ok', false, 'erro', 'cantar');
  end if;
  perform 1 from public.players where id = v_uid for update;
  insert into private.show_sabado (user_id, sabado) values (v_uid, v_dia) on conflict do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'feito'); end if;
  update public.players set stars = stars + 20, updated_at = now() where id = v_uid returning stars into v_stars;
  insert into public.star_log (user_id, delta, reason) values (v_uid, 20, 'show_sabado');
  return json_build_object('ok', true, 'stars', v_stars, 'premio', 20);
end $function$;
revoke all on function public.show_sabado_marcar() from public, anon;
grant execute on function public.show_sabado_marcar() to authenticated;

-- ---------- 2) Festa no mapa ----------
create table if not exists private.festa_lembrancas (
  user_id uuid not null references public.players(id) on delete cascade,
  festa text not null,
  ano integer not null,
  item text not null,
  em timestamptz not null default now(),
  primary key (user_id, festa, ano)
);
alter table private.festa_lembrancas enable row level security;
revoke all on private.festa_lembrancas from anon, authenticated;

-- festa = os 7 primeiros dias de um tema da temporada (tema_do_dia); devolve tema, início e fim da festa
create or replace function private.festa_do_dia(d date)
 returns table(tema text, inicio date, fim date)
 language sql stable set search_path to ''
as $$
  with t as (select public.tema_do_dia(d) k),
  ini as (select max(x::date) i from generate_series(d - 30, d, interval '1 day') x
           where public.tema_do_dia(x::date) = (select k from t) and public.tema_do_dia(x::date - 1) is distinct from (select k from t))
  select (select k from t), (select i from ini), (select i from ini) + 6
   where (select k from t) is not null and d <= (select i from ini) + 6;
$$;

create or replace function private.festa_item(k text)
 returns text language sql immutable set search_path to ''
as $$ select case k when 'halloween' then 'fundo_halloween' else 'tema_' || k end $$;

create or replace function public.festa_estado()
 returns json
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  with f as (select * from private.festa_do_dia(public.hoje_br())),
  prox as (select x::date d, public.tema_do_dia(x::date) k from generate_series(public.hoje_br() + 1, public.hoje_br() + 120, interval '1 day') x
            where public.tema_do_dia(x::date) is not null and public.tema_do_dia(x::date - 1) is distinct from public.tema_do_dia(x::date)
            order by x limit 1)
  select json_build_object(
    'ativa', exists (select 1 from f),
    'tema', (select tema from f), 'inicio', (select inicio from f), 'fim', (select fim from f),
    'item', (select private.festa_item(tema) from f),
    'guardou', exists (select 1 from f join private.festa_lembrancas l on l.festa = f.tema and l.ano = extract(year from f.inicio)::int and l.user_id = auth.uid()),
    'proxima', (select json_build_object('tema', k, 'inicio', d) from prox));
$function$;
revoke all on function public.festa_estado() from public;
grant execute on function public.festa_estado() to anon, authenticated;

create or replace function public.festa_resgatar()
 returns json
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_uid uuid := auth.uid(); f record; v_item text; v_vis text[];
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  select * into f from private.festa_do_dia(public.hoje_br());
  if f.tema is null then return json_build_object('ok', false, 'erro', 'sem_festa'); end if;
  v_item := private.festa_item(f.tema);
  if (select preco from public.visual_preco(v_item)) is null then return json_build_object('ok', false, 'erro', 'item'); end if;
  if not exists (select 1 from public.players where id = v_uid and not coalesce(bloqueado, false)) then
    return json_build_object('ok', false, 'erro', 'sem_conta');
  end if;
  insert into private.festa_lembrancas (user_id, festa, ano, item) values (v_uid, f.tema, extract(year from f.inicio)::int, v_item)
    on conflict do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'feito'); end if;
  update public.players set visuais = case when v_item = any(coalesce(visuais, '{}')) then visuais else array_append(coalesce(visuais, '{}'), v_item) end,
         updated_at = now()
   where id = v_uid returning visuais into v_vis;
  return json_build_object('ok', true, 'item', v_item, 'tema', f.tema, 'visuais', v_vis);
end $function$;
revoke all on function public.festa_resgatar() from public, anon;
grant execute on function public.festa_resgatar() to authenticated;

-- ---------- 3) Uso dos jogos e Jogo da semana ----------
-- pessoas distintas e partidas por jogo entre a e b (datas de Brasília, inclusive)
create or replace function private.uso_jogos(a date, b date)
 returns table(k text, jogadores bigint, partidas bigint)
 language sql stable set search_path to ''
as $$
  select 'run', count(distinct l.user_id), count(*) from public.leaderboard l
   where (l.created_at at time zone 'America/Sao_Paulo')::date between a and b and l.user_id is not null
  union all select 'karaoke', count(distinct r.player_id), count(*) from private.kt_runs r where r.dia between a and b and r.finished_at is not null
  union all select 'sora', count(distinct s.player_id), count(*) from private.sora_history s where (s.finished_at at time zone 'America/Sao_Paulo')::date between a and b
  union all select 'cafe', count(distinct c.user_id), count(*) from private.cafe_resultados c where c.dia between a and b
  union all select 'handshake', count(distinct h.user_id), count(*) from private.handshake_resultados h where h.dia between a and b
  union all select 'jardim', count(distinct j.user_id), count(*) from private.jardim_canteiros j
   where j.ultima_rega between a and b or (j.plantado at time zone 'America/Sao_Paulo')::date between a and b
  union all select 'battle', count(distinct t.player_id), count(*) from private.battle_partidas t where t.dia between a and b
  union all select 'foto', count(distinct m.user_id), count(*) from private.studio_mural m where m.dia between a and b
  union all select 'duo', count(distinct d.de), count(*) from public.duo_log d where d.dia between a and b
  union all select 'gacha', count(distinct g.user_id), count(*) from public.gacha g where g.dia between a and b
  union all select 'pet', count(distinct x.user_id), count(*) from public.star_log x
   where x.reason = 'minijogo' and (x.created_at at time zone 'America/Sao_Paulo')::date between a and b
$$;

-- segunda-feira (Brasília) da semana de d
create or replace function private.segunda_da_semana(d date)
 returns date language sql immutable set search_path to ''
as $$ select d - ((extract(dow from d)::int + 6) % 7) $$;

-- jogo menos jogado na semana anterior, entre os que têm missão de nível 1 (fica fixo de segunda a domingo)
create or replace function public.jogo_da_semana()
 returns json
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  with seg as (select private.segunda_da_semana(public.hoje_br()) s),
  u as (select * from private.uso_jogos((select s from seg) - 7, (select s from seg) - 1)
         where k in ('karaoke', 'sora', 'cafe', 'handshake', 'jardim', 'battle')),
  e as (select * from u order by jogadores, partidas, md5(k || (select s from seg)::text) limit 1)
  select json_build_object('k', e.k, 'jogadores', e.jogadores, 'partidas', e.partidas, 'semana', (select s from seg), 'bonus', 5) from e;
$function$;
revoke all on function public.jogo_da_semana() from public;
grant execute on function public.jogo_da_semana() to anon, authenticated;

create or replace function public.admin_uso_jogos(p_dias integer default 7)
 returns json
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare v_d integer := least(greatest(coalesce(p_dias, 7), 1), 60); v_hoje date := public.hoje_br();
begin
  if not public.eh_admin() then return json_build_object('ok', false, 'erro', 'admin'); end if;
  return json_build_object('ok', true, 'dias', v_d,
    'contas_ativas', (select count(*) from public.players where updated_at > now() - make_interval(days => v_d) and not coalesce(bloqueado, false)),
    'jogos', (select coalesce(json_agg(json_build_object('k', k, 'jogadores', jogadores, 'partidas', partidas) order by jogadores desc, partidas desc), '[]'::json)
              from private.uso_jogos(v_hoje - v_d + 1, v_hoje)),
    'jogo_da_semana', public.jogo_da_semana());
end $function$;
revoke all on function public.admin_uso_jogos(integer) from public, anon;
grant execute on function public.admin_uso_jogos(integer) to authenticated;

-- missões: a de nível 1 prefere o Jogo da semana (fora dos dias de descoberta do Jardim/Battle) e vale ★5 a mais
create or replace function public.missoes()
 returns json
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  with d as (select public.hoje_br() dia),
  js as (select coalesce(public.jogo_da_semana()->>'k', '') k),
  f as (select (dia >= date '2026-11-17' and (dia - date '2026-11-17') % 2 = 0) desc1,
               (dia >= date '2026-11-17' and (dia - date '2026-11-17') % 3 = 1) desc2 from d),
  m as (select l.*, md5(auth.uid()::text || (select dia from d)::text || l.k) h from public.missoes_lista() l),
  m0 as (select 'collect'::text k, 0 nivel, 1 meta, 5 premio, 'collect'::text fam, ''::text h
         union all select 'duo'::text, 0, 1, 5, 'duo'::text, ''::text),
  m1 as (select * from m where nivel = 1 and (not (select desc1 from f) or fam in ('jardim', 'battle'))
          order by (k = (select k from js)) desc, h limit 1),
  m2 as (select * from m where nivel = 2 and fam <> (select fam from m1) and (not (select desc2 from f) or k = 'foto') order by h limit 1),
  m3 as (select * from m where nivel = 3 and fam <> (select fam from m1) and fam <> (select fam from m2) order by h limit 1),
  esc as (select * from m0 union all select * from m1 union all select * from m2 union all select * from m3)
  select coalesce(json_agg(json_build_object('k', e.k, 'meta', e.meta,
           'premio', e.premio + case when e.nivel = 1 and e.k = (select k from js) then 5 else 0 end,
           'semana', e.nivel = 1 and e.k = (select k from js),
           'prog', least(public.missoes_progresso(auth.uid(), e.k, (select dia from d)), e.meta),
           'feito', exists (select 1 from public.missoes_feitas f2 where f2.user_id = auth.uid() and f2.dia = (select dia from d) and f2.k = e.k))
         order by e.nivel), '[]'::json)
  from esc e where auth.uid() is not null
$function$;

commit;
