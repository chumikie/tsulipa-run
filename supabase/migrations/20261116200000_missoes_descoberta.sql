-- Missões do dia com "descoberta" (16/11/2026): a partir de 17/11, os jogos pouco jogados entram no ciclo diário.
-- Dias pares (contando de 17/11): a missão de nível 1 sai do Bloom⭐Garden! (jardim) ou do Idol⭐Battle! (battle).
-- Um dia sim, dois não (resto 1 de 3): a missão de nível 2 é a foto do Photo⭐Studio! (foto).
-- Até 16/11 nada muda (quem já resgatou hoje não ganha missão nova). resgatar_missao valida contra esta mesma função.
-- Aplicada como migration "missoes_descoberta".
CREATE OR REPLACE FUNCTION public.missoes()
 RETURNS json
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with d as (select public.hoje_br() dia),
  f as (select (dia >= date '2026-11-17' and (dia - date '2026-11-17') % 2 = 0) desc1,
               (dia >= date '2026-11-17' and (dia - date '2026-11-17') % 3 = 1) desc2 from d),
  m as (select l.*, md5(auth.uid()::text || (select dia from d)::text || l.k) h from public.missoes_lista() l),
  m0 as (select 'collect'::text k, 0 nivel, 1 meta, 5 premio, 'collect'::text fam, ''::text h
         union all select 'duo'::text, 0, 1, 5, 'duo'::text, ''::text),
  m1 as (select * from m where nivel = 1 and (not (select desc1 from f) or fam in ('jardim', 'battle')) order by h limit 1),
  m2 as (select * from m where nivel = 2 and fam <> (select fam from m1) and (not (select desc2 from f) or k = 'foto') order by h limit 1),
  m3 as (select * from m where nivel = 3 and fam <> (select fam from m1) and fam <> (select fam from m2) order by h limit 1),
  esc as (select * from m0 union all select * from m1 union all select * from m2 union all select * from m3)
  select coalesce(json_agg(json_build_object('k', e.k, 'meta', e.meta, 'premio', e.premio,
           'prog', least(public.missoes_progresso(auth.uid(), e.k, (select dia from d)), e.meta),
           'feito', exists (select 1 from public.missoes_feitas f2 where f2.user_id = auth.uid() and f2.dia = (select dia from d) and f2.k = e.k))
         order by e.nivel), '[]'::json)
  from esc e where auth.uid() is not null
$function$;
