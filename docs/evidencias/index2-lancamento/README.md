# Evidências do lançamento da INDEX 2 — 29/10/2026

Base: `bc443bb0ea22df52a918421a2a6ca64015bb46c8`, branch `release/index2-lancamento`.

- `before.log`: execução dos oito comandos do workflow antes das mudanças: 6/8; os dois testes que falhavam constam com erro e saída.
- `after.log`: os mesmos oito comandos, após a migração: 8/8. Node v24.22.1 no ambiente local; o workflow continua usando Node 22.
- `browser.json` / `browser.log`: Chromium 153.0.8010.0, dez combinações (PT/EN/ES/TH/JA × 390×844 e 1440×1000), abertura do hub, aviso fechado, ensaio local, retorno, menu Sora e retorno. Redirecionamento `/index2.html` → `/` confirmado. Nenhuma exceção JavaScript; sem overflow horizontal no documento principal.
- `mobile-*.jpg` / `desktop-*.jpg`: quatro capturas por combinação, organizadas em grade: hub, aviso fechado, ensaio e Sora. A captura do hub mostra o viewport inicial; o restante do menu continua acessível por rolagem vertical.
- `rev.cjs`: roteiro efetivamente executado, com dependências/caches locais do ambiente descritos abaixo.

## Isolamento e limites

Todos os pedidos externos de aplicação foram abortados no navegador (incluindo SDK e endpoints Supabase). Fontes Google foram baixadas previamente e servidas por interceptação local; Noto Sans Thai, fontes japonesas e Noto Emoji instaladas apenas no ambiente de teste. Emoji deste Chromium são monocromáticos e podem diferir do celular da usuária. Não houve criação de usuários, pontuações ou registros na produção ou na homologação.

O roteiro usa Playwright do runtime, Chromium em `/tmp/chromium`, cache de fontes em `/tmp/font-map.json` e `/tmp/game-fonts.css`, servidor local na porta 8765 e pasta `../evidence` para saídas. Esses caminhos são do ambiente de execução, não dependências do site. O clique inicial animado e o card Karaoke com `aria-disabled=true` foram acionados com `force:true` no Playwright; isso não removeu a restrição de horário nem alterou o DOM ou o servidor.

Esta revisão não equivale a teste em aparelho físico nem a teste real de login, compras/gacha/resgates/corridas persistidas ou multiplayer. A implementação de `contaRpc` foi comparada byte a byte com a `index.html` anterior e é idêntica; o conjunto de nomes `brs48cr_*` também é idêntico ao da INDEX 2 original.

Observação preexistente fora do escopo: o botão de som no menu Sora ainda aparece como “Som” fora de PT nas capturas. Não foi modificado o arquivo do Sora nem o Karaoke online. Validar esse detalhe em uma tarefa separada, se desejado.

## Repetir a suíte estática

Execute cada `node tests/<arquivo>` listado em `.github/workflows/validate-games.yml`. São oito comandos independentes, sem banco ou rede. A correção dos testes mantém a verificação de CSS, texto de ensaio, navegação, datas, isolamento e ranking semanal; adapta as expectativas de prévia ao lançamento.
