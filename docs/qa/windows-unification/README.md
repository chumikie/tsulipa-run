# Unificação visual das janelas — PR #49

Base revisada: `8bd3815cd2023227eefbab27efadb0f7b6bf9911`.

A estrutura compartilhada está em `tw-windows.css`: fontes, hierarquia de título/japonês/descrição, estrela dourada, superfície, borda, raio, sombra, backdrop e controles. Gacha e Moon Duo deixaram de definir esse conjunto em `index2-skin.css`. Os estilos específicos agora cuidam das dimensões e do conteúdo de cada jogo.

Pet, Gacha, Moon Duo e as molduras de Perfil/Encontro usam as classes compartilhadas no documento principal. Sora e Karaoke carregam a mesma folha nos seus documentos. `tw-windows.js` mantém a escala do título ligada à largura da página hospedeira (35 px no computador, 24 px no celular), gerencia foco/Tab/Escape e reutiliza os handlers de saída existentes. Os subtítulos japoneses usam 12 px e peso 800.

O Karaoke continua largo, com título/subtítulos no topo, uma linha de controles com rolagem horizontal interna no celular, instrução compacta, banner diário com esmaecimento e som/câmera no canto inferior da sala. O Sora passa a ter o mesmo × das outras janelas. O Pet recebe × e som no cabeçalho, mantendo também o botão Voltar existente. O tamanho dos jogos e suas artes não foram padronizados à força.

## Evidência visual

Cada comparação mostra ANTES à esquerda e DEPOIS à direita, na ordem Gacha, Pet, Duo, Sora e Karaoke:

- [Visão geral atual](overview.webp)
- [Computador — escuro](desktop-dark-comparison.webp)
- [Computador — claro](desktop-light-comparison.webp)
- [Celular — escuro](mobile-dark-comparison.webp)
- [Celular — claro](mobile-light-comparison.webp)

As capturas mostram a aplicação real renderizada em Chromium local. Fontes da marca foram servidas a partir dos dados já incorporados ao Karaoke; o ambiente Linux recebeu uma fonte de emoji para a captura. Glifos de emoji podem variar no Windows/Android. Animações dos personagens podem estar em instantes diferentes entre as capturas.

## Validação executada

- Validação estática e 10 suítes Node passaram.
- 20 vistas dos cinco jogos: 1440 × 1000 e 390 × 844, em claro e escuro. Conferidos título/subtítulo, borda de 2 px, raio de 24 px, enquadramento, ×, Escape e retorno do foco ao card. O Sora também foi percorrido com Tab, sem alcançar os controles do hub atrás.
- 30 combinações adicionais: cinco jogos × três Oshis × claro/escuro; paleta dos iframes comparada à paleta da página principal.
- 8 vistas adicionais de Perfil e Encontro, nos dois tamanhos e temas: moldura, enquadramento, fechamento e Escape.
- 2 verificações detalhadas do Karaoke: rolagem interna, som/câmera dentro da sala, banner abaixo da TV no computador e fora da imagem no celular. Verificados esmaecimento, recuperação por hover e foco.
- Nos testes de navegador, todas as requisições externas foram bloqueadas. Pet e Duo usam dados locais de teste para exibir o camarim e o palco. Perfil e Encontro também usam fixtures locais. Nenhuma autenticação real, giro, prêmio, tentativa online, compra ou gravação no banco foi executada.

Os arquivos `*-results.json` registram métricas e resultados. O fluxo com uma conta real e o jogo em um aparelho físico continuam sendo uma verificação manual complementar; não são alegados como testados aqui.

## Reproduzir

Os testes comuns não precisam de rede:

```sh
node tests/validate-games.js
node --test tests/*.test.js
```

O teste de navegador requer Playwright disponível no ambiente e Chromium instalado. Execute a partir da raiz do repositório:

```sh
BROWSER_EXECUTABLE=/caminho/do/chromium node tests/windows-browser.cjs . /tmp/windows-qa
WINDOWS_OSHI_MATRIX=1 BROWSER_EXECUTABLE=/caminho/do/chromium node tests/windows-browser.cjs . /tmp/windows-oshi
WINDOWS_EXTRA=1 BROWSER_EXECUTABLE=/caminho/do/chromium node tests/windows-browser.cjs . /tmp/windows-secondary
WINDOWS_DETAIL=1 BROWSER_EXECUTABLE=/caminho/do/chromium node tests/windows-browser.cjs . /tmp/windows-banner
```

O servidor desse teste escuta somente em loopback. Ele injeta um acesso aos controladores exclusivamente na resposta HTTP local para abrir as fixtures; essa instrumentação não existe no HTML publicado. `WINDOWS_BASELINE=1` permite capturar uma cópia anterior sem exigir as classes novas.

Nenhum merge, alteração no Supabase ou deploy de produção faz parte desta mudança.
