# PR #58 — Estado central e mapa de retomada

Documento de acompanhamento da PR #58 (`perf/karaoke-mobile-tile-occupancy` → `main`).

**Regra de trabalho:** continuar exclusivamente nesta PR. Não criar PR paralela, não alterar `main`, não fazer merge ou deploy, e não executar SQL no Supabase sem autorização específica do responsável.

**Snapshot do código auditado:** 01/11/2026, 17h09 (Brasília) — último commit de código verificado: `56c3182ac7811e9d75470f05f48fbce1b3fb0824`.
**Estado da PR na consulta:** aberta, em Draft, não mesclada e marcada como mergeable. Base `main`: `983852cca2e5afc612dad6f77acc687b66a951f0`. A PR tinha 356 commits, 51 arquivos alterados, 5.107 adições e 987 remoções.
**CI associado ao HEAD de código:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), com `static-validation` e `postgres-center-run` aprovados. O documento pode receber commits documentais posteriores sem alterar o código auditado.

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
- Karaoke mobile:
- Karaoke mobile: controles de som/pausa/timing reposicionados; correção da pausa indevida do show quando o palco sai da viewport; rolagem ao palco no início da apresentação.
- Sala solo do Karaoke: existe passeio autônomo de figurante, interações sociais entre dois figurantes, reações, itens e visitas de pets. A limitação atual — somente um passeio autônomo por vez — está descrita na seção 3.3.

## 2. Testes automatizados — evidência no GitHub Actions

