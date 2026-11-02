CREATE OR REPLACE FUNCTION public.missoes_lista()
 RETURNS TABLE(k text, nivel integer, meta integer, premio integer, fam text)
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  select * from (values
    ('corra2', 1, 2, 10, 'corrida'), ('coracao', 1, 1, 10, 'coracao'), ('recado', 1, 1, 10, 'recado'), ('mini', 1, 1, 10, 'mini'), ('pet', 1, 1, 10, 'pet'),
    ('corra3', 2, 3, 15, 'corrida'), ('estrelas50', 2, 50, 15, 'estrela'), ('pontos2000', 2, 2000, 15, 'ponto'), ('tsulipa', 2, 3, 15, 'tsulipa'),
    ('corra5', 3, 5, 20, 'corrida'), ('pontos5000', 3, 5000, 20, 'ponto'), ('estrelas100', 3, 100, 20, 'estrela')
  ) as v(k, nivel, meta, premio, fam)
$function$
