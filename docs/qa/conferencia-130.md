# Conferência visual — PR #130

## Entregas

- Moon⭐Duo: edição antes dos menus de saída; salvar e atividades agrupados; seis cenas iniciais, com acesso às demais; rótulos novos nos seis idiomas.
- Exportações com assinatura: rodapé acrescentado fora dos pixels originais. Largura preservada; a altura cresce pelo rodapé. PNG transparente do Duo continua sem assinatura.
- Colorir: usa as formas fechadas do renderer do avatar, sem o filtro de detecção de bordas em 180 px. Desenho em 720×800, mapa de áreas independente do contorno, paleta, teclado, Desfazer (até 30 ações), Limpar reversível e PNG. Não altera o visual salvo, o contexto de render do jogo nem concede estrelas.
- Caça-palavras: acabamento da grade, seleção e palavras encontradas, contraste em tema escuro e feedback de acerto. A resposta precisa corresponder às células da palavra sorteada.
- Diferenças: pequenas peças desenhadas no Canvas em prateleiras do camarim; posições separadas, cinco diferenças únicas, marcação de acertos e alternativa por teclado.
- Labirinto: gatinho e microfone desenhados, trilha percorrida, feedback de parede e chegada e cancelamento de gesto.
- Fichinhas: cabeçalho independente da regra global `header{max-width:760px}`, composição centralizada no desktop e enquadramento inteiro maior; mantém nomes, informações, fala e pets.

## Validação local — 21/11/2026

- `node tests/moon-conferencia.test.js`: passou.
- `node tests/melhorias-20261121.test.js`: 14/14 passaram. As migrações são apenas lidas como texto por essa suíte; nenhum SQL foi executado.
- `tests/passatempos-refino.browser.cjs`: Chrome headless; quatro larguras (320, 390, 1440, 1906), três fichas em cada largura, sem transbordamento; pintura, Desfazer, Limpar, desfazer a limpeza, PNG, fundo e avatar preservados.
- Três partidas completas na UI real com RPC simulado: cinco palavras, cinco diferenças, labirinto com 44 passos na edição testada; uma chamada de conclusão por tipo. Colorir não chama a recompensa.
- Teclado e textos novos conferidos nos seis idiomas; caça-palavras em tema claro/escuro; movimento reduzido.
- Inspeção das capturas do desenho, figurino, diferenças, labirinto e fichas mobile/desktop.
- Sintaxe dos módulos alterados e scripts inline do index conferida.

## Limites

Conta, RPC e rede externa foram isolados nos testes. Não houve teste com conta real ou aparelho físico, nem avaliação de todas as combinações de figurino/acessórios. A suíte geral completa não foi executada. CI não foi aguardado. A PR continua em rascunho para os próximos itens da conferência; sem SQL, merge ou publicação.


## Segunda conferência: perfil, jardim e fotografia

- Emoji livre: as sugestões exibem a escolha salva com aria-pressed, inclusive quando não consta na lista; digitação atualiza a seleção. O cálculo visual de perfil completo usa o emoji salvo da própria conta. Não há nova restrição por lista nem alteração de SQL.
- Vitrine dentro da aba Perfil, abaixo dos números; card desenhado em 360×504, com grade responsiva de card, insígnia e música. Mantidos os bloqueios de sessão e respostas antigas existentes no módulo.
- Histórico, coleções e edição do perfil em seções expansíveis; troféus e recados continuam visíveis.
- Bloom: enfeites e caminho desenhados antes da cerca.
- Studio: palma e pulso na escala dos braços; dedos e polegar envolvem a haste. Inspeção com microfone, lightstick e flor, nas poses V, aceno e coração. Não foram conferidas todas as combinações possíveis de objetos/poses.
- Missões: título interno oculto somente quando o painel é exibido na tela nova de missões.
- Browser suite ampliada: seleção do emoji 🎙️ e digitação 🪷, perfil completo com emoji livre, card em resolução correta, saída da vitrine na troca de aba, perfil em 320/390 px, título único das missões, captura do Bloom e grade de mãos do Studio. RPCs simulados, nenhuma conta real.


## Terceira conferência (auditoria a partir de a415843)

Navegador: Chromium headless (Playwright) com RPC simulado e rede externa bloqueada. Sem conta real e sem iPhone físico; simulação de celular não equivale a aparelho.

### Reproduzido e corrigido

