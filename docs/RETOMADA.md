## Mesma PR #110 — passo 4: `karaoke-show.js` (17/11/2026, 17h)
- O show de ritmo (sons sintetizados, notas, acertos, combo, pausa, retomada e fim do show; o antigo `var kt=(function(){…})()`) foi para `karaoke-show.js` (36 KB). A sala cria com `KaraokeShow.criar({…})`; os 35 nomes que o show usa da sala chegam como leitura na hora (`D.nome()`), porque alguns são trocados depois de criado (ex.: `krUI`). Nenhum deles é reescrito pelo show.
- **Prova de que só mudou de lugar:** `tests/karaoke-fonte.js` remonta o HTML antigo a partir dos dois arquivos e o resultado é idêntico byte a byte ao commit anterior. Os 13 testes que extraíam trechos do show do HTML usam esse ajudante; teste novo `karaoke-show-arquivo.test.js`.
- `karaoke-time.html`: 403 KB (início do dia) → 321 KB. **Plano da #109 concluído** (ranking, biblioteca, enfeites, show).
- Conferido aqui: 119 testes rápidos e um show aberto no Android simulado (sem erro, foto inteira). Testes de navegador ficam para o CI.

## Mesma PR #110 — Karaoke dividido (passos 2 e 3) e mais leve no show do celular (17/11/2026, fim da tarde)

**Arquivos novos** (código igual, só mudou de lugar; o que vem da sala chega por parâmetro):
- `karaoke-biblioteca.js`: biblioteca de trilhas, prévias, vozes do trio e cabecinhas (`KaraokeBiblioteca.criar({$,tr,lang,avatar,CH,kt(),meta(),muted()})`).
- `karaoke-palco-desenho.js`: 25 funções de desenho dos enfeites (plantas, mesa e copos, caixas de som, armário, neon, pandeiro de parede, monitores, brilhos, `ktRR`/`ktCoracao`/`ktEstrela`…). Movidas por análise da árvore do código: cada valor da sala vira `D.nome()`. **Conferido com relógio e sorteio congelados: 60 quadros idênticos pixel a pixel.** `meuChar`, `ktMicCor` e `ktCorMembro` (leem o jogo) ficaram na sala.
- `karaoke-time.html`: 403 → 355 KB. Falta o passo 4 do plano (`karaoke-show.js`: ritmo, notas, combo e fim do show).

**Leveza** (Android simulado, 412 px a 2,6×, mediana de 3; Chrome sem placa de vídeo):
| | antes | depois |
|---|---|---|
| Sala parada | 25 qps, CPU 101% | 34 qps, CPU 84% |
| Show | 19 qps, CPU 101% | 34 qps |
- **Camadas lentas** (`KaraokePalco.camada`): janela, mesa, enfeites e plantas mexem devagar (a samambaia leva ~7 s para balançar); são redesenhados a cada 100 ms num canvas guardado e copiados nos outros quadros. Mesma resolução e transformação da sala; chave nova (paleta, VIP, vista da janela) redesenha na hora. Se o aparelho já está mais lento que a camada, ela desenha direto (sem cópia extra). Com `KaraokePalco.camada.ms=0` a diferença para o desenho direto é só o suavizado do texto da placa da janela.
- **Show no celular:** a sala vira fundo em tela cheia (`object-fit:cover`) e só ~1/3 da largura aparece. Escondendo a sala, o show ia de 21 para 58 qps, então ela era o peso. Agora (`krCorteSala`) só a faixa visível (com margem) é pintada e Idols inteiros fora dela não são desenhados (o balão de fala continua). "Ver sala inteira", computador e tablet deitado pintam tudo. **Foto no meio do show:** espera um quadro inteiro antes de copiar (reserva de 400 ms) — conferido: foto com a sala 100% preenchida.
- **PC:** igual antes e depois neste Chrome (9–10 qps, canvas 1920×1080 pintado pelo processador). Precisa de computador real para medir.
- Teste novo: `tests/karaoke-palco-desenho.test.js`. Navegador: `karaoke-mobile.browser.cjs` (5 larguras), `telas.browser.cjs` e `corrida.browser.cjs` passando.

## Mesma PR #110 — coluna larga no PC e primeira parte do Karaoke separada (17/11/2026, tarde)

