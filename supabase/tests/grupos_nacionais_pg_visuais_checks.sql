\set ON_ERROR_STOP on
-- Execução real das três migrações sobre PostgreSQL descartável.
-- A compra é um simulador isolado; o catálogo e salvar_avatar são os
-- códigos submetidos às substituições SQL das migrações reais.

do $catalogo$
declare
  k text; expected_price integer; found_price integer; found_points integer;
begin
  for k,expected_price in select * from (values
    ('roupa_tailandia',150),
    ('det_tulipa',50),
    ('det_torrada',50),
    ('hat_palha',70),
    ('duo_cafe',90)
  ) as expected(k,price) loop
    select preco,pontos into found_price,found_points from public.visual_preco(k);
    if found_price is distinct from expected_price or found_points is distinct from 0 then
      raise exception 'catálogo/pontos incorretos para %: %, %',k,found_price,found_points;
    end if;
  end loop;
  if exists(select 1 from public.visual_preco('fundo_cafe')) then
    raise exception 'Café foi cadastrado como fundo cobrado novamente';
  end if;
  if not (select prosecdef from pg_proc where oid='public.salvar_avatar(jsonb)'::regprocedure)
     or not (select prosecdef from pg_proc where oid='public.comprar_visual(text)'::regprocedure) then
    raise exception 'SECURITY DEFINER das RPCs de avatar/compra foi perdido';
  end if;
  if has_function_privilege('anon','public.salvar_avatar(jsonb)','EXECUTE')
     or has_function_privilege('anon','public.comprar_visual(text)','EXECUTE')
     or not has_function_privilege('authenticated','public.salvar_avatar(jsonb)','EXECUTE')
     or not has_function_privilege('authenticated','public.comprar_visual(text)','EXECUTE') then
    raise exception 'permissões de compra/avatar alteradas';
  end if;
end
$catalogo$;

set role authenticated;
do $compra_avatar$
declare
  r json;
