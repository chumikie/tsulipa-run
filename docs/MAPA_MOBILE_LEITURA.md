# Mapa Vivo⭐ — leitura e toque móvel

**Entrega 1 do ciclo após a PR #88.** Branch `feat/mapa-mobile-leitura-20261114` derivada de `visual/layout-hud` no commit `400fa8a4ca9c16be644e16bba6cdcae1c996e9f3`. A PR #88 não é alterada por esta entrega.

## Mudança pequena e reversível

- **Rótulos dos seis bairros** passam por `rotulo(id)` já na primeira montagem, em vez de nascerem sempre em português. Recebem `data-tw-rotulo` para o mecanismo de idioma que já existia atualizar os nomes ao voltar ao mapa.
- **Botões do mapa no celular:** áreas mínimas de 52 px nos seis atalhos e 48 px nos botões de voltar/aproximar. Fonte um pouco maior (com ajuste para 320 px) e ícones com largura estável.
- **Acessibilidade:** foco visível no botão de abrir o mapa também por teclado. Sem alterar a regra dos cards, a área de toque do Canvas, rolagem ou desempenho.

## Segurança e escopo

Somente `tw-mapa.js`, `hub-polish.css`, teste estático e esta nota. Não altera `index.html`, fluxo Google, Supabase, SQL, recompensas, saves, pontuação, Canvas 2D ou geração de SVGs.

## Testes

- `node tests/mapa-mobile-leitura.test.js` — verificações de tradução inicial, rótulo reativo, dimensões mínimas e não interferência.
- Antes de integrar à produção: revisão visual nas resoluções **320×640** e **390×844**, incluindo idioma japonês, indonésio e tema escuro; Safari no iPhone físico ainda pendente.
- O ramo é propositalmente independente para ser considerado **depois do merge da PR #88**. Não criar nova PR nem atualizar Vercel até decidir a integração.
