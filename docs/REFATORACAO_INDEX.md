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
   (`var X = <literal>`) do bloco. Exceção: tabelas que algum código já lê durante o carregamento, antes do
   ponto onde eram declaradas, ficam no `index.html` (para não passarem de `undefined` a preenchidas mais cedo). Ele carrega **antes** do script principal, o que reproduz exatamente o
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
| 2 | Perfil | `perfil.js`, `perfil.css` | Extraído (02/11/2026). 97 funções + 22 tabelas; 130 linhas de CSS. Modo admin fica para a Etapa 6. |
| 3 | Star⭐Gacha! | `gacha.js`, `gacha.css` | Extraído (02/11/2026). 15 funções + 4 tabelas (giro, card do Idol, últimos cards e zoom); 19 linhas de CSS. O card do Gacha na tela de início fica para a etapa do Hub. |
| 4 | Moon⭐Duo! | `duo.js`, `duo.css` | Extraído (02/11/2026). 51 funções + 15 tabelas (desenho, telas, abas, lojinha, itens travados, aviso); 56 linhas de CSS. |
| 5 | Encontro do dia | `encontro.js`, `encontro.css` | Extraído (02/11/2026). 16 funções + 6 tabelas (cena, halo, emojis, ordem do trio, prêmio); 18 linhas de CSS. O botão na tela de início fica para a etapa do Hub. |
| 6 | Administração | — | Pendente (esperar a PR #60, que mexe no admin) |
| 7 | Tela de início (hub) | `hub.js`, `hub.css` | Extraído (02/11/2026). 91 funções + 33 tabelas (cards, missões, Top Idols, TV, insígnia nova, busca, música, vitrine); 103 linhas de CSS. Temas da temporada e desenhos do Center⭐Run ficam para a Etapa 8. |
| 8 | Center⭐Run | — | Pendente |
| — | Consolidação do index.html e redução controlada de `!important` | — | Depois das etapas |

### Etapa 1 — o que ficou no index.html
- Estado do camarim (`petData`, `petOpen`, `petCv`/`petCtx` etc.), listeners e as chamadas de início
  (`petAlertLigar()` e afins), na posição original.
- `drawPet` e os desenhos de pet usados também pelo Center⭐Run e pelo Perfil (ficam para a etapa do
  Center⭐Run, por serem compartilhados).
- `pet-sync.js` continua sendo a única camada de sincronização.

### Etapa 7 — conferência antes × depois
- Abertura, visitante, logado com missões, aba do Top Idols, TsuLiPa⭐TV e busca (dados de teste), em 390 px e
  1280 px: estilos calculados idênticos, fora animações (alertas pulsando, TV e microfone); nenhum erro.
- O teste de fumaça do controlador da vitrine (`validate-games.js`) agora junta as funções de `hub.js` com as
  variáveis que ficaram no `index.html`.

### Etapa 5 — conferência antes × depois
- Encontro em trio (abrir, tocar no palco), em 390 px e 1280 px, com dados de teste: estilos calculados
  idênticos, fora animações (corações pulsando, botões da TV e do microfone); nenhum erro.

### Etapa 4 — conferência antes × depois
- Janela do Duo e as abas Cena, Cenário, Expressões e Presente (dados de teste, sem banco), em 390 px e
  1280 px: estilos calculados idênticos, fora o balanço animado dos botões da TV e do microfone; nenhum erro.
  Testes de navegador do CI (tradução, acessórios, Karaoke) conferidos só no GitHub nesta etapa.

### Etapa 3 — conferência antes × depois
- Janela do Gacha, giro (resultado com card), zoom do card e últimos cards no perfil (dados de teste, sem banco),
  em 390 px e 1280 px: estilos calculados idênticos, fora o balanço animado dos botões da TV e do microfone;
  nenhum erro no console.

### Etapa 2 — o que ficou no index.html
- Estado do perfil, listeners (`perfOv.addEventListener`…) e as chamadas de início, na posição original.
- Tabelas lidas já no carregamento (por exemplo `PERF_LOJA`, `PERF_POSES`, `PERF_FUNDOS`, `PERF_CAMPOS`) e
  regras de CSS mistas (`.lbn`, `.conta-perfil`, seletores que juntam perfil com Duo/aniversário/Encontro).
- Testes de texto ajustados para ler `index.html` + módulos (`tests/site-source.js`); um recorte antigo do
  `validate-games.js` procurava `hubLoop()` (que virou `hubLoop(ms)`) e ia sem querer até o fim do arquivo:
  corrigido para `hubLoop(`.

### Etapa 2 — conferência antes × depois
- Perfil público, perfil pessoal e as abas Perfil, Montar Idol e Estúdio (dados de teste, sem banco), início e
  Center⭐Run, em 390 px e 1280 px: estilos calculados idênticos em todos os elementos, fora o balanço animado
  dos botões da TV e do microfone; nenhum erro no console. A largura dos seletores de roupa do Center⭐Run varia
  entre carregamentos mesmo na versão antiga (conferido antes × antes), então foi desconsiderada.

### Etapa 1 — conferência antes × depois
- Telas: início, menu, Center⭐Run, adoção, camarim, Comer, Banho, Brincar, Cantar, Conversar, Acessório,
  Decorar, Dormir, foto e corrida; mesmo save do pet gerado nos dois casos; sem erros novos no console.
- Estilos calculados: 0 diferenças em todos os elementos, fora as fases de animação CSS (morcegos, brilho do
  alerta do pet e do campo de nome), que mudam de um quadro para o outro.
