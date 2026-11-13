-- Happy⭐Cafe! — cliente VIP: os pedidos da 6ª e da 11ª rodada valem o DOBRO de pontos.
-- Mudança mínima e auditável: insere UMA linha nas funções de produção cafe_run_etapa e cafe_run_etapa2
-- (lidas com pg_get_functiondef no momento de aplicar). Não mexe em geração de pedidos, vidas,
-- combo, estrelas (o bônus do dia continua ★10 fixo) nem grants (CREATE OR REPLACE os mantém).
-- Se o marcador não existir exatamente uma vez, a migração falha e nada muda.
do $mig$
declare f text; d text; marca text := E'   INSERT INTO private.cafe_resultados(user_id,dia)';
begin
  foreach f in array array['public.cafe_run_etapa(uuid,jsonb,boolean)','public.cafe_run_etapa2(uuid,jsonb,boolean)'] loop
    d := pg_get_functiondef(f::regprocedure);
    if position('cliente VIP' in d) > 0 then continue; end if;   -- já aplicado
    if (length(d) - length(replace(d, marca, ''))) / length(marca) <> 1 then
      raise exception 'marcador não encontrado exatamente uma vez em %', f; end if;
    d := replace(d, marca, E'   IF v_s.etapa IN (6,11) THEN v_pontos:=v_pontos*2; END IF;   -- cliente VIP paga em dobro\n' || marca);
    execute d;
  end loop;
end $mig$;
