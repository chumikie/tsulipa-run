-- Testes sequenciais. Cada asserção falha com exceção (psql -v ON_ERROR_STOP=1).
\set A '00000000-0000-0000-0000-00000000000a'
\set D '00000000-0000-0000-0000-00000000000d'
create function pg_temp.eu(u text) returns void language sql as $$ select set_config('request.jwt.claim.sub', u, false) $$;
create function pg_temp.ok(cond boolean, msg text) returns void language plpgsql as $$
begin if cond is not true then raise exception 'FALHOU: %', msg; end if; raise notice 'ok: %', msg; end $$;

-- 1. status
select pg_temp.eu(:'A');
select pg_temp.ok((public.gacha_po_status()->>'po')::int=0, 'status: saldo inicial 0');
select pg_temp.ok(public.gacha_po_status()->'repetidos'->0->>'nick'='Bia' and (public.gacha_po_status()->'repetidos'->0->>'vezes')::int=3,
  'status: só Bia é convertível (próprio card de aniversário e Caio ficam fora)');
select pg_temp.ok(json_array_length(public.gacha_po_status()->'repetidos')=1, 'status: um repetido');
select pg_temp.ok((public.gacha_po_status()->'faltando')::text like '%Duda%' and json_array_length(public.gacha_po_status()->'faltando')=1,
  'status: falta só Duda (sem o próprio, sem quem não tem avatar, sem bloqueado)');
-- 2-6. conversão
select pg_temp.ok((public.gacha_converter_repetido('Bia','11111111-0000-0000-0000-000000000001')->>'po')::int=1, 'converter Bia: +1 pó');
select pg_temp.ok(private.cards_qtd(:'A','bia')=2, 'converter: tirou 1 cópia');
select pg_temp.ok((public.gacha_converter_repetido('Bia','11111111-0000-0000-0000-000000000001')->>'repetido')::boolean, 'idempotente: mesma requisição não converte de novo');
select pg_temp.ok(private.cards_qtd(:'A','bia')=2 and (public.gacha_po_status()->>'po')::int=1, 'idempotente: inventário e saldo iguais');
select pg_temp.ok(public.gacha_converter_repetido('Caio','11111111-0000-0000-0000-000000000001')->>'erro'='requisicao_reutilizada', 'requisição reutilizada com outro card é recusada');
select pg_temp.ok((public.gacha_converter_repetido(' BIA ','11111111-0000-0000-0000-000000000002')->>'po')::int=2, 'converter de novo (nick com espaço/maiúscula)');
select pg_temp.ok(public.gacha_converter_repetido('Bia','11111111-0000-0000-0000-000000000003')->>'erro'='sem_repetido', 'primeira cópia é preservada');
select pg_temp.ok(private.cards_qtd(:'A','bia')=1, 'sobrou 1 Bia');
select pg_temp.ok(public.gacha_converter_repetido('Ana','11111111-0000-0000-0000-000000000004')->>'erro'='sem_repetido', 'próprio card (aniversário) não vira pó');
select pg_temp.ok(public.gacha_converter_repetido('Caio','11111111-0000-0000-0000-000000000005')->>'erro'='sem_repetido', 'card com 1 cópia não vira pó');
select pg_temp.ok(public.gacha_converter_repetido('Bia',null)->>'erro'='parametros', 'sem requisição: recusado');
select pg_temp.ok(public.gacha_converter_repetido('',gen_random_uuid())->>'erro'='parametros', 'nick vazio: recusado');
select pg_temp.eu('');
select pg_temp.ok(public.gacha_converter_repetido('Bia',gen_random_uuid())->>'erro'='sem_conta', 'sem conta: recusado');
select pg_temp.ok(public.gacha_po_status()->>'erro'='sem_conta', 'status sem conta');
-- 7-9. resgate
select pg_temp.eu(:'A');
select pg_temp.ok(public.gacha_resgatar_card('Duda','22222222-0000-0000-0000-000000000001')->>'erro'='po_insuficiente', 'resgate com 2 pós: insuficiente');
select pg_temp.ok((select count(*) from private.gacha_po_log where requisicao='22222222-0000-0000-0000-000000000001')=0, 'resgate recusado não grava log');
update private.gacha_po_saldo set saldo=6 where user_id=:'A';  -- atalho só do teste
select pg_temp.ok(public.gacha_resgatar_card('Edu',gen_random_uuid())->>'erro'='card_indisponivel', 'sem avatar: indisponível');
select pg_temp.ok(public.gacha_resgatar_card('Fe',gen_random_uuid())->>'erro'='card_indisponivel', 'bloqueado: indisponível');
select pg_temp.ok(public.gacha_resgatar_card('Ana',gen_random_uuid())->>'erro'='card_indisponivel', 'o próprio card: indisponível');
select pg_temp.ok(public.gacha_resgatar_card('Caio',gen_random_uuid())->>'erro'='ja_possui', 'card que já tem: recusado');
select pg_temp.ok((public.gacha_resgatar_card('duda','22222222-0000-0000-0000-000000000002')->>'po')::int=1, 'resgatar Duda: -5 pós');
select pg_temp.ok((public.gacha_resgatar_card('duda','22222222-0000-0000-0000-000000000002')->>'repetido')::boolean
  and (public.gacha_po_status()->>'po')::int=1, 'resgate idempotente');