- **Colorir removido** a pedido da dona. Antes da remoção, a auditoria encontrou um defeito grave: o filtro `/^create|get|measure|isPoint|to/` casava "to" dentro de `restore`, então o mapa de áreas nunca restaurava o contexto e saía de sincronia com o desenho (rosto, franja e tronco não pintavam; varredura de 16 mil toques pintou só saia e cabelo de trás). Com o Colorir fora, saem também a paleta, Desfazer, Limpar e os textos; os três passatempos e as recompensas continuam iguais.
- **Passatempos evoluídos** (sem mudar regras de estrelas): botão Dica no caça-palavras (destaca a primeira letra de uma palavra que falta) e nas diferenças (círculo tracejado por 2,2 s), com aviso nos seis idiomas de que a dica não custa estrelas; labirinto com Recomeçar, contador de passos e brilho no microfone; faixa roxa grossa das diferenças trocada por um rodapé fino.
- **Studio, mãos:** a mão agora é um punho simples (palma arredondada e faixa de dedos sobre a haste), sem linhas de dedos e sem antebraço extra. Captura: `conferencia-130/studio-maos.png`.
- **Studio, regressão da própria PR:** a limpeza do avatar de outra pessoa tinha perdido `lado2` (cor do cabelo bicolor). Restaurado.
- **Moon⭐Duo:** o selo "🔒 ★preço" cobria o ícone das cenas bloqueadas; agora fica abaixo do nome. "Álbum e atividades" abria vazio até o próximo clique (atalhos montados 350 ms depois de um clique, e só com o palco visível); agora monta ao abrir. Captura: `conferencia-130/duo-cenas-390.png`.
- **Emoji livre:** o `maxlength="8"` contava unidades UTF‑16 e cortava sequências compostas que o servidor aceita (o servidor conta até 8 caracteres). Agora o campo limita por caracteres, sem cortar no meio da composição por IME. 🎙 e 🎙️ (seletor de apresentação) marcam o mesmo botão em vez de criar um botão duplicado. O valor salvo continua vindo da resposta do servidor (`re.emoji`); o indicador de perfil completo usa o perfil salvo, não o texto digitado.
- **Vitrine:** card favorito maior a partir de 700 px (196 px de largura, antes 136 px).
- **Testes que já falhavam no HEAD da PR:** `index-modules` (funções novas de perfil-tela.js sem marcador `//→` em perfil.js) e `semana-20261120` (chamada da vitrine fora do padrão). Corrigidos.
- Versões de cache: studio.js, tw-celular.css, tw-passatempos.js, duo.css, tw-comunidade.js, perfil.js e perfil-tela.js.

### Apenas inspecionado (sem defeito confirmado)

- Bloom: caminho e pedras atrás da cerca; Idol, plantas, canteiros, balões e regador na ordem certa, às 12h, 18h e 22h, claro/escuro, 390 e 1440 px. O regador encosta no balão do canteiro 4 em telas largas (sem bloquear o toque).
- Perfil: claro/escuro (tema escuro por `prefers-color-scheme`, como no site), 320/390/768/1440 px, seções expansíveis e abas. Sem transbordamento.
- Fichinhas: a faixa do título encosta na borda esquerda por desenho (mesmo componente das outras telas).
- Assinatura: rodapé fora da foto, PNG transparente do Duo sem selo, fotos guardadas na série/Momentos sem selo. A página de três fotos do Álbum continua sem assinatura (como antes da PR).
- Missões: título único na tela nova (coberto pelo teste de navegador).

### Não validado

Conta real (salvar emoji no servidor, vitrine de outra conta), iPhone/Android físico, zoom 125% real do sistema, leitores de tela e o conjunto completo de testes de navegador do CI (`telas.browser.cjs` e Karaoke não foram executados aqui).

### Testes desta rodada

- `node tests/run-all.js`: 123/123.
- `node tests/passatempos-refino.browser.cjs`: passou (fichas em 4 larguras; três partidas completas com uma recompensa por tipo; Dica nos seis idiomas; Recomeçar zera passos; emoji com seletor, sequência composta de 7 caracteres preservada e limite de 8; vitrine; título único das missões; Bloom).
- Roteiros próprios de auditoria (fora do repositório): Duo em 320/390/1440 claro/escuro, mãos do Studio em 4 poses × 5 objetos × 3 enquadramentos, Bloom em três horários.


## Quarta conferência: atalhos do Menu (22/11, a partir de 40ffc51)

