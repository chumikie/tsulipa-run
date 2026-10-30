-- Religa o Karaoke⭐Day! online (desfaz karaoke_online_desligado.sql). Rodar só com o OK da dona.
grant execute on function public.karaoke_sala(text, uuid) to authenticated;
grant execute on function public.karaoke_sala_toque(uuid) to authenticated;
grant execute on function public.karaoke_sala_elenco() to authenticated;
grant execute on function public.karaoke_sala_admin(text, integer, text) to authenticated;
grant execute on function public.karaoke_posteres_semana() to anon, authenticated;
grant usage on schema karaoke_lab to authenticated;
grant select on all tables in schema karaoke_lab to authenticated;
grant usage on all sequences in schema karaoke_lab to authenticated;
grant execute on function karaoke_lab.can_view_signal() to authenticated;
grant select on table public.tsulipa_karaoke_lab_signal to authenticated;
alter publication supabase_realtime add table public.tsulipa_karaoke_lab_signal;
-- Confira as permissões exatas contra karaoke_sala_online_producao.sql antes de reabrir.
