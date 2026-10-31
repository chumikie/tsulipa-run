-- Karaoke⭐Day! (sala simultânea de domingo) APOSENTADO em 30/10/2026.
-- O único karaokê atual é o Karaoke⭐Time!, jogo individual com plateia visual e ranking semanal.
-- Este script desliga a API antiga sem apagar tabelas ou registros. O script de religação fica apenas como arquivo histórico e não deve ser usado para reativar a sala.

revoke execute on function public.karaoke_sala(text, uuid) from public, anon, authenticated;
revoke execute on function public.karaoke_sala_toque(uuid) from public, anon, authenticated;
revoke execute on function public.karaoke_sala_elenco() from public, anon, authenticated;
revoke execute on function public.karaoke_sala_admin(text, integer, text) from public, anon, authenticated;
revoke execute on function public.karaoke_posteres_semana() from public, anon, authenticated;

revoke usage on schema karaoke_lab from anon, authenticated;
revoke all on all tables in schema karaoke_lab from anon, authenticated;
revoke all on all sequences in schema karaoke_lab from anon, authenticated;
revoke execute on all functions in schema karaoke_lab from public, anon, authenticated;

revoke all on table public.tsulipa_karaoke_lab_signal from anon, authenticated;
do $$ begin
  if exists (select 1 from pg_publication_tables where pubname='supabase_realtime'
             and schemaname='public' and tablename='tsulipa_karaoke_lab_signal') then
    alter publication supabase_realtime drop table public.tsulipa_karaoke_lab_signal;
  end if;
end $$;
