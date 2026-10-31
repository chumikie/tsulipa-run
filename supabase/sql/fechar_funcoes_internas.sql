-- Aplicado em 31/10/2026: funções internas (usadas só por outras funções do servidor ou por gatilhos)
-- não podem mais ser chamadas direto pelo site/API.
do $$ declare r record; begin
for r in select p.oid::regprocedure f from pg_proc p where p.pronamespace='public'::regnamespace and p.proname = any(array['aniver_hoje','eh_admin','encontro_do_dia','gacha_card','insignias','lb_set_date','mini_pts','missoes_lista','missoes_progresso','players_visual_sync','recados_globais_on','tema_do_dia','visual_preco','visual_tema']) loop
 execute format('revoke execute on function %s from public, anon, authenticated', r.f);
end loop; end $$;