**Último CI de código consultado:** workflow `Check TsuLiPa special games`, execução [#41343692142](https://github.com/chumikie/tsulipa-run/actions/runs/41343692142), associado exatamente ao HEAD `6fb427a9`. Os dois jobs terminaram com sucesso:

- `static-validation`: aprovado. Incluiu `tests/avatar-hair.test.js` (módulo compartilhado no Sora e Karaoke Day), `tests/avatar-items.test.js` (chapéu/estrela no Sora e restauração do acessório salvo), além das demais verificações estáticas.
- `postgres-center-run`: aprovado. Executou as integrações PostgreSQL isoladas do Center Run e dos tickets.

Histórico da correção: as execuções #41343606339 e #41343621330 falharam em `tests/karaoke-homol-view.test.js:58`, pois a substituição do retângulo da mecha deixou de preservar a guarda de cor hexadecimal que o teste protegia. O código manteve a nova mecha compartilhada e restaurou a guarda `c.streak && cor hexadecimal válida`; a execução posterior #41343692142 passou nos dois jobs.

Entre as verificações incluídas no workflow estão testes de cabelos, acessórios, recuperação de crédito, paleta do Center Run, ciclo de visibilidade, regressão de pausa do Karaoke, recuperação de tickets, fluxos de ritmo, sincronização do Pet e estabilidade do Sora.

O job PostgreSQL usa banco temporário/isolado do CI e cobre os fluxos de Center Run e tickets. **Isso não é execução nem homologação no banco de produção.**

Limites desta evidência:

- O resultado verde confirma os comandos automatizados executados pelo workflow naquele HEAD.
- Os testes de avatar exercitam contratos de integração e chamadas de desenho: agora cobrem as camadas compartilhadas em Perfil/Center Run, Karaoke Time, Sora (jogador e parceiros) e Karaoke Day. Não substituem inspeção visual de todos os personagens, acessórios, tamanhos e prévias do editor.
- O teste de pausa do Karaoke protege condições de visibilidade e o comportamento codificado; não comprova funcionamento em todos os celulares físicos.
- Não encontrei teste específico para três figurantes caminharem simultaneamente, retorno do personagem do jogador ao microfone ou histórico pessoal por música.
- A execução local antiga de 33/33 testes, registrada no histórico da PR, pertence a um HEAD anterior e não deve ser apresentada como teste local do HEAD `76ba9e55`.

**Nesta atualização documental não foram executados testes locais, testes de navegador ou testes em aparelhos.** Como o commit desta atualização altera apenas `docs/PR58_STATUS.md`, o workflow com filtro de caminhos de código não deve ser interpretado como uma nova execução de CI para este commit documental.

## 3. Homologação, pendências e fila de retomada

### 3.1. Personagens — implementação presente, homologação visual incompleta

- Os módulos `tw-avatar-hair.js` e `tw-avatar-items.js` são carregados por `index.html`/Perfil/Center Run e Karaoke Time. Nesta retomada, `sora-jump.html` também passou a carregar ambos: o jogador usa o visual salvo; os parceiros continuam usando o próprio personagem e compartilham as novas camadas de cabelo. O Sora restaura `brs48cr_acc` antes do desenho, e o teste agora protege esse caminho.
- `karaoke-day.html`, que tem seu próprio `desenharIdol` e é usado pelo controlador de prévias/Hub, também passou a carregar `tw-avatar-hair.js` e usar as camadas compartilhadas de base, topo, franja, bicolor e mecha. As formas antigas permanecem como fallback; a guarda de cor válida da mecha foi preservada.
- Os testes automatizados verificam contratos de integração e chamadas simuladas de Canvas para esses caminhos. Isso comprova presença/uso das camadas no código, não a aparência final em tela.
- O relatório visual anterior foi feito em navegador headless, viewport 420×900, sem login, e cobriu apenas parte das telas. Perfil completo e Karaoke autenticado continuam pendentes.
- **Boneco aparecendo careca:** tratar como investigação de perda/ausência visual da base do cabelo, não como autorização para criar uma opção selecionável chamada `Careca`. A branch histórica `feat/avatar-careca-capitao-estrela` contém um teste que explicitamente mantém essa opção fora do menu; a causa do boneco aparecer sem cabelo ainda precisa ser localizada e corrigida onde ocorrer.
- Falta inspeção visual das bases traseira/superior, franjas, acessórios e aparência em personagens masculinos/femininos, parceiros, Perfil, Estúdio, Hub, Center Run, Karaoke Time, Sora, Karaoke Day e prévias do editor.

### 3.2. Experiência musical do Karaoke — implementação integrada; QA visual pendente

Pedido do responsável: substituir a Vitrine sonora extensa por três controles compactos com as cabeças do Tsu, Lirika e Pati, preservando a reprodução das vozes; reorganizar as faixas do Karaoke em uma biblioteca compacta/selecionável como Novidades; mostrar a melhor nota pessoal por música, sem ranking compartilhado.

**Código presente no HEAD `d88d5b7a`:**

- A antiga Vitrine sonora longa foi substituída por uma biblioteca compacta dentro do mesmo `ktAudioLibrary`, com duas abas: **Músicas** e **Vozes**.
- A aba Músicas apresenta as sete faixas existentes e um espaço para o recorde pessoal de cada faixa. Selecionar uma faixa altera o seletor original `#ktSong`; não inicia show, não consome tentativa e não faz débito.
- A aba Vozes apresenta três botões com os retratos reais do Tsu, Lirika e Pati, desenhados pelo `KaraokeAvatar.draw`. Tocar numa cabeça reproduz a primeira voz daquele personagem e abre suas outras falas.
- Os 15 MP3 do trio e o áudio especial do Encontro permanecem no repositório e continuam usando um único player de reprodução, lazy load, respeito ao mute e limpeza ao terminar, esconder a aba ou sair da página.
- `KaraokeShowRules` agora mantém `personalSongs[accountId][songKey]` no armazenamento local existente `kt_showcase_week_v1`. A melhor pontuação por faixa é separada por conta e música, e persiste além da virada semanal. O ranking semanal compartilhado existente não recebe esses dados.
- A migração do save v1 acrescenta `personalSongs` quando ausente, preservando ranking semanal antigo, tentativas e partidas pendentes. Não houve alteração de Supabase nem RPC para esses recordes.
- O histórico pessoal fica **neste aparelho/neste armazenamento local**; não é sincronizado entre dispositivos nem publicado como ranking compartilhado.
- Foi acrescentado `tests/karaoke-personal-song-records.test.js`, cobrindo isolamento por conta, recorde por faixa, persistência semanal, migração de save antigo e rejeição de resultado inválido. `tests/karaoke-mobile-performance.test.js` também protege a estrutura compacta, as três cabeças, os sete espaços de recorde e o contrato de reprodução existente.

**Histórico do protótipo do Claude:** os nomes `library.html`, `library.css` e `library.js` apareceram como arquivos criados no scratchpad local, mas não foram encontrados no GitHub. Não há confirmação de que o comando da sessão tenha terminado. A implementação equivalente foi concluída diretamente em `karaoke-time.html`; não afirmar que os arquivos temporários foram recuperados.

**CI de código:** execução [#41344644714](https://github.com/chumikie/tsulipa-run/actions/runs/41344644714), associada ao HEAD `d88d5b7a`: `static-validation` e `postgres-center-run` aprovados. O novo teste pessoal por música e as asserções da biblioteca compacta passaram no job estático.

**Ainda pendente:** reprodução e navegação visual em navegador com áudio habilitado, conferir o recorte/tamanho das três cabeças no desktop e no celular, confirmar a experiência de trocar música e iniciar show, completar partidas reais e observar o recorde atualizar, além de conferir a persistência após recarregar e trocar de conta. O CI não é prova de reprodução de áudio nem de homologação visual/física.

Status: **implementação e testes automatizados integrados; homologação visual e de áudio pendente**.

### 3.3. Plateia autônoma e movimento do jogador — implementação integrada; homologação visual pendente

**Plateia autônoma:**

- O controlador singular `krLoungeActor` foi substituído por `krLoungeActors`, uma lista com limite explícito de três personagens em passeio simultâneo.
- Cada caminhante tem rota, faixa de piso e destino próprios. As três faixas são escolhidas sem duplicação; os pontos de parada são mantidos separados para reduzir cruzamentos/convergência.
- A rotina avança todos os caminhantes no mesmo loop já existente e usa o mesmo `krFrameDelta`; não cria RAF, timer ou intervalo independente por Idol.
- Quem assume o microfone, recebe item/lanche, dança ou entra em estado incompatível deixa de passear e retorna ao assento quando necessário.
- Conversas/aplausos continuam limitados ao par existente. A existência de até três caminhantes não transforma conversas em grupos maiores.
- A regra `krLoungeSoloPermitido()` continua desligando o comportamento autônomo na homologação/conexão de homologação. Não foi criado modo online de sala.

**Movimento do jogador:**

- O planejador de piso `krPlanearDestino(px,py)`, que já existia sem chamada, agora é chamado quando o jogador toca uma área livre do chão da sala. Os objetos/interações de cena e as pistas de ritmo continuam tendo prioridade.
- O movimento permanece no corredor/piso permitido, contorna a área central do palco e é conduzido pelo loop existente com delta-time.
- Depois de cinco segundos desde o último toque de destino, o relógio lógico da sala programa o retorno pela lateral até o ponto fixo do microfone (`480,286`). O temporizador usa 300 quadros lógicos a 60 Hz; como depende do relógio/loop da sala, fica suspenso quando a página/sala está inativa.
- O pedestal do microfone fica fixo no palco e deixa de acompanhar o personagem enquanto ele caminha.
- `ktFlow.request()` verifica a posição do jogador **antes** de consultar tentativas/quota ou iniciar a confirmação do ticket. Se estiver longe, mostra o aviso e manda o personagem retornar; não abre a confirmação nem admite/debita uma partida.

**Proteções automatizadas:**

- Novo `tests/karaoke-lounge-movement.test.js`: exercita três caminhantes simultâneos, lanes e destinos distintos, atualização independente, prioridade de cantor, limpeza ao entrar em homologação, toque no piso, rota de retorno e gate de posição.
- `tests/karaoke-flow.test.js` foi estendido para confirmar que um jogador longe do microfone recebe aviso/retorno e não chega à consulta de quota/admissão.
- O workflow agora inclui os novos contratos nos caminhos de pull request/push e no job `static-validation`.

**CI de código:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), associada ao HEAD `56c3182a`: `static-validation` e `postgres-center-run` aprovados. O log estático mostra explicitamente o novo teste de três caminhantes/retorno e o fluxo de bloqueio do microfone aprovados.

**Ainda pendente:** inspeção visual do movimento de três Idols no palco real, colisões/oclusões em diferentes formações e tamanhos de viewport, toque em celular físico, retorno após uma partida real, e confirmação de que a cena continua visualmente legível sem esconder os detalhes dos personagens. Os testes atuais são de lógica/contratos em CI; não são homologação visual nem teste físico.

Status: **implementação e testes automatizados integrados; homologação visual, de toque e em aparelhos pendente**.

### 3.4. Desempenho e apresentação

- A camada de 30 Hz e as verificações automatizadas estão no código, mas não há medição de desempenho em celulares físicos nesta auditoria.
- Permanecem pendentes a inspeção dos loops secundários, a faixa de visitantes/Idols e a apresentação dos rankings de Karaoke.
- Não remover animações, reações, acessórios, detalhes ou efeitos para reduzir custo. Primeiro identificar o trabalho que pode ser pausado quando não está visível e medir o que realmente consome recursos.

### 3.5. Itens adicionais, separados dos pedidos acima

- A ideia de transformar o terceiro quadro em seletor com top 3 mensal por música é um ranking compartilhado diferente do histórico pessoal solicitado no item 3.2. Depende de desenho de dados e decisão específica no Supabase; não confundir as duas funcionalidades.
- Lupa de palco, itens clicáveis da mesa e glitter adicional permanecem ideias futuras, não parte da conclusão das frentes principais.

### 3.6. Verificações visuais e de uso real ainda necessárias

O commit `76ba9e55` registra que a correção de pausa do Karaoke foi verificada em Chromium nos tamanhos 390×844 e 1280×900. Isso é uma verificação de navegador relatada no commit, não homologação em celulares físicos. Os commits `9093898`, `d180dbc` e `6fb427a` adicionaram integração compartilhada de cabelo no Sora e no Karaoke Day; os testes e o CI validam os contratos de código. Não foi realizada inspeção visual desses dois renderizadores nesta retomada.

O relatório anterior também registra uma inspeção headless 420×900 sem login. Não há evidência nesta auditoria de:

- homologação em aparelho Android/iOS físico;
- fluxo autenticado Google completo no Perfil e no Karaoke;
- inspeção de todos os renderizadores alternativos, parceiros e prévias do editor;
- teste visual de todas as animações durante sessões longas;
- validação da nova biblioteca musical ou das três caminhadas simultâneas, pois ainda não foram implementadas.

### 3.7. Correções de inconsistências deste documento

Registros antigos que diziam que o quepe/estrela ainda não estavam implementados, que o redesenho dos cabelos aguardava implementação ou que a pausa mobile seguia sem correção estavam desatualizados. O código e os commits posteriores confirmam essas implementações/correções; o que permanece pendente é a homologação visual e em aparelhos, não a ausência dos respectivos módulos.

A fila de retomada é: **(0) manter este mapa atualizado; (1) concluir a investigação do boneco que aparece careca e homologar visualmente a base do cabelo nos renderizadores conectados; (2) recuperar o protótipo e concluir a experiência musical; (3) concluir a plateia autônoma e o movimento do jogador; (4) homologar desempenho em aparelhos físicos; (5) fazer revisão integral da PR antes de qualquer decisão de merge.**

## 4. Branches avaliadas

Total: 53 branches além da PR. Método: commits exclusivos (`git rev-list`), equivalência de patch (`git cherry`), presença na PR das linhas adicionadas e busca de funções/identificadores no código. **Divergência de commits não significa funcionalidade ausente**: várias correções foram reescritas na PR com outros arquivos.

### A. Já contidas na `main` (38) — nada a recuperar

Todos os commits destas branches já estão na `main` de produção (e, portanto, também na PR):

ajustes-v213, ajustes-vitrine, chore/karaoke-estreia-08-11-2026, encontro-cena, encontro-dupla-trio, encontro-por-conta, engavetado/karaoke-day, feat/pet-sync-admin-20261030, feature/karaoke-time, feature/sora-jump-karaoke-hub-v21, fix/backstage-pet-sync-main-2026-10-30, fix/cards-hub, fix/center-run-botao-deslizar-30-10, fix/karaoke-placar-rotativo, fix/kt-ritmo-relogio, fix/mic-cd-popup-and-encounter-no-rank-2026-10-30, fix/perfil-foto-sem-slide-2026-10-30, gacha-cards, icone-topo, janelas-na-inicial, lancamento/30-10, main, moderacao-contas, moderacao-livre, moon-duo-abas, musicas-gacha-duo, musicas-temas, novidades, og-zipper-icone, og/karaoke-time, privacidade-og, release/index2-lancamento, test/karaoke-reuse-anonymous-session, titulo-world, traducoes-dicas, v2-1-2, vitrine-lugar, vitrine-reacao.

### B. Commits exclusivos, funcionalidade já presente na PR (10)

| Branch | Onde está na PR |
|---|---|
| feat/karaoke-ticket-inventory-ui | Patch equivalente já aplicado (placar rotativo do telão). |
| login-google-espacos | Todas as linhas já presentes. |
| feature/sora-jump-ranking-online | Versão anterior; ranking online ativo, `sora_run_start/finish/abort` e abas Semana/Geral já existem. |
| fix/sora-online-profile-tv | SQL e `sora-jump.html` idênticos; diferenças em `index.html` são textos antigos substituídos. |
| feature/sora-karaoke-v2-2026-10-29 | O texto do Google já saiu do botão do Gacha ("🎰 Girar!"); diferença apenas cosmética. |
| fix/karaoke-ticket-recovery | Ree## 6. Testes e CI — histórico com escopo explícito

- **HEAD de código auditado:** `56c3182ac7811e9d75470f05f48fbce1b3fb0824`.
- **CI mais recente consultado para esse HEAD:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), workflow `Check TsuLiPa special games`, evento `pull_request`, concluída em 01/11/2026.
- Jobs: `static-validation` = **success**; `postgres-center-run` = **success**.
- O job estático inclui os testes de integração dos cabelos Sora/Karaoke Day, o teste de recordes pessoais por música, as verificações da biblioteca compacta, `tests/karaoke-lounge-movement.test.js` e o fluxo de bloqueio no microfone em `tests/karaoke-flow.test.js`, além das verificações anteriores listadas em `.github/workflows/validate-games.yml`.
- O log do job estático registra: biblioteca musical/recordes pessoais aprovados; confirmação do Karaoke com bloqueio por posição aprovada; teste de três caminhantes simultâneos, lanes/destinos distintos, prioridade do cantor, isolamento de homologação, toque no piso, retorno de cinco segundos e início apenas no microfone aprovado.
- O job PostgreSQL usa serviço temporário no CI e executa integrações isoladas de Center Run e tickets. Não representa acesso ou teste ao Supabase de produção.
- A execução local histórica de 33/33 testes Node ocorreu em HEAD anterior (`47b1c8a` conforme registro anterior); não atribuir esse resultado ao HEAD `56c3182a`.
- O commit `76ba9e55` registra verificação em Chromium a 390×844 e 1280×900 para a regressão de pausa mobile. Tratar como validação de navegador relatada pelo autor do commit; não equivale a teste em celular físico. As integrações recentes do Sora/Karaoke Day, a nova biblioteca musical e o movimento da sala têm confirmação automatizada de código, mas não inspeção visual nesta retomada.
- A revisão visual headless 420×900 sem login, registrada anteriormente, foi parcial e não cobriu Perfil completo nem Karaoke autenticado.
- **Nesta atualização do mapa não foram executados testes locais, visuais, de navegador ou em aparelhos.** O commit deste documento não deve ser apresentado como nova validação do código.

