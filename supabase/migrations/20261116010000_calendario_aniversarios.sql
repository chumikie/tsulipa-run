-- Calendário do TsuLiPa⭐World: aniversários dos jogadores (só dia e mês, MM-DD; sem ano). Decisão do dono em 16/11/2026:
-- o dia de todo mundo que cadastrou aparece no Calendário. Contas bloqueadas ficam de fora. Página de privacidade atualizada.
-- Aplicada como migration "calendario_aniversarios".
create or replace function public.calendario_aniversarios()
returns json language sql stable security definer set search_path to 'public' as $$
  select coalesce(json_agg(json_build_object('nick', p.nick, 'aniver', p.aniver, 'oshi', p.oshi) order by p.aniver, lower(p.nick)), '[]'::json)
  from public.players p
  where p.aniver ~ '^\d\d-\d\d$' and not coalesce(p.bloqueado, false)
$$;
revoke all on function public.calendario_aniversarios() from public;
grant execute on function public.calendario_aniversarios() to anon, authenticated;
