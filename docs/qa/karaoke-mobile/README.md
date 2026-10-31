# Karaoke no celular — PR #49

Base: `45de798cff0da32dc36c27cd2a01c9d1085beca9`. Ajuste restrito à apresentação, em 31/10/2026.

O cabeçalho oficial era transportado inteiro para o Karaoke, incluindo `#best`, alimentado pelo Center Run. A regra nova oculta esse placar somente em `data-karaoke-tela`, sem alterar dados nem a apresentação ao voltar ao Center.

No celular, a linha de controles podia quebrar sem distribuição definida. `karaoke-mobile.css` organiza seleção de música e início em duas colunas, com a sessão na linha seguinte. Abaixo de 620 px, margens laterais menores dão mais espaço à sala, preservando seu enquadramento 16:9 e a ampliação do telão já existente durante a partida.

O aviso de cinco tentativas era movido para o fluxo da página e depois recebia `opacity:0`, deixando um bloco invisível antes do ranking. No Karaoke integrado em celular ele permanece visível e compacto. O ranking fica 10 px abaixo do aviso. Durante a partida, a ordem mantém controles, cena, teclas, aviso e ranking. Ao esgotar as tentativas o aviso externo sai do fluxo, pois a sala já apresenta a mensagem de encerramento.

O JavaScript da sala, seu desenho, posições, interações, cálculo de pontos e integração online não foram alterados. No computador o aviso mantém seu comportamento original de esmaecimento.

## Evidência

- [Celular, antes e depois](mobile-comparison.webp).
- [Computador, antes e depois](desktop-comparison.webp).
- [Métricas da base](before-results.json) e [métricas atualizadas](after-results.json).

Capturas com dados locais; animações e sorteios podem aparecer em instantes diferentes. Não representam partidas nem contas reais. À esquerda está a base; à direita, o ajuste.

## Verificação

- Validação estática do projeto e 12 suítes Node passaram.
- Chromium local em 320, 390, 430, 844 (horizontal) e 1440 px: abertura, sala inteira, início offline, ausência de rolagem lateral, controles dentro da largura, alternância para visão da sala e retorno ao menu.
- No celular, o aviso continua legível após o tempo de esmaecimento original; não existe um bloco invisível entre ele e o ranking.
- Ao retornar ao Center, seu placar reaparece.
- Comparação com a base em 844 e 1440 px: canvas e cena conservam posição e dimensões.
- Requisições externas foram bloqueadas. A instrumentação de abertura existe exclusivamente na resposta HTTP do servidor de teste local; não modifica login ou controles de acesso da aplicação.
- WebKit não pôde ser executado neste ambiente por dependências de sistema indisponíveis. Chromium com largura mobile não equivale a Safari/iOS físico; o teste logado no aparelho permanece uma verificação manual.

Reprodução, com Playwright e Chromium instalados:

```sh
node tests/validate-games.js
node --test tests/*.test.js
node tests/karaoke-mobile.browser.cjs /tmp/karaoke-after
QA_BASELINE=1 QA_WIDTHS=390,1440 node tests/karaoke-mobile.browser.cjs /tmp/karaoke-before
```

`QA_BASELINE=1` lê `HEAD` para comparação com a cópia de trabalho. Para reproduzir a base após o commit, use um checkout separado do SHA acima. `QA_WEBKIT=1` inclui WebKit quando suas dependências estiverem disponíveis.