select pg_temp.ok((select count(*) from json_array_elements(public.album_cards()) e where e->'card'->>'nick'='Duda' and (e->>'vezes')::int=1)=1, 'Duda aparece no Álbum (album_cards)');
select pg_temp.ok((select (e->>'vezes')::int from json_array_elements(public.album_cards()) e where e->'card'->>'nick'='Bia')=1, 'Álbum mostra Bia ×1 depois da conversão');
select pg_temp.ok(json_array_length(public.gacha_po_status()->'faltando')=0, 'nada mais faltando');
select pg_temp.ok((select sum(delta) from public.star_log) is null, 'pó e resgate não mexem em ★');
-- 10. garantia no giro: sem nenhum Idol elegível (único caso em que hoje sai "nada")
begin;
update public.players set avatar=null where id<>:'D';
select pg_temp.eu(:'D');
do $$ declare i int; r json; nada6 int := 0; ruim int := 0; bonus int := 0; begin
  for i in 1..300 loop
    delete from public.gacha where user_id='00000000-0000-0000-0000-00000000000d';
    insert into public.gacha(user_id,dia,tipo,valor) select '00000000-0000-0000-0000-00000000000d', date '2026-01-01'+k, 'nada', '0' from generate_series(1,7) k;
    perform set_config('teste.hoje', '2026-02-01', true);
    r := public.gacha_girar();
    if r->>'tipo'='nada' then ruim := ruim+1; end if;
    if r->>'tipo'='bonus' then bonus := bonus+1; end if;
    -- controle: só 6 "nada" seguidos -> ainda pode sair "nada"
    delete from public.gacha where user_id='00000000-0000-0000-0000-00000000000d';
    insert into public.gacha(user_id,dia,tipo,valor) select '00000000-0000-0000-0000-00000000000d', date '2026-01-01'+k, case when k=1 then 'estrelas' else 'nada' end, '0' from generate_series(1,7) k;
    r := public.gacha_girar();
    if r->>'tipo'='nada' then nada6 := nada6+1; end if;
  end loop;
  perform pg_temp.ok(ruim=0, format('garantia: 300 giros após 7 "nada" e nenhum "nada" (bônus em %s)', bonus));
  perform pg_temp.ok(nada6>60, format('controle: com 6 "nada" a sorte normal continua (%s "nada" em 300)', nada6));
end $$;
select pg_temp.ok(public.gacha_girar()->>'erro'='hoje', 'continua 1 giro por dia');
rollback;
-- 11. permissões
select pg_temp.ok(not has_function_privilege('anon','public.gacha_po_status()','execute')
  and not has_function_privilege('anon','public.gacha_converter_repetido(text,uuid)','execute')
  and not has_function_privilege('anon','public.gacha_resgatar_card(text,uuid)','execute'), 'anon não executa as RPCs novas');
select pg_temp.ok(has_function_privilege('authenticated','public.gacha_converter_repetido(text,uuid)','execute')
  and has_function_privilege('authenticated','public.gacha_resgatar_card(text,uuid)','execute'), 'authenticated executa');
select pg_temp.ok(not has_table_privilege('authenticated','private.gacha_po_saldo','select')
  and not has_table_privilege('authenticated','private.gacha_po_log','select'), 'tabelas de pó fora do alcance da API');
