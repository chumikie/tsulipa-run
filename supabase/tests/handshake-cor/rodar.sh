#!/bin/sh
# Teste ISOLADO do lightstick do Handshake. Nunca aponte para produção.
# handshake_run_finish da réplica = trecho de validação e pontuação da função de produção (13/11/2026).
set -e
cd "$(dirname "$0")"
DB=hs_cor_$$; P="psql -X -q -tA -v ON_ERROR_STOP=1 -U postgres -d $DB"
createdb -U postgres "$DB"; trap 'dropdb -U postgres "$DB"' EXIT
$P -f fixture.sql >/dev/null
$P -f ../../sql/aplicado/20261113_handshake_cor.sql >/dev/null
$P -f ../../sql/aplicado/20261113_handshake_cor.sql >/dev/null   # reaplicar não duplica
A=00000000-0000-0000-0000-00000000000a
ok(){ [ "$1" = "$2" ] && echo "  ok: $3" || { echo "FALHOU: $3 (veio '$1')"; exit 1; }; }
ok "$($P -c "select (length(d)-length(replace(d,'lightstick certo','')))/16 from (select pg_get_functiondef('public.handshake_run_finish(uuid,jsonb)'::regprocedure) d) x")" 1 "linhas do lightstick inseridas uma vez"
S=$($P -c "select set_config('request.jwt.claim.sub','$A',false);" -c "select public.handshake_iniciar()::text" | tail -1)
ok "$(echo "$S" | python3 -c "import json,sys;d=json.load(sys.stdin);c=d['cores'];print(len(c),len(c[0]),len(c[1]),all(len(c[i])==len(d['desafios'][i]) for i in range(2,8)),all(0<=v<=5 for r in c for v in r))")" "8 0 0 True True" "cores só a partir da 3ª rodada, uma por fã, de 0 a 5"
ok "$($P -c "select count(*) from private.handshake_sessoes where cores is not null")" 1 "cores guardadas na sessão"
# sessão conhecida: rodada 3 com presentes [2,5,9] e cores [1,4,0]
mk(){ $P -c "insert into private.handshake_sessoes(id,user_id,desafios,cores,criado) values('$1','$A','[[0,1,2],[3,4,5],[2,5,9]]','[[],[],[1,4,0]]',now()-interval '20 seconds')"; }
f(){ $P -c "select set_config('request.jwt.claim.sub','$A',false);" -c "select public.handshake_run_finish('$1','$2')->>'pontos_verificados'" | tail -1; }
R='{"rodada":3,"origem":3,"indice":0,"resposta":2,"restante":0,"superfa":false'
mk 00000000-0000-0000-0000-000000000001; mk 00000000-0000-0000-0000-000000000002; mk 00000000-0000-0000-0000-000000000003; mk 00000000-0000-0000-0000-000000000004
p0=$(f 00000000-0000-0000-0000-000000000001 "[$R}]")
p1=$(f 00000000-0000-0000-0000-000000000002 "[$R,\"cor\":1}]")
p2=$(f 00000000-0000-0000-0000-000000000003 "[$R,\"cor\":3}]")
p3=$(f 00000000-0000-0000-0000-000000000004 "[{\"rodada\":3,\"origem\":3,\"indice\":0,\"resposta\":7,\"restante\":0,\"superfa\":false,\"cor\":1}]")
echo "    sem cor: $p0 · cor certa: $p1 · cor errada: $p2 · presente errado + cor certa: $p3"
ok "$p1" "$((p0+50))" "presente E cor certos: +50"
ok "$p2" "$p0" "cor errada: igual a hoje"
ok "$p3" 0 "cor sem acertar o presente não vale nada"
ok "$p0" "$p0" "versão antiga do site (sem cor) continua válida"
# partida de 600+ pontos passa pelo trecho do prêmio (v_item, v_saldo): pega erro de compilação no fim da função
mk 00000000-0000-0000-0000-000000000009
G=$(python3 -c "import json;print(json.dumps([{'rodada':r,'origem':3,'indice':0,'resposta':2,'restante':1000,'superfa':r>3,'cor':1} for r in [3]]+[{'rodada':3,'origem':3,'indice':i,'resposta':[2,5,9][i],'restante':1000,'superfa':False,'cor':[1,4,0][i]} for i in [1,2]]))")
ok "$($P -c "select set_config('request.jwt.claim.sub','$A',false);" -c "select public.handshake_run_finish('00000000-0000-0000-0000-000000000009','$G')->>'premio_novo'" | tail -1)" true "partida com prêmio do dia roda a função inteira sem erro"
echo "OK: lightstick do Handshake testado em PostgreSQL isolado"
