# Álbum de cards — pedido para o Supabase (ChatGPT)

**Status:** front-end pronto na PR do Álbum (`album.js`). Ainda não há nada aplicado no banco.
Hoje `meus_cards` devolve só os **3 últimos cards** de quem joga. O álbum precisa de **todos os Idols que a pessoa já tirou**.

## O que o site espera

Uma função RPC **só de leitura**:

```
public.album_cards() returns json
```

Ela recebe a pessoa logada por `auth.uid()` e não tem parâmetros.

Devolve uma lista com **um item por Idol** que essa conta já tirou no Star⭐Gacha!, no mesmo formato de `meus_cards`, mais o número de vezes:

```json
[
  { "card": { "nick": "Fuji", "...": "mesmos campos que meus_cards já devolve em card" },
    "tipo": "normal",
    "vezes": 2,
    "primeira": "2026-11-03T14:00:00Z" }
]
```

- `card` deve ter os **mesmos campos de `meus_cards`**, porque o site desenha com o mesmo `gachaCardDesenhar`. Para o card de cada Idol vale o mais recente.
- `tipo`: `"aniver"` quando for card de aniversário (igual a `meus_cards`).
- `vezes`: quantas vezes a pessoa tirou esse Idol. É opcional; aparece como "×2" no álbum.
- Grant: `authenticated`. Sem `anon`.

## Perguntas para a auditoria

1. Existe hoje um **histórico** de todos os giros com o Idol sorteado (tabela de log), ou só os 3 últimos ficam guardados?
   - **Se existe:** a função apenas lê esse histórico, e o álbum já nasce com tudo o que cada pessoa tirou.
   - **Se não existe:** é preciso começar a gravar cada card sorteado numa tabela nova, só de inserção, no `gacha_girar`. O álbum passa a contar a partir da data da aplicação, e os 3 cards atuais de `meus_cards` podem entrar como ponto de partida.
2. Confirmar que nada muda em saldos, giros diários ou prêmios. O álbum é só exibição.

## Comportamento do site enquanto a função não existe

- O botão **📖 Álbum de cards** aparece no Star⭐Gacha! (só com conta).
- O álbum mostra **um espaço "?" para cada Idol da vitrine**, uma barra de progresso, páginas de 9 e o aviso "O álbum começa a guardar seus cards em breve".
- Quando a função existir, os cards aparecem nos espaços, sem mudar o site. Tocar no card abre a tela de zoom já existente, com "Salvar como imagem".

Aplicação somente com autorização da dona do projeto. A proposta SQL, quando escrita, vai em `supabase/sql/proposta/`, não em `supabase/migrations/`.