begin
  perform set_config('request.jwt.claim.sub','',true);
  r := public.comprar_visual('det_tulipa');
  if r->>'erro' <> 'login' then raise exception 'compra anônima aceita: %',r; end if;
  r := public.salvar_avatar('{"c":{"det":"tulipa"}}'::jsonb);
  if r->>'erro' <> 'tamanho' then raise exception 'avatar anônimo aceito: %',r; end if;

  perform set_config('request.jwt.claim.sub','50000000-0000-4000-8000-000000000002',true);
  -- Bloqueia uso sem posse. Não deve gravar, debitar ou liberar o Café.
  r := public.salvar_avatar('{"c":{"det":"tulipa"}}'::jsonb);
  if r->>'erro' <> 'acessorio_nao_comprado' then raise exception 'tulipa grátis: %',r; end if;
  r := public.salvar_avatar('{"c":{"det":"torrada"}}'::jsonb);
  if r->>'erro' <> 'acessorio_nao_comprado' then raise exception 'torrada grátis: %',r; end if;
  r := public.salvar_avatar('{"c":{"hat":"palha"}}'::jsonb);
  if r->>'erro' <> 'acessorio_nao_comprado' then raise exception 'chapéu grátis: %',r; end if;
  r := public.salvar_avatar('{"fundo":"cafe"}'::jsonb);
  if r->>'erro' <> 'fundo_nao_comprado' then raise exception 'Café sem duo_cafe: %',r; end if;
  r := public.salvar_avatar('{"c":{"out":"brasil"}}'::jsonb);
  if r->>'erro' <> 'roupa_nao_comprada' then raise exception 'roupa sem compra: %',r; end if;
  r := public.comprar_visual('det_inexistente');
  if r->>'erro' <> 'visual' then raise exception 'compra fora do catálogo: %',r; end if;

  r := public.comprar_visual('det_tulipa');
  if r->>'ok' <> 'true' or (r->>'custo')::integer <> 50 then
    raise exception 'compra da tulipa falhou: %',r;
  end if;
  r := public.comprar_visual('det_tulipa');
  if r->>'erro' <> 'ja_tem' then raise exception 'cobrança duplicada da tulipa: %',r; end if;
  r := public.salvar_avatar('{"c":{"det":"tulipa"}}'::jsonb);
  if r->>'ok' <> 'true' then raise exception 'tulipa comprada não pôde ser salva: %',r; end if;

  r := public.comprar_visual('det_torrada');
  if r->>'ok' <> 'true' then raise exception 'compra torrada: %',r; end if;
  r := public.salvar_avatar('{"c":{"det":"torrada"}}'::jsonb);
  if r->>'ok' <> 'true' then raise exception 'torrada comprada não pôde ser salva: %',r; end if;

  r := public.comprar_visual('hat_palha');
  if r->>'ok' <> 'true' then raise exception 'compra chapéu: %',r; end if;
  r := public.salvar_avatar('{"c":{"hat":"palha"}}'::jsonb);
  if r->>'ok' <> 'true' then raise exception 'chapéu comprado não pôde ser salvo: %',r; end if;

  r := public.comprar_visual('duo_cafe');
  if r->>'ok' <> 'true' or (r->>'custo')::integer <> 90 then
    raise exception 'compra duo_cafe: %',r;
  end if;
  r := public.salvar_avatar('{"fundo":"cafe"}'::jsonb);
  if r->>'ok' <> 'true' then raise exception 'Café com duo_cafe foi bloqueado: %',r; end if;

  r := public.comprar_visual('roupa_brasil');
  if r->>'ok' <> 'true' then raise exception 'compra da roupa legada Brasil: %',r; end if;
  r := public.salvar_avatar('{"fundo":"cafe","c":{"out":"brasil","det":"torrada","hat":"palha"}}'::jsonb);
  if r->>'ok' <> 'true' then raise exception 'salvamento combinado perdeu compatibilidade: %',r; end if;

  -- Administração existente conserva o comportamento de visuais livres.
  perform set_config('request.jwt.claim.sub','50000000-0000-4000-8000-000000000001',true);
  r := public.salvar_avatar('{"c":{"det":"tulipa","hat":"palha"}}'::jsonb);
  if r->>'ok' <> 'true' then raise exception 'permissão de admin foi removida: %',r; end if;
end
$compra_avatar$;
reset role;

do $integridade_visuais$
declare
  a public.players;
  b public.players;
begin
  select * into a from public.players where id='50000000-0000-4000-8000-000000000001';
  select * into b from public.players where id='50000000-0000-4000-8000-000000000002';
  if a.stars <> 123 or a.visuais <> '{}'::text[] or a.grupo <> 'SKU48'
     or a.avatar #>> '{c,det}' <> 'tulipa' then
    raise exception 'saldo/visuais/grupo/admin fora do contrato: %',row_to_json(a);
  end if;
  if b.stars <> 46 or b.grupo <> 'BRS48' or b.time <> 'B'
     or b.emoji <> '💙' or b.cor <> '#222222' or cardinality(b.visuais) <> 5
     or not b.visuais @> array['det_tulipa','det_torrada','hat_palha','duo_cafe','roupa_brasil']::text[]
     or b.visuais @> array['fundo_cafe']::text[] then
    raise exception 'saldo, saves ou propriedade da conta B divergentes: %',row_to_json(b);
  end if;
  if b.avatar->>'fundo' <> 'cafe'
     or b.avatar #>> '{c,out}' <> 'brasil'
     or b.avatar #>> '{c,det}' <> 'torrada'
     or b.avatar #>> '{c,hat}' <> 'palha' then
    raise exception 'último save do avatar não preservado: %',b.avatar;
  end if;
  if (select pontos from public.ci_ranking_guard where id=1) <> 98765
     or (select count(*) from public.admin_log) <> 2 then
    raise exception 'ranking ou auditoria administrativa alterados';
  end if;
end
$integridade_visuais$;

select 'PASS: 3 migrations + catalogue, isolated purchase, ownership, avatar, Cafe, ACL and integrity' as result;