**Escopo decidido pela dona no meio da rodada:** o Menu do TsuPhone já está cheio. Esta rodada só corrige defeitos dos 14 atalhos e não acrescenta funções ou blocos novos às janelas. Também a pedido da dona, o diamantinho do humor saiu do Camarim VIP. A proposta de enxugar o Menu (até 8 atalhos e uma pasta "Comunidade") ficou registrada no fim desta seção, sem implementação.

**HEAD final:** o commit local desta seção, sobre `40ffc51`, ainda não foi enviado à PR. Este ambiente não recebeu permissão de escrita no repositório, então a branch continua em `40ffc51` até alguém enviar o commit (veja "Limitações").

### Como foi auditado

- **Conta real (Chrome da dona, só leitura):** produção `tsulipa-world.vercel.app` (`main`, tw-celular.js v=70), conta logada e tema escuro do sistema.
  - Desktop com viewport de 1536 px e zoom do sistema de 125% (devicePixelRatio 1,25).
  - 390 px numa moldura da mesma origem (mesma sessão), porque a janela do Chrome não redimensionou.
  - Atalhos abertos: Zipper Shop, Encontro do dia, Passatempos, Álbum, Procurar Idol, Novidades, Fichinhas, Tour de camarins, Vida no bairro, Concurso, Meu mês e Recado.
  - Tema claro e escuro e os seis idiomas na grade. O idioma voltou para `pt` no fim.
  - Console sem erros.
- **Não abertos na conta real:**
  - Convidar amigos: `convite_meu` cria o código no servidor se ele ainda não existir.
  - Lembrete: baixava o .ics no toque.
  - Nada foi votado, inscrito, enviado, resgatado, comprado ou salvo.
- **Local, na branch da PR:** Chromium headless (Playwright), conta e RPC simulados e rede externa bloqueada.
  - Larguras de 320, 390, 768, 1440 e 1920 px, claro e escuro e movimento reduzido.
  - Seis idiomas em 320, 390 e 1440 px, medindo linhas e palavras maiores que o atalho.
  - Falha de servidor simulada com RPC rejeitado.

### Reproduzido e corrigido

1. **Ícones repetidos.** Fichinhas e Convidar usavam o "trio"; Encontro e Recado, o coração; Passatempos, a trilha e o Instalar, a estrela; Lembrete e Meu mês, o calendário.
   - Agora cada atalho tem um desenho próprio no mesmo traço: peça de quebra-cabeça, porta de camarim, envelope do convite, sino, gráfico do mês, carta, brilho e celular.
   - Os atalhos e a ordem continuam os mesmos.
2. **Rótulos quebrando no meio da palavra.** O rótulo "TsuLiPa⭐Wo / rld" e o "アイドルをさ / がす" vinham de `overflow-wrap:anywhere`. Havia rótulos de 3 linhas em pt, en, es e id e de 4 linhas em th e em 320 px.
   - Agora o rótulo tem no máximo 2 linhas e só quebra entre palavras (`break-word`, `text-wrap:balance`).
   - Onde o nome não cabia, a grade usa um nome curto, e o nome inteiro fica em `aria-label` e `title`:
     - em todos os idiomas: "Show de sábado", "Meu mês" e "Recado ao trio";
     - em alguns: "Passa-tempos" e "Pasa-tiempos" (hífen opcional), "Kampung kita" (id), "コーデ大会" e "アイドル検索" (ja), "เกมประจำวัน" (th).
   - Verificação automática nos seis idiomas em 320, 390 e 1440 px: nenhum rótulo com mais de 2 linhas e nenhuma palavra cortada sem hífen.
3. **Última linha torta.** Eram 8 + 5 no desktop e 4 + 4 + 4 + 2 encostados à esquerda no celular. No computador, as colunas agora dividem as linhas por igual (13 atalhos → 7 + 6), e a última linha fica centralizada. Todos os atalhos têm a mesma altura.
4. **Tour de camarins no escuro:** o nome usava `#3c2a6a` sobre `#1b2d4b` (contraste de cerca de 1,3:1) e agora usa `#f3e8ff`.
5. **Vida no bairro no escuro:** o texto claro ficava sobre o cartão branco a 72%, porque a regra escura usava `html.dark`, que o site não aplica. As regras agora seguem `prefers-color-scheme` e `data-theme`.
6. **Álbum em 390 px:** a "Série de fotos" caía na coluna de 76 px dos filtros e empurrava a grade de cards para baixo. Agora ela ocupa a linha inteira.
7. **Concurso, Convidar amigos e Álbum de duetos presos em "…"** quando o servidor falhava. O erro só aparecia no aviso flutuante.
   - Agora a janela mostra "Carregando…" e, em caso de falha, o erro na própria janela (`role=alert`) com "Tentar de novo". Os textos estão nos seis idiomas.
