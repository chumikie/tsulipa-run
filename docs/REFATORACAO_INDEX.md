# Refatoração do index.html em módulos (PR #62)

Objetivo: tirar do `index.html` os grandes blocos de funcionalidade, um por vez, **sem mudar nada na tela nem nas regras**.

## Método (vale para todas as etapas)

1. **Invólucro removido (Etapa 1, uma vez só):** o script principal era uma única função `(function(){ … })();`.
   O invólucro virou comentário; as ~1.100 funções e variáveis de dentro passaram a ser globais da página.
   Conferido antes: nenhum desses nomes coincide com propriedades do navegador nem com globais dos outros
   scripts (`pet-sync.js`, `tw-i18n.js`, `tw-windows.js`, `karaoke-tickets.js`, `tw-avatar-*.js`,
   `tw-motion-lifecycle.js`); a única exceção é `contaJ`, que já era exposto em `window.contaJ`
   (o `defineProperty` antigo fica sem efeito e `window.contaJ` passa a ser a própria variável, com o mesmo valor).
2. **O módulo só declara:** o arquivo novo recebe apenas as **declarações de função** e as **tabelas fixas**
   (`var X = <literal>`) do bloco. Ele carrega **antes** do script principal, o que reproduz exatamente o
   hoisting de quando tudo morava no mesmo script. Variáveis com estado, `addEventListener`, chamadas de
   inicialização e qualquer código que executa continuam no `index.html`, na mesma ordem.
3. **CSS:** as regras do bloco vão para `<nome>.css`, ligado com `<link>` no ponto do primeiro bloco de regras
   do módulo (o `<style>` é fechado e reaberto ali). A ordem das regras do módulo entre si é mantida.
4. **Provas a cada etapa:**
   - `node tests/run-all.js` (os testes de texto leem `index.html` + módulos via `tests/site-source.js`);
   - `tests/<modulo>-module.test.js`: o módulo não executa nada ao carregar, carrega antes do script
     principal, e nenhuma função ficou duplicada;
   - Chromium antes × depois, com relógio e `Math.random` fixos: capturas e **estilos calculados de todos os
     elementos** em cada estado do módulo (celular 390 px e computador 1280 px);
   - testes de navegador do CI (`i18n-visual`, `profile-accessories`, `karaoke-mobile`).

## Etapas

| Etapa | Módulo | Arquivos | Situação |
|---|---|---|---|
| 1 | Backstage⭐Pet! | `pet.js`, `pet.css` | Extraído (02/11/2026). 121 funções + 56 tabelas; 83 linhas de CSS. |
| 2 | Perfil | — | Pendente |
| 3 | Gacha | — | Pendente |
| 4 | Moon⭐Duo | — | Pendente |
| 5 | Encontro do dia | — | Pendente |
| 6 | Administração | — | Pendente (esperar a PR #60, que mexe no admin) |
| 7 | Hub | — | Pendente |
| 8 | Center⭐Run | — | Pendente |
| — | Consolidação do index.html e redução controlada de `!important` | — | Depois das etapas |

### Etapa 1 — o que ficou no index.html
- Estado do camarim (`petData`, `petOpen`, `petCv`/`petCtx` etc.), listeners e as chamadas de início
  (`petAlertLigar()` e afins), na posição original.
- `drawPet` e os desenhos de pet usados também pelo Center⭐Run e pelo Perfil (ficam para a etapa do
  Center⭐Run, por serem compartilhados).
- `pet-sync.js` continua sendo a única camada de sincronização.

### Etapa 1 — conferência antes × depois
- Telas: início, menu, Center⭐Run, adoção, camarim, Comer, Banho, Brincar, Cantar, Conversar, Acessório,
  Decorar, Dormir, foto e corrida; mesmo save do pet gerado nos dois casos; sem erros novos no console.
- Estilos calculados: 0 diferenças em todos os elementos, fora as fases de animação CSS (morcegos, brilho do
  alerta do pet e do campo de nome), que mudam de um quadro para o outro.
