# Plano de lançamento — TsuLiPa⭐World

**Objetivo:** transformar a versão experimental em uma liberação segura para membros reais sem perder o jogo existente, sobrecarregar Supabase/Realtime ou gastar deploys desnecessários na Vercel.

**Última verificação da base de código:** 29/10/2026. O checkpoint de desempenho e regressão [`fef6870d`](https://github.com/chumikie/tsulipa-run/commit/fef6870d9dea142935b5a7f8e2a5a3cc44400775) passou no GitHub Actions [run #154](https://github.com/chumikie/tsulipa-run/actions/runs/40959784396). A auditoria de Portão 5 está registrada; medições de navegador/CDN ainda estão pendentes. Este checklist é o portão de liberação; documentos de etapa e auditorias são evidências auxiliares, não autorização automática para publicar.

## Diagnóstico atual — fatos verificados

- [ ] **Ainda não é liberação pública de Sora/Karaoke.** O PR [#33](https://github.com/chumikie/tsulipa-run/pull/33) está aberto em rascunho. index2.html é uma prévia independente; index.html principal continua separado.
- [x] A branch experimental tem git.deploymentEnabled=false em vercel.json. Portanto, não assumir que o preview Vercel está ativo nem reativá-lo só para cada pequena alteração.
- [x] O commit de código base 7f80d787 passou no workflow estático do GitHub às 20:22 UTC de 29/10/2026. Isso valida os testes automatizados configurados, **não** substitui teste visual, rede, Auth/CAPTCHA, navegador real ou multiplayer. O commit de organização documental não altera código do jogo.
- [x] O Supabase **TsuLiPa World - Homologacao** tem as migrações do laboratório de Karaoke 3A.2–3A.10. A sala existe, mas os assentos e a fila estavam vazios, sem contas de Auth.
- [x] O cadastro de ensaio continua desligado (SIGNUP_ENABLED=false) e o portão do servidor fica fechado por padrão. Não abrir durante esta organização.
- [x] O projeto **BRS48's Project** é o Supabase que contém os dados reais do jogo. A prévia não é um sandbox, mesmo com escritas bloqueadas pelo helper contaRpc.
- [x] O elenco semanal dos pôsteres usa a tabela privada private.karaoke_poster_elencos e a RPC public.karaoke_posteres_semana(), já presentes na produção.
- [x] O pódio semanal tw_podio_semana e a tabela private.tw_weekly_podium_scores **não existem na produção**; supabase/sql/tw_weekly_podium_proposal.sql é uma proposta versionada, não uma migração aplicada.
- [ ] O tamanho transferido, uso comprimido, FPS real, tráfego de Supabase/Realtime e consumo Vercel ainda precisam ser medidos em dashboards e dispositivos. Não se promete compatibilidade com o plano gratuito apenas pela inspeção do código.
- [ ] A auditoria do Supabase sinalizou RLS desativado na tabela privada dos pôsteres. As permissões diretas de anon e authenticated foram consultadas e não permitem acesso direto à tabela/schema, mas o aviso deve ser revisado explicitamente antes da liberação. Não ligar RLS nem mudar grants às cegas: a RPC pública depende desse modelo de acesso.

## Portão 1 — corrigir e validar a experiência visual

- [x] Reestilizar Top Idols/TV: `TsuLiPa TV` recebe moldura de TV kawaii na tela inicial; o pódio vira barra lateral no hub desktop. `hubIdols` continua sendo a vitrine animada antiga, independente. **Revisão visual manual em navegador ainda pendente**. Sora/Karaoke seguem sem campeões online inventados enquanto `TW_RANK_ONLINE_READY=false`.
- [x] Ajustar as regras de tamanho do Sora embutido para usar mais a altura disponível em desktop, celular e paisagem curta; `sora-jump.html` só recebeu a atualização do CSS. Testes estáticos de geometria adicionados. **Revisão visual manual em navegador ainda pendente**.
- [ ] Fazer a rodada visual completa de traduções em PT/ES/EN/TH/JA, tema/Oshi, retorno ao hub, áudio e ausência de tela branca/flash. As novas mensagens do ranking já têm traduções; isso não prova que todas as sessões do jogo estejam totalmente traduzidas.
- [x] Preservar a física e resolução lógica 360×520 do Sora, as chaves de saves e a lógica original de Center⭐Run. Alterações de gameplay/`index.html` oficial não foram feitas.

## Portão 2 — verificações automáticas de código

Executar a suíte na branch atual; nenhum desses testes exige criar contas reais ou pontuações de produção:

- [x] `node tests/validate-games.js`
- [x] `node tests/karaoke-room-model.test.js`
- [x] `node tests/karaoke-rhythm.test.js`
- [x] `node tests/karaoke-homol-view.test.js`
- [x] `node tests/karaoke-homol-sync.test.js`
- [x] `node tests/karaoke-homol-refresh.test.js`
- [x] `node tests/sora-stability.test.js`
- [x] `node tests/tw-weekly-podium.test.js`

- [x] GitHub Actions `Check TsuLiPa special games` — run [#154](https://github.com/chumikie/tsulipa-run/actions/runs/40959784396) terminou em `success` para o checkpoint [`fef6870d`](https://github.com/chumikie/tsulipa-run/commit/fef6870d9dea142935b5a7f8e2a5a3cc44400775); os oito passos de validação foram concluídos.
- [ ] Testar todos os retornos e os casos de erro no navegador/homologação; um teste estático verde não prova que o navegador chamou a RPC correta nem que as permissões Auth estão certas.

## Portão 3 — homologação de membros reais

Somente no projeto de homologação, depois de revisar as configurações Auth e antiabuso:

- [ ] Confirmar domínio permitido do Turnstile/CAPTCHA, validação no servidor e configurações do Supabase Auth. A chave pública no cliente não substitui a verificação do servidor.
- [ ] Manter cadastro desligado até que o CAPTCHA e as políticas estejam realmente testados.
- [ ] Com duas ou mais contas de teste e navegadores separados, validar presença, reconexão, saída, retorno do navegador (bfcache), fechamento do portão e expiração de vaga.
- [ ] Validar o limite de **9 participantes**: 1 cantora + 8 assistindo; a 10ª entrada deve ser recusada.
- [ ] Validar fila FIFO de **3 posições**, rejeição da 4ª pessoa na fila, posse de um único microfone, turno de 60 s (5 s de preparação + 45 s de ritmo + 10 s de aplausos), heartbeat/lease e troca de cantor.
- [ ] Validar as permissões de moderação com uma conta autorizada e uma não autorizada. Nenhuma autorização pode depender do apelido ou de flags controladas pelo navegador.
- [ ] Confirmar que ensaio não concede estrelas, moedas, insígnias nem escreve no ranking oficial.

## Portão 4 — segurança e dados

- [ ] Revisar RLS, grants, políticas e funções SECURITY DEFINER de cada caminho usado pelos novos jogos. Preservar as funções existentes; não revogar permissões em massa.
- [ ] Revisar o aviso referente a private.karaoke_poster_elencos e documentar uma decisão de segurança compatível com karaoke_posteres_semana().
- [ ] Manter TW_RANK_ONLINE_READY=false até que as pontuações de Sora/Karaoke sejam autenticadas e verificadas no servidor. Pontuação local de ensaio não é competitiva.
- [ ] Não aplicar tw_weekly_podium_proposal.sql na produção sem revisão, migração aprovada, teste de concorrência e validação em homologação.
- [ ] Não alterar as chaves brs48cr_*, nomes de tabelas/RPCs, autenticação ou dados de contas para “facilitar” a integração.

## Portão 5 — custo e desempenho

**Resultado desta auditoria:** parte do portão foi comprovada por código, logs agregados e consultas somente de leitura; a transferência real, o cache dos arquivos e o FPS continuam pendentes porque não foi criado um preview atual nem houve inspeção de navegador.

- [x] Confirmado no código: `index2.html` só define o `src` do iframe quando o jogo é escolhido e descarrega-o para `about:blank` ao retornar. Sora e Karaoke param seus loops/áudio em segundo plano e restauram o ciclo de vida ao voltar.
- [x] Aplicada uma otimização localizada em `index2.html`: os loops `requestAnimationFrame` do Center⭐Run de base e da prévia do avatar agora são acompanhados, cancelados quando o hub/iframe cobre a tela ou a aba fica oculta, e retomados ao voltar. O teste automatizado cobre os quatro estados. A física, a resolução lógica, os saves e `index.html` oficial não foram alterados.
- [x] Conferido o padrão de chamadas: não há gravação por frame. O `perfConferir` compara snapshots locais a cada 4 s e só envia `salvar_nuvem` quando há mudanças; o envio é agrupado/limitado. A homologação Karaoke usa heartbeat de 30 s e atualizações de estado coalescidas com mínimo aproximado de 2 s entre refreshes; o ritmo autenticado de homologação chama a RPC `karaoke_ensaio_toque` por toque (não por frame). Esse tráfego de homologação exige futura medição de carga antes de abrir a jogadores reais.
- [x] Medido com consulta SQL somente de leitura: `pg_database_size(current_database())` retornou **13.579.955 bytes (~13,58 MB)** em produção e **11.572.915 bytes (~11,57 MB)** em homologação. É o tamanho reportado pelo Postgres naquele momento, não uma medição de transferência nem a fatura completa de armazenamento.
- [x] Inspecionados logs agregados para **28/10/2026 20:00 UTC a 29/10/2026 20:00 UTC**. Produção: 2.568 `edge_logs`, 201 `postgres_logs`, 72 `pgbouncer_logs`, 52 `auth_logs`, 48 `auth_audit_logs` e 21 `postgrest_logs`. Rotas com mais eventos incluíram `aviso_inicio` (302 POSTs), `vitrine_idols` (238), `jogador` (233), `carregar_nuvem` (230) e `salvar_nuvem` (194). São contagens do projeto de produção inteiro — não usuários únicos, nem chamadas atribuídas a esta branch, nem RPCs normalizadas por visita. Em homologação houve 10 registros em `realtime_logs`, o que **não** equivale ao número de mensagens Realtime faturáveis.
- [x] Confirmado que `vercel.json` mantém `git.deploymentEnabled=false` para a branch. Não foi criado nenhum deployment nesta auditoria. O histórico consultado contém pelo menos 30 deployments READY antigos da branch em aproximadamente 53 minutos (29/10, 13:53–14:46 UTC), reforçando a decisão de agrupar ajustes antes de um preview.
- [ ] Medir bytes realmente transferidos com gzip/Brotli, cabeçalhos de cache/hit ratio e FPS em desktop/celular. O código estático não fornece esses números: a branch não tem preview atual e as consultas de métricas/cobrança tentadas nesta sessão não retornaram dados utilizáveis.
- [ ] Medir RPCs e mensagens Realtime por visita/sessão e associar o consumo à funcionalidade experimental. Logs agregados não incluem denominador de visitas; a contagem de `realtime_logs` não substitui métricas de mensagens.
- [x] Organizar Markdown em `docs/` não acrescenta trabalho ao navegador, pois os HTML/JS do jogo não importam esses arquivos. É manutenção, não uma otimização de runtime por si só.

## Portão 6 — estratégia real de lançamento

**Importante:** fazer merge do PR #33 não substitui automaticamente a página principal pelo index2.html. O PR adiciona a prévia e os jogos separados; a home oficial continua em index.html.

- [ ] Escolher explicitamente o modo de lançamento: (A) continuar com a página principal e integrar cuidadosamente os cards aprovados nela; ou (B) aprovar uma troca controlada da entrada principal após comparação completa. Não renomear arquivos nem substituir a home às cegas.
- [ ] Confirmar a lista exata de arquivos/migrações para a publicação; separar mudanças de frontend de mudanças de banco.
- [ ] Revisar PR e preview final em desktop e celular; aprovar o PR #33 e a estratégia de rollout antes de fazer merge.
- [ ] Só liberar inscrições e multiplayer depois de todos os portões anteriores aprovados. A publicação visual e a abertura do servidor são duas decisões separadas.

## Critério de conclusão

A liberação só está pronta quando os testes automatizados estão verdes **e** a experiência visual, Auth/CAPTCHA, permissões, fila, microfone, retorno móvel e carga real tiverem sido verificados. Até lá, a página experimental pode continuar evoluindo, mas o portão online permanece fechado.