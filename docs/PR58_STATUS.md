# PR #58 — Estado central e mapa de retomada

Documento de acompanhamento da PR #58 (`perf/karaoke-mobile-tile-occupancy` → `main`).

**Regra de trabalho:** continuar exclusivamente nesta PR. Não criar PR paralela, não alterar `main`, não fazer merge ou deploy, e não executar SQL no Supabase sem autorização específica do responsável.

**Snapshot do código auditado:** 01/11/2026, 16h03 (Brasília) — último commit de código confirmado: `76ba9e559cd150a34d37d69fa8b86a1b31a6ad2e`.
**Estado da PR na consulta:** aberta, em Draft, não mesclada e marcada como mergeable. Base `main`: `983852cca2e5afc612dad6f77acc687b66a951f0`. A PR tinha 325 commits, 49 arquivos alterados, 4.562 adições e 945 remoções.
**Importante:** este documento será atualizado por um commit exclusivamente documental na mesma branch. O SHA acima identifica o último HEAD que contém as alterações de código e ao qual o CI abaixo se refere; o commit documental não altera o código do jogo.

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
- Módulos de cabelo e acessórios: três cortes extras ondulados, três franjas extras, mecha que acompanha a franja, Marias presas, rabo em uma peça, arco-íris em mechas tingidas, quepe militar e presilha de estrela.
- Karaoke mobile: controles de som/pausa/timing reposicionados; correção da pausa indevida do show quando o palco sai da viewport; rolagem ao palco no início da apresentação.
- Sala solo do Karaoke: existe passeio autônomo de figurante, interações sociais entre dois figurantes, reações, itens e visitas de pets. A limitação atual — somente um passeio autônomo por vez — está descrita na seção 3.3.

## 2. Testes automatizados — evidência no GitHub Actions

