#!/bin/sh
# Teste ISOLADO do cliente VIP do Café (cópia de cafe_run_etapa2 de produção, 13/11/2026).
set -e
cd "$(dirname "$0")"
DB=cafe_vip_$$; P="psql -X -q -tA -v ON_ERROR_STOP=1 -U postgres -d $DB"
createdb -U postgres "$DB"; trap 'dropdb -U postgres "$DB"' EXIT
$P -f fixture.sql >/dev/null
$P -f ../../sql/aplicado/20261113_cafe_vip.sql >/dev/null
$P -f ../../sql/aplicado/20261113_cafe_vip.sql >/dev/null   # idempotente
ok(){ [ "$1" = "$2" ] && echo "  ok: $3" || { echo "FALHOU: $3 (veio '$1')"; exit 1; }; }
ok "$($P -c "select (length(d)-length(replace(d,'cliente VIP','')))/11 from (select pg_get_functiondef('public.cafe_run_etapa2(uuid,jsonb,boolean)'::regprocedure) d) x")" 1 "linha VIP inserida uma vez (reaplicar não duplica)"
r(){ $P -c "select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000a',false);" -c "select public.cafe_run_etapa2('$1','{\"base\":1,\"cob\":-1,\"enf\":2,\"doce\":-1}',false)->>'pontos_etapa'" | tail -1; }
# mesmo pedido, mesmo tempo, sem combo: rodada 5 (normal) x rodada 6 (VIP)
p5=$(r 00000000-0000-0000-0000-000000000005); $P -c "update private.cafe_runs set combo=0" >/dev/null
p6=$(r 00000000-0000-0000-0000-000000000006)
echo "    rodada 5: $p5 pts · rodada 6: $p6 pts"
ok "$((p6))" "$((p5*2))" "VIP (rodada 6) vale o dobro"
ok "$($P -c "select count(*) from public.star_log")" 0 "nenhuma estrela mexida"
echo "OK: cliente VIP do Café testado em PostgreSQL isolado"
