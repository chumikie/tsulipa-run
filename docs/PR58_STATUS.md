# PR #58 — Estado central e mapa de retomada

Documento de acompanhamento da PR #58 (`perf/karaoke-mobile-tile-occupancy` → `main`).

**Regra de trabalho:** continuar exclusivamente nesta PR. Não criar PR paralela, não alterar `main`, não fazer merge ou deploy, e não executar SQL no Supabase sem autorização específica do responsável.

**Último commit de código verificado:** `56c3182ac7811e9d75470f05f48fbce1b3fb0824` (01/11/2026, 17h09, Brasília).
**HEAD atual da branch ao atualizar este documento:** `38948812b8e5e2d517c8d9e37f9129938ca608b2` — commit exclusivamente documental.
**Estado da PR:** aberta, em Draft, não mesclada e marcada como mergeable. Base `main`: `983852cca2e5afc612dad6f77acc687b66a951f0`. Na consulta: 357 commits, 51 arquivos alterados, 5.127 adições e 987 remoções.
**CI do último HEAD de código:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), com `static-validation` e `postgres-center-run` aprovados.
**CI posterior do commit documental:** execução [#41345515468](https://github.com/chumikie/tsulipa-run/actions/runs/41345515468), também com os dois jobs aprovados. Esse commit altera somente este documento e não modifica o código do jogo.

---

## 1. Implementado no branch — presença confirmada no código

Esta seção confirma que a implementação está presente no código da PR. **Não significa, por si só, homologação visual ou aprovação em aparelho real.**

- Controlador compartilhado de ciclo de vida em `tw-motion-lifecycle.js`: pausa de animações e loops associados a componentes inativos; limpeza de gates, observers e listeners de iframes removidos ou substituídos.
- Primeira camada de renderização móvel limitada a 30 Hz em jogos e prévias, com simulação baseada em delta-time para preservar movimento e relógio musical.
- Otimizações de desenho e caches: ocupação do piso em buffer reutilizável, caches de cenário, paletas, sprites e buffers de aparência.
- Integrações de ciclo de vida, atualização e limpeza em `index.html`, Karaoke Time/Day, Sora Jump, Backstage Pet, Hub, Perfil/Estúdio, Gacha, Moon Duo e Encontro.
- Proteções contra respostas assíncronas obsoletas após troca de conta em fluxos de perfil, autenticação, jogos e sincronização.
- Recuperação de tickets do Karaoke: chave idempotente, resposta perdida, recarga, concorrência, retomada e isolamento por conta.
- Recuperação da confirmação de crédito do Center Run após resposta perdida, sem repetir a finalização da corrida.
- Correção do cache de paleta do Center Run que podia deixar a corrida em branco.
- Módulos de cabelo e acessórios: três cortes extras ondulados, três franjas extras, mecha que acompanha a franja, Marias presas, rabo em uma peça, arco-íris em mechas tingidas, quepe militar e presilha de estrela. O módulo compartilhado foi conectado também aos renderizadores próprios do Sora Jump (jogador e parceiros) e do Karaoke Day, preservando fallback legado no Karaoke Day.
- Karaoke mobile: controles de som/pausa/timing reposicionados; correção da pausa indevida do show quando o palco sai da viewport; rolagem ao palco no início da apresentação.
- Biblioteca compacta do Karaoke: abas Músicas/Vozes, três retratos reais do Tsu/Lirika/Pati, preservação dos áudios e recordes pessoais locais por música.
- Sala solo do Karaoke: até três figurantes em passeio simultâneo, cada um com faixa/destino próprios; conversas continuam limitadas ao par existente; homologação continua desativando a autonomia.
- Movimento do jogador no piso do Karaoke: toque inicia rota no chão; retorno automático ao microfone após cinco segundos; tentativa/ticket não é consultado nem admitido enquanto o jogador está longe do microfone.

## 2. Testes automatizados — evidência no GitHub Actions

**CI mais recente associado ao código:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), para o HEAD de código `56c3182a`. Os dois jobs terminaram com sucesso:

- `static-validation`: aprovado. Incluiu contratos de integração dos cabelos Sora/Karaoke Day, biblioteca compacta, recordes pessoais por música, movimento de três caminhantes e bloqueio do Karaoke fora do microfone, além das demais verificações do workflow.
- `postgres-center-run`: aprovado. Executou as integrações de Center Run e tickets em um serviço PostgreSQL temporário do CI.

