# Star⭐Gacha! — protótipo isolado de repetidos e garantia de prêmio

**Estado:** somente proposta de jogabilidade (PR #88, `visual/layout-hud`). **NÃO está ativo no site**, não foi aplicado SQL, não altera tabelas, RPCs, giros, estrelas, tickets, perfis ou saves. O protótipo em `tools/gacha/regras-proposta.js` é testável sem conta.

## Situação existente

- `gacha_girar` define os resultados no Supabase; frontend só apresenta o retorno.
- `public.gacha` registra os giros e `album_cards()` devolve os Idols com `vezes` (segundo proposta e estado da RETOMADA).
- `meus_cards()` mostra até três cards; a tela do Álbum já tem coleção, contadores e metas visuais.
- Prêmios já existentes: `ticket`, `estrelas`, `bonus`, `card` e `nada`. **Não mudar probabilidades da sorte nem o teto diário sem revisão.**

## Regras sugeridas (precisam da aprovação do dono)

1. **Pó de estrela:** +1 pó por *novo* giro que traz `card` repetido. Primeiro card de cada Idol não gera pó. Card de aniversário e duplicatas históricas **não convertem automaticamente**; evitar conceder pó sem log transacional. O nome “pó de estrela” é uma moeda do álbum, totalmente separada das ★ gastáveis.
2. **Troca:** gastar **5 pós** para escolher **1 card faltante** do conjunto elegível atual. Nunca oferecer o próprio card, card removido, já possuído ou BDAY. Verificar seleção e posse dentro de transação atômica, e registrar a origem do card novo para o Álbum (não lançar um novo giro, não gerar ★). Se a coleção tiver poucos cards ou não houver elegíveis, ocultar a troca.
3. **Garantia de prêmio:** depois de **7 giros consecutivos do tipo `nada`**, o **8º giro diário** deve gerar um dos prêmios já existentes, jamais `nada`. Qualquer `ticket`, `estrelas`, `bonus` ou `card` reinicia a sequência. Isso **não cria giros extras** e não garante card raro. Recalcular histórico no servidor; nunca aceitar contagem do navegador.
4. **Transações e segurança:** alterar `gacha_girar` apenas com conferência da função e do esquema reais, bloquear concorrência por `auth.uid()`, utilizar lock transacional por usuário, e lançar resultado, pó e troca de forma idempotente. Não usar dados enviados pelo navegador como fonte da quantidade ou sorteio.
5. **Compatibilidade:** não alterar chaves `brs48cr_*`, economia atual de ★, o limite de 1 giro/dia, cards dos jogadores ou histórico existente. Se o novo recurso estiver desabilitado, o Gacha atual continua igual.

## Decisões pendentes antes da implementação online

- Confirmar **1 pó por duplicata, custo de 5 pós** (números provisórios).
- Confirmar que a garantia conta **somente `nada`**, e não “prêmios que a pessoa não gosta”.
- Revisar versão atual de `gacha_girar`, schema de `public.gacha`, `album_cards`, `players`, `aniver_presentes`, grants/RLS; testar com PostgreSQL isolado.
- Decidir política de conversão histórica (proposta atual: **não** converter) e elegibilidade de cards futuros.
- Somente depois de autorização específica elaborar SQL em `supabase/sql/proposta/` e teste de integração; **nunca** executar em produção automaticamente.

## Testes do protótipo

```sh
node tests/gacha-regras-proposta.test.js
```

Testar a transação real e seu comportamento concorrente separadamente antes de liberar a função.
