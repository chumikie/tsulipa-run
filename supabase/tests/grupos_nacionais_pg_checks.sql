\set ON_ERROR_STOP on
-- Papel authenticated e JWT claims sintéticas por conta, sem dados de produção.
do $acl$
begin
  if has_function_privilege('anon','public.salvar_grupo(text,text)','EXECUTE')
     or has_function_privilege('anon','public.salvar_grupo_estilo(text,text,text,text)','EXECUTE')
     or has_function_privilege('anon','public.salvar_estilo(text,text,text)','EXECUTE') then
    raise exception 'RPC de gravação exposta a anon';
  end if;
  if not has_function_privilege('authenticated','public.salvar_grupo(text,text)','EXECUTE')
     or not has_function_privilege('authenticated','public.salvar_grupo_estilo(text,text,text,text)','EXECUTE')
     or not has_function_privilege('authenticated','public.salvar_estilo(text,text,text)','EXECUTE')
     or not has_function_privilege('anon','public.grupos_disponiveis()','EXECUTE') then
    raise exception 'ACL das RPCs não corresponde ao contrato';
  end if;
  if not (select prosecdef from pg_proc where oid='public.salvar_grupo(text,text)'::regprocedure)
     or not (select prosecdef from pg_proc where oid='public.salvar_grupo_estilo(text,text,text,text)'::regprocedure) then
    raise exception 'RPCs de gravação perderam SECURITY DEFINER';
  end if;
end
$acl$;

set role authenticated;
do $authenticated$
declare
  r json;
  own_group text;
  own_team text;
  own_emoji text;
  own_color text;
  other_group text;
  other_stars integer;
  profile json;
  public_profile json;
  oshi json;
  groups json;
begin
  perform set_config('request.jwt.claim.sub','',true);
  r := public.salvar_grupo('BRS48','B');
  if r->>'erro' <> 'login' then raise exception 'auth.uid nulo não foi bloqueado: %',r; end if;

  groups := public.grupos_disponiveis();
  if json_array_length(groups) <> 2
     or json_array_length((select x.value from json_array_elements(groups) as x(value) where x.value->>'codigo'='BRS48')->'times') <> 4
     or json_array_length((select x.value from json_array_elements(groups) as x(value) where x.value->>'codigo'='SKU48')->'times') <> 4 then
    raise exception 'catálogo público dos grupos/times incompleto: %',groups;
  end if;

  perform set_config('request.jwt.claim.sub','50000000-0000-4000-8000-000000000001',true);
  r := public.salvar_grupo('SKU48','U');
  if r->>'ok' <> 'true' or r->>'grupo' <> 'SKU48' or r->>'time' <> 'U' then
    raise exception 'seleção válida de grupo/time falhou: %',r;
  end if;
  r := public.salvar_grupo('NOPE','B');
  if r->>'erro' <> 'grupo' then raise exception 'grupo inválido aceito: %',r; end if;
  r := public.salvar_grupo('SKU48','B');
  if r->>'erro' <> 'time' then raise exception 'time de outro grupo aceito: %',r; end if;

  r := public.salvar_grupo_estilo('SKU48','KKS','not-an-emoji','#ff80ba');
  if r->>'erro' <> 'emoji' then raise exception 'emoji inválido aceito: %',r; end if;
  r := public.salvar_grupo_estilo('SKU48','KKS','🌸','red');
  if r->>'erro' <> 'cor' then raise exception 'cor inválida aceita: %',r; end if;
  r := public.salvar_grupo_estilo('SKU48','KKS','🌸','#ff80ba');
  if r->>'ok' <> 'true' or r->>'grupo' <> 'SKU48' or r->>'time' <> 'KKS'
     or r->>'emoji' <> '🌸' or r->>'cor' <> '#ff80ba' then
    raise exception 'gravação atômica de grupo/estilo falhou: %',r;
  end if;

  -- A RPC legada grava estilo sem retornar a conta para BRS48.
  r := public.salvar_estilo('🌟','#00aa55','S');
  if r->>'ok' <> 'true' then raise exception 'salvar_estilo legado falhou: %',r; end if;
  profile := public.meu_perfil();
  if profile->>'grupo' <> 'SKU48' or profile->>'time' <> 'S'
     or profile->>'emoji' <> '🌟' or profile->>'cor' <> '#00aa55' then
    raise exception 'meu_perfil não expôs o grupo/estilo atual: %',profile;
  end if;

  perform set_config('request.jwt.claim.sub','50000000-0000-4000-8000-000000000002',true);
  r := public.salvar_grupo('BRS48','B');
  if r->>'ok' <> 'true' then raise exception 'segunda conta não conseguiu salvar grupo: %',r; end if;
  public_profile := public.perfil_publico('Conta B');
  if public_profile->>'grupo' <> 'BRS48' or public_profile->>'time' <> 'B' then
    raise exception 'perfil_publico não expôs o grupo da conta consultada: %',public_profile;
  end if;

  oshi := public.oshi_opcoes();
  if json_array_length(oshi) <> 2
     or not exists(select 1 from json_array_elements(oshi) as x(value) where x.value->>'nick'='Conta A' and x.value->>'grupo'='SKU48')
     or not exists(select 1 from json_array_elements(oshi) as x(value) where x.value->>'nick'='Conta B' and x.value->>'grupo'='BRS48') then
    raise exception 'oshi_opcoes não devolveu os grupos das duas contas: %',oshi;
  end if;

  select grupo into other_group from public.players where nick='Conta A';
  select stars into other_stars from public.players where nick='Conta B';
  select grupo into own_group from public.players where id=auth.uid();
  select time,emoji,cor into own_team,own_emoji,own_color from public.players where id=auth.uid();
  if other_group <> 'SKU48' or own_group <> 'BRS48' or own_team <> 'B'
     or own_emoji <> '💙' or own_color <> '#222222' or other_stars <> 456 then
    raise exception 'isolamento entre contas/campos não preservado';
  end if;
end
$authenticated$;
reset role;

select 'PASS: migration applied; account-scoped RPCs, ACL, validation, legacy compatibility and profile propagation verified' as result;