**Execução posterior:** o commit documental `38948812` também disparou a execução [#41345515468](https://github.com/chumikie/tsulipa-run/actions/runs/41345515468), com ambos os jobs aprovados. O diff desse commit é apenas documental.

Limites desta evidência:

- O CI confirma os comandos automatizados executados naquele commit; não confirma a aparência final do jogo.
- Os testes de avatar exercitam contratos de integração e chamadas de desenho. Não substituem inspeção visual de todos os personagens, acessórios, tamanhos e prévias do editor.
- O teste de três caminhantes e retorno ao microfone verifica lógica/estado e contratos; não comprova colisões, composição visual ou experiência de toque em celular.
- O teste de recordes pessoais valida isolamento por conta, faixa e migração local; não comprova reprodução real de áudio nem sincronização entre dispositivos. O histórico permanece local.
- O job PostgreSQL usa banco temporário do CI. Não representa acesso ou teste ao Supabase de produção.
- A execução local histórica de 33/33 testes Node ocorreu em HEAD anterior (`47b1c8a` conforme registro anterior); não atribuir esse resultado ao HEAD `56c3182a`.
- O commit `76ba9e55` registra verificação em Chromium a 390×844 e 1280×900 para a regressão de pausa mobile. É uma verificação de navegador relatada pelo autor do commit, não teste em celular físico.
- A revisão visual headless 420×900 sem login, registrada anteriormente, foi parcial e não cobriu Perfil completo nem Karaoke autenticado.

**Nesta retomada não foram executados testes locais, inspeção visual nova em navegador nem testes em aparelhos físicos.** Não confundir o CI verde com homologação visual ou física.

## 3. Homologação, pendências e fila de retomada

### 3.1. Personagens — integração de renderizadores feita; homologação visual pendente

- Os módulos `tw-avatar-hair.js` e `tw-avatar-items.js` são carregados por `index.html`/Perfil/Center Run e Karaoke Time. `sora-jump.html` também carrega ambos: jogador e parceiros usam as novas camadas compartilhadas, preservando identidades distintas. O Sora restaura o acessório salvo em `brs48cr_acc`.
- `karaoke-day.html`, com seu próprio `desenharIdol` e uso no controlador de prévias/Hub, também carrega `tw-avatar-hair.js` e compartilha as camadas de base, topo, franja, bicolor e mecha. As formas antigas permanecem como fallback.
- Os testes automatizados verificam contratos de integração e chamadas simuladas de Canvas. Isso comprova presença/uso das camadas no código, não a aparência final em tela.
- O relatório visual anterior foi feito em navegador headless, viewport 420×900, sem login, e cobriu apenas parte das telas. Perfil completo e Karaoke autenticado continuam pendentes.
- **Boneco aparecendo careca:** tratar como investigação de perda/ausência visual da base do cabelo, não como autorização para criar uma opção selecionável chamada `Careca`. A branch histórica `feat/avatar-careca-capitao-estrela` contém teste que mantém essa opção fora do menu. A causa do boneco aparecer sem cabelo ainda precisa ser localizada no personagem/renderizador em que ocorre.
- Falta inspeção visual das bases traseira/superior, franjas, acessórios e aparência em personagens masculinos/femininos, parceiros, Perfil, Estúdio, Hub, Center Run, Karaoke Time, Sora, Karaoke Day e prévias do editor.

Status: **integração dos módulos e testes automatizados concluídos; investigação da ausência da base e homologação visual pendentes**.

### 3.2. Experiência musical do Karaoke — implementação integrada; QA visual/áudio pendente

Pedido do responsável: substituir a Vitrine sonora extensa por três controles compactos com as cabeças do Tsu, Lirika e Pati, preservando a reprodução das vozes; reorganizar as faixas em uma biblioteca compacta/selecionável como Novidades; mostrar a melhor nota pessoal por música, sem ranking compartilhado.

**Código presente no HEAD de código `56c3182a`:**

- A Vitrine sonora longa foi substituída por uma biblioteca compacta dentro do mesmo `ktAudioLibrary`, com abas **Músicas** e **Vozes**.
- A aba Músicas apresenta as sete faixas existentes e o recorde pessoal de cada faixa. Selecionar uma faixa altera o seletor original `#ktSong`; não inicia show, não consome tentativa e não faz débito.
- A aba Vozes apresenta três botões com os retratos reais do Tsu, Lirika e Pati, desenhados por `KaraokeAvatar.draw`. Tocar numa cabeça reproduz a primeira voz daquele personagem e abre as outras falas.
- Os 15 MP3 do trio e o áudio especial do Encontro permanecem no repositório e continuam usando um único player, lazy load, respeito ao mute e limpeza ao terminar, ocultar a página ou sair.
- `KaraokeShowRules` mantém `personalSongs[accountId][songKey]` no armazenamento local existente `kt_showcase_week_v1`. A melhor pontuação por faixa é separada por conta e música e persiste além da virada semanal. O ranking semanal compartilhado não recebe esses dados.
- A migração do save v1 acrescenta `personalSongs` quando ausente, preservando ranking semanal antigo, tentativas e partidas pendentes. Não houve alteração de Supabase nem RPC para esses recordes.
- O histórico pessoal fica **neste aparelho/neste armazenamento local**; não é sincronizado entre dispositivos nem publicado como ranking compartilhado.
- Foi acrescentado `tests/karaoke-personal-song-records.test.js`, cobrindo isolamento por conta, recorde por faixa, persistência semanal, migração de save antigo e rejeição de resultado inválido. `tests/karaoke-mobile-performance.test.js` também protege a estrutura compacta, as três cabeças, os sete espaços de recorde e o contrato de reprodução existente.

**Histórico do protótipo do Claude:** `library.html`, `library.css` e `library.js` apareceram como arquivos criados no scratchpad local, mas não foram encontrados no GitHub. Não há confirmação de que o comando da sessão tenha terminado. A implementação equivalente foi concluída diretamente em `karaoke-time.html`; não afirmar que os arquivos temporários foram recuperados.

**CI de código:** execução [#41344644714](https://github.com/chumikie/tsulipa-run/actions/runs/41344644714), associada ao HEAD `d88d5b7a`, aprovou os testes de recordes pessoais e da biblioteca compacta. A execução posterior [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721) também passou com os testes posteriores integrados.

**Ainda pendente:** reprodução e navegação visual em navegador com áudio habilitado; conferir o recorte/tamanho das três cabeças no desktop e no celular; testar troca de música, iniciar show, completar partida e observar recorde atualizar; conferir persistência após recarregar e trocar de conta. CI não é prova de reprodução de áudio nem homologação visual/física.

Status: **implementação e testes automatizados integrados; homologação visual e de áudio pendente**.

### 3.3. Plateia autônoma e movimento do jogador — implementação integrada; homologação visual pendente

**Plateia autônoma:**

- O controlador singular `krLoungeActor` foi substituído por `krLoungeActors`, uma lista com limite explícito de três personagens em passeio simultâneo.
- Cada caminhante tem rota, faixa de piso e destino próprios. As três faixas são escolhidas sem duplicação; os pontos de parada são mantidos separados para reduzir cruzamentos/convergência.
- A rotina avança todos os caminhantes no mesmo loop e usa o mesmo `krFrameDelta`; não cria RAF, timer ou intervalo independente por Idol.
- Quem assume o microfone, recebe item/lanche, dança ou entra em estado incompatível deixa de passear e retorna ao assento quando necessário.
- Conversas/aplausos continuam limitados ao par existente. A existência de até três caminhantes não transforma conversas em grupos maiores.
- `krLoungeSoloPermitido()` continua desligando o comportamento autônomo durante homologação/conexão de homologação. Não foi criado modo online de sala.

**Movimento do jogador:**

- O planejador `krPlanearDestino(px,py)`, que já existia sem chamada, agora é chamado quando o jogador toca uma área livre do chão. Objetos/interações de cena e pistas de ritmo continuam tendo prioridade.
- O movimento permanece no piso/corredor permitido, contorna a área central do palco e usa o loop existente com delta-time.
- Depois de cinco segundos desde o último toque de destino, o relógio lógico programa o retorno pela lateral até o microfone fixo (`480,286`). O temporizador usa 300 quadros lógicos a 60 Hz e fica suspenso quando a sala/página está inativa.
- O pedestal do microfone fica fixo no palco e deixa de acompanhar o personagem enquanto ele caminha.
- `ktFlow.request()` verifica a posição do jogador antes de consultar tentativas/quota ou iniciar a confirmação de ticket. Se estiver longe, mostra o aviso e manda o personagem retornar; não abre a confirmação nem admite/debita uma partida.

**Proteções automatizadas:**

- `tests/karaoke-lounge-movement.test.js`: três caminhantes simultâneos, lanes/destinos distintos, atualização independente, prioridade do cantor, limpeza em homologação, toque no piso, rota de retorno e gate de posição.
- `tests/karaoke-flow.test.js`: jogador longe do microfone recebe aviso/retorno e não chega à consulta de quota/admissão.
- O workflow inclui esses contratos nos caminhos de pull request/push e em `static-validation`.

**CI de código:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), associada ao HEAD `56c3182a`, aprovou `static-validation` e `postgres-center-run`. O log estático registra explicitamente o teste de três caminhantes/retorno e o fluxo de bloqueio do microfone.

**Ainda pendente:** inspeção visual dos três Idols no palco real, colisões/oclusões em diferentes formações e viewports, toque em celular físico, retorno após uma partida real e legibilidade da sala sem esconder detalhes dos personagens. Os testes atuais são de lógica/contrato, não homologação visual nem teste físico.

Status: **implementação e testes automatizados integrados; homologação visual, de toque e em aparelhos pendente**.

### 3.4. Desempenho e apresentação

- A camada de 30 Hz e os contratos automatizados estão no código, mas não há medição de desempenho em celulares físicos nesta retomada.
- O controlador usa `render30Due` para limitar a pintura visual em dispositivos móveis e `frameDelta` para manter a simulação independente da frequência de desenho.
- Permanecem pendentes a inspeção dos loops secundários, a faixa de visitantes/Idols e a apresentação dos rankings de Karaoke.
- Não remover animações, reações, acessórios, detalhes ou efeitos para reduzir custo. Primeiro identificar o trabalho que pode ser pausado quando não está visível e medir o que realmente consome recursos.

### 3.5. Itens adicionais, separados dos pedidos acima

- A ideia de transformar o terceiro quadro em seletor com top 3 mensal por música é um ranking compartilhado diferente do histórico pessoal solicitado no item 3.2. Depende de desenho de dados e decisão específica no Supabase; não confundir as duas funcionalidades.
- Lupa de palco, itens clicáveis da mesa e glitter adicional permanecem ideias futuras, não parte da conclusão das frentes principais.

### 3.6. Verificações visuais e de uso real ainda necessárias

- O commit `76ba9e55` registra verificação em Chromium a 390×844 e 1280×900 para a regressão de pausa mobile. É verificação de navegador relatada pelo autor do commit, não homologação em celular físico.
- A revisão visual headless 420×900 sem login, registrada anteriormente, foi parcial e não cobriu Perfil completo nem Karaoke autenticado.
- As integrações recentes de Sora/Karaoke Day, biblioteca musical e movimento da sala têm confirmação automatizada de código; não foi realizada inspeção visual dessas mudanças nesta retomada.
- Não há evidência nesta auditoria de homologação em Android/iOS físico, fluxo autenticado Google completo no Perfil/Karaoke, inspeção de todos os renderizadores/parceiros/prévias do editor, ou sessões longas observando todas as animações.

### 3.7. Correções de inconsistências do mapa

Registros antigos que diziam que o quepe/estrela ainda não estavam implementados, que o redesenho dos cabelos aguardava implementação ou que a pausa mobile seguia sem correção estavam desatualizados. O código e os commits posteriores confirmam essas implementações/correções; o que permanece pendente é a homologação visual e em aparelhos, não a ausência dos respectivos módulos.

A fila de retomada permanece: (0) mapa e evidências; (1) localizar a ausência da base do cabelo/boneco careca e homologar renderizadores; (2) homologar experiência musical; (3) homologar visualmente plateia/movimento; (4) verificar desempenho em aparelhos físicos; (5) revisão integral antes de qualquer decisão de merge.

## 4. Branches avaliadas

Inventário registrado na auditoria anterior: 53 branches além da PR. Método: commits exclusivos (`git rev-list`), equivalência de patch (`git cherry`), presença na PR das linhas adicionadas e busca de funções/identificadores no código. **Divergência de commits não significa funcionalidade ausente**: várias correções foram reescritas na PR com outros arquivos. Esta lista é o inventário documentado da auditoria anterior, não uma nova verificação de todas as branches nesta atualização.

### A. Já contidas na `main` (38) — nada a recuperar

Todos os commits destas branches já estavam na `main` de produção na auditoria anterior (e, portanto, também na PR):

ajustes-v213, ajustes-vitrine, chore/karaoke-estreia-08-11-2026, encontro-cena, encontro-dupla-trio, encontro-por-conta, engavetado/karaoke-day, feat/pet-sync-admin-20261030, feature/karaoke-time, feature/sora-jump-karaoke-hub-v21, fix/backstage-pet-sync-main-2026-10-30, fix/cards-hub, fix/center-run-botao-deslizar-30-10, fix/karaoke-placar-rotativo, fix/kt-ritmo-relogio, fix/mic-cd-popup-and-encounter-no-rank-2026-10-30, fix/perfil-foto-sem-slide-2026-10-30, gacha-cards, icone-topo, janelas-na-inicial, lancamento/30-10, main, moderacao-contas, moderacao-livre, moon-duo-abas, musicas-gacha-duo, musicas-temas, novidades, og-zipper-icone, og/karaoke-time, privacidade-og, release/index2-lancamento, test/karaoke-reuse-anonymous-session, titulo-world, traducoes-dicas, v2-1-2, vitrine-lugar, vitrine-reacao.

### B. Commits exclusivos, funcionalidade já presente na PR (10)

| Branch | Onde está na PR |
|---|---|
| feat/karaoke-ticket-inventory-ui | Patch equivalente já aplicado (placar rotativo do telão). |
| login-google-espacos | Todas as linhas já presentes. |
| feature/sora-jump-ranking-online | Versão anterior; ranking online ativo, `sora_run_start/finish/abort` e abas Semana/Geral já existem. |
| fix/sora-online-profile-tv | SQL e `sora-jump.html` idênticos; diferenças em `index.html` são textos antigos substituídos. |
| feature/sora-karaoke-v2-2026-10-29 | O texto do Google já saiu do botão do Gacha ("🎰 Girar!"); diferença apenas cosmética. |
| fix/karaoke-ticket-recovery | Reescrita na PR (`karaoke-tickets.js`, `karaoke-time.html`) com teste próprio. |
| fix/center-run-credit-recovery | Reescrita na PR com teste próprio. |
| feat/avatar-careca-capitao-estrela | Capitão, estrela e 3 cortes ondulados trazidos para `tw-avatar-items.js` / `tw-avatar-hair.js`. A opção careca foi removida pela própria branch; investigar a ausência da base visual sem reintroduzir opção de menu não solicitada. |
| sem-online-historico | Botão "Não funcionou? Entrar de outro jeito" (`gisAntigo`, login Google por redirecionamento) já está na `main` e na PR; só muda a classe do botão de fechar. |
| feat/backstage-admin-single-owner | Documentação e testes presentes; bloco Sora⭐Jump da proposta SQL do perfil admin permanece item separado para avaliação no Supabase. |

Estas 10 já têm o conteúdo na PR; as que dependem da PR só entram na `main` quando a PR #58 for aprovada. Até lá, a PR é o lugar onde esse trabalho está preservado.

### C. Descartadas ou adiadas (4)

| Branch | Motivo |
|---|---|
| feature/karaoke-cd-player-popup | A moldura de CD foi removida de propósito na `main` (commit `f3db9aa`, "Remove unwanted Karaoke Time CD popup shell"). |
| recovery/restore-embedded-karaoke | Altera `sora-jump-karaoke.html`, que não existe mais; o Karaoke atual é `karaoke-time.html`. |
| chumikie-refatoracao-repositorio | Ensaio de Karaoke online/multijogador (SQL lab 3a11/3a12), contrário à regra do Karaoke solo. **Adiado**: lint (`tools/lint`) e testes `static-links` / `index-critical-flows` podem ser reaproveitados depois. |
| sql/ranking-abertura | Apenas SQL, marcado como já aplicado em produção; responsabilidade do Supabase. |

### D. Funcionalidade ausente avaliada (1)

| Branch | Decisão |
|---|---|
| feature/encontro-dia-duo-trio-profiles | **Descartada.** Regra do responsável: no Encontro solo aparecem ranking e Oshi; na Dupla (terça) e no Trio (sexta), não. A PR já faz isso (`index.html` `encMostrar` + `tw-mic-cd-popup.css`: `.encp.enc-grupo #encRk, #encSelo, #encOshi { display:none }`). A branch acrescentaria ranking/Oshi por membro do grupo, o oposto do desejado. |

## 5. Alterações recuperadas de outras branches

- `feat/avatar-careca-capitao-estrela` → chapéu de Capitão, estrela, três cortes ondulados.
- `fix/karaoke-ticket-recovery` → recuperação de tickets (reescrita).
- `fix/center-run-credit-recovery` → reconciliação de crédito (reescrita).

## 6. Testes e CI — histórico com escopo explícito

- **Último HEAD de código:** `56c3182ac7811e9d75470f05f48fbce1b3fb0824`.
- **CI desse HEAD:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), workflow `Check TsuLiPa special games`, evento `pull_request`, concluída em 01/11/2026.
- Jobs: `static-validation` = **success**; `postgres-center-run` = **success**.
- O job estático inclui os testes de integração dos cabelos Sora/Karaoke Day, recordes pessoais por música, biblioteca compacta, três caminhantes, retorno ao microfone e bloqueio de início fora do microfone, além das verificações anteriores do workflow.
- O job PostgreSQL usa serviço temporário no CI e executa integrações isoladas de Center Run e tickets. Não representa acesso ou teste ao Supabase de produção.
- A execução local histórica de 33/33 testes Node ocorreu em HEAD anterior (`47b1c8a`); não atribuir esse resultado ao HEAD atual.
- O commit `76ba9e55` registra verificação em Chromium a 390×844 e 1280×900 para a regressão de pausa mobile. É verificação de navegador relatada pelo autor do commit, não homologação em celular físico.
- A revisão visual headless 420×900 sem login, registrada anteriormente, foi parcial e não cobriu Perfil completo nem Karaoke autenticado.
- A atualização documental mais recente da branch (commit `38948812`) também teve execução [#41345515468](https://github.com/chumikie/tsulipa-run/actions/runs/41345515468) com os dois jobs aprovados; ela não modifica o código do jogo.
- **Nesta reconstrução deste documento não foram executados testes locais, visuais, de navegador ou em aparelhos.** Não confundir CI verde com homologação visual ou física.

## 7. Supabase — estado registrado e bloqueios

Nenhuma alteração de Supabase foi executada nesta retomada. Os dados abaixo reproduzem o estado documentado na investigação de 01/11/2026; não representam uma nova consulta ao banco nesta atualização.

- Projeto registrado no histórico: `fsggtvgbyhchblyazgmt`.
- `20261031151827_karaoke_tickets_extra_shows_inventory_gacha`: consta no registro anterior como aplicada.
- A investigação anterior registrou `public.terminar_corrida` em produção com teto de 1.500 estrelas/dia. Confirmar por leitura no momento de uma futura revisão autorizada antes de tomar decisão.
- A proposta de 100 estrelas/dia por conta (`America/Sao_Paulo`) está em `supabase/migrations/20261101161409_center_run_daily_100.sql`, com checklist, runbook e SQL de rollback em `supabase/sql/`. Foi homologada em PostgreSQL isolado; **não foi aplicada em produção** e depende de autorização específica.
- A documentação da proposta registra um ponto de UX ainda a decidir: em um cenário de crédito parcial (por exemplo, 90 já recebidas e pedido de 30), a função credita apenas 10, mas o campo `limite_diario` pode continuar falso porque o teto foi alcançado durante essa corrida. Não alterar o contrato sem decisão explícita; definir a mensagem para crédito parcial + limite antes de qualquer aplicação.
- A homologação temporal isolada usa relógio controlado apenas no PostgreSQL efêmero. A documentação também registra que a fixture de teste do Pet deve usar o motivo real `minijogo` em vez de motivo fictício antes de tratá-la como espelho exato da regra do Pet.
- Preservar o limite independente de 50 estrelas/dia dos minijogos do Pet.
- Não apagar nem resetar saldos, históricos, corridas ou rankings.
- O bloco Sora⭐Jump da proposta `admin_player_profile_proposal.sql` continua como item separado para avaliação.
- Relatório de leitura e conferência do Supabase permanece pendente.

**Bloqueio:** não executar `supabase db push`, `supabase migration up`, SQL manual, alteração de função, alteração de saldo ou operação destrutiva sem autorização específica do responsável.

## 8. Checklist para aprovação final

### Mapa e código
- [x] Reconfirmar PR #58 aberta, Draft, sem merge e branch de trabalho exclusiva.
- [x] Reconstruir o mapa de status e separar o commit de código do commit documental.
- [x] Registrar as evidências automatizadas sem classificá-las como homologação visual/física.
- [x] Registrar que os arquivos temporários do scratchpad do Claude não foram localizados; a funcionalidade equivalente foi implementada diretamente em `karaoke-time.html`.
- [ ] Fazer a revisão humana final do diff integral da PR e de todos os arquivos sensíveis.

### Personagens
- [ ] Investigar em que renderizador/personagem o boneco aparece careca e corrigir a perda da base do cabelo; não criar opção de menu `Careca` sem decisão específica.
- [x] Conectar as camadas compartilhadas de cabelo ao renderizador do Sora Jump (jogador e parceiros) e ao renderizador do Karaoke Day, mantendo os fallbacks antigos.
- [ ] Conferir visualmente a base dos cabelos e todas as camadas em personagens masculinos/femininos, parceiros e renderizadores alternativos.
- [ ] Conferir visualmente cortes, franjas, mecha, Marias, rabo, quepe e presilha em Perfil, Estúdio, Hub, Center Run, Karaoke Time, Sora e Karaoke Day.

### Karaoke — experiência musical
- [x] Substituir a Vitrine extensa por abas compactas de Músicas e Vozes, mantendo os 15 MP3 do trio e o áudio do Encontro.
- [x] Criar três botões com cabeças reais e reprodução das vozes do Tsu, Lirika e Pati.
- [x] Criar cartões das sete faixas e seleção pelo seletor existente.
- [x] Implementar recorde pessoal por conta/faixa em armazenamento local, com migração compatível de saves v1 e sem ranking compartilhado.
- [x] Proteger lógica e estrutura da biblioteca com testes automatizados no CI.
- [ ] Homologar navegação, reprodução de áudio, pontuação e atualização dos recordes visualmente no navegador e em celular físico.

### Karaoke — plateia e movimento
- [x] Permitir até três figurantes caminhando simultaneamente, com lanes/destinos independentes e prioridade de cantor.
- [x] Conectar o toque no piso ao planejador de movimento do jogador, preservando interações da cena e pistas de ritmo.
- [x] Fazer o jogador retornar ao microfone após cinco segundos longe, usando o relógio lógico da sala.
- [x] Exigir posição correta no microfone para iniciar; bloquear antes da consulta de tentativa/ticket quando o jogador está longe.
- [x] Preservar o gate solo/offline e desligar a autonomia durante homologação.
- [ ] Homologar visualmente três caminhantes simultâneos, rotas, oclusões e composição da sala.
- [ ] Testar toque no piso, retorno automático e início pelo microfone em celular físico.

### Desempenho e homologação
- [ ] Investigar faixa de visitantes e apresentação dos rankings de Karaoke.
- [ ] Revisar loops secundários e cadência em 30/60 Hz sem retirar animações ou detalhes.
- [ ] Testar em celulares físicos; registrar aparelho, viewport, cenário e resultado.
- [ ] Fazer homologação autenticada de Perfil, Karaoke, tickets e avatares.
- [ ] Registrar separadamente teste estático/unitário, CI PostgreSQL isolado, verificação Chromium/headless e homologação física.

### Banco, CI e revisão final
- [x] CI do HEAD de código `56c3182a` aprovado nos dois jobs reportados.
- [x] Execução posterior de CI do commit documental `38948812` também aprovada nos dois jobs.
- [ ] Fazer leitura autorizada do Supabase e conferir estado efetivo antes de qualquer proposta de mudança.
- [ ] Decidir separadamente sobre o teto de 100 estrelas/dia; não aplicar sem autorização específica.
- [ ] Revisar diff completo da PR, possíveis regressões, arquivos SQL, redirects, workflows e compatibilidade.
- [ ] Revisão humana final do responsável.
- [ ] Merge somente após autorização explícita.
- [ ] Arquivar branches antigas somente após merge autorizado e autorização específica.