8. **Meu mês:** nada aparecia até o servidor responder, e o erro ficava só no aviso. Agora tem o mesmo carregando e erro com "Tentar de novo".
9. **Concurso:**
   - o foco inicial caía em "Atualizar meu visual", um botão que grava, e agora cai no título;
   - depois de votar, a janela era refeita no topo e o foco se perdia; agora a rolagem e o foco voltam ao coração tocado.
10. **Recado:** "Enviar" ficava ativo com o campo vazio e o toque não fazia nada.
    - O botão agora fica apagado até haver 2 letras (`aria-disabled`).
    - O aviso de texto curto, de limite diário e de erro aparece dentro da janela, e o texto digitado é mantido.
11. **Camarim VIP:** saiu o diamantinho do humor, que ficava solto embaixo da argola, longe da cabeça. O humor continua no ícone do app e no Mapa. Nos interiores do Café, da Loja e do Gacha ele continua.

Versões de cache: tw-celular.css 60, tw-celular.js 72, tw-bairro.js 9 (tw-bairro-tela.js 4), tw-comunidade.js 6 e tw-pessoal.js 8.

### Capturas (antes | depois, mesma largura e tema; locais, com dados simulados)

`conferencia-130/`:
- Menu: `menu-atalhos-320-escuro.png`, `menu-atalhos-390-escuro.png`, `menu-atalhos-1440-escuro.png`, `menu-atalhos-390-escuro-{pt,ja,es}-depois.png`, `menu-atalhos-320-escuro-ja-depois.png`.
- Telas: `tour-390-escuro.png`, `bairro-390-escuro.png`, `album-390-escuro.png`, `concurso-erro-390-escuro.png`, `convite-erro-390-escuro.png`, `retro-erro-390-escuro.png`, `camarim-vip-390-escuro.png`.

As capturas feitas na conta real não foram versionadas, porque mostram apelidos de outros jogadores.

### Apenas inspecionado (sem defeito confirmado nesta rodada)

Zipper Shop, Encontro do dia, Passatempos (com as dicas da 3ª conferência), Fichinhas, Novidades, Procurar Idol e Meu mês com dados.

Observações menores, sem mudança:
- O Encontro do dia não tem `aria-labelledby`, e a Zipper Shop não leva o foco para dentro da janela (são de outros módulos).
- Procurar Idol começa com a tela vazia até alguém digitar.
- Em japonês, a 320 px, "プロフィール" e "アイドル検索" ainda quebram dentro da palavra em duas linhas, sem cortar texto.

### Não validado

- Convidar amigos e Lembrete na conta real (os motivos estão em "Como foi auditado").
- Votar, inscrever, resgatar e enviar recado com servidor real: só com RPC simulado.
- iPhone ou Android físicos: a largura de celular foi simulada e não equivale a um aparelho.
- Leitor de tela real.
- Zoom de 125% em larguras de celular.

### Testes

- `node tests/run-all.js`: 124/124, incluindo o novo `tests/menu-atalhos-conferencia.test.js`. Ele confere ícones únicos, nomes curtos nos 6 idiomas, colunas e última linha centralizada, tema escuro do Tour e do bairro, Álbum, estados de carregando e erro, foco do concurso, Recado, Camarim VIP e versões de cache.
- `tests/passatempos-refino.browser.cjs`: passou.
- Roteiros locais fora do repositório:
  - grade nos 6 idiomas em 3 larguras;
  - telas em 390 e 1440 px, claro e escuro;
  - falha de servidor no Concurso, Convite e Meu mês;
  - Recado sem envio com 1 letra e com envio único depois;
  - concurso com foco no título, voto preservando foco e rolagem, e Esc fechando.
- `tests/evolucao.browser.cjs` falha igual em `40ffc51` sem as mudanças (espera "Música da conta B" na vitrine). A falha não vem desta rodada e não foi investigada.

### Proposta registrada, não implementada: enxugar o Menu

Até 8 atalhos em duas linhas de 4:
- Zipper Shop, Álbum, Fichinhas, Procurar Idol, Encontro do dia, Passatempos, Vida no bairro e uma pasta "Comunidade" com Concurso, Convidar, Tour e Recado.