- **Coluna do visual novo no PC grande:** a largura virou a variável `--twc-col` (`tw-celular.css`): 980 px como antes, **1240 px a partir de 1500 px** e **1360 px a partir de 1800 px**. Topo, faixa de título e páginas seguem a mesma variável (nada mais tem 980 px fixo). Em telas ≥ 1500 px o **Calendário** vira duas colunas (mês | dia escolhido) e o **Mapa** não passa da altura da tela (`min(--twc-col, (100vh − 360px) × 1,6)`), para os balões de "Falar" continuarem à vista. Abaixo de 1500 px nada muda. Conferido em 1920×1080, 1536×864 e 1366×768: sem erro e sem rolagem lateral.
- **`karaoke-ranking.js?v=1` (passo 1 do plano da #109):** saíram do `karaoke-time.html` o ranking da semana (Pontuação, Mais shows, Quem mais evoluiu), a música da semana, as abas, a linha "Você" e o `ktBoardsAgora`/placar da sala. **Código igual, só mudou de arquivo:** o `ktMeta` chama `KaraokeRanking.criar({$,tr,rules,context,avatar})` e usa `render()`/`reset()`. O `KaraokeShowRules` (regras e contas do ranking) continua no HTML. `karaoke-time.html`: 403 → 398 KB. Conferido na sala a 390 e 1366 px, vazio e com ranking online de mentira: medalhas, "Você" em 9º, 👑 do líder na música da semana, rostinhos desenhados, troca de aba e `ktMetaRefresh`.
- **Próximos passos do plano:** ~~`karaoke-biblioteca.js`~~ e ~~`karaoke-palco-desenho.js`~~ (feitos, ver acima) → ~~`karaoke-show.js`~~ (feito). O ganho de leveza de verdade vem do passo 3 (desenho da sala), que é onde está o peso medido (26 qps no Android simulado).

## Auditoria de leveza — 17/11/2026 (noite), depois de #105–#109 no ar

Base: `main` em `d47971a`. Medido no Chrome sem tela com o modo demonstração, em Android (412 px, 2,6×), tablet Android (800×1280 e 1280×800, 2×) e PC (1920 e 1366). **Atenção ao ler os números:** esse Chrome desenha sem placa de vídeo, então canvas animado pesa muito mais que num aparelho real. Vale a comparação antes/depois e entre telas, não o valor absoluto.

**Achado e corrigido**
- **Palco do Início desenhado 2× por quadro:** no visual novo, o `hubLoop` desenhava o `hubCv` (que nem aparece) e o `tw-celular.js` copiava a imagem inteira para o `twcPalcoCv` a cada quadro. A cópia obrigava a pintar o `hubCv` na hora: **~80% do processador parado no Início**. Agora o `hubLoop` desenha direto no palco (`hubDesenhar(alvo)` + `twcPalcoAlvo()`); com o palco fora da tela ou coberto, não desenha nada. Clássico igual a antes (desenha no `hubCv`). Script parado no Início: 96% → 12%; Menu e Jogos: 15% → 7–9% (60 qps).
- **`twNitido` (perfil.js) pintava demais no celular:** a conta era "pelo menos o zoom" → Café, Gacha, Handshake, Loja e Montar Idol saíam a 1760 px de largura para aparecer com ~390 px (2,5× mais pixels que a tela mostra). Agora é só tamanho na tela × zoom, com o mesmo teto do `tw-nitidez.js` (2× para palcos grandes). Café 17 → 52 qps, Gacha 9 → 27 qps (Android simulado). Mesma correção no quarto do Pet (`petFitCanvas`).
- **Mapa com pixels demais no celular:** 1600×1000 lógicos em ~380 px. O `tw-nitidez.js` agora também **baixa** a resolução de canvas enormes (≥ 600 mil pixels lógicos) mostrados com menos de 80% deles na tela (nunca abaixo de 0,5×). Mapa no Android: 14 → 59 qps.
- **Freio do palco do Início** (igual ao do Center⭐Run): se o palco passar de ~45 ms por quadro, cai de 2× para 1,5× e depois para 1×; o aparelho guarda em `tw_palco_nitidez`. Aparelho que aguenta não perde nitidez. `TW_NITIDEZ.limitado(cv)` diz quando um canvas foi freado de propósito (o `telas.browser.cjs` aceita).
- O palco novo do Início sempre recebe um primeiro desenho, mesmo com uma janela por cima (nunca fica em branco).
- Testes `karaoke-mobile-performance` e `validate-games` procuravam `function hubDesenhar()` literal: agora `function hubDesenhar(`.

**Conferido sem erro:** 117/117 testes; `corrida.browser.cjs` e `telas.browser.cjs`; 17 telas × 5 aparelhos (sem erro de script, sem rolagem lateral); partida começada em Center⭐Run, Café, Handshake, Gacha, Sora, Karaoke (pergunta antes de gastar tentativa), Battle, Bloom, Studio e Duo.
**Peso da abertura (visual novo):** 89 arquivos, 2,2 MB (~750 KB comprimido). Maiores: `index.html` 229 KB, `tw-celular.js` 193, `centerrun.js` 112, `tw-mapa.js` 106 (baixa depois da abertura), `hub.js` 103, `tw-celular.css` 97, `mapa-mundo.svg` 95.
**Falta (precisa de aparelho real):** medir no Android de verdade (processador e bateria no Início, Café, Gacha e Karaoke); o Karaoke continua o mais pesado no teste (canvas 960×540 cheio de personagens, 26 qps no Android simulado). **Ideias:** ~~coluna mais larga no PC ≥ 1500 px~~ (feito, ver acima); dividir o `karaoke-time.html` (passo 1 feito, ver acima); `tw-bairro.js` (45 KB) sob demanda.

## Rodada 17/11/2026 — visual novo também no computador e no tablet

**Entrou** (branch `feat/visual-novo-computador`, PR draft)
- **Padrão em todos os aparelhos** (pedido do dono): sem escolha guardada, o visual novo abre em telefone, tablet e computador (`on=pref!=='0'` no `index.html`). Quem tocou em Ajustes → "Voltar ao visual clássico" (`brs48cr_celular='0'`) continua no clássico; `?celular=0|1` segue valendo.
- **Faixa de título quebrada em telas largas:** o recuo esquerdo (que alinha o título à coluna de 980 px) crescia com a janela, mas a faixa ficava presa em 560 px; em 1920 px o título virava uma coluna de ~70 px colada na esquerda (print do dono, tela do Mapa). Agora a largura soma o recuo: `min(calc(560px + max(0px,(100% - 980px)/2)),86%)`. Celular igual a antes.
- Versões: `tw-celular.css?v=33`, `tw-celular.js?v=44`. Teste novo em `celular-previa.test.js` para a largura da faixa.
- **Conferido no Chrome sem tela** (sem `?celular=1`, com `?demo=1`): 1920×1080, 2560×1440, 1366×768, tablet 1024×768 e iPhone 13; Início, Menu, Jogos, Calendário, Mapa, Missões e Perfil, sem erro de script; escolha do clássico respeitada ao recarregar.

- **Nitidez no computador** (relato do dono: "qualidade muito inferior"): no visual novo as janelas ficam ~708 px no computador e os palcos desenhados em 640 px (ou o quarto do Pet em 360) eram ampliados; com zoom do Windows a 150% chegavam a 60% da nitidez.
  - `twNitido(cv)` (em `perfil.js`): dá ao canvas pixels reais pelo tamanho na tela × zoom (degraus de 0,25, teto 3×) e uma escala por baixo; `cv.width/height` continuam respondendo o tamanho lógico, então o desenho e os toques do jogo não mudam. Ligado na Loja, Gacha, Café, Handshake e na prévia do Montar Idol. **Só usar em canvas com largura no CSS e que não seja lido de volta** (getImageData/drawImage dele mesmo).
  - Quarto do Pet: `petFitCanvas` passa a usar o tamanho na tela (era só o zoom) e é conferido a cada quadro.
  - `perfCharContorno` desenha o boneco na resolução real do destino (antes, sempre na lógica e ampliado); sem escala, igual a antes.
  - Medido (1280 px, zoom 100% e 150%): Pet, Loja, Gacha, Café e Handshake de 0,5–0,9 para ≥ 1,0. Ainda abaixo de 1 com zoom 150%: o palco do Início (0,87, cópia do `hubCv`).
- **Celular com o nome do Idol:** "SamiPhone" também no aviso de recado do Humor, na dica da câmera do Camarim e no "guardar foto" do Karaoke (já valia na marca e em Momentos). Sem conta: TsuPhone.
- **Karaoke com bloco vazio enorme abaixo dos rankings:** a altura avisada ao site era `documentElement.scrollHeight`, que nunca fica menor que o iframe; depois de crescer uma vez não encolhia (~760 px vazios no celular). Agora mede o `body`. O teste de navegador da sala fixa o hub clássico (é o que ele mede); o lobby novo tem os próprios testes.
- Teste novo: `tests/visual-computador.test.js`.

### Vida no bairro (mesma PR, 17/11 tarde) — ideias do The Urbz escolhidas pelo dono
Módulo novo `tw-bairro.js?v=1` (carrega com o visual novo, logo depois do `tw-humor.js`). **Tudo neste aparelho** (`brs48cr_bairro_v1`, separado por conta), **nada de estrela, ranking ou servidor**. Conta só o que o Humor já conta: jogo confirmado pelo servidor (ou treino de visitante), nunca abrir janela; o `tw-humor.js` agora passa o jogo aos ouvintes (`avisar(tipo, ev, fraco)`).
- **Bico da rua (3 níveis):** os jogos de cada rua do Mapa contam pontos (Star Stage: Run/Karaoke/Handshake · Galeria: Café/Gacha · Vila: Bloom · Praça: frases, corações, passeios · Arena: Battle · Jardim: Sora/Duo/Studio). Níveis em 2, 6 e 15 pontos, **no máximo 4 por rua por dia** (anda com os dias). Prêmios só de enfeite: nível 1 selo da rua, nível 2 um **gesto**, nível 3 o título "Estrela da rua".
- **Gestos** = poses grátis + expressões que o desenho base já tem (V, Coração, Tchau × sorriso/piscadinha/surpresa/apaixonado/olhar). Nenhuma arte nova, nenhuma pose paga liberada.
- **Bagunça da semana:** troca no domingo 0h de Brasília (junto com o Karaoke), roda as 6 ruas: Passarinho Distraído (Praça), Gatinho Paparazzi (Arena), Nuvem Resmungona (Jardim), Pombinho Maestro (Star Stage), Coelhinha Gulosa (Galeria), Borboleta Sapeca (Vila). Resolve com o gesto do bico de **outra** rua (nível 2), uma vez por semana; a cena mostra o seu Idol fazendo o gesto. Os bichos são os mesmos desenhos do Mapa (`twMapaBicho` em `tw-mapa.js`; borboleta e passarinho foram separados em `voadorDesenhar`, desenho igual); a nuvem é desenhada no próprio módulo. Se a semana acaba sem resolver, "os vizinhos resolveram juntos" (sem castigo).
- **Mensagens no *Nick*Phone:** o Chat do celular do Camarim ganha uma fala do trio a mais (Tsu: bagunça e pista do gesto; Lirika: nível novo ou dica de bico; Pati: guia ou "Estrela da rua"), com número de novas no app Chat e em cada contato; lida ao abrir a conversa.
- **Primeiros dias guiados:** só em conta nova (sem recorde nem histórico do Humor neste aparelho). Dia 1 Star Stage + Praça, dia 2 Galeria, dia 3 Vila, dia 4 Jardim, dia 5 Arena. **Nada é trancado:** rua apagada ganha véu "em breve" no Mapa e, ao tocar, pergunta Entrar / Ver tudo agora / Depois.
- **Onde aparece:** linha "Bagunça da semana" no Hoje do Início (com o bico mais perto de subir), atalho "Vida no bairro" no Menu, janela própria (moldura igual às dos jogos, `z-index` 22), véu do guia no Mapa e Chat do celular. No clássico não aparece (o Humor também não).
- Textos nos 6 idiomas no próprio módulo (com "do/da", "no/na" em português e espanhol). Peso: 45 KB (17 KB comprimido), só no visual novo.
- Teste novo `tests/bairro.test.js` (contagem, limite diário, rotação, gesto, guia, falas, idiomas, sem moeda/servidor). Conferido no Chrome sem tela (iPhone 13 e 1440 px), as 6 bagunças semana a semana, guia no Mapa, Chat do DemoPhone; sem erro de script; clássico intacto.
- **Não testado:** conta real (o bico conta com os RPCs confirmados de verdade), iPhone/Android físicos. **Ideias para depois:** roupa como prêmio do nível 3 (precisa do servidor, porque a loja é validada lá), o capítulo de domingo do Idol⭐News! contando o fim da bagunça, levar o progresso para a conta (SQL, com o ChatGPT e OK do dono).
- Palco do Início continua 0,87 de nitidez com zoom 150%: é cópia do `hubCv`; resolver pede mudar o tamanho do hub (também usado no clássico) — deixado para outra rodada.

**Falta:** conferir em computador real (Windows/Chrome) e no iPad; merge do dono.

## Rodada 16/11/2026 (tarde) — PR #98, versão v3.0

**Entrou**
- **Visual de celular é o padrão nos telefones** (toque + lado menor ≤ 600 px) quando a pessoa não escolheu; Ajustes → "Voltar ao visual clássico" grava `brs48cr_celular='0'`. Computador e tablet seguem no clássico (botão 📱 no ⚙️). O clássico fica no histórico do git (marcar `v3-classico` depois do merge).
- **Correção grave:** o selo de missão pendente (`badge(true)`) quebrava o visual novo para quem tinha conta e missão por fazer — voltava sozinho ao clássico (o bug também estava na `main`).
- **"Hoje" no Início (celular):** desejo do dia → Camarim VIP, missões, capítulo de domingo (lido ao abrir o News, `tw_cap_lido`), aniversários do dia com ♡ Coração (`dar_coracao`) e Perfil; 1 aniversário + "+N" que abre; com tudo feito a lista recolhe ("Ver lista").
- **Menu** sem repetição (sem TV repetida, News, Hoje/Calendário/desejo/VIP — moram no Início); "TsuLiPa ♡" → "Fichinhas".
- **Teams:** barra até a meta só com 2+ jogando na semana; os outros aparecem como convite.
- **Descoberta:** desejo do dia com o dobro de chance para Battle/Studio/Bloom; missões (migration `missoes_descoberta`, a partir de 17/11): nível 1 alterna jardim/battle em dias pares, nível 2 é a foto do Studio a cada 3 dias.
- **Quadrinhos da temporada 0** (6 capítulos das músicas dos Unit Festivals): direção de cena por quadro (`JN_T0_DIR` → `jnT0Desenhar`): cenários próprios (audição, sala com espelho e reflexo, cidade city pop com neon, praia/pôr do sol, quarto, tela dividida dia/noite, Halloween, portão do World), palco por festival com plateia de lightsticks e faixa da música, câmera geral/médio/close, expressões existentes, balão nunca sobre rosto, lua/sol no lado sem balão. Falas, datas e Temporada 1 intactas.
- **Desenhos:** palco de amizades e Camarim VIP com textos legíveis no celular; VIP equilibrado; Battle/Studio em treino também no clássico; JOGAR do Center⭐Run visível no celular; Bloom mostra erro em vez de "Carregando..." eterno; Studio "Pose V ✌".
- **Peso:** `tw-mapa.js` (~100 KB) baixa depois da abertura (`twMapaCarregar`); o Mapa no celular pede e espera se tocar antes.
- Temporada 1 continua trancada; datas movidas para os domingos 27/12/2026 → 31/01/2027 (depois dos capítulos comuns).

**Falta:** aparelho/login reais; ok do Pati; merge do dono; dia do aniversário da Lirika (a ficha só diz "maio"); avisar jogadores que o aniversário (dia/mês) é público no Calendário; Temporada 1 (refino visual + revisão nativa + autorização); áudio e sala do pet não testados aqui.

## Auditoria geral — 16/11/2026 (branch `fix/recuperacao-visual-celular-20261115`, PR #98)

**Estado:** a `main` tem tudo até a #97 (o "site não abre no iPhone" era a tela de carregamento decorativa cobrindo o início; a #97 tirou). A PR #98 leva 70+ commits: recuperação visual do celular, Temporada 1 trancada e as correções abaixo. Prévia: `tsulipa-world-git-fix-recuperacao-visual-celul-f18405-tsu-li-pa.vercel.app/?celular=1`.

**Corrigido nesta auditoria**
- Arquivos alterados sem trocar `?v=` (tw-celular, tw-calendario, tw-mapa, hub-polish, pet-sala): o celular misturava arquivo velho e novo até o F5. Teste novo `cache-versoes` reprova quando isso volta.
- `jornal-capitulos.js` (100 KB, Temporada 1 nos 6 idiomas) carregava na abertura de todo mundo; agora baixa quando o Idol⭐News! ou o Calendário abre (`jornalCapsCarregar`). Abertura clássica 1.792 → 1.693 KB.
- Vitrine: sem Idol repetido quando poucos cabem; proporção e ordem sorteada iguais ao clássico.
- Menu: Ranking legível (a superfície de papel do Oshi apagava o roxo); sem atalhos que já têm porta no Início ou na engrenagem.
- Fichinhas em abas, com Ouvir; quadrinho ampliado ao tocar; descrições em 2 linhas.
- Temporada 1: falas sem corte, balões lado a lado, pistas redesenhadas, direção de cena nos 30 quadros, leitor inerte, CSS fluido.

**Conferido sem erro:** sintaxe de todos os .js; arquivos referenciados no index existem; abertura clássica (iPhone, Galaxy, desktop) e celular sem erro de script; Sora, Karaoke e privacidade abrem; Handshake, Café, News, Battle, Gacha, Loja, Dois e Perfil abrem e fecham. Testes 110/110.

**Falta (precisa de aparelho, conta ou decisão do dono)**
- Aparelho real (iPhone/Safari, Android) e login real em tudo da #98.
- Ligar o visual de celular para todos (depois do ok do Pati).
- Temporada 1: revisão nativa das traduções e autorização; personagens ainda em poses prontas (andar/virar/abraçar pede poses novas no `perfDesenharIdol`).
- Peso: abertura ainda ~230 KB acima do pós-reforma (1.460 KB); próximos candidatos: `tw-mapa.js` (101 KB) sob demanda e o bloco do Dois no `index.html`.
- Prêmio dos lightsticks do Battle (SQL proposto, não aplicado); PRs antigas #72 e #74 (fechar ou registrar).

## Correção de abertura — 15/11/2026 (PR de correção, ainda não publicada)

Base conferida: `f257624`, merge da #95; Vercel READY no mesmo commit. O relato é tela que abre e não responde a toques. No Chrome remoto, os dois modos abriram como visitante; houve timeout inicial de inspeção no modo novo, seguido de interação normal. **Não foi possível reproduzir conclusivamente o congelamento do iPhone.**

- Observadores de animação passam a agrupar mutações por frame, com inspeção única por alvo, em vez de refazer a visibilidade de toda a página em cada microtarefa.
- Moldura do celular: corrige duas inscrições no mesmo alvo (a segunda apagava `subtree` e `hidden` da primeira); só altera `hidden` quando muda, evitando realimentação.
- A abertura decorativa não captura toques. Cópia do palco usa o limite móvel de 30 fps já existente.
- JS/CSS revalidam cache; imagens continuam com cache. Versões dos scripts/CSS alterados foram incrementadas. Caches já gravados pela versão anterior só expiram pela política antiga; URLs novas resolvem os arquivos alterados nesta rodada.
- OG novo com arte vetorial original do mapa (`og-world.png`) no site e README. Para a prévia do link **do próprio GitHub**, Settings → Social preview ainda precisa receber essa imagem (é independente das metas do site).
- Nenhuma mudança no banco, recompensas ou chaves de saves. Visual novo continua disponível e opt-in.
- Testes locais: `node tests/run-all.js`; regressão nova executa batching e transições de visibilidade em VM.
- Não testados: correção em navegador, iPhone/Safari e login real. Não esperar CI; merge/publicação continuam com o dono.

# Retomada — onde paramos (15/11/2026)

## Quadro geral — feito / falta (15/11/2026)

Comece por aqui. O resto do arquivo é o diário detalhado de cada etapa.

**Onde está o trabalho:** tudo publicado na `main` (Vercel ok). Últimos merges: #88 (14/11), #91, #92 (jogos novos, mapa vivo, charmaker, site mais leve) e #93 (charmaker no Perfil e na Zipper Shop). **Não há PR de trabalho aberto.** Para continuar, crie uma branch nova a partir da `main` e abra um PR novo (sempre um só PR por rodada de trabalho; o dono não gosta de PRs paralelos).

### Publicado em 14–15/11 (#92 e #93) — só front, banco sem mudança
- **Charmaker (editor do Você), estilo Charat:** prévia grande presa no topo com 7 expressões e ↔ girar; abas com miniaturas desenhadas (Corte, Franja, Mecha, Detalhe, Olhos, Sobrancelha, Boca, Bochecha, Roupa, Parte de baixo, Acessório, Óculos); 🎲 Sortear (nunca muda a pele, respeita trancas) e ↩ Desfazer; paleta de 12 cores de cabelo. Arquivo `charmaker.js`; os `<select>` antigos continuam escondidos e cada toque dispara o mesmo evento (save, trancas e Perfil iguais).
- **O mesmo estúdio no Montar Idol** do Perfil e da Zipper Shop (`TW_CHARMAKER.montar`). Ali tudo grava sempre no Você via `perfMontMudou` e o sortear é direto, sem trocar o personagem selecionado no Center Run.
- **Rosto à escolha** (`tw-avatar-rosto.js`, usado pelas três cópias do `drawChar`: Center Run, Karaoke, Sora Jump). O padrão é o rosto clássico de antes, pixel por pixel (decisão do dono: o olhar antigo é mais simpático). Campos novos em `c`: `olho`, `boca`, `bochecha`, `sobrancelha` (`salvar_avatar` guarda o objeto inteiro, sem migração). Olhos novos são só formas cheias, sem traços.
- **Corpo e itens:** sapatos; saia/bermuda também em Zipper, Sweet e Estrelado; Cacheado menor embaixo; franja Arco-íris com bicos; orelha de elfo na cor da pele; 5 cortes (Rabo lateral, Tranças, Coque, Princesa, Hime) e 4 franjas (Cortina, Curtinha, Pontinhas, Cacheada) em `tw-avatar-hair.js`; acessório novo **Arco estelar** (o laço e a flor foram retirados porque já existiam como Item: Laço azul, Hibisco, Flor de cerejeira); Quepe, Chapéu de palha e Boina assentados na cabeça.
- **Ferramenta:** `tools/avatar/folha.py` gera a folha de auditoria do avatar (comparar antes/depois).
- **Mapa vivo:** Idols das ruas em 1,75× com estrelinha no seu Idol; tocar no chão leva o seu Idol até lá; passeantes pulam e respondem; borboletas, gatinho e passarinhos reagem; perto da fonte da Praça, "Desejo feito!". Tudo local.
- **Jogos novos:** trilha sintetizada por jogo (`jogos-trilha.js`) e efeitos; Jardim com a planta crescendo na rega; Café com paciência colorida e rostinho (normal e Dois no balcão); Battle com lightsticks no ritmo durante o show; Studio com tema da semana e selo no mural; câmeras do Studio medidas no desenho real. Prêmios e regras continuam no servidor.
- **Página inicial:** 9 jogos em ordem alfabética (3×3 no computador; Star⭐Gacha! em faixa no celular).
- **Site mais leve:** Idol⭐Battle! carrega sob demanda; ícone do topo de 52 KB para 3 KB; cache de 1 h para JS/CSS/imagens no `vercel.json`.

### Na PR #94 (15/11) — aberta, merge do dono
- **Acessibilidade:** botões pequenos com área de toque de 28 px; nomes para leitor de tela na busca, no Dois e nas cores do Perfil.
- **Celular:** idioma e tema atrás do botão ⚙️ no topo do Hub; "Pra hoje" subiu ~100 px na primeira tela.
- **Mais leve:** Photo⭐Studio! carrega sob demanda (como o Battle); a capa do Idol News chama o Studio quando precisa.
- **Charmaker:** 3 visuais favoritos (`brs48cr_favs`), com 💾 para guardar e toque para vestir; peças bloqueadas são puladas; tem desfazer.
- **Studio, tema da semana (banco mudou, com OK):** publicar no mural uma foto no tema dá ★3, uma vez por semana. Arquivo `supabase/sql/aplicado/20261115_studio_tema_semana.sql` (já aplicado). Tema e semana iguais aos do site (domingo 0h de Brasília). No `?demo=1` a regra é simulada.
- Teste do Meu Camarim aceita a fala da Lirika que alterna por data.

### Análise do site (14/11, depois da #94)
- **Abertura:** 83 arquivos, ~1,9 MB sem compressão (~0,6 MB comprimido pela Vercel). No computador local, pronto em ~0,8 s (desktop) e ~1,0 s (celular). Console sem erros; nenhum botão sem nome; 1 alvo de toque abaixo de 24 px no celular.
- **Maiores na abertura:** pet.js 235 KB, centerrun.js 218 KB, index.html 218 KB, perfil.js 115 KB, hub.js 108 KB, mapa-mundo.svg 95 KB.
- **Próximos ganhos, do mais fácil ao mais trabalhoso:**
  1. ~~`favicon.svg`~~ e 2. ~~Happy⭐Cafe! e Handshake⭐Event! sob demanda~~: feitos (ver "Rodada de peso"). Dois ficou de fora.
  3–5. Center Run, Perfil e pet: feitos na "Reforma de peso".

### Rodada de peso (15/11, PR #94)
- **Feito:** `favicon.svg` 36→12 KB (imagem interna de 128 para 64 px, sem perder cor). Handshake⭐Event! e Happy⭐Cafe! sob demanda: `jogos-base.js` (5 KB) carrega na abertura com o que o Hub, o pet, a Vida na Cidade, o Idol⭐News! e o evento leem; o jogo (handshake, cafe, cafe-gorjeta, cafe-vip, cafe-duplo e flores, nessa ordem) baixa no primeiro toque. Abertura: 83→78 arquivos, 1907→1761 KB.
- **Armadilha:** peça do Handshake/Café que outro arquivo leia na abertura vai para `jogos-base.js`, nunca fica duplicada (o `var` do jogo zeraria o valor). O teste `jogos-sob-demanda` confere.
- **Não deu para fazer rápido:** Dois (muito código dele direto no `index.html`), Perfil (`perfil.js` é a biblioteca de desenho dos Idols, usada por 15+ arquivos), Center Run (`centerrun.js` tem ~130 peças usadas por outros arquivos: `drawChar`, `starT`, `setBest`…) e `pet.js`. Os quatro pedem primeiro separar a parte compartilhada em arquivos próprios; é uma reforma maior, para uma rodada só dela.

### Medição de código parado (15/11, cobertura do Chrome na abertura)
- 1271 KB de JS carregados, ~935 KB não executados na abertura. Maiores: `pet.js` (13% usado), `centerrun.js` (20%), `perfil.js` (19%), `hub.js` (33%), `jornal.js` (14%), `duo.js` (11%).
- **Por que não dá para só "carregar depois":** a análise de dependências (`/tmp`, script de grafo) mostra que só 5 KB do `centerrun.js` e 0 KB do `pet.js` são usados apenas por eles mesmos; o resto é chamado pelo código direto no `index.html` (laço da corrida, telas, aviso de login). Tirar da abertura exige antes mudar o `index.html` para o laço da corrida e o pet só começarem ao serem abertos.
- **Também avaliados e deixados:** módulos do karaokê no Idol⭐News! (`KaraokeRoomViews`, `KaraokeNewsPhoto`: sem eles a foto da janela some sem erro), `admin.js` (19 KB, ligado em muitos pontos), Dois (código espalhado por ~250 linhas do `index.html`).
- **Se quiser seguir:** reforma própria em etapas: (1) laço e telas da corrida para uma função de início chamada ao tocar em jogar; (2) o mesmo para o pet; (3) só então separar arquivos. Cada etapa numa PR, testando a corrida inteira.

### Reforma de peso (15/11, PR #94): corrida, pet e Perfil sob demanda
Abertura: **1907 KB → 1460 KB** (Handshake/Café 146 KB + corrida 100 KB + pet 160 KB + Perfil 37 KB).
Como foi feito: cobertura do Chrome função por função (o que roda fora de cada parte vs. dentro dela) + parser do TypeScript
(`/opt/npm-tools/node_modules/typescript`) para cortar cada função exatamente, sem quebrar nada no meio.

| Base (abertura) | Parte sob demanda | Baixa quando |
|---|---|---|
| `centerrun.js` (personagens, tradução, cartões, ranking) | `centerrun-corrida.js` (laço, cenário, obstáculos, fim de jogo, polaroid) | sai do Hub para o palco (`hubFechar` marca `twCorridaQuer`), toca JOGAR ou abre link direto |
| `pet.js` (desenho do pet, humor, lembranças, fotos guardadas) | `pet-sala.js` (quarto, celular, agenda, camarim, minijogo, adoção) | abre o pet ou o 📸 da corrida |
| `perfil.js` (biblioteca de desenho dos Idols, login, loja) | `perfil-tela.js` (abas, diário, recados, insígnias, estúdio de foto) | abre um Perfil (junto com os dados, no `perfAbrir`) |

**Regras para mexer daqui em diante (armadilhas):**
- Mudou um arquivo sob demanda? Suba a versão dentro da base: `TW_CORRIDA_ARQ`, `PET_SALA_ARQ`, `PERF_TELA_ARQ`.
- Código da abertura (inclusive o `index.html`) **não pode** chamar função da parte sob demanda sem esperar: use `twCorridaAoCarregar` / `petSalaAoCarregar` / `perfTelaCarregar().then(...)`, ou `typeof f === 'function'` quando for só desenhar uma tela que ainda não existe. Também vale para função passada como valor (`addEventListener(t, f)`, `x.onclick = f`).
- Os invólucros da Temporada 2 no `index.html` (`jump`, `spawn`, `obsDesenhar`, `end`, `update`, `draw`) entram via `twCorridaAoCarregar`; os de `petPhUI` e `petClose`, via `petSalaAoCarregar`.
- No `pet.js` e no `perfil.js`, cada `//→nome` marca onde a função estava; na parte ela vem depois de `//←nome`. `tests/fonte-dividida.js` remonta a ordem original para os testes que recortam por posição. Função nova: escreva na base, a não ser que só a própria parte use.
- `tests/index-modules.test.js` confere que as partes não executam nada ao carregar, não repetem declarações e não estão em `<script src>` do `index.html`.

### Também na #94 (15/11)
- **Mapa:** gatinho malhado (Galeria do Brilho) e de smoking (Star Stage) com coleira, piscando, dormindo à noite e soltando corações ao toque; passarinhos e borboletas redesenhados; peixinhos koi na fonte da Praça.
- **Mapa, mais vida:** cachorrinho shiba na Star Arena e coelhinho na Vila das Tulipas (atrás dos Idols, tocáveis, dormem à noite); gatos, cachorrinho e coelhinho reagem quando o seu Idol passa perto (`meuIdolPerto`, usa as posições do quadro anterior, nada é salvo).
- **Mapa, mais bichinhos:** pombinho na Praça (anda, cisca, bate as asas) e ovelhinha de nuvem no Jardim das Nuvens (quica soltando nuvens); agora toda rua tem um bichinho de chão que reage ao seu Idol.
- **Backstage⭐Pet!:** o Idol no quarto mostra o rosto do charmaker (olhos, sobrancelha, boca) e sorri "^^" de vez em quando; antes ficava sempre "^^" quando o pet estava feliz.
- **Traduções em dia (15/11):** 62 textos que apareciam em português nos outros idiomas (Café, Handshake, Hub, álbum, moderação, insígnias da Temporada 2 e do Sora, título do logo) + "Ajustar timing" no Karaoke (linha 203; o teste do indonésio confere 203). Como achar os próximos: (1) textos literais de `tr()` comparados com `TW_DICT` em cada idioma; (2) `tr` interceptado com o site em inglês/japonês, navegando nas telas (pega `tr(variavel)`, como os nomes das insígnias). Sobram só nomes próprios (grupos, músicas, poses).
- **Indonésio:** chaves novas (Montar visual, Favoritos, Tema…) em `translations/id/TW_DICT.json`; depois de mexer, rode `node translations/id/build-preview-catalog.cjs` e suba `preview-data.js?v=`.
- **Center Run:** JOGAR e Corrida do dia logo depois da escolha do personagem; o estúdio de visual fica recolhido em "✏️ Montar visual" (lembra aberto/fechado em `brs48cr_montar_aberto`).

### Visita surpresa no mapa (15/11, PR nova)
- A cada 8 minutos, cada rua sorteia pelo relógio (igual para todo mundo) se o Tsu, a Lirika ou o Pati passeiam por lá (~45% das vezes), com o visual do palco (`HUB_TRIO`), etiqueta "⭐ Nome" por cima das placas e frase própria ao toque (6 idiomas, `VISITA_FALAS`).
- Quem está logado como Tsu, Lirika ou Pati (apelido da conta, sem diferenciar maiúsculas) nunca encontra a si mesmo: o sorteio passa para outro membro. O trio no palco do mapa-múndi continua como sempre.
- Os bichinhos de chão reagem a quem visita como reagem ao seu Idol. Para testes: `TW_MAPA_DEBUG=true` expõe `TW_MAPA_VISITAS`.

### Visual de celular — prévia (15/11, mesma PR)
- Ideia de um amigo + esqueleto do Link! Like!: o início vira um "celular de Idol". Barra de cima (você, estrelas, ⚙️), barra de baixo (Voltar · Menu · Início), telas Início, Menu, Jogos e Ajustes. Arquivos: `tw-celular.js` e `tw-celular.css`.
- **Desligado por padrão.** Liga com `?celular=1` ou no ⚙️ do início clássico ("📱 Visual novo (prévia)"); desliga com `?celular=0` ou em Ajustes → "Voltar ao visual clássico". Fica salvo em `brs48cr_celular`. Desligado, nenhum dos dois arquivos é baixado.
- Nada de regra nova: cada ícone chama o mesmo card do hub clássico, que continua montado por baixo (login, cadeados, prêmios e sons iguais). Missões, busca, novidades e mapa abrem o hub clássico rolado até a parte certa, com a barra de baixo para voltar.
- O TsuLiPa continua lá: logo animado, tema do momento, partículas da temporada e o palco do Tsu, da Lirika e do Pati (cópia do `hubCv`; o toque chega ao hub e o trio reage). A cor da faixa e do botão Menu segue o tema do Oshi.
- Sem conta, os jogos que pedem login mostram cadeado e o aviso "Entre para jogar" antes do login do Google (era o "Karaoke não abre" no tablet).
- Tablet: duas colunas a partir de 900 px; banners e lista de jogos em duas colunas a partir de 720 px. `tw-mapa.js` expõe `twMapaVisitaAgora()` para a faixa "Agora no mapa".
- Rodada 2 (comparando com prints do Link! Like!): o Início ficou só com o palco (com um selinho de quem passeia no mapa), um destaque "Pra hoje" e os 8 apps. Pet, ranking e o "Pra hoje" completo foram para o Menu. Os painéis ficaram brancos, os títulos viraram abas brancas e as ações usam botão amarelo. A cor segue o tema do Oshi.
- Bolinhas do Tsu, da Lirika e do Pati desenhadas pelo jogo (`HUB_TRIO_DRAW_CHARS` + `perfFotoRedonda`). Álbum novo: grade de cards com filtro por Oshi (Todos, Tsu, Lirika, Pati e Outros, pelo `card.oshi`). Ele lê só `album_cards`; o toque abre o zoom de card do Gacha, e "Ver metas e trocar cards" abre o álbum clássico.
- Falta a lista de músicas do Karaoke com capa e "quem canta": o seletor fica dentro de `karaoke-time.html` (iframe) e não existe o dado de quem canta cada música.

- Rodada 3: a **moldura do celular** vale para toda janela `.tw-window-overlay` (Perfil, Pet, Loja, Gacha, Idol News, Álbum, Café, Handshake, Battle, Bloom, Studio, Moon Duo, Trocas, Encontro, Fã). A janela abre entre a barra de cima e a de baixo, no painel branco. Voltar clica no ✕ da própria janela; Menu e Início fecham as janelas e voltam ao celular. Center Run, Karaoke e Sora seguem em tela cheia, como a Live deles.
- A moldura também aparece no menu do Center⭐Run! (antes de correr) e no salão do Karaoke⭐Time! (antes do show). Correndo (`body.jogando`) ou cantando (`html.tw-kt-arena`), as barras saem. Voltar usa o próprio "← Início" de cada tela (`#hubVolta` / `#twPreviewVoltar`), que fica escondido.
- **Sala do Karaoke como MUSIC LIST** (`karaoke-lista.js` / `.css`, só com o celular ligado: lê `parent.TW_CELULAR_LIGADO`). Aba laranja "MÚSICAS" com as tentativas do dia, capas em grade desenhadas por CSS a partir das opções do `#ktSong` (com selo da música da semana), detalhe da escolhida (BPM, ★, recorde pessoal), "Ouvir" usando a prévia de sempre e "Cantar" apertando o `#ktStart`. A sala vira um palco compacto (máx. 560 px, como a janela do Battle) em qualquer aparelho. O título antigo, o seletor e o logo do site somem dentro da sala; o cartão de tentativas só reaparece se houver show para recuperar.
- **Som das músicas do Karaoke** (só timbre: partitura, notas da pista e relógio iguais, então os recordes continuam valendo). Mixer com compressor suave, eco no tempo da música (1,5 passo), filtro nas ondas quadradas, esquerda/direita, bumbo com queda de tom, caixa e chimbal de ruído fixo (sem sorteio), virada antes do refrão e acorde final. Pedido do dono: energia no estilo hi-NRG das trilhas dance de jogos dos anos 2000 (sem copiar melodia): palmas em camadas no 2 e no 4, chimbal aberto no contratempo, arpejo de sintetizador em semicolcheias e baixo em oitavas no pop. Testes: `karaoke-som.test.js`, com aparelho de som falso; a prévia foi conferida no Chromium. **Não ouvido por ninguém ainda.**
- O idioma dentro do Karaoke vem de `?lang=` / `brs48cr_lang`: o `LANG` do Karaoke fica dentro do script dele, então `karaoke-lista.js` e `karaoke-arena.js` leem do mesmo lugar.
- Rodada 5, a partir dos prints no iPhone do dono:
  - A moldura não aparecia nas janelas criadas na hora (jogos que carregam depois, como o Handshake). Agora o observador também vê janelas novas no `body`, com uma conferência a cada 1,5 s de segurança.
  - As janelas viraram tela cheia (sem caixinha cortada).
  - Logo sem quebrar linha.
  - A vitrine "Idols do TsuLiPa⭐World" voltou ao Início, só com rosto e nome (sem pontos); tocar abre o perfil (`.lbn`).
  - Mapa, Missões, Procurar Idol e Novidades abrem como telas do celular: a mesma seção do hub é levada para a tela e devolvida ao sair (`EMB`), então os cliques e as regras são os mesmos.
  - A barra antiga "Visitante · ★ · Entrar" (`#twHud`) fica escondida com o celular ligado.
- Rodada 6 (15/11):
  - A vitrine antiga (luzes, confete, lightsticks) foi para a tela de abertura, antes do "Toque para começar". As contas do Tsu, da Lirika e do Pati desfilam juntas na frente da fila; os bonecos do trio (`twcTrioVitrine`) só entram quando a lista não carrega, para ninguém aparecer duas vezes. Sem pontuação no visual de celular. Ao começar, a vitrine volta ao hub clássico (`vitrineDevolver`).
  - A bolinha da vitrine do Início não corta mais o anel.
  - Todos os atalhos do Menu foram conferidos no iPhone 13 emulado. Missões, Procurar e Novidades abrem embutidos; Álbum e Ajustes são telas próprias; Perfil, Zipper Shop, Gacha e Idol News abrem como janelas em tela cheia com a moldura. A TsuLiPa⭐TV! agora também ganha a moldura, fica entre as barras e fecha pelo Voltar/Início.
  - Correção: sem vitrine (RPC falhando), cada redesenho pedia a vitrine de novo e o navegador travava. Agora pede no máximo uma vez por minuto.
  - O teste `tw-mapa-dois-niveis` falhava só no horário em que havia visita surpresa (faltava `measureText` no canvas falso).
- Rodada 7 (15/11, prints do mapa no iPhone):
  - As contas oficiais do trio são `tsu`, `lirika` e `patiliri`. No mapa elas não passeiam como jogadores, porque o membro aparece pela visita (antes a Lirika ficava duplicada). Na vitrine, essas três contas vão juntas para a frente.
  - Quem visita uma rua fica em atividade na frente de um lugar: canta (microfone/lightstick com notinhas) no Star Stage, em cima do palco; faz coraçãozinho nas lojas, no café e no gacha; acena nos outros lugares (`POSES_ATIVAS`, `LUGAR_ATIVO`).
  - A tela pulava para o topo a cada ação no mapa: o `posicionar()` do mapa puxava o mapa de volta para o hub clássico a cada `hubCardsUI`. Agora ele não mexe no mapa enquanto o mapa está dentro do celular, e a rolagem é restaurada depois de reembutir.
  - Rua menos ampliada no celular (720 px de largura em vez de 1080).
  - Gatinhos redesenhados no jeito dos Idols: cabeção quadradinho, corpo de pãozinho, cores chapadas, contorno único e rostinho simples, sem bigodes nem degradê. Continuam piscando, mexendo a orelha e o rabo, pulando ao toque e dormindo à noite.
- Rodada 8 (15/11), ideias do BarbieGirls/Zwinky com arte nossa:
  - Montar Idol em vitrine (só com o celular ligado, `charmaker.js`): o Idol aparece numa redoma desenhada no canvas, e as partes viram 3 passos-móveis (1 Visual/penteadeira, 2 Roupa/guarda-roupa, 3 Acessórios/prateleira). Peça trancada pode ser **provada** na redoma (👀): só na prévia, sem salvar nem comprar.
  - Frases prontas (`tw-presenca.js`): 8 chaves fixas (oi, lindo, jogar, dancar, amei, parabens, valeu, tchau), traduzidas no aparelho. O servidor só aceita essas chaves, então não existe chat livre. Ficam no Mapa e no lado de dentro dos lugares. O seu balão aparece na hora; os dos outros, para quem está online na mesma rua.
  - Idols online agora: pílula verde no Início e no Mapa. **Supabase (OK do dono no chat, 15/11)**: tabela `public.presenca` (RLS ligada, sem políticas, acesso só pelas funções), `presenca_ping(p_rua, p_frase)` (só logado; no máximo 1 frase a cada 4 s) e `presenca_agora(p_rua)` (todos; conta quem apareceu nos últimos 3 min e lista até 8 pessoas na rua, com frase dos últimos 15 s). Migração: `supabase/migrations/20261115200000_presenca_online.sql`. Quem está online numa rua passeia lá primeiro, com o nome em cima.
  - Lado de dentro dos lugares: tocar no Café, na Zipper⭐Shop! ou no Star⭐Gacha! (na rua do mapa) abre uma sala desenhada com quem está por ali, com os balões das frases. O botão grande abre o lugar de verdade (`window.twMapaEntrar`).
  - Mapa geral vivo: até 6 Idols (online e vitrine, sem as contas do trio) andam pelas calçadas (`mundoGente`, `CALCADAS`).
  - Cantinho dos pais: tela nos Ajustes, nos 6 idiomas, com link para a privacidade.
  - Manutenção fofa: depois de 3 falhas de rede seguidas no `contaRpc` (ou ao ficar offline), uma folha com o trio e cones avisa que o progresso está guardado, com os botões "Jogar Center⭐Run!" e "Tentar de novo". Aparece uma vez por sessão.
- Rodada 9 (15/11):
  - Cadeados para visitante: Bloom e Álbum entraram na lista (`PEDE_LOGIN`); Battle, Café, Handshake e Studio mostram o selo "Treino" (jogam sem conta, sem prêmio). As portas do mapa que pedem conta ganham um cadeadinho (`cadeadosPortas`).
  - Cantinho dos pais revisado contra o código e a privacidade ("sem chat ao vivo", recados com filtro, e-mail privado, aniversário opcional). A privacidade ganhou o item "Idols online e frases prontas" nos 6 idiomas (15/11/2026).
  - Auditoria (iPhone claro, iPhone escuro em inglês, iPad, iPhone SE em japonês, 11 telas): sem erros nem estouro de tela; ajustes no "+" das estrelas (área de toque de 44 px), no rank cortado e na caixinha vazia do Karaoke.
  - Humor do Idol (`tw-humor.js`, local em `brs48cr_humor_v1`): 4 barrinhas (Energia, Diversão, Brilho, Amizade). Sobem quando uma partida termina (RPC de fim de partida com conta, ou ao abrir o jogo para visitante) e baixam devagar com o tempo; a Energia descansa sozinha.
  - Desejo do dia: um por dia (sorteio pela data e pelo nome), só entre o que a pessoa consegue cumprir (visitante recebe jogos de treino, mapa ou frase). Cumprir dá +15 nas barrinhas, conta a série de dias e libera o passe do Camarim VIP de hoje.
  - Diamantinho: gira em cima do SEU Idol no mapa e no card de humor (verde, amarelo ou rosa, conforme a média).
  - Camarim VIP: aberto para todo mundo todo dia, sem dinheiro (é só cumprir o desejo do dia). É uma sala com tapete vermelho, espelho de lâmpadas e o trio; o botão "Foto VIP" baixa um Polaroid em PNG.
  - Nada disso mexe em estrelas, ranking ou Supabase.
- Rodada 10 (15/11):
  - Fichinhas do trio (tela `trio`, aberta pelo chip "♡ Fichinhas" do palco ou pelo atalho "TsuLiPa ♡" do Menu). Os dados vêm dos perfis oficiais em brs48.blogspot.com/2021/08/{tsu,lirika,pati}.html, só com o que o blog informa e sem ano de nascimento. A tela tem o mapa de amizades: unit TsuLiPa e Gekokujou, dupla NeByur✰ (Tsu + Pati) e os pets Chu, Koali e Pucchi.
  - Abertura animada: 3 camadas em parallax (seguem o dedo, o mouse e a inclinação quando o navegador deixa) e o trio de corpo inteiro flutuando. Tela de carregamento só logo depois de abrir a página (mínimo de 0,9 s e máximo de 4 s). "Reduzir movimento" deixa tudo parado.
  - TsuPhone: novo app "Humor" (barrinhas, desejo, série, recados do trio, prêmios e a foto VIP salva em JPEG pequeno, `brs48cr_vip_foto_v1`). Ao cumprir o desejo, um membro do trio manda um recado (o Tsu e o Pati no masculino, a Lirika no feminino).
  - Camarim: prêmios desenhados sem imagem nova (`petPremiosDesejo`): troféu na estante com 3 dias seguidos, lâmpadas VIP no espelho com 7 dias seguidos e tapete vermelho depois da foto VIP. `pet-sala.js?v=3`.
  - Tour de camarim (visitar o camarim de outros Idols e deixar coração): **precisa de RPC nova no Supabase, esperando o OK do dono**.
- Rodada 11 (15/11), refino pedido pelo dono ("tudo novo no nível atual do site, sem emojis baratos e sem erros"):
  - O mapa de amizades virou canvas animado (`amigosDesenhar`): o trio de corpo inteiro com `perfDesenharIdol`, os pets de verdade (Chu, Koali e Pucchi, com `drawPet`), fitas nas cores dos membros, pílulas "unit TsuLiPa", "Gekokujou" e "dupla NeByur✰", holofotes e brilhinhos. Sem animação com "reduzir movimento".
  - Fichas no estilo cartão de perfil: topo na cor do membro com listras, boneco de corpo inteiro, chips de geração e time, linhas com ícones desenhados (bolo, alfinete, régua, paleta, pata, coração), pet desenhado e frase em balão.
  - Emojis trocados por ícones desenhados no card de humor (desejo, série, VIP), no aviso, no Cantinho dos pais, na manutenção (cone em SVG) e no app Humor do TsuPhone.
  - Salas por dentro redesenhadas: Café com vitrine, balcão de madeira, sofá com almofadas e luminárias; Zipper⭐Shop com arara de vestidos, saias e jaquetas, espelho de lâmpadas e prateleiras; Gacha com máquina de cápsulas, manivela e placa neon; VIP com cortinas de veludo. Os Idols ficaram maiores e o diamantinho aparece em cima de você.
  - Auditoria de novo (4 aparelhos, 14 telas): sem erros e sem nada saindo da tela.
- Rodada 12 (15/11), pedidos do dono depois de ver o Link! Like! (sem "Live do mês" e sem "Disputa antes da live"):
  - Cantinho dos pais saiu (o público é adulto). Nos Ajustes ficou só o link de Privacidade e segurança.
  - Mapa de amizades: os três lado a lado na mesma altura, a Lirika no meio (ninguém "acima"). Saiu o Gekokujou; entrou "Os três entraram juntos: Draft 1st Generation · ago/2021". Tocar num membro: pulinho, fala com a voz de verdade (`HUB_FALAS` + `hubVozTocar`) e corações; tocar num pet: pulo e o som dele (`petVoice`).
  - Salas por dentro: Idols maiores (escala 1,72) e reação ao toque (pulo, pose e corações; no VIP, a voz do membro). Um carinho conta na barra de amizade no máximo a cada 30 s.
  - Calendário "o ano do TsuLiPa" (`tw-calendario.js?v=1`, só leitura): começa em 27/10/2026 (primeiro cadastro no servidor, em plena temporada de Halloween). Marca o lançamento e o aniversário do jogo, os aniversários do Tsu (05/09) e do Pati (23/09), maio como o mês da Lirika (o blog não tem o dia), agosto como o mês da Draft 1st Generation, o aniversário do BRS48 (13/11), os temas de data do jogo, o evento da semana e os capítulos do quadrinho. As falas do dia mudam com a data. Card "Dia N do TsuLiPa⭐World" no início e atalho no menu. Falta: as datas reais do Unit Festival, para marcar a semana do festival.
  - História em capítulos no Idol⭐News! (`jornal-capitulos.js?v=1`, aba Vida das Idols): 6 capítulos de 3 quadros, desenhados com os bonecos do jogo e balões nas 6 línguas. Um capítulo novo toda terça desde 27/10 (hoje há 3; o 4º chega em 17/11).
  - Idol⭐Battle! (`battle.js?v=14`): cada card tem uma habilidade (Nota Alta, Passo Duplo ou Piscadinha, pelo melhor atributo). Ela dispara quando a torcida fecha 3 batidas seguidas na rodada daquele card: faixa no palco, a carta brilha e sobem corações (+5, ou +8 se combina com a rodada). Contador "Corações da torcida" no show e no resultado. É festa da torcida: o placar e o prêmio continuam sendo só os do servidor.
  - Tour de camarins (menu do celular): lista de camarins (`camarim_tour`), o camarim de outro Idol desenhado com o próprio desenho do Backstage⭐Pet! (decoração, pet ativo e o Idol), e 1 coração por dia em cada camarim (`camarim_coracao`). Migration `camarim_tour` aplicada.
  - Missões do dia: entram "Cantar no Karaoke⭐Time!" e "Pule de nuvem em nuvem no Sora⭐Jump!" (nível 1, ★10), com progresso do servidor. Migration `missoes_karaoke_sora` aplicada.
- Rodada 13 (15/11):
  - Login: o "Escolha seu nome de Idol" não tinha saída. Um amigo entrou com outra conta do Google (criada em 08/11 e sem nome), tentou o nome da conta dele e só recebia "em uso". Agora o aviso mostra qual conta Google entrou, explica o "em uso" e tem "Usar outra conta Google" (abre a escolha de conta) e "Agora não" (sai e volta como visitante). `conta.js?v=3`.
  - Idol⭐Battle! (`battle.js?v=15`): a faixa de HABILIDADE ganhou o acabamento do site (aro branco, brilho de vidro, raios girando, selo amarelo, pastilha de corações, reflexo passando na carta) e o contador de corações virou uma medalha no estilo dos medidores.
  - Tela inicial limpa (pedido do Pati): só o palco, o "Pra hoje" e 6 portas grandes: Jogos (abre a lista), Missões (menu com Missões do dia, Pedido de fã e Meta dos Teams), Mapa, Idol⭐News!, Camarim e Calendário. O humor, o card do calendário e a vitrine de Idols foram para o Menu. Saiu o atalho repetido "Meu Perfil" do Menu (o perfil fica no topo).
- Boas-vindas do celular: 3 telas, uma vez por aparelho (marcador `tw_cel_tut_v1`, não é save). O tutorial clássico fica escondido enquanto o celular estiver ligado.
- Modo escuro: segue o aparelho (`prefers-color-scheme`), como o resto do site.

### Formato de Live no Battle e no Karaoke (15/11, mesma PR)
- Inspirado na tela de Live do Link! Like!, com desenho próprio. Só visual: nenhuma regra, prêmio ou SQL mudou.
- `battle.js?v=12` / `battle.css?v=9`: o palco do show ficou 560×520. Tem arco de progresso com as 3 apresentações e estrelas (verde = ganhou, rosa = perdeu), placar de BRILHO (os pontos do servidor × 1000), salão com telão de arco-íris, guirlanda de flores e chão de madeira, a unit inteira no palco, o card de quem se apresenta entrando pela direita, os medidores Você · Combo · Rival e a "mão" com os 3 cards (o da vez sobe e brilha). O Combo conta os acertos seguidos do lightstick no ritmo que já existia (o anel que fecha na batida); errar a batida zera.
- `karaoke-arena.js?v=3`: durante o seu show, um arco com 4 trechos e estrelas mostra o progresso da música, um placar ★ fica abaixo do arco, e embaixo ficam os medidores Precisão · Combo (enche a cada 10 e muda de cor) · Música. Saem corações dos botões a cada acerto, e o véu ficou mais claro para a sala da semana aparecer. As pistas desceram um pouco para caber o arco.

- Celular de verdade com internet lenta: primeira entrada no Center Run, no pet e no Perfil (espera o download).
- Uma corrida longa (Temporada 2 passando de cenário, UFO, gigante, Fever) com a corrida sob demanda: testei partidas curtas.
- Handshake e Café no celular com internet lenta: o primeiro toque espera o download (~120 KB).
- Conta real: publicar foto no tema da semana e ver +★3 (só uma vez na semana).
- Conta real: salvar um visual com as peças novas pelo Montar Idol e recarregar.
- iPhone/Safari: prévia do charmaker presa no topo; trilhas dos jogos novos.
- Ouvir os sons (não testados por ouvido).
- Battle e Karaoke em formato de Live: jogar de verdade no celular (o Karaoke só foi conferido num desenho de teste com estado simulado).
- Visual de celular: iPad/Safari e Android de verdade, logado (missões, Sair, pet), e se o palco copiado pesa em tablet antigo.
- Apagar as branches antigas no GitHub (o proxy não deixa apagar daqui).

### Ideias na fila (escolha do dono)
- **Prêmio dos lightsticks do Battle — proposta pronta, NÃO aplicada:** `supabase/sql/proposta/20261115_battle_lightsticks_premio.sql`. ★2 uma vez por dia para 9 de 12 batidas no show de uma batalha real dos últimos 10 min. Limite: a nota vem do aparelho (por isso o prêmio é pequeno). Precisa do OK do dono; depois, ligar no `battle.js` e no `demo.js` (passos no topo do arquivo).
- Dois sob demanda: **avaliado e deixado** (15/11). Sairiam ~40 KB (~12 KB comprimido) do `duo.js`, `duo-pedido.js` e do bloco no `index.html`, mas o bloco acrescenta traduções e troca `perfPoseAtras` (desenho de pose de todo o site), e loja, câmera, login e Perfil usam partes do Dois na abertura. Ganho pequeno para o risco.

### Armadilhas conhecidas
- `hub-polish.css`: depois do marcador "Mapa Vivo⭐" não pode ter `display:none`, `transform:scale`, `touch-action`, `animation:` nem `transition:` (teste `mapa-mobile-leitura`).
- Um robô regera os SVGs do mapa a cada push com um commit "[skip ci]": faça `git fetch` + `rebase` antes de enviar.
- Ao mudar `tw-i18n.js`, rode `node tools/i18n/dividir.js`. Antes de criar uma chave, confira se ela já existe (chave repetida sobrescreve a tradução de outro lugar).
- O `drawChar` existe em três cópias: peças novas vão para os módulos compartilhados (`tw-avatar-*.js`), não para uma cópia só.
- Antes de criar acessório ou item novo, confira a lista de Itens (`ACC`) e da loja.

## Diário anterior (14/11/2026)

### Acabamento visual (14/11, tarde)
- Camarim: o Cantinho de lembranças saiu do meio dos cuidados do pet. Agora fica no fim, fechado, e só mostra as lembranças e o vasinho. A foto e os cards já estão no Celular e na Estante, e o vaso e o porta-retratos já aparecem no desenho do quarto.
- Idol⭐Battle!: abas em negrito (a regra `font` estava inválida), título igual aos outros jogos, menos caixa dentro de caixa, atributos numa linha só, escalação compacta e botão "Começar show!" largo.
- Photo⭐Studio!: a foto fica menor (cabe com as opções à vista), as opções ficam em grade regular e o "Clicar!" fica preso no rodapé.
- Jogos antigos: Álbum, Troca e Pedido de fã agora mostram o título completo por qualquer caminho (pelas missões aparecia só o emoji). Campos da Troca e busca do Duo com o mesmo desenho dos outros campos. Perfil a 320 px com a foto em cima. Pó de estrela em duas colunas.
- Conferido com as fontes reais (as de `kt-fonts.css`) e no tema escuro. No escuro, os botões secundários do Jardim e da Troca ficam claros dentro dos cartões claros.
- Karaoke⭐Time! (dentro do site): a 320 px as 4 ferramentas da sala cabem numa linha. Os atalhos de teclado já somem em celular (regra antiga `hover:none`).
- Center⭐Run!: personalização da roupa em linhas alinhadas (a 320 px o rótulo fica em cima); "日本語" não quebra mais.
- Happy⭐Cafe! em jogo: ingredientes compactos (um grupo por linha) e "Recomeçar copo"/"Servir" presos no rodapé, para não rolar a tela durante o pedido.
- 320 px: títulos das janelas ("Handshake⭐Event!") e o logo da abertura não cortam mais.
- Modo demonstração: giro do Star⭐Gacha! (mesmas chances do servidor).
- Idol⭐Battle!: cada rival esconde um atributo (?), o mesmo para todo mundo no dia (só na tela; o servidor ainda envia o valor).
- Happy⭐Cafe!: o pedido aparece em letra grande abaixo da cena.
- Photo⭐Studio!: o resultado diz o que faltou na pauta (as estrelas ficam só na polaroid).
- **Banco (14/11, OK do dono):** missões do dia com `jardim` e `battle` (nível 1) e `foto` (nível 2). Contagem e lista aplicadas (a #88 é publicada no mesmo dia). O Hub abre o jogo certo pela missão e atualiza depois de jogar; o modo demonstração simula essas missões.
- Privacidade (6 idiomas, 14/11): Battle, Photo Studio (Mural só ao publicar) e banner com trios. A opção de não aparecer continua valendo só para Moon⭐Duo! e outdoors (decisão do dono: o jogo é de inclusão).
- Descrição do site (Google e compartilhamento) cita os jogos novos.
- Links do BRS48 retirados (14/11): rodapé do Hub, botões do menu do Center⭐Run! e bandeirinha do Brasil no banner; item correspondente saiu da Privacidade.
- Ruas do mapa com identidade própria (`tools/mapa/rua.py`): Star Stage à noite com holofotes e janelas acesas; Galeria do Brilho com letreiros neon e varal de luzes; Vila das Tulipas com colinas e campo de tulipas; Praça com árvores, bancos, canteiros e fonte maior; Star Arena com arquibancada, torres de luz e pódios; Jardim das Nuvens só de céu, com arco-íris. A ilha do Sora⭐Jump! não aparecia na rua (bug do desenho) e agora aparece.
- Ruas vivas (tw-mapa.js, desligado com "reduzir movimento"): estrelas piscando (Stage, Arena, Céu), holofotes varrendo o Stage, neon pulsando e luzinhas na Galeria do Brilho, torcida com lightsticks e torres de luz na Arena, fonte da Praça com gotas nos jatos e ondinhas, cachoeira do mapa com água descendo e névoa. Fonte da rua com jatos ligados à água; telhado da casinha (Meu Perfil) liso, sem as fileiras de bolinhas.
- Jardim das Nuvens: Sora⭐Jump! com degraus de nuvem até a estrela e trampolim; Photo⭐Studio! com câmera no telhado, toldo, varal de polaroids e porta com "Entrar".
- Happy⭐Cafe! "Dois no balcão" (ex-#89) entrou na #88; o modo demonstração simula os dois pedidos.
- Fãs e clientes com nomes em estilo mangá (Usamado, Sayami, Hanoka…); os nomes antigos continuam valendo nas lembranças já salvas.
- **Traduções por idioma (código mais leve):** a página carrega `tw-i18n-base.js` e só o idioma escolhido (`i18n/en|es|th|ja.js`). A fonte continua sendo `tw-i18n.js`: depois de editar, rodar `node tools/i18n/dividir.js` (o teste `i18n-dividido` acusa se esquecer). Trocar de idioma baixa o arquivo e monta o dicionário na mesma ordem de antes (conferido: igual ao site antigo nos 4 idiomas).
- Karaoke⭐Time!: saiu o modo de homologação antigo (`?homol=1`); o show automático dos outros Idols continua.
- Traduções: quem abre o site já em outro idioma vê tudo traduzido (antes ficavam "Audição" e itens do Center Run em português); diário do Idol⭐News! (51 frases) e "Quepe (Capitão)" traduzidos em EN/ES/TH/JA; "Star⭐Gacha!" não vira mais "Gachapon" (nomes dos jogos não se traduzem); leitor de tela da TV no idioma certo.
- Mapa da cidade: ao rolar até ele, não fica mais embaixo da barra fixa do jogador.
- Conferido em Chrome local a 390 e 320 px, sem as fontes do Google. Falta ver no iPhone.

### Teste sem login (modo demonstração)
- Abrir o site local (`python3 -m http.server` na raiz) com `?demo=1` no fim do endereço. As prévias de branch da Vercel estão desligadas no `vercel.json` e no domínio oficial o modo demonstração não liga.
- Cria a conta de mentira "Demo" (★500) e simula no navegador Battle (rival do dia, Top da Arena, Arena, Torcida), Jardim, Photo Studio, Café (partida verificada, cliente VIP, bônus ★10 do dia) e Handshake (8 rodadas, cor do lightstick, prêmio do dia), com os mesmos limites do servidor. O botão **+1 dia** da faixa avança o dia simulado (regas, limites diários, prêmio do dia seguinte).
- Nada é gravado e tudo some ao recarregar. Nunca liga em `tsulipa-world.vercel.app` (teste: `tests/demo-jogos.test.js`).
- Também simula o pó do Gacha (converter e resgatar, no Álbum) e o Moon⭐Duo! com o Pedido de cena (★5 uma vez por dia).
- No Handshake do modo demonstração o prêmio do dia é sempre ticket (no servidor é ticket ou mimo do pet), para não mexer no save do pet do aparelho.
- O modo demonstração prova telas, fluxos e limites. **Não prova** que as estrelas reais são creditadas.

### Pronto, mas sem validação real
- Conta real: partida oficial do Battle (limite de 5 e ★5), Arena, Jardim, converter e resgatar no Gacha.
- iPhone físico e Safari.
- Login com Google na prévia.

### Não concluído (estado de 14/11, antes dos merges — histórico)
- **Merge da #88:** é o que coloca tudo isso no site; o merge é do dono.
- **#89 (Café: Dois no balcão):** o banco está aplicado, mas o front não entrou na #88.
- **#74 (tela do prêmio do Sora):** rascunho; o SQL dele não deve ser aplicado, porque foi substituído pela versão com anti-cheat.
- **Nomes:** "Vila das Tulipas" (antes Vila das Flores) e "Galeria do Brilho" (antes Rua das Vitrines), confirmados em 14/11.
- **Casa decorável:** ainda em dúvida.
- **Ideias não iniciadas:** calibração de atraso no Karaoke e o pet ajudando no jardim.
- **Camarim em 320 px:** botões com 44 px e rótulo embaixo do emoji (CSS feito; não conferido em aparelho).
- **Limpeza:** apagar as branches já mergeadas.

---


Este arquivo é para continuar o trabalho em outra sessão (por exemplo, no Claude Code). Leia este arquivo, `docs/RAIOX_JOGOS.md` e `docs/MAPA_DO_CODIGO.md` antes de mexer em qualquer coisa.

## Regras do projeto
- Respostas em português, curtas e diretas. Sempre dizer o que **não** foi testado.
- HTML/CSS/JS puro, sem frameworks (só o Supabase via CDN). Canvas 2D com `requestAnimationFrame`.
- Nunca renomear chaves `brs48cr_*`.
- Nada vai para `main` sem PR, e quem faz o merge é o dono do projeto.
- Banco de produção só muda com OK explícito do dono. Os SQL já aplicados ficam em `supabase/sql/aplicado/`.
- Nada de dado falso em produção; horário de Brasília; roupas unissex.
- Nunca pedir nem mostrar chaves secretas no chat.
- Não usar personagens com direitos autorais; artes sempre originais.
- Testes: `for f in tests/*.js; do node $f; done`. O `karaoke-time.html` tem limite de 450 KB.

## Estado atual
- **Branch `visual/layout-hud` (PR #88)**, que já contém o PR #87:
  - visual dos cards e da paleta;
  - HUD do jogador;
  - destaque "Pra hoje";
  - barra de baixo no celular;
  - duas colunas no computador (≥1180px);
  - janelas com moldura;
  - abertura;
  - Top Idols no Idol⭐News!;
  - mapa da cidade.
- **PRs abertos:**
  - #86: traduções do Karaoke num arquivo próprio;
  - #72: documentação;
  - #74: Sora 500 m. Precisa de anti-cheat antes de aplicar o SQL.
  - O #87 pode ser fechado, porque já está dentro do #88.
- **Mapa da cidade original** (`tw-mapa.js` + `mapa-cidade.svg`, descrição do estado antes da navegação em 2 níveis):
  - é um botão "Passear pela cidade" no fim do Meu mundo, que abre e fecha;
  - `TW_LUGARES` é o registro de lugares, e cada prédio aciona o card original do hub;
  - o trio fica na praça, desenhado com `drawChar` e `perfCharContorno`;
  - o seu Idol e os Idols da vitrine passeiam pelas ruas;
  - a cidade muda com a hora de Brasília: dia, entardecer (17h) e noite (19h–6h);
  - histórico: a arte antiga era editada sem gerador versionado; agora `tools/mapa/` contém os geradores SVG da versão em dois níveis, sem afetar o site publicado antes do merge.
- **Pendências do dono:**
  - merges;
  - limpar os branches já mergeados.

## Planejamento (fases)
- **Fase 0:** registro de lugares. ✅
- **Fase 1:** mapa da cidade. ✅
- **Fase 2:** raio-X dos jogos atuais, em `docs/RAIOX_JOGOS.md`. ✅
- **Fase 3:** melhorar os jogos atuais. Feito no front-end: Pedido de cena do dia (Moon⭐Duo!), metas do Álbum (Gacha), hora extra do Handshake (vale já no treino sem conta). Com banco: ver a fila abaixo.
- **Fase 4:** jogos novos, na ordem Bloom⭐Garden!, Photo⭐Studio!, Idol⭐Battle!. A casa decorável ainda está em dúvida.

## Banco (atualizado 13/11, à tarde)
- **Já estava em produção:** `album_cards()` (o Álbum e as metas de coleção funcionam).
- **Aplicado hoje, com o OK do dono:** hora extra do Handshake (8 filas, até 60 respostas), Sora 500 m com anti-cheat (prêmio ★25/dia, ≥20 s e ≤25 m/s), Café "Dois no balcão" (`cafe_run_pedidos`, `cafe_run_etapa2`, `cafe_run_finalizar`). Arquivos em `supabase/sql/aplicado/20261113_*.sql`.
- **Também aplicado hoje:** `admin_corrida` (excluir corrida no admin agora desfaz os contadores).
- **Merges que destravam no site:** PR #88 (visual, mapa, hora extra no site), PR #89 (Café Dois no balcão), PR #74 (tela do prêmio do Sora; o SQL dele foi substituído pela versão com anti-cheat — não aplicar o SQL do #74).

## Economia de estrelas
- Retrato real em `docs/ECONOMIA_ESTRELAS.md` (o teto de ★100/dia do Center ESTÁ em produção desde 02/11; o README-center-run-100.md está desatualizado).
- **Aplicado em 13/11:** bônus do dia, ★10/dia no Café e no Handshake (1ª partida verificada com 600+ pontos). Arquivo em `supabase/sql/aplicado/20261113_bonus_jogo_dia.sql`.

## Mapa em 2 níveis (aprovado pelo dono em 13/11)
O mapa de 1 nível ficou lotado. Novo modelo:
1. **Mapa do mundo** (`tools/mapa/mundo2.py`, prova em `docs/mapa-provas/mundo_v2.jpg`): os prédios reais agrupados em 6 bairros, só 6 plaquinhas (nome do bairro + ícones do que tem dentro).
   - Star Stage (aprovado; ID `palco`): Handshake, Center, Karaoke.
   - Rua das Vitrines (nome **provisório**, ID legado `harajuku`): Café, Gacha, Shop. Não usar Harajuku como nome exibido.
   - Vila das Flores (nome **provisório**, ID legado `fofo`): Pet, Minha casa, horta "em breve" (Bloom⭐Garden!). Sem nome de pet.
   - Praça Central: fonte (Encontro do dia), Idol⭐News!, Pedido de fã.
   - Star Arena (aprovado; ID `arena`): "?" (Idol⭐Battle!).
   - Jardim das Nuvens (aprovado; ID `ceu`, única ilha no alto): Sora, Moon⭐Duo!, "?" (Photo⭐Studio!).
2. **Cena da rua de cada bairro** (modelo: `tools/mapa/rua.py`, prova em `docs/mapa-provas/rua_harajuku.jpg`): tocar no bairro abre a rua dele, com os prédios grandes lado a lado (escala ~2), calçada, chão de pedrinha onde os Idols passeiam e botão "◀ Mapa". No celular a rua rola para os lados.

**Ordem de implementação (1–6 implementadas na PR #88; sem merge/publicação oficial):**
1. Gerar `mapa-mundo.svg` (mundo2.py + sep.py) e as 6 ruas (copiar rua.py para cada bairro).
2. Em `tw-mapa.js`: estado `cena = 'mundo' | <bairro>`; caixas de clique por bairro no mundo; na rua, caixas por prédio usando o mesmo `TW_LUGARES` (clique chama o `click()` do card original).
3. Levar para a rua: passeantes (seu Idol + Idols da vitrine + pets), hora do dia (`horaBR`, `ceu`), alertas (!) e cadeados. No mundo ficam só alerta somado por bairro e o trio no palco.
4. Botão "◀ Mapa", tecla Esc e `history` (voltar do celular volta ao mundo).
5. Jogos novos entram ocupando o "?" do bairro.
6. Testar desktop + celular (rolagem, cliques, tema escuro) e os testes `for f in tests/*.js; do node $f; done`.

## Estado de execução do mapa (13/11/2026 — PR #88)
- **Passo 1:** mundo e seis SVGs de ruas gerados com `tools/mapa/gerar_2_niveis.py` e validados.
- **Passo 2:** navegação mundo → bairro e clique nos cards originais implementados em `tw-mapa.js`; IDs internos antigos preservados.
- **Passo 3:** Idols e pets existentes passeiam nas ruas, iluminação por horário de Brasília, cadeados e alertas por edifício; alertas agregados e trio no mundo.
- **Passo 4:** botão HTML e SVG “◀ Mapa”, Esc quando não há jogo/modal em primeiro plano, histórico de navegação para Voltar/Avançar do celular. Preserva `history.state` de outros módulos.
- **Passo 5:** três espaços reservados e ilustrados nas ruas: `bloom-garden` (horta da Vila das Flores), `photo-studio` (estúdio do Jardim das Nuvens) e `idol-battle` (arena central). Exibem “Em breve”, sem abrir jogos, criar saves ou conceder recompensas. Integração real desses jogos permanece para fase futura.
- **Passo 6:** testes JS completos `for f in tests/*.js; do node "$f"; done` e QA interativo em Chromium, usando `tools/mapa/teste-browser.cjs`: desktop 1280×800, celular 320×640, celular 390×844 em tema escuro, rolagem, clique em card original, Esc, botão Voltar e histórico. Tudo validado na execução GitHub Actions #43467172453. **Não houve teste em iPhone físico nem login OAuth real.**
- **Prévia Vercel:** `https://tsulipa-world-git-visual-layout-hud-tsu-li-pa.vercel.app/` (alias da PR #88), build verificado READY no commit `63a8b443`. Projeto existente `tsulipa-world`, sem alterar produção. A prévia tem Vercel Authentication/SSO ativo: acesso exige conta autorizada na Vercel. **Login Google/Supabase real não foi comprovado.** Se desejar autenticar na prévia, conferir allow list no Supabase Auth > URL Configuration e origem autorizada do Google Cloud para esse domínio, sem mudar Site URL de produção. Não aplicar alterações de configuração sem autorização.
- **Regras mantidas:** sem tocar em Supabase ou `main`, sem duplicar lógica dos cards, sem mexer nas chaves `brs48cr_*`. Dois nomes de bairros continuam provisórios.

## Mapa Vivo⭐ — refinamento (13/11/2026, noite)
- Textos das artes desenhados no canvas com a fonte do jogo e traduzidos (`tools/mapa/textos.py` → `mapa-textos.js`); antes saíam serifados.
- Rótulos e botões do mapa nos seis idiomas; a dica "Arraste para passear" fica abaixo da arte.
- Ruas: Idols visitam as portas em ritmos diferentes, com balãozinho (♪ ❤ ★); o pet segue e senta ao lado; passeantes abaixo das placas.
- Detalhes discretos: pétalas, floquinhos, notinhas, corações, vapor do Café, brilhos; no mundo, gotinhas na fonte e nuvens. Tudo desliga com "reduzir movimento".
- À noite as placas ficam acesas como letreiros.
- Atalho destaca o bairro; entrar na rua aproxima a câmera até ele.
- Missões do dia (as da Agenda do Idol) aparecem no mapa: 🎯 no bairro e balão com progresso sobre o prédio (ex.: 🏃 1/2 no Center⭐Run!). Sem mudança no banco.
- **Não testado:** iPhone físico e conta real.

## Star⭐Gacha! — pó de estrela e garantia (APLICADO em produção em 13/11, com o OK do dono)
- SQL auditado e testado em PostgreSQL isolado (38 verificações): `supabase/sql/aplicado/20261113_gacha_po_garantia.sql`. Detalhes em `docs/GACHA_REPETIDOS_GARANTIA_PROPOSTA.md`.
- Interface no Álbum (`gacha-po.js`, PR #88): aparece sozinha agora que a função existe no banco. Conferido com dados reais (só leitura): status responde ok. Converter/resgatar com conta real ainda não testados.

## Aplicado em 13/11 (noite), com o OK do dono
- `20261113_gacha_po_garantia`: pó de estrela (1 repetido = 1 pó, 5 pós = 1 card) e garantia após 7 "nada".
- `20261113_duo_pedido_premio`: ★5/dia pelo Pedido de cena do Moon⭐Duo! (confere o duo da cena em `duo_log`).
- `20261113_bloom_garden`: Bloom⭐Garden! v1 — 4 canteiros, sementes ★20–60, 1 rega/dia, flores na conta; nunca dá ★.
- Arquivos em `supabase/sql/aplicado/`; testes isolados em `supabase/tests/{gacha-po,duo-pedido,bloom}/rodar.sh`.
- Front no PR #88: `gacha-po.js`, `duo-pedido.js`, `bloom.js` (horta da Vila das Flores no mapa), `cafe-gorjeta.js` (só visual).

## Café VIP — APLICADO (13/11, noite, OK do dono)
- `supabase/sql/aplicado/20261113_cafe_vip.sql`: cliente VIP do Café (6ª e 11ª clientes valem o dobro). Insere uma linha em `cafe_run_etapa` e `cafe_run_etapa2` (lidas na hora de aplicar; falha se o marcador mudar). Testado isolado em `supabase/tests/cafe-vip/`. O front (`cafe-vip.js`) já está no PR #88 Conferido em produção: as duas funções têm a linha VIP e mantêm os grants.

## Handshake: fãs com dois detalhes — APLICADO (13/11, noite, OK do dono)
- SQL: `supabase/sql/aplicado/20261113_handshake_cor.sql` (testado isolado em `supabase/tests/handshake-cor/`). Compatível com a versão antiga: sem `cor` na resposta, pontuação igual a hoje.
- Front (`handshake.js?v=11`): cor do lightstick da 3ª rodada em diante, pergunta da cor depois do presente certo, +50; jeito muda o tempo da apresentação.
- Servidor: `handshake_iniciar` passa a sortear também a cor do lightstick (0–5) para os fãs a partir da rodada 3; `handshake_run_finish` aceita `cor` na resposta e soma +50 quando presente E cor estão certos.
- Cliente (`handshake.js`): depois do presente, escolher a cor (6 botões). O jeito do fã passa a valer: tímido mostra o texto por menos tempo, animado repete.
- Mexe no coração do jogo e em 2 funções em uso: fazer com teste isolado e OK do dono.

## Flores com uso + Caderno na conta — APLICADO (13/11, noite, OK do dono)
- `20261113_flores_e_caderno`: `jardim_usar_flor` (gasta 1 flor para levar à mesa do Handshake; o front dá +Hype: Sakura 10, Tulipa 15, Girassol 20, Flor-lunar 30) e `cafe_caderno` (só leitura das receitas comprovadas).
- Front: `flores.js` (PR #88). Testes: `supabase/tests/flores/rodar.sh`, `tests/flores.test.js`.

## Fase 4 — estado em 14/11/2026
- Bloom⭐Garden! v1 ✅ (aplicado), flores com uso ✅ (aplicado).
- Photo⭐Studio! v1 ✅ e v2 Mural + Capa no Idol⭐News! ✅ (aplicados) — `docs/PHOTO_STUDIO_PROPOSTA.md`.
- Idol⭐Battle! v1 ✅ **APLICADO em produção em 14/11/2026, com o OK do dono** (`supabase/sql/aplicado/20261114_idol_battle_v1.sql`): rival do dia, 5 tentativas, ★5 na 1ª vitória; ordem do rival e sorte por `random()` no servidor. Front (`battle.js`, Star Arena) na PR #88 passa a usar o servidor sozinho para quem está logado. Conferido em produção só por leitura: grants, RLS, 0 partidas. **Não testado: conta real, ★5 real, iPhone.**
- Padrão de trabalho que o dono aprovou: SQL em `supabase/sql/proposta/` + teste em PostgreSQL isolado (`supabase/tests/<nome>/rodar.sh`, com cópia INTEIRA de qualquer função de produção alterada) + front num arquivo próprio no PR #88; aplicar no banco só com a frase de OK do dono; depois mover para `aplicado/`.

## Mapa Vivo⭐ — acabamento de textos e CSS na PR #88
- Placas do mapa renderizadas em Mochiy Pop One, com largura máxima para traduções maiores e brilho/sombra discreta.
- Letreiro do Sora⭐Jump! reposicionado dentro da rua do Jardim das Nuvens pelo gerador de textos.
- Botões, chips de bairro, foco, contraste noturno e bordas refinados para acompanhar o CSS do Hub; reduzido movimento continua respeitado.
- Bloom, Photo Studio (inclusive treino sem conta) e Idol Battle (treino até aplicação de SQL) usam entradas no próprio mapa.
- CI do mapa #43540804733 aprovou JS, geração de SVGs, capturas e QA Chromium de desktop, celular e tema escuro. Testes físicos em iPhone ainda não realizados.

## Próximo passo (antes do merge)
1. Battle aplicado em 14/11: falta testar com conta real (partida oficial, limite de 5 e ★5).
2. Conferir o mapa e os jogos no iPhone físico, login e pequenos fluxos integrados.
3. Teste da página inicial (`tests/i18n-visual.browser.cjs`) refeito em 14/11 (escolha delegada pelo dono): em vez de exigir texto/layout idênticos à referência `e95e777`, reprova idioma errado, erro de JS novo, rolagem lateral nova, bloco principal mudando de aberto/fechado e tradução que voltou ao português; texto novo igual ao português vira aviso; o resto vai para `report.json`. **Atenção:** mudança de posição ou de texto não reprova mais sozinha — olhar o relatório/capturas do CI.
4. Atualizar a prévia da PR #88 e só então propor merge; os nomes provisórios Rua das Vitrines e Vila das Flores aguardam confirmação.


## Vida de Idol⭐ — Cidade que Reage (primeira sequência, PR #88)
- Implementadas cinco melhorias leves de continuidade: reações do Hub apenas após atividades confirmadas, lembranças da sessão no Camarim, atalhos em objetos já existentes, presença visual discreta por horário e três capítulos opcionais do Diário.
- Novos arquivos `vida-cidade.js`, `vida-cidade.css`, `tests/vida-cidade.test.js` e documentação `docs/VIDA_IDOL_CIDADE_REAGE_PR88.md`.
- Sem novas RPCs, SQL, saves, recompensas, alterações nos itens originais ou cópias de fotos. Memórias limitadas à sessão e isoladas por conta.
- Ainda não foram criados NPCs novos caminhando nas ruas nem uma narrativa persistente. Próxima fase depende de QA visual real no iPhone e decisão artística.

## Idol⭐Battle! — show no palco (14/11/2026, só front, PR #88)
- `battle.js?v=3` / `battle.css?v=2`: as 3 rodadas agora são encenadas num palco em canvas (holofotes, plateia com lightsticks, placar subindo, ★ WIN ★), com botão **Pular** e sem animação quando "reduzir movimento" está ligado. O show só encena o resultado que já veio do servidor; o cliente não sorteia nada.
- Rivais e a sua unit aparecem com o visual real do Idol (mesmo `drawChar` do jogo, dados da vitrine); quem não está na vitrine vira um medalhão com a inicial. Atributos 🎤💃💖 visíveis nos rivais e nos seus cards; `×N` marca cards repetidos.
- Escalação: sugestão inicial com a melhor soma; escolher um Idol já usado em outra rodada troca os dois de lugar.
- Aviso de ★5 do dia (em aberto / já conquistada), polaroid nova com a unit no palco e o placar.
- Treino sem conta ficou vencível: a ordem escolhida decide (antes era impossível ganhar).
- **Correção no mapa (`tw-mapa.js?v=39`)**: os Idols da vitrine não passeavam nas ruas porque o código lia `p.av`, mas a vitrine entrega `p.avatar`. Agora aceita os dois.
- Conferido em Chromium local (390×844, 320×640 escuro, 1280×800 com movimento reduzido) com o `index.html` inteiro e com resposta de servidor simulada; 87 testes JS OK. **Não testado: conta real, iPhone físico, Safari.**

## Idol⭐Battle! — Top da Arena — APLICADO (14/11/2026, OK do dono)
- `supabase/sql/aplicado/20261114_idol_battle_ranking.sql`: `battle_ranking()` só de leitura (vitórias da semana desde domingo, Brasília; top 10 + a sua posição; desempate por menos partidas; contas bloqueadas fora; sem ids) e índice em `private.battle_partidas(dia)`.
- Teste isolado: `supabase/tests/battle/checks_ranking.sql` (dentro do `rodar.sh` do Battle).
- Front no PR #88: seção "Top da Arena" na janela do Battle (`battle.js`) e 4º pódio no Idol⭐News! (`jornal.js?v=14`).
- Conferido em produção por leitura: anon sem acesso, authenticated executa, semana começando no domingo, ranking vazio (0 partidas). **Não testado: conta real, iPhone.**

## Idol⭐Battle! v2 — Arena dos Idols — APLICADO (14/11/2026, OK do dono)
- `supabase/sql/aplicado/20261114_idol_battle_v2_arena.sql`: cada pessoa deixa UMA unit salva; os outros desafiam sem ninguém estar online. **Sem ★** (não toca em `stars`/`star_log`), não gasta cards, não altera funções anteriores.
  - `battle_unit_salvar(p_unit)`, `battle_arena()`, `battle_desafiar(p_alvo, p_unit, p_requisicao)`; tabelas `private.battle_units` (contador `fas`) e `private.battle_desafios`; helper privado `battle_unit_resolver`.
  - Regras: 3 desafios/dia, 1 por pessoa/dia, idempotência por UUID, empate é da defesa, +1 fã ❤️ para a defesa que vence. A lista mostra os 3 Idols em ordem alfabética (ordem da defesa secreta) e nunca ids. Unit cuja dona perdeu um card fica indisponível até salvar de novo. Contas bloqueadas ficam fora.
- Teste isolado: `supabase/tests/battle/checks_arena.sql` (no mesmo `rodar.sh`).
- Conferido em produção por leitura: corpo das 4 funções idêntico ao testado (md5), anon sem acesso, authenticated só nas 3 RPCs públicas, RLS ligada sem políticas, 0 linhas.
- Front no PR #88 (`battle.js?v=7`, `battle.css?v=5`): aba "Arena dos Idols" (montar e salvar a unit ali mesmo, lista de defesas, desafiar, show e polaroid), aviso de fã da defesa, narração das rodadas para leitor de tela, data da polaroid no formato do idioma, contraste dos textos corrigido no tema escuro.
- Conferido em Chromium (claro e escuro) com servidor simulado. **Não testado: conta real, iPhone.**

## Bloom⭐Garden! — refinamento (14/11/2026, só front, PR #88)
- `bloom.js?v=3` (+ estilos em `hub-polish.css?v=33`), sem SQL novo e usando só as 4 RPCs de sempre.
- Tocar num canteiro do desenho faz a ação certa: vazio abre as sementes em botões grandes (com ★ e dias; sem ★ suficiente fica apagado), crescendo rega, florido colhe.
- "Regar tudo" e "Colher tudo" quando há 2 ou mais canteiros na mesma situação (uma chamada por canteiro, conferida no servidor).
- Balão em cada canteiro (＋, 💧, 🌼) e progresso n/m maior; o céu acompanha a hora de Brasília (dia, entardecer, noite com lua e estrelas; flor-lunar brilha à noite).
- O seu Idol e o pet ativo aparecem no jardim e vão até o canteiro cuidado.
- Conferido em Chromium (390×844) com servidor simulado. **Não testado: conta real, iPhone.**

## Idol⭐Battle! v3 — Torcida de flores — APLICADO (14/11/2026, OK do dono)
- `supabase/sql/aplicado/20261114_idol_battle_v3_torcida.sql`. Liga o Bloom⭐Garden! ao Battle: 1 flor por dia, gasta, dá +1 à sua unit nas partidas daquele dia (rival do dia e arena). 🌸 Canto, 🌷 Dança, 🌻 Carisma, ⭐ flor-lunar nas três. Teto de 11 por rodada e regra de empate mantidos. Não dá ★.
- **Atenção:** substitui `battle_jogar` (a função do prêmio ★5) e `battle_desafiar` por cópias inteiras das versões aplicadas com as linhas da torcida. `tests/idol-battle.test.js` confere que nenhuma outra linha mudou. Funções novas: `battle_torcida()`, `battle_torcida_levar(p_flor)`; tabela `private.battle_torcida`.
- Teste isolado: `supabase/tests/battle/checks_torcida.sql`; o `rodar.sh` agora também refaz TODAS as verificações antigas num banco novo já com as funções substituídas (regressão).
- Front no PR #88 (`battle.js?v=8`, `battle.css?v=6`): seção "Torcida de flores" na escalação, 🌸+1 no palco e no resultado. Só aparece quando `battle_torcida()` responde.
- Antes de aplicar, `battle_jogar`/`battle_desafiar` de produção tinham o md5 das versões aplicadas; depois, as 5 funções têm o md5 do que foi testado; anon sem acesso, RLS ligada, 0 linhas.
- Conferido em Chromium com servidor simulado. **Não testado: conta real, iPhone.**

## Bloom⭐Garden! redesenhado + jogos novos no Hub (14/11/2026, só front, PR #88)
- **Jardim (`bloom.js?v=4`, `hub-polish.css?v=34`)**: cena refeita à mão no canvas — cada flor tem o seu desenho (sakura com pétalas entalhadas, tulipa em taça, girassol com coroa e miolo, flor-lunar em estrela) e fases (semente, broto, botão, flor); caixotes de madeira, colinas, cerquinha, sol/lua pela hora de Brasília, gotas na rega e pétalas na colheita. Sem emoji como ícone: gota, broto e flor são desenhados. Canteiros em cartões 2×2 com miniatura da planta e bolinhas de progresso; sementes e "Suas flores" com a flor desenhada. Mesmas 4 RPCs.
- **Hub (`hub-novos.js?v=1`, teste `tests/hub-novos.test.js`)**: Bloom⭐Garden!, Photo⭐Studio! e Idol⭐Battle! ganham cards na lista de Jogos, no molde dos outros (embrulha `hubCardsUI`, não edita `hub.js`). O card do jardim avisa quando há rega ou colheita. Sem conta, os três seguem a regra atual do Hub (cadeado → login); o treino sem conta do Studio e do Battle continua pelo mapa.
- Conferido em Chromium (390×844 e 1280×900) com servidor simulado. **Não testado: conta real, iPhone, Safari.**

## Refinamento visual — segunda passada (14/11/2026, só front, PR #88)
- **Jardim (`bloom.js?v=5`)**: plaquinha do jardim, regador, borboletas de dia e vaga-lumes à noite (parados com "reduzir movimento").
- **Photo⭐Studio! (`studio.js`, `hub-polish.css?v=35`)**: sem emoji no título, nas abas, na pauta e nos botões; cenário, luz e flores ganham uma amostra de cor desenhada; opções em grade alinhada (2 ou 3 colunas); moldura da foto igual à do jardim. Nenhuma regra ou RPC mudou.
- **Idol⭐Battle! (`battle.js?v=9`, `battle.css?v=7`)**: sem emoji como ícone — microfone, sapatilha, coração e troféu são desenhados e usados tanto no HTML (SVG) quanto no palco e na polaroid (Path2D); flores da torcida viram bolinhas de cor; pódio do ranking com medalhas numeradas; títulos de seção só com texto. Nenhuma regra ou RPC mudou.
- Conferido em Chromium (390×844). **Não testado: conta real, iPhone, Safari.**


## Rodada 17/11/2026 (PR #104 · v3 oficial)
- Visual de celular oficial nos telefones (sem "prévia"); passos do Montar Idol e tutorial corrigidos.
- Novidades (celular): posts do Idol⭐News! (`news_posts`) com data e selo "novo" (`tw_nov_visto`); a lista fixa fica embaixo.
- Idol⭐Battle: 480px, cena unit × rival no topo (`cenaDesenhar`), escolha por cards (`data-battle="slot"`), caixas escuras no modo escuro.
- Moon⭐Duo: cena da lua (`duoCenaDesenhar`); sugestões com reserva Tsu/Lirika.
- Karaoke⭐Time! como karaokê box: parede capitonê, carpete (cache), sofá de veludo, mesa de madeira com pandeiro/maracas/tablet/controle,
  molduras de madeira, cardápio de músicas no lugar do placar (ranking logo abaixo + botão 🏆 no celular), 2 polaroids em vez de 6.
  No celular a sala ocupa a tela, com Trilha/Jogar flutuando em cima e Som/Pausar/Timing/Foto/🏆 embaixo.
- Idol⭐News! continua com cartões claros ("papel") no modo escuro — decisão em aberto.
