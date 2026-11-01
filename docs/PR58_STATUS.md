# PR #58 — Estado central

Documento único de acompanhamento da PR #58 (`perf/karaoke-mobile-tile-occupancy` → `main`).
A PR permanece **aberta e em draft**. Nenhum merge, deploy ou alteração no Supabase é feito a partir deste trabalho sem autorização do responsável.

Última atualização: 01/11/2026 — HEAD de referência antes deste documento: `47b1c8aef9e7c6abd494b9131415599e803010fa`.

---

## 1. Concluído (código + teste automatizado no CI)

- Controle compartilhado de ciclo de vida em `tw-motion-lifecycle.js` (pausa de animações, gates de iframe, limpeza de observers/listeners).
- Renderização móvel limitada a 30 Hz no Center⭐Run!, Karaoke⭐Time!, Sora⭐Jump! e prévias, com a simulação preservada em delta-time.
- Otimizações de desenho e caches em Canvas (piso 15×6, parede, estante, sprites limitados a 64).
- Sala solo de Karaoke: plateia autônoma, reações, passeios, conversas, pandeiros e visitas do Pet.
- Respostas assíncronas vinculadas à conta (perfil, sincronização, microfone, Karaoke, Sora).
- Limpeza de timers, listeners e recursos de áudio.
- Recuperação de tickets de Karaoke: chave idempotente, recarga da página, saldo já debitado, corrida substituída, troca de conta (`tests/karaoke-ticket-recovery.test.js` + suíte PostgreSQL descartável).
- Recuperação da confirmação de crédito do Center⭐Run! após resposta perdida (`tests/center-run-credit-recovery.test.js`).
- Desenhos 2D originais do chapéu de Capitão e da estrela (`tw-avatar-items.js`, `tests/avatar-items.test.js`).
- Três cortes de cabelo ondulados originais (`tw-avatar-hair.js`, `tests/avatar-hair.test.js`).

## 2. Implementado, aguardando homologação manual

- Conferência visual de cabelos, chapéu de Capitão e estrela no Center⭐Run!, Perfil e Karaoke.
- Karaoke e tickets em fluxo autenticado real (conta Google).
- Desempenho em celulares reais (30 Hz, aquecimento, bateria).
- Migração do Center⭐Run! para 100 estrelas/dia: preparada e testada em PostgreSQL isolado; **não aplicada em produção** (ver seção 7).

## 3. Falta corrigir / investigar

- Custo da faixa de visitantes do Karaoke.
- Apresentação dos rankings de Karaoke.
- Revisão dos loops secundários que já desenham a cada dois frames, em aparelhos cujo `requestAnimationFrame` opera perto de 30 Hz.
- Decisão pendente: botão "entrar pelo método antigo" quando o login Google falha (branch `sem-online-historico`, ver seção 5-D).

## 4. Branches avaliadas

Total: 53 branches além da PR. Método: commits exclusivos (`git rev-list`), equivalência de patch (`git cherry`), presença na PR das linhas adicionadas e busca de funções/identificadores no código. **Divergência de commits não significa funcionalidade ausente**: várias correções foram reescritas na PR com outros arquivos.

### A. Já contidas na `main` (38) — nada a recuperar

Todos os commits destas branches já estão na `main` de produção (e, portanto, também na PR):

ajustes-v213, ajustes-vitrine, chore/karaoke-estreia-08-11-2026, encontro-cena, encontro-dupla-trio, encontro-por-conta, engavetado/karaoke-day, feat/pet-sync-admin-20261030, feature/karaoke-time, feature/sora-jump-karaoke-hub-v21, fix/backstage-pet-sync-main-2026-10-30, fix/cards-hub, fix/center-run-botao-deslizar-30-10, fix/karaoke-placar-rotativo, fix/kt-ritmo-relogio, fix/mic-cd-popup-and-encounter-no-rank-2026-10-30, fix/perfil-foto-sem-slide-2026-10-30, gacha-cards, icone-topo, janelas-na-inicial, lancamento/30-10, main, moderacao-contas, moderacao-livre, moon-duo-abas, musicas-gacha-duo, musicas-temas, novidades, og-zipper-icone, og/karaoke-time, privacidade-og, release/index2-lancamento, test/karaoke-reuse-anonymous-session, titulo-world, traducoes-dicas, v2-1-2, vitrine-lugar, vitrine-reacao.

### B. Commits exclusivos, funcionalidade já presente na PR (9)

