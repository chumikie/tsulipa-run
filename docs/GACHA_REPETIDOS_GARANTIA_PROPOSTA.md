# Star⭐Gacha! — protótipo isolado de repetidos e garantia de prêmio

**Estado:** somente proposta de jogabilidade (PR #88, `visual/layout-hud`). **NÃO está ativo no site**, não foi aplicado SQL, não altera tabelas, RPCs, giros, estrelas, tickets, perfis ou saves. O protótipo em `tools/gacha/regras-proposta.js` é testável sem conta.

## Situação existente

- `gacha_girar` define os resultados no Supabase; frontend só apresenta o retorno.
- `public.gacha` registra os giros e `album_cards()` devolve os Idols com `vezes` (segundo proposta e estado da RETOMADA).
- `meus_cards()` mostra até três cards; a tela do Álbum já tem coleção, contadores e metas visuais.
- Prêmios já existentes: `ticket`, `estrelas`, `bonus`, `card` e `nada`. **Não mudar probabilidades da sorte nem o teto diário sem revisão.**

## Regras sugeridas (precisam da aprovação do dono)

1. **Pó de estrela (decisão confirmada para a proposta):** converter **voluntariamente** uma cópia repetida de card do Gacha em **1 pó**. A primeira cópia permanece; só transfere 1 do inventário, com registro negativo em `card_movimentos`. Duplicatas históricas podem ser convertidas se ainda existirem no inventário; aniversário sozinho não é elegível. O pó é independente das ★ gastáveis.
2. **Troca:** gastar **5 pós** para escolher **1 card faltante** do conjunto elegível atual. Nunca oferecer o próprio card, card removido, já possuído ou BDAY. Verificar seleção e posse dentro de transação atômica, e registrar a origem do card novo para o Álbum (não lançar um novo giro, não gerar ★). Se a coleção tiver poucos cards ou não houver elegíveis, ocultar a troca.
3. **Garantia de prêmio:** depois de **7 giros consecutivos do tipo `nada`**, o **8º giro diário** deve gerar um dos prêmios já existentes, jamais `nada`. Qualquer `ticket`, `estrelas`, `bonus` ou `card` reinicia a sequência. Isso **não cria giros extras** e não garante card raro. Recalcular histórico no servidor; nunca aceitar contagem do navegador.
4. **Transações e segurança:** alterar `gacha_girar` apenas com conferência da função e do esquema reais, bloquear concorrência por `auth.uid()`, utilizar lock transacional por usuário, e lançar resultado, pó e troca de forma idempotente. Não usar dados enviados pelo navegador como fonte da quantidade ou sorteio.
5. **Compatibilidade:** não alterar chaves `brs48cr_*`, economia atual de ★, o limite de 1 giro/dia, cards dos jogadores ou histórico existente. Se o novo recurso estiver desabilitado, o Gacha atual continua igual.

## Auditoria real do Supabase (13/11/2026; consultas somente de leitura)

- Confirmada a função atual `public.gacha_girar()`: 40% card; 40% ★5–15; 12% ★20–40; 3% bônus; 5% ticket. A função só produz `nada` quando o ramo de card não encontra nenhum Idol elegível; o 8º giro garantido só altera esse caso. Portanto **a garantia é uma proteção rara, não um mecanismo que concede prêmios extras normalmente**.
- `public.gacha`: chave primária `(user_id,dia)`; `gacha_girar()` já bloqueia a linha em `players` para preservar 1 giro/dia.
- `album_cards()` soma `gacha`, `aniver_presentes` e `card_movimentos`; assim, resgate de card e conversão de duplicata entram no inventário existente.
- Já existem trocas entre pessoas (`propor_troca`, `responder_troca` e `private.cards_qtd`). A conversão por pó usa o **mesmo advisory lock 4801** para não gastar o mesmo repetido duas vezes.
- Segurança atual conferida: `gacha_girar`, `album_cards` e as RPCs de troca são SECURITY DEFINER, pertencem a `postgres` e têm EXECUTE explícito a `authenticated` e `service_role`, não a `anon`.
- Não houve alteração em dados ou schema de produção, nem teste de escrita autenticada.

## Auditoria 2 + testes em PostgreSQL isolado (13/11/2026, noite)

Regras **aprovadas pelo dono**: 1 pó por cópia repetida convertida voluntariamente; 5 pós = 1 card faltante; o giro depois de 7 "nada" seguidos não sai "nada"; 1 giro/dia mantido; primeira cópia sempre preservada; economia de ★ intacta.

Comparei o SQL com as definições reais de produção (`gacha_girar`, `album_cards`, `private.cards_qtd`, `propor_troca`, `responder_troca`, esquema de `card_movimentos`/`gacha`; só leitura) e corrigi:

1. **Garantia não dá mais ★5**: quando o giro garantido cairia em "nada", entrega um bônus de corrida (ímã/escudo/fever). Assim a economia de ★ não muda em nada.
2. **Próprio card fora da conversão**: o card de aniversário (o seu próprio) nunca vira pó, mesmo com 2+ cópias.
3. **Resgate determinístico**: a escolha do Idol usa `order by id limit 1` (nicks são únicos por `lower(nick)`).
4. **`gacha_po_status()` devolve as listas da interface**: `repetidos` (convertíveis, com a contagem) e `faltando` (até 80 Idols ativos que ainda não estão no álbum).
5. Grants: RPCs novas só para `authenticated` e `service_role`; tabelas de pó no schema `private` (sem acesso pela API).

**Testes** (`supabase/tests/gacha-po/`, PostgreSQL 16 local com réplica mínima do esquema e cópias das funções reais): 38 asserções, incluindo idempotência, requisição reutilizada, primeira cópia preservada, card sem avatar/bloqueado/próprio, saldo insuficiente, integração com `album_cards`, garantia em 300 giros sem "nada" (controle com 6 "nada" continua normal), 1 giro/dia, permissões e **concorrência real** (duas conversões ao mesmo tempo; conversão × troca aceita ao mesmo tempo — só uma gasta a cópia).

```sh
PGHOST=<socket local> PGPORT=<porta> sh supabase/tests/gacha-po/rodar.sh   # nunca apontar para produção
```

**Comportamento herdado, não alterado:** se a cópia oferecida numa troca pendente for convertida, a troca continua pendente e é recusada no aceite (`sem_repetido_outro`), como já acontece hoje quando a cópia é trocada com outra pessoa.

## Arquivo de implementação de servidor (somente para revisão)

`supabase/sql/proposta/20261113_gacha_po_garantia_REVIEW_ONLY.sql`

Contém carteira e log privados com RLS, RPCs `gacha_po_status`, `gacha_converter_repetido`, `gacha_resgatar_card` e alteração mínima de `gacha_girar` para garantir a ausência de `nada` no 8º giro consecutivo. Conversão e resgate utilizam uma chave UUID de idempotência por operação, além do lock transacional compartilhado com trocas sociais.

**Ainda falta antes de liberar online:** autorização do dono para aplicar o SQL e o teste com conta real depois de aplicado. Nenhuma função deve ser publicada antes disso. Sem autorização específica, o arquivo não será aplicado.

## Testes do protótipo

```sh
node tests/gacha-regras-proposta.test.js
```

Testar a transação real e seu comportamento concorrente separadamente antes de liberar a função.
