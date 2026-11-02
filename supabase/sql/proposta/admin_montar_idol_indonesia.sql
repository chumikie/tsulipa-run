-- PROPOSTA (não aplicada) — 02/11/2026: aceitar a camisa da Indonésia (SPR48) no "Montar o Idol" do admin.
-- Depende de a camisa existir no catálogo (proposta 20261102140311: roupa_indonesia por ★150).
-- Mudança mínima sobre a versão ativa (migração 20261102175109_admin_montar_idol_antena_coracao_tailandia):
-- incluir 'indonesia' na lista de roupas da lojinha aceitas, logo depois de 'tailandia'. A regra de compra
-- continua a mesma (só aceita se a conta já comprou roupa_indonesia, ou se já está vestindo).
do $$
declare original text; alterado text; oid_func oid;
begin
  select p.oid into oid_func from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname='admin_montar_idol';
  if oid_func is null then raise exception 'admin_montar_idol ausente'; end if;
  original:=pg_get_functiondef(oid_func);
  alterado:=replace(original,'''brasil'', ''tailandia'', ''pijama'',','''brasil'', ''tailandia'', ''indonesia'', ''pijama'',');
  if original=alterado then raise exception 'Lista de roupas mudou; revisar admin_montar_idol'; end if;
  execute alterado;
end $$;