| Branch | Onde está na PR |
|---|---|
| feat/karaoke-ticket-inventory-ui | Patch equivalente já aplicado (placar rotativo do telão). |
| login-google-espacos | Todas as linhas já presentes. |
| feature/sora-jump-ranking-online | Versão anterior; ranking online ativo, `sora_run_start/finish/abort` e abas Semana/Geral já existem. |
| fix/sora-online-profile-tv | SQL e `sora-jump.html` idênticos; diferenças em `index.html` são textos antigos substituídos. |
| feature/sora-karaoke-v2-2026-10-29 | O texto do Google já saiu do botão do Gacha ("🎰 Girar!"); diferença apenas cosmética. |
| fix/karaoke-ticket-recovery | Reescrita na PR (`karaoke-tickets.js`, `karaoke-time.html`) com teste próprio. |
| fix/center-run-credit-recovery | Reescrita na PR com teste próprio. |
| feat/avatar-careca-capitao-estrela | Capitão, estrela e 3 cortes ondulados recuperados em `tw-avatar-items.js` / `tw-avatar-hair.js`. A opção careca foi removida pela própria branch. Arquivar só depois da conferência visual da seção 2. |
| feat/backstage-admin-single-owner | Documentação e testes presentes; a diferença é um bloco Sora⭐Jump na proposta SQL do perfil admin → encaminhado ao Supabase (seção 7). |

Estas 9 só entram na `main` quando a PR #58 for aprovada. Até lá, a PR é o lugar onde esse trabalho está preservado.

### C. Descartadas ou adiadas (4)

| Branch | Motivo |
|---|---|
| feature/karaoke-cd-player-popup | A moldura de CD foi removida de propósito na `main` (commit `f3db9aa`, "Remove unwanted Karaoke Time CD popup shell"). |
| recovery/restore-embedded-karaoke | Altera `sora-jump-karaoke.html`, que não existe mais; o Karaoke atual é `karaoke-time.html`. |
| chumikie-refatoracao-repositorio | Ensaio de Karaoke online/multijogador (SQL lab 3a11/3a12), contrário à regra do Karaoke solo. **Adiado**: lint (`tools/lint`) e testes `static-links` / `index-critical-flows` podem ser reaproveitados depois. |
| sql/ranking-abertura | Apenas SQL, marcado como já aplicado em produção; responsabilidade do Supabase. |

### D. Funcionalidades ausentes avaliadas (2)

| Branch | Decisão |
|---|---|
| feature/encontro-dia-duo-trio-profiles | **Descartada.** Regra do responsável: no Encontro solo aparecem ranking e Oshi; na Dupla (terça) e no Trio (sexta), não. A PR já faz isso (`index.html` `encMostrar` + `tw-mic-cd-popup.css`: `.encp.enc-grupo #encRk, #encSelo, #encOshi { display:none }`). A branch acrescentaria ranking/Oshi por membro do grupo, o oposto do desejado. |
| sem-online-historico | **Pendente de decisão.** Botão "entrar pelo método antigo" (`gisAntigo`) quando o login Google falha. Ausente da `main` e da PR. |

## 5. Alterações recuperadas de outras branches

- `feat/avatar-careca-capitao-estrela` → chapéu de Capitão, estrela, três cortes ondulados.
- `fix/karaoke-ticket-recovery` → recuperação de tickets (reescrita).
- `fix/center-run-credit-recovery` → reconciliação de crédito (reescrita).

## 6. Testes e CI

- Workflow `Check TsuLiPa special games`, run `41330584112` no HEAD `47b1c8a`: **aprovado** (`static-validation`, `postgres-center-run`).
- Execução local em 01/11/2026 (Node 22): **31/31** testes Node do workflow aprovados. Suítes PostgreSQL rodam apenas no CI.

## 7. Supabase (responsabilidade do ChatGPT)

Projeto `fsggtvgbyhchblyazgmt`. Nada é executado a partir desta PR.

- `20261031151827_karaoke_tickets_extra_shows_inventory_gacha`: consta como aplicada.
- `public.terminar_corrida` em produção ainda usa teto de 1.500 estrelas/dia.
- Proposta de 100 estrelas/dia por conta (`America/Sao_Paulo`): `supabase/migrations/20261101161409_center_run_daily_100.sql` + checklist, runbook e rollback em `supabase/sql/`. Homologada em PostgreSQL isolado; **depende de autorização específica**.
- Limite independente de 50 estrelas/dia dos minijogos do Pet: preservar.
- Não apagar saldos, históricos ou rankings.
- Para avaliar: bloco Sora⭐Jump da proposta `admin_player_profile_proposal.sql` (branch `feat/backstage-admin-single-owner`).
- Relatório final do Supabase: aguardando.

## 8. Checklist para aprovação final

- [ ] Conferência visual de cabelos, chapéu e estrela.
- [ ] Karaoke e tickets em fluxo autenticado.
- [ ] Teste em celulares reais.
- [ ] Faixa de visitantes do Karaoke investigada.
- [ ] Rankings de Karaoke revisados.
- [ ] Decisão sobre o botão de login antigo.
- [ ] Suíte completa e CI verdes no HEAD final.
- [ ] Relatório do Supabase recebido.
- [ ] Decisão do responsável sobre a migração de 100 estrelas.
- [ ] Revisão humana da PR e decisão de merge.
- [ ] Após o merge: arquivar as branches das seções 4-A, 4-B e 4-C com autorização.