O restante iria para onde já faz sentido:
- Lembrete do show → Calendário, que já baixa .ics;
- Meu mês → Perfil / Esta semana;
- Novidades → Idol⭐News!;
- Instalar app → Ajustes.

Fica para a decisão da dona.

### Poda decidida pela dona (22/11, mesma rodada)

O Menu e o Início tinham voltado a acumular coisas repetidas. Com a escolha da dona entre as opções propostas:

- **Menu sem os 3 banners** (Center⭐Run!, Karaoke⭐Time!, Star⭐Gacha!). Eles já estão na porta Jogos do Início.
- **Menu com 8 atalhos:** Zipper Shop, Encontro do dia, Passatempos, Álbum, Procurar Idol, Fichinhas, Vida no bairro e a pasta **"Mais"**.
  - A pasta abre uma folha com Novidades, Tour de camarins, Concurso, Convidar amigos, Show de sábado, Meu mês (só no celular) e Recado ao trio. Trilha e Instalar entram quando aparecem.
  - Tocar num item fecha a pasta e abre a tela, e Esc também fecha a pasta.
  - O ponto de "novo" das Novidades aparece na pasta.
- **"Esta semana" saiu do Início** e foi para o Calendário, abaixo do dia escolhido (na coluna da direita no PC largo). Com isso, o show de sábado, a festa, o jogo da semana e a retrospectiva também passam a aparecer no celular.
- Continuam como estavam, por escolha da dona: o cartão "Seu perfil", o "Hoje", o link do mapa no Início e, no Menu, a caixa do Humor e a fileira de Idols online.
- Contagem de botões no Menu com conta simulada: 19 → 10 no celular e 18 → 10 no PC.
- Testes: `menu-atalhos-conferencia.test.js` cobre banners, os 7 + Mais e "Esta semana" no Calendário. O `celular-previa.test.js` recortava o Início até a função `banner()`, que saiu, e agora recorta até o marcador do Menu. Roteiro local da pasta: itens, foco no primeiro, fechar ao tocar e Esc.
- Capturas: `menu-podado-390-escuro.png`, `menu-pasta-mais-390-escuro.png`, `calendario-esta-semana-390-escuro.png` (dados simulados; o texto do show aparece incompleto porque o RPC simulado não manda a data).

### Revisão antes do merge (22/11)

- **Corrigido:** o Star⭐Gacha! não estava na lista de Jogos. A entrada dele no TsuPhone era o banner do Menu, que saiu na poda. Agora ele está na lista de Jogos, com um teste que impede a regressão.
- **Testes de navegador do CI rodados aqui:**
  - `telas.browser.cjs`: passou. Ele procurava Novidades no Menu, e agora também abre a pasta "Mais".
  - `evolucao.browser.cjs`: passou, 27 etapas. Ele já falhava em `40ffc51` por duas mudanças anteriores da própria PR (a vitrine na aba Perfil e o "Salvar" do Duo dentro de um menu), e o Gacha agora entra pela lista de Jogos. Os três roteiros foram atualizados.
  - `atalhos-calendario.browser.cjs`, `corrida.browser.cjs`, `i18n-visual.browser.cjs` e `passatempos-refino.browser.cjs`: passaram. O i18n-visual só avisa "TsuLirikaPati" igual ao português, o que é esperado.
  - Uma execução do `telas` em paralelo com outros dois testes falhou na posição do botão da estreia. Sozinho, ele passa: a falha veio da carga da máquina.
- **Não rodados aqui:** `admin-idol`, `profile-accessories`, os testes de Karaoke, `continuidade` (WebKit) e os testes de banco.

### Últimos acertos (22/11)

- Encontro do dia: a janela ganhou nome acessível (`aria-labelledby`), o ✕ ganhou o rótulo "Fechar" e o foco agora entra na janela ao abrir. Zipper Shop: foco no ✕ ao abrir, também com o rótulo "Fechar". Esc fecha as duas (conferido localmente).
- Japonês: as Fichinhas aparecem na grade como "プロフ", porque "プロフィール" quebrava em 320 px.
- `docs/RETOMADA.md` e o diário de novembro foram atualizados.
- Versões de cache: encontro-base.js 3 (encontro.js 4), shop.js 14 e tw-celular.js (mesma versão 72 da rodada, ainda não publicada).
