#!/bin/sh
# Duas sessões ao mesmo tempo disputando a MESMA cópia repetida.
set -e
P="psql -X -q -tA -v ON_ERROR_STOP=1 -U postgres -d $DB"
A=00000000-0000-0000-0000-00000000000a
B=00000000-0000-0000-0000-00000000000b
# Ana recebe +1 Bia (fica com 2): uma cópia repetida para disputar.
$P -c "insert into public.card_movimentos(user_id,chave,delta) values('$A','bia',1)"
# Caso 1: duas conversões simultâneas
( $P -c "begin; select set_config('request.jwt.claim.sub','$A',false); select public.gacha_converter_repetido('Bia',gen_random_uuid())->>'ok'; select pg_sleep(1.5); commit;" > c1.out ) &
sleep .4
$P -c "select set_config('request.jwt.claim.sub','$A',false); select coalesce(public.gacha_converter_repetido('Bia',gen_random_uuid())->>'erro','ok');" > c2.out
wait
grep -q true c1.out && tail -1 c2.out | grep -q sem_repetido || { echo "FALHOU: conversões simultâneas"; cat c1.out c2.out; exit 1; }
echo "  ok: duas conversões simultâneas — só uma gasta a cópia"
# Caso 2: conversão x troca aceita ao mesmo tempo
$P -c "insert into public.card_movimentos(user_id,chave,delta) values('$A','bia',1)"
TID=$($P -c "insert into public.card_trocas(de,para,dou,quero) values('$B','$A','caio','bia') returning id" | head -1)
( $P -c "begin; select set_config('request.jwt.claim.sub','$A',false); select public.gacha_converter_repetido('Bia',gen_random_uuid())->>'ok'; select pg_sleep(1.5); commit;" > c3.out ) &
sleep .4
$P -c "select set_config('request.jwt.claim.sub','$A',false); select coalesce(public.responder_troca($TID,true)->>'erro','aceita');" > c4.out
wait
grep -q true c3.out && tail -1 c4.out | grep -q sem_repetido || { echo "FALHOU: conversão x troca"; cat c3.out c4.out; exit 1; }
Q=$($P -c "select private.cards_qtd('$A','bia')" | tail -1)
[ "$Q" = 1 ] || { echo "FALHOU: Ana devia ficar com 1 Bia, ficou $Q"; exit 1; }
echo "  ok: conversão e troca ao mesmo tempo — a troca é recusada e a primeira cópia fica"
rm -f c1.out c2.out c3.out c4.out