| feature/encontro-dia-duo-trio-profiles | **Descartada.** Regra do responsável: no Encontro solo aparecem ranking e Oshi; na Dupla (terça) e no Trio (sexta), não. A PR já faz isso (`index.html` `encMostrar` + `tw-mic-cd-popup.css`: `.encp.enc-grupo #encRk, #encSelo, #encOshi { display:none }`). A branch acrescentaria ranking/Oshi por membro do grupo, o oposto do desejado. |

## 5. Alterações recuperadas de outras branches

- `feat/avatar-careca-capitao-estrela` → chapéu de Capitão, estrela, três cortes ondulados.
- `fix/karaoke-ticket-recovery` → recuperação de tickets (reescrita).
- `fix/center-run-credit-recovery` → reconciliação de crédito (reescrita).

## 6. Testes e CI — histórico com escopo explícito

- **HEAD de código auditado:** `d88d5b7a52f769a4674d7e7ae37421c5bb5873de`.
- **CI mais recente consultado para esse HEAD:** execução [#41344644714](https://github.com/chumikie/tsulipa-run/actions/runs/41344644714), workflow `Check TsuLiPa special games`, evento `pull_request`, concluída em 01/11/2026.
- Jobs: `static-validation` = **success**; `postgres-center-run` = **success**.
- O job estático inclui os testes de integração dos cabelos Sora/Karaoke Day, o novo teste `tests/karaoke-personal-song-records.test.js` e as verificações da nova estrutura da biblioteca compacta em `tests/karaoke-mobile-performance.test.js`, além das demais verificações listadas em `.github/workflows/validate-games.yml`.
- O job PostgreSQL usa serviço temporário no CI e executa integrações isoladas de Center Run e tickets. Não representa acesso ou teste ao Supabase de produção.
- A execução local histórica de 33/33 testes Node ocorreu em HEAD anterior (`47b1c8a` conforme registro anterior); não atribuir esse resultado ao HEAD `d88d5b7a`.
- O commit `76ba9e55` registra verificação em Chromium a 390×844 e 1280×900 para a regressão de pausa mobile. Tratar como validação de navegador relatada pelo autor do commit; não equivale a teste em celular físico. As integrações recentes do Sora/Karaoke Day e a nova biblioteca musical têm confirmação automatizada de código, mas não inspeção visual nesta retomada.
- A revisão visual headless 420×900 sem login, registrada anteriormente, foi parcial e não cobriu Perfil completo nem Karaoke autenticado.
- **Nesta atualização do mapa não foram executados testes locais, visuais, de navegador ou em aparelhos.** O commit deste documento não deve ser apresentado como nova validação do código.

## 7. Supabase — estado registrado e bloqueios

Nenhuma alteração de Supabase foi executada nesta retomada. Os dados abaixo reproduzem o estado documentado na investigação de 01/11/2026; não representam uma nova consulta ao banco nesta atualização.

- Projeto registrado no histórico: `fsggtvgbyhchblyazgmt`.
- `20261031151827_karaoke_tickets_extra_shows_inventory_gacha`: consta no registro anterior como aplicada.
- A investigação anterior registrou `public.terminar_corrida` em produção com teto de 1.500 estrelas/dia. Confirmar por leitura ### Karaoke — plateia e movimento
- [x] Permitir até três figurantes caminhando simultaneamente, com lanes/destinos independentes e prioridade de cantor.
- [x] Conectar o toque no piso ao planejador de movimento do jogador, preservando interações da cena e pistas do ritmo.
- [x] Fazer o jogador retornar ao microfone após cinco segundos longe, usando o relógio lógico da sala.
- [x] Exigir posição correta no microfone para iniciar; bloquear antes da consulta de tentativa/ticket quando o jogador está longe.
- [x] Preservar o gate solo/offline e desligar a autonomia durante homologação.
- [ ] Homologar visualmente três caminhantes simultâneos, rotas, oclusões e composição da sala.
- [ ] Testar toque no piso, retorno automático e início pelo microfone em celular físico.

relas/dia dos minijogos do Pet.
- Não apagar nem resetar saldos, históricos, corridas ou rankings.
- O bloco Sora⭐Jump da proposta `admin_player_profile_proposal.sql` continua como item separado para avaliação.
- Relatório de leitura e conferência do Supabase permanece pendente.

**Bloqueio:** não executar `supabase db push`, `supabase migration up`, SQL manual, alteração de função, alteração de saldo ou operação destrutiva sem autorização específica do responsável.

## 8. Checklist para aprovação final

### Mapa e código
- [x] Reconfirmar PR #58 aberta, Draft, sem merge e branch de trabalho exclusiva.
- [x] Registrar o HEAD de código e separar o estado do código do commit documental.
- [x] Corrigir estados antigos contraditórios neste documento.
- [x] Registrar que os arquivos temporários do scratchpad não foram localizados; a funcionalidade equivalente foi implementada diretamente em `karaoke-time.html`.

### Personagens
- [ ] Investigar em que renderizador/personagem o boneco aparece careca e corrigir a perda da base do cabelo; não criar opção de menu `Careca` sem decisão específica.
- [x] Conectar as camadas compartilhadas de cabelo ao renderizador próprio do Sora Jump (jogador e parceiros) e ao renderizador do Karaoke Day, mantendo os fallbacks antigos.
- [ ] Conferir visualmente a base dos cabelos e todas as camadas em personagens masculinos/femininos, parceiros e renderizadores alternativos.
- [ ] Conferir visualmente cortes, franjas, mecha, Marias, rabo, quepe e presilha em Perfil, Estúdio, Hub, Center Run, Karaoke Time, Sora e Karaoke Day.

### Karaoke — experiência musical
- [x] Registrar que os arquivos temporários do scratchpad não foram localizados; não afirmar que foram recuperados.
- [x] Substituir a Vitrine extensa por abas compactas de Músicas e Vozes, mantendo os 15 MP3 do trio e o áudio do Encontro.
- [x] Criar os três botões com cabeças reais e reprodução das vozes do Tsu, Lirika e Pati.
- [x] Criar cartões das sete faixas com seleção pelo seletor existente e espaço para o recorde pessoal por música.
- [x] Implementar recorde pessoal por conta/faixa em armazenamento local, com migração compatível de saves v1 e sem ranking compartilhado.
- [x] Proteger a lógica e a estrutura da biblioteca com testes automatizados no CI.
- [ ] Homologar navegação, reprodução de áudio, pontuação e atualização dos recordes visualmente no navegador e em celular físico.

### Karaoke — plateia e movimento
- [ ] Permitir pelo menos três figurantes caminhando simultaneamente, com rotas e limites seguros.
- [ ] Conectar o toque no piso ao planejador de movimento do personagem do jogador.
- [ ] Fazer o jogador retornar ao microfone após cinco segundos longe.
- [ ] Exigir posição correta no microfone para iniciar/jogar.
- [ ] Preservar a sala solo/offline e o telão de maiores combos.

### Desempenho e homologação
- [ ] Investigar faixa de visitantes e apresentação dos rankings de Karaoke.
- [ ] Revisar loops secundários e cadência em 30/60 Hz sem retirar animações ou detalhes.
- [ ] Testar em celulares físicos; registrar aparelho, viewport, cenário e resultado.
- [ ] Fazer homologação autenticada de Perfil, Karaoke, tickets e avatares.
- [ ] Distinguir sempre teste estático/unitário, CI PostgreSQL isolado, verificação Chromium/headless e homologação física.

### Banco, CI e revisão
- [x] CI do HEAD de código `d88d5b7a` aprovado nos dois jobs reportados.
- [ ] Reexecutar/confirmar CI após futuras alterações de código.
- [ ] Fazer leitura autorizada do Supabase e conferir estado efetivo antes de qualquer proposta de mudança.
- [ ] Decidir separadamente sobre o teto de 100 estrelas/dia; não aplicar sem autorização específica.
- [ ] Revisar diff completo da PR, possíveis regressões, arquivos SQL, documentação e compatibilidade.
- [ ] Revisão humana final do responsável.
- [ ] Merge somente após autorização explícita.
- [ ] Arquivar branches antigas somente após merge autorizado e autorização específica.

