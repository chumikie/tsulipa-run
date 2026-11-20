-- Executar depois do aceite de mini_run_start/finish.
-- O rollback depois desta etapa precisa manter o contrato novo.
begin;
do $$
begin
  if to_regprocedure('public.mini_run_start(text)') is null
     or to_regprocedure('public.mini_run_finish(uuid,integer)') is null then
    raise exception 'As funções novas do Camarim precisam estar instaladas.';
  end if;
end;
$$;
revoke execute on function public.ganhar_minijogo(integer) from public, anon, authenticated;
commit;
