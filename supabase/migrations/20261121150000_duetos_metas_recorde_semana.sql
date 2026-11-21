-- 21/11/2026 · PR das melhorias (segunda parte)
-- 1) Álbum de duetos do Moon⭐Duo!: cada pessoa diferente com quem você fez uma cena entra no álbum. Metas de
--    3, 6, 10 e 15 parceiros pagam ★10, ★20, ★30 e ★50 uma vez cada (resgate no servidor, sem confiar no aparelho).
-- 2) Metas do álbum de Idols (Star⭐Gacha!): 5, 15, 30 e 50 Idols já comemoravam no aparelho; agora pagam ★10, ★25,
--    ★40 e ★60 uma vez cada. A contagem vem de public.album_cards(), a mesma do álbum.
-- 3) Recorde da semana: o melhor do Center⭐Run! e do Sora⭐Jump! desde segunda-feira (horário de Brasília), para
--    o jogo mostrar quanto falta para bater.

create table if not exists private.duo_album_premios (
  user_id uuid not null references public.players(id) on delete cascade,
  meta int not null,
  em timestamptz not null default now(),
  primary key (user_id, meta)
);
create table if not exists private.album_metas_premios (
  user_id uuid not null references public.players(id) on delete cascade,
  meta int not null,
  em timestamptz not null default now(),
  primary key (user_id, meta)
);
alter table private.duo_album_premios enable row level security;
alter table private.album_metas_premios enable row level security;

create or replace function private.duo_meta_premio(p_meta int)
 returns int language sql immutable set search_path to ''
as $$ select case p_meta when 3 then 10 when 6 then 20 when 10 then 30 when 15 then 50 end $$;
create or replace function private.album_meta_premio(p_meta int)
 returns int language sql immutable set search_path to ''
as $$ select case p_meta when 5 then 10 when 15 then 25 when 30 then 40 when 50 then 60 end $$;

create or replace function private.duo_parceiros(p_uid uuid)
 returns int language sql stable set search_path to ''
as $$
  select count(distinct l.para)::int from public.duo_log l join public.players p on p.id = l.para
   where l.de = p_uid and l.para <> p_uid and not coalesce(p.bloqueado, false)
$$;

create or replace function public.duo_album()
 returns json language plpgsql stable security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_n int;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  v_n := private.duo_parceiros(v_uid);
  return json_build_object('ok', true, 'parceiros', v_n,
    'lista', coalesce((select json_agg(x order by x.primeira) from (
        select p.nick, p.avatar, count(*) cenas, min(l.dia) primeira
          from public.duo_log l join public.players p on p.id = l.para
         where l.de = v_uid and l.para <> v_uid and not coalesce(p.bloqueado, false)
         group by p.nick, p.avatar) x), '[]'::json),
    'metas', (select json_agg(json_build_object('meta', m, 'premio', private.duo_meta_premio(m), 'ok', v_n >= m,
                'resgatado', exists (select 1 from private.duo_album_premios r where r.user_id = v_uid and r.meta = m)) order by m)
                from unnest(array[3, 6, 10, 15]) m));
end $$;

create or replace function public.duo_album_resgatar(p_meta int)
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_p int := private.duo_meta_premio(p_meta); v_stars int;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if v_p is null then return json_build_object('ok', false, 'erro', 'meta'); end if;
  perform 1 from public.players where id = v_uid and not coalesce(bloqueado, false) for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  if private.duo_parceiros(v_uid) < p_meta then return json_build_object('ok', false, 'erro', 'falta'); end if;
  insert into private.duo_album_premios (user_id, meta) values (v_uid, p_meta) on conflict do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'feito'); end if;
  update public.players set stars = stars + v_p, updated_at = now() where id = v_uid returning stars into v_stars;
  insert into public.star_log (user_id, delta, reason) values (v_uid, v_p, 'duo_album');
  return json_build_object('ok', true, 'premio', v_p, 'stars', v_stars);
end $$;

-- Idols no álbum: os mesmos itens que o álbum mostra (repetidos e trocas já resolvidos em album_cards)
create or replace function private.album_achados()
 returns int language sql stable set search_path to ''
as $$
  select count(*)::int from json_array_elements(coalesce(public.album_cards(), '[]'::json)) e
   where coalesce(nullif(e->>'vezes', '')::int, 1) > 0
$$;

create or replace function public.album_metas()
 returns json language plpgsql stable security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_n int;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  v_n := private.album_achados();
  return json_build_object('ok', true, 'achados', v_n,
    'metas', (select json_agg(json_build_object('meta', m, 'premio', private.album_meta_premio(m), 'ok', v_n >= m,
                'resgatado', exists (select 1 from private.album_metas_premios r where r.user_id = v_uid and r.meta = m)) order by m)
                from unnest(array[5, 15, 30, 50]) m));
end $$;

create or replace function public.album_meta_resgatar(p_meta int)
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_p int := private.album_meta_premio(p_meta); v_stars int;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if v_p is null then return json_build_object('ok', false, 'erro', 'meta'); end if;
  perform 1 from public.players where id = v_uid and not coalesce(bloqueado, false) for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  if private.album_achados() < p_meta then return json_build_object('ok', false, 'erro', 'falta'); end if;
  insert into private.album_metas_premios (user_id, meta) values (v_uid, p_meta) on conflict do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'feito'); end if;
  update public.players set stars = stars + v_p, updated_at = now() where id = v_uid returning stars into v_stars;
  insert into public.star_log (user_id, delta, reason) values (v_uid, v_p, 'album_meta');
  return json_build_object('ok', true, 'premio', v_p, 'stars', v_stars);
end $$;

create or replace function public.meu_recorde_semana()
 returns json language plpgsql stable security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_ini date := private.segunda_da_semana(public.hoje_br());
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  return json_build_object('ok', true, 'semana', v_ini,
    'run', (select coalesce(max(score), 0) from public.leaderboard
             where user_id = v_uid and (created_at at time zone 'America/Sao_Paulo')::date >= v_ini),
    'sora', (select coalesce(max(score), 0) from private.sora_history
              where player_id = v_uid and (finished_at at time zone 'America/Sao_Paulo')::date >= v_ini));
end $$;

revoke all on function private.duo_meta_premio(int), private.album_meta_premio(int), private.duo_parceiros(uuid), private.album_achados() from public, anon, authenticated;
revoke all on function public.duo_album(), public.duo_album_resgatar(int), public.album_metas(), public.album_meta_resgatar(int), public.meu_recorde_semana() from public, anon;
grant execute on function public.duo_album(), public.duo_album_resgatar(int), public.album_metas(), public.album_meta_resgatar(int), public.meu_recorde_semana() to authenticated;