**Último CI de código consultado:** workflow `Check TsuLiPa special games`, execução [#41339757980](https://github.com/chumikie/tsulipa-run/actions/runs/41339757980), associado ao HEAD de código `76ba9e55`. Os dois jobs terminaram com sucesso:

- `static-validation`: aprovado.
- `postgres-center-run`: aprovado.

Entre as verificações incluídas no workflow estão testes de cabelos, acessórios, recuperação de crédito, paleta do Center Run, ciclo de visibilidade, regressão de pausa do Karaoke, recuperação de tickets, fluxos de ritmo, sincronização do Pet e estabilidade do Sora.

O job PostgreSQL usa banco temporário/isolado do CI e cobre os fluxos de Center Run e tickets. **Isso não é execução nem homologação no banco de produção.**

Limites desta evidência:

- O resultado verde confirma os comandos automatizados executados pelo workflow naquele HEAD.
- Os testes de avatar exercitam funções e contratos de desenho; não substituem inspeção visual de todos os personagens, acessórios, tamanhos e renderizadores.
- O teste de pausa do Karaoke protege condições de visibilidade e o comportamento codificado; não comprova funcionamento em todos os celulares físicos.
- Não encontrei teste específico para três figurantes caminharem simultaneamente, retorno do personagem do jogador ao microfone ou histórico pessoal por música.
- A execução local antiga de 33/33 testes, registrada no histórico da PR, pertence a um HEAD anterior e não deve ser apresentada como teste local do HEAD `76ba9e55`.

**Nesta atualização documental não foram executados testes locais, testes de navegador ou testes em aparelhos.** Como o commit desta atualização altera apenas `docs/PR58_STATUS.md`, o workflow com filtro de caminhos de código não deve ser interpretado como uma nova execução de CI para este commit documental.

## 3. Homologação, pendências e fila de retomada

### 3.1. Personagens — implementação presente, homologação visual incompleta

- Os módulos `tw-avatar-hair.js` e `tw-avatar-items.js` estão presentes e são carregados por Center Run/Perfil e Karaoke.
- Os testes automatizados verificam os três cortes, as franjas e o desenho do quepe/presilha por meio de contratos e chamadas simuladas de Canvas.
- O relatório visual anterior foi feito em navegador headless, viewport 420×900, sem login, e cobriu apenas parte das telas. O Perfil completo e o Karaoke com o avatar salvo ficaram pendentes de autenticação.
- **Personagem careca:** não foi encontrada opção careca/calva no menu nem implementação correspondente nos módulos atuais. A branch antiga de recuperação do chapéu/estrela retirou essa opção; portanto, não considerar o pedido concluído.
- Falta conferir base dos cabelos, camadas traseiras/superiores/franjas, acessórios e preservação de aparência em todos os tipos de personagem, parceiros, Perfil, Estúdio, Hub, Center Run, Karaoke e renderizadores alternativos.

### 3.2. Experiência musical do Karaoke — pedido não incorporado ao GitHub

Pedido do responsável: substituir a Vitrine sonora extensa por três controles compactos com as cabeças do Tsu, Lirika e Pati, preservando a reprodução das vozes; reorganizar as faixas do Karaoke em uma biblioteca compacta/selecionável como Novidades; mostrar a melhor nota pessoal por música, sem ranking compartilhado.

Estado encontrado no código remoto:

- `karaoke-time.html` ainda contém a seção original `ktAudioLibrary`, com listas longas de vozes, trilhas e áudio especial.
- Os arquivos MP3 das vozes do Tsu, Lirika e Pati e do Encontro continuam no repositório.
- Existe um player de áudio único e seleção das sete trilhas existentes; isso não equivale à nova interface solicitada.
- `KaraokeShowRules` guarda registros locais por jogador e métrica (score, accuracy e combo). O resultado contém a música usada, mas o armazenamento não está organizado como melhor resultado separado por jogador **e por música**. Não foi encontrada a tela de melhores notas por faixa.
- Não foram encontrados `library.html`, `library.css` ou `library.js` no branch, nem commit que incorpore esses arquivos.
- O responsável forneceu um trecho da sessão Claude mostrando que esses três arquivos foram criados no scratchpad e que começou um comando para substituir HTML/CSS/JS em `karaoke-time.html`. O trecho termina no meio do comando. **É evidência de protótipo iniciado no ambiente local do Claude, não prova de que o comando terminou nem de que os arquivos foram enviados ao GitHub.** Recuperar esse scratchpad/sessão antes de reescrever a solução.

Status: **pendente de integração**. Preservar os MP3 e o player existente; não apagar recursos como substituição simplista. A interface nova e o histórico pessoal por música precisam de implementação e testes próprios.

### 3.3. Plateia autônoma e movimento do jogador — implementação parcial

- O código usa um controlador singular `krLoungeActor` para o passeio autônomo: há apenas um figurante em passeio independente por vez.
- Há interação social entre até dois figurantes, mas conversa/olhar/aplauso não equivale a três personagens caminhando simultaneamente.
- O planejador `krPlanearDestino(px,py)` existe, mas a busca do código não encontrou chamada para ele; portanto, não há evidência de que o toque no piso esteja conectado a esse planejador.
- No início do show, o personagem do jogador é posicionado no palco/microfone pelo próprio código. Não foi encontrada a regra pedida de retorno automático ao microfone após cinco segundos longe.
- A exigência de estar no microfone para iniciar/jogar também precisa ser implementada e validada sem prejudicar o fluxo atual de apresentação.

Status: **parcial; precisa de implementação**. Manter Karaoke exclusivamente solo/offline; não criar sala online nem fila de participantes reais.

### 3.4. Desempenho e apresentação

- A camada de 30 Hz e as verificações automatizadas estão no código, mas não há medição de desempenho em celulares físicos nesta auditoria.
- Permanecem pendentes a inspeção dos loops secundários, a faixa de visitantes/Idols e a apresentação dos rankings de Karaoke.
- Não remover animações, reações, acessórios, detalhes ou efeitos para reduzir custo. Primeiro identificar o trabalho que pode ser pausado quando não está visível e medir o que realmente consome recursos.

### 3.5. Itens adicionais, separados dos pedidos acima

- A ideia de transformar o terceiro quadro em seletor com top 3 mensal por música é um ranking compartilhado diferente do histórico pessoal solicitado no item 3.2. Depende de desenho de dados e decisão específica no Supabase; não confundir as duas funcionalidades.
- Lupa de palco, itens clicáveis da mesa e glitter adicional permanecem ideias futuras, não parte da conclusão das frentes principais.

### 3.6. Verificações visuais e de uso real ainda necessárias

O commit `76ba9e55` registra que a correção de pausa do Karaoke foi verificada em Chromium nos tamanhos 390×844 e 1280×900. Isso é uma verificação de navegador relatada no commit, não homologação em celulares físicos.

O relatório anterior também registra uma inspeção headless 420×900 sem login. Não há evidência nesta auditoria de:

- homologação em aparelho Android/iOS físico;
- fluxo autenticado Google completo no Perfil e no Karaoke;
- inspeção de todos os renderizadores alternativos, parceiros e prévias do editor;
- teste visual de todas as animações durante sessões longas;
- validação da nova biblioteca musical ou das três caminhadas simultâneas, pois ainda não foram implementadas.

### 3.7. Correções de inconsistências deste documento

Registros antigos que diziam que o quepe/estrela ainda não estavam implementados, que o redesenho dos cabelos aguardava implementação ou que a pausa mobile seguia sem correção estavam desatualizados. O código e os commits posteriores confirmam essas implementações/correções; o que permanece pendente é a homologação visual e em aparelhos, não a ausência dos respectivos módulos.

A fila de retomada é: **(0) manter este mapa atualizado; (1) concluir auditoria visual dos personagens e investigar careca; (2) recuperar o protótipo e concluir a experiência musical; (3) concluir a plateia autônoma e o movimento do jogador; (4) homologar desempenho em aparelhos físicos; (5) fazer revisão integral da PR antes de qualquer decisão de merge.**

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
| fix/karaoke-ticket-recovery | Reescrita na PR (`karaoke-tickets.js`, `karaoke-time.html`) com teste próprio. |
| fix/center-run-credit-recovery | Reescrita na PR com teste próprio. |
| feat/avatar-careca-capitao-estrela | Capitão, estrela e 3 cortes ondulados (criados nesta branch em 01/11, **não** existiam no jogo) trazidos para `tw-avatar-items.js` / `tw-avatar-hair.js`. A opção careca foi removida pela própria branch. Arquivar somente após a conferência visual dos personagens (seção 3.1). |
| sem-online-historico | Botão "Não funcionou? Entrar de outro jeito" (`gisAntigo`, login Google por redirecionamento) já está na `main` e na PR; só muda a classe do botão de fechar. |
| feat/backstage-admin-single-owner | Documentação e testes presentes; a diferença é um bloco Sora⭐Jump na proposta SQL do perfil admin → encaminhado ao Supabase (seção 7). |

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

- **HEAD de código auditado:** `76ba9e559cd150a34d37d69fa8b86a1b31a6ad2e`.
- **CI mais recente consultado para esse HEAD:** execução [#41339757980](https://github.com/chumikie/tsulipa-run/actions/runs/41339757980), workflow `Check TsuLiPa special games`, evento `pull_request`, concluída em 01/11/2026.
- Jobs: `static-validation` = **success**; `postgres-center-run` = **success**.
- O job estático inclui testes de avatar/cabelos/acessórios, recuperação de crédito, paleta do Center Run, visibilidade, regressão de pausa do Karaoke, fluxo e ritmo do Karaoke, recuperação de tickets, estabilidade do Sora e demais verificações listadas em `.github/workflows/validate-games.yml`.
- O job PostgreSQL usa serviço temporário no CI e executa integrações isoladas de Center Run e tickets. Não representa acesso ou teste ao Supabase de produção.
- A execução local histórica de 33/33 testes Node ocorreu em HEAD anterior (`47b1c8a` conforme registro anterior); não atribuir esse resultado ao HEAD `76ba9e55`.
- O commit `76ba9e55` registra verificação em Chromium a 390×844 e 1280×900 para a regressão de pausa mobile. Tratar como validação de navegador relatada pelo autor do commit; não equivale a teste em celular físico.
- A revisão visual headless 420×900 sem login, registrada anteriormente, foi parcial e não cobriu Perfil completo nem Karaoke autenticado.
- **Nesta atualização do mapa não foram executados testes locais, visuais, de navegador ou em aparelhos.** Um commit que altera somente este documento não deve ser apresentado como nova validação do código.

## 7. Supabase — estado registrado e bloqueios

Nenhuma alteração de Supabase foi executada nesta retomada. Os dados abaixo reproduzem o estado documentado na investigação de 01/11/2026; não representam uma nova consulta ao banco nesta atualização.

- Projeto registrado no histórico: `fsggtvgbyhchblyazgmt`.
- `20261031151827_karaoke_tickets_extra_shows_inventory_gacha`: consta no registro anterior como aplicada.
- A investigação anterior registrou `public.terminar_corrida` em produção com teto de 1.500 estrelas/dia. Confirmar por leitura no momento de uma futura revisão autorizada antes de tomar decisão.
- A proposta de 100 estrelas/dia por conta (`America/Sao_Paulo`) está em `supabase/migrations/20261101161409_center_run_daily_100.sql`, com checklist, runbook e SQL de rollback em `supabase/sql/`. Foi homologada em PostgreSQL isolado; **não foi aplicada em produção** e depende de autorização específica.
- Preservar o limite independente de 50 estrelas/dia dos minijogos do Pet.
- Não apagar nem resetar saldos, históricos, corridas ou rankings.
- O bloco Sora⭐Jump da proposta `admin_player_profile_proposal.sql` continua como item separado para avaliação.
- Relatório de leitura e conferência do Supabase permanece pendente.

**Bloqueio:** não executar `supabase db push`, `supabase migration up`, SQL manual, alteração de função, alteração de saldo ou operação destrutiva sem autorização específica do responsável.

## 8. Checklist para aprovação final

### Mapa e código
- [x] Reconfirmar PR #58 aberta, Draft, sem merge e branch de trabalho exclusiva.
- [x] Registrar o HEAD de código e separar o estado do código do commit documental.
- [x] Corrigir estados antigos contraditórios neste documento.
- [ ] Recuperar ou documentar a impossibilidade de recuperar os arquivos de biblioteca criados no scratchpad do Claude.

### Personagens
- [ ] Investigar e restaurar/implementar a opção careca, preservando compatibilidade dos saves.
- [ ] Conferir a base dos cabelos e todas as camadas em personagens masculinos/femininos, parceiros e renderizadores alternativos.
- [ ] Conferir visualmente cortes, franjas, mecha, Marias, rabo, quepe e presilha em Perfil, Estúdio, Hub, Center Run e Karaoke autenticado.

### Karaoke — experiência musical
- [ ] Recuperar o protótipo `library.html`, `library.css`, `library.js` do scratchpad, caso ainda esteja disponível.
- [ ] Substituir a Vitrine extensa por três controles compactos de voz do Tsu, Lirika e Pati, preservando os áudios existentes.
- [ ] Criar biblioteca compacta de faixas, selecionável como a seção Novidades.
- [ ] Implementar e persistir a melhor nota pessoal separada por música, sem ranking compartilhado.
- [ ] Criar testes específicos de seleção de faixa, player de voz, persistência e isolamento por usuário.

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
- [x] CI do HEAD de código `76ba9e55` aprovado nos dois jobs reportados.
- [ ] Reexecutar/confirmar CI após futuras alterações de código.
- [ ] Fazer leitura autorizada do Supabase e conferir estado efetivo antes de qualquer proposta de mudança.
- [ ] Decidir separadamente sobre o teto de 100 estrelas/dia; não aplicar sem autorização específica.
- [ ] Revisar diff completo da PR, possíveis regressões, arquivos SQL, documentação e compatibilidade.
- [ ] Revisão humana final do responsável.
- [ ] Merge somente após autorização explícita.
- [ ] Arquivar branches antigas somente após merge autorizado e autorização específica.

