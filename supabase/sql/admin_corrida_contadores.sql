-- Moderação: ao excluir uma corrida, desfaz o que o gatilho lb_contar somou
-- (1 corrida; +1 Center se a pontuação era 5000+). Dias jogados, estrelas e insígnias ficam como estão.
create or replace function public.admin_corrida(p_id bigint) returns json language plpgsql security definer set search_path to 'public' as $function$
declare u uuid; sc integer;
begin
  if not public.eh_admin() then return json_build_object('ok', false, 'erro', 'admin'); end if;
  delete from public.leaderboard where id = p_id returning user_id, score into u, sc;
  if not found then return json_build_object('ok', false, 'erro', 'corrida'); end if;
  if u is not null then
    update public.players set
      best = coalesce((select max(score) from public.leaderboard where user_id = u), 0),
      corridas_total = greatest(0, corridas_total - 1),
      centers_total = greatest(0, centers_total - case when coalesce(sc, 0) >= 5000 then 1 else 0 end)
    where id = u;
  end if;
  insert into public.admin_log (admin, acao, alvo, valor) values (auth.uid(), 'corrida', u::text, p_id::text);
  return json_build_object('ok', true);
end $function$;
