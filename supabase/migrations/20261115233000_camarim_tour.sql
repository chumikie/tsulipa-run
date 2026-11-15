-- Tour de camarins: ver o camarim (Backstage⭐Pet!) de outro Idol e deixar 1 coração por dia em cada camarim.
-- Só expõe o que o camarim mostra (pet ativo, decoração, Oshi e avatar) — o mesmo nível do perfil público.
-- Aplicada como migration "camarim_tour".
create table if not exists public.camarim_coracoes (
  de uuid not null references public.players(id) on delete cascade,
  para uuid not null references public.players(id) on delete cascade,
  dia date not null default public.hoje_br(),
  em timestamptz not null default now(),
  primary key (de, para, dia)
);
alter table public.camarim_coracoes enable row level security;
create index if not exists camarim_coracoes_para on public.camarim_coracoes(para);

create or replace function public.camarim_ver(p_nick text)
returns json language sql stable security definer set search_path to 'public' as $$
  select json_build_object(
    'nick', p.nick, 'oshi', p.oshi, 'avatar', p.avatar,
    'ativo', p.nuvem_pet->>'ativo',
    'pet', case when p.nuvem_pet ? 'pets' and p.nuvem_pet->'pets' ? (p.nuvem_pet->>'ativo')
      then (select jsonb_build_object('nome', v->>'nome', 'xp', v->'xp', 'acc', v->>'acc', 'cfg', v->'cfg') from (select p.nuvem_pet->'pets'->(p.nuvem_pet->>'ativo') v) z) end,
    'decor', coalesce(p.nuvem_pet->'decor', '{}'::jsonb),
    'coracoes', (select count(*) from public.camarim_coracoes c where c.para = p.id),
    'dei', exists (select 1 from public.camarim_coracoes c where c.para = p.id and c.de = auth.uid() and c.dia = public.hoje_br()),
    'eu', p.id = auth.uid())
  from public.players p
  where lower(p.nick) = lower(btrim(coalesce(p_nick, ''))) and not coalesce(p.bloqueado, false) and p.nuvem_pet ? 'pets'
$$;

create or replace function public.camarim_tour()
returns json language sql stable security definer set search_path to 'public' as $$
  select coalesce(json_agg(t order by t.ord), '[]'::json) from (
    select p.nick, p.oshi, p.avatar, p.nuvem_pet->>'ativo' ativo,
      (select count(*) from public.camarim_coracoes c where c.para = p.id) coracoes,
      exists (select 1 from public.camarim_coracoes c where c.para = p.id and c.de = auth.uid() and c.dia = public.hoje_br()) dei,
      row_number() over (order by p.updated_at desc nulls last) ord
    from public.players p
    where p.nuvem_pet ? 'pets' and not coalesce(p.bloqueado, false) and p.id is distinct from auth.uid()
    order by p.updated_at desc nulls last limit 12) t
$$;

create or replace function public.camarim_coracao(p_nick text)
returns json language plpgsql security definer set search_path to 'public' as $$
declare v_para uuid; v_tot int;
begin
  if auth.uid() is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if exists (select 1 from public.players where id = auth.uid() and coalesce(bloqueado, false)) then return json_build_object('ok', false, 'erro', 'bloqueado'); end if;
  select id into v_para from public.players where lower(nick) = lower(btrim(coalesce(p_nick, ''))) and not coalesce(bloqueado, false);
  if v_para is null then return json_build_object('ok', false, 'erro', 'idol'); end if;
  if v_para = auth.uid() then return json_build_object('ok', false, 'erro', 'eu'); end if;
  insert into public.camarim_coracoes (de, para) values (auth.uid(), v_para) on conflict do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'feito'); end if;
  select count(*) into v_tot from public.camarim_coracoes where para = v_para;
  return json_build_object('ok', true, 'coracoes', v_tot);
end $$;

revoke all on function public.camarim_ver(text) from public;
revoke all on function public.camarim_tour() from public;
revoke all on function public.camarim_coracao(text) from public;
grant execute on function public.camarim_ver(text) to anon, authenticated;
grant execute on function public.camarim_tour() to anon, authenticated;
grant execute on function public.camarim_coracao(text) to authenticated;
