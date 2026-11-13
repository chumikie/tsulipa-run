#!/bin/sh
# Testes ISOLADOS do pó/garantia do Gacha. Nunca aponte para produção.
# Uso: PGHOST=/var/tmp/pgtest PGPORT=5499 sh supabase/tests/gacha-po/rodar.sh
set -e
cd "$(dirname "$0")"
DB=gacha_po_teste_$$
P="psql -X -q -v ON_ERROR_STOP=1 -U postgres"
createdb -U postgres "$DB"
trap 'dropdb -U postgres "$DB"' EXIT
$P -d "$DB" -f fixture.sql
$P -d "$DB" -f ../../sql/proposta/20261113_gacha_po_garantia_REVIEW_ONLY.sql
$P -d "$DB" -c "revoke execute on function public.gacha_girar() from public; grant execute on function public.gacha_girar() to authenticated, service_role;"
$P -d "$DB" -f dados.sql
$P -d "$DB" -o /dev/null -f testes.sql 2>teste.log || { sed 's/^psql:[^ ]* //' teste.log; rm -f teste.log; exit 1; }
sed 's/^psql:[^ ]* NOTICE:  ok:/  ok:/' teste.log; rm -f teste.log
DB="$DB" sh ./concorrencia.sh
echo "OK: todos os testes isolados do pó/garantia passaram"
