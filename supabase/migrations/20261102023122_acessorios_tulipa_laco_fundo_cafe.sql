-- Apenas catálogo e validação de propriedade; não muda saves, saldo nem rankings.
-- A compra do fundo Café kawaii continua sendo exclusivamente duo_cafe.
do $migration$
declare origem text; novo text;
begin
  origem := pg_get_functiondef('public.visual_preco(text)'::regprocedure);
  novo := replace(origem,
    '(''det_coelho'', 50, 0),',
    '(''det_coelho'', 50, 0), (''det_tulipa'', 50, 0), (''det_torrada'', 50, 0), (''hat_palha'', 70, 0),');
  if novo = origem then raise exception 'visual_preco mudou: revisar catálogo antes de migrar'; end if;
  execute novo;
end $migration$;

-- Mantém a assinatura de salvar_avatar e todas as verificações anteriores.
-- Novos detalhes não podem ser publicados por quem não os comprou.
-- O fundo cafe é permitido apenas a quem já tem duo_cafe (sem nova cobrança).
do $migration$
declare origem text; novo text;
begin
  origem := pg_get_functiondef('public.salvar_avatar(jsonb)'::regprocedure);
  novo := replace(origem,
    'AND NOT ((''fundo_'' || f) = ANY(p.visuais)) THEN',
    'AND NOT ((''fundo_'' || f) = ANY(p.visuais)) AND NOT (f = ''cafe'' AND ''duo_cafe'' = ANY(p.visuais)) THEN');
  if novo = origem then raise exception 'salvar_avatar mudou: revisar validação de fundos'; end if;
  origem := novo;
  novo := replace(origem,
    'IF pk <> '''' AND NOT coalesce((p.nuvem_pet->''pets'') ? pk, false) THEN',
    'IF NOT livre AND coalesce(v_avatar #>> ''{c,det}'', '''') IN (''tulipa'', ''torrada'') AND NOT ((''det_'' || (v_avatar #>> ''{c,det}'')) = ANY(p.visuais)) THEN
    RETURN json_build_object(''ok'', false, ''erro'', ''acessorio_nao_comprado'');
  END IF;
  IF NOT livre AND coalesce(v_avatar #>> ''{c,hat}'', '''') = ''palha'' AND NOT (''hat_palha'' = ANY(p.visuais)) THEN
    RETURN json_build_object(''ok'', false, ''erro'', ''acessorio_nao_comprado'');
  END IF;
  IF pk <> '''' AND NOT coalesce((p.nuvem_pet->''pets'') ? pk, false) THEN');
  if novo = origem then raise exception 'salvar_avatar mudou: revisar validação de acessórios'; end if;
  execute novo;
end $migration$;
