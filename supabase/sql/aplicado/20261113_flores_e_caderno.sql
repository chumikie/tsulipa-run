-- APLICADO EM PRODUÇÃO em 13/11/2026 com o OK do dono (migração 20261113_flores_e_caderno).
-- Flores do Bloom⭐Garden! com uso + Caderno do Café salvo na conta.
-- 1) jardim_usar_flor: gasta 1 flor colhida para levar à mesa do Handshake (o jogo dá mais Hype no
--    começo; a pontuação continua sendo a conferida pelo servidor, sem fórmula nova).
-- 2) cafe_caderno: só leitura das receitas que o servidor JÁ comprovou (private.cafe_receitas_comprovadas),
--    para o Caderno voltar ao trocar de aparelho.
-- Não mexe em ★, tickets nem em funções existentes.
create table if not exists private.jardim_usos (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.players(id) on delete cascade,
  flor text not null check (flor in ('sakura','tulipa','girassol','lunar')),
  uso text not null check (uso in ('handshake')),
  em timestamptz not null default now()
);
alter table private.jardim_usos enable row level security;
revoke all on private.jardim_usos from public, anon, authenticated;

create or replace function public.jardim_usar_flor(p_flor text, p_uso text)
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare v_uid uuid := auth.uid(); v_qtd int;
begin
  if v_uid is null or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if p_flor is null or p_flor not in ('sakura','tulipa','girassol','lunar') or p_uso is distinct from 'handshake' then
    return pg_catalog.json_build_object('ok',false,'erro','parametros'); end if;
  update private.jardim_flores set qtd=qtd-1 where user_id=v_uid and flor=p_flor and qtd>0 returning qtd into v_qtd;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','sem_flor'); end if;
  insert into private.jardim_usos(user_id,flor,uso) values(v_uid,p_flor,p_uso);
  return pg_catalog.json_build_object('ok',true,'flor',p_flor,'qtd',v_qtd);
end $f$;

create or replace function public.cafe_caderno()
returns json language sql stable security definer set search_path to ''
as $f$
  select coalesce(pg_catalog.json_agg(c.base::text || '-' || c.enf::text order by c.base, c.enf), '[]'::json)
  from private.cafe_receitas_comprovadas c where c.user_id = (select auth.uid());
$f$;

revoke all on function public.jardim_usar_flor(text,text) from public, anon;
revoke all on function public.cafe_caderno() from public, anon;
grant execute on function public.jardim_usar_flor(text,text) to authenticated, service_role;
grant execute on function public.cafe_caderno() to authenticated, service_role;
