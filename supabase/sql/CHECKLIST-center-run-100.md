# Center⭐Run! — checklist controlado de aplicação e reversão (Etapa 2.3)

**Estado:** apenas revisão. SQL de produção **NÃO autorizado**, **NÃO aplicado**. PR #58 permanece draft. Data de referência: 2026-11-01.

## Evidência de comparação com produção

- Função ativa consultada via `pg_get_functiondef`: `public.terminar_corrida(uuid,integer,integer,text,text)`, `RETURNS json`, `SECURITY DEFINER`, `search_path=public`.
- A proposta `center_run_daily_100_REVIEW_ONLY.sql` mantém o bloqueio de `players FOR UPDATE`, token da `runs` pertencente a `auth.uid()`, não repetição (`finished_at is null`), expiração de 2 horas, cálculo de pontuação por tempo, teto por corrida 400 e por duração, atualização de `players`, lançamento em `star_log` e entrada no `leaderboard`.
- Diferenças deliberadas: `1500 - ganho_hoje` → `100 - ganho_hoje` e novo campo de resposta `limite_diario`. Não há `DELETE`, atualização retroativa ou alteração de schema.
- `ganho_hoje` filtra exclusivamente `star_log.reason='corrida'` e dia de `America/Sao_Paulo`; regras independentes do Pet (50/dia) e demais motivos não são tocadas.
- Produção: `runs.id` UUID PK e `user_id` FK; `players.id` UUID PK, `stars >= 0` e `best >= 0`; `star_log` tem `user_id`, `delta`, `reason`, `created_at`; `leaderboard` tem checks de score, estrelas, nome, personagem e dispositivo. Todos os campos referidos pela proposta existem.
- Há gatilhos `players_visual_sync`, `lb_contar` e `lb_set_date`: a proposta preserva suas chamadas indiretas. A validação isolada usa schema mínimo e **não reproduz esses gatilhos**; sua compatibilidade foi inspecionada em leitura, não exercitada em produção.
- ACL anteriormente conferida: execução concedida a `authenticated` e `service_role`, não a `anon`; a função original pertence a `postgres`. Confirmar novamente na janela.
- Homologação: workflow de PR com PostgreSQL 16 efêmero, contas fictícias, sessões concorrentes, UUID duplicado, dono errado, corrida inválida, separação de dias, ACL e saldos. Não reproduz o relógio real acelerado nem todos os gatilhos/integrações Supabase.
- **Atenção à semântica da mensagem:** `limite_diario=true` apenas se a conta **já** tinha >=100 créditos de corrida antes da nova chamada. Uma corrida que completa exatamente o teto pode creditar parte da recompensa e retornar `false`; isto não altera o teto, mas exige observar a UX.

## Checklist pré-aplicação — sem escrita

- [ ] Obter aprovação **específica** para executar SQL em produção; aprovação da PR/testes não equivale a autorização de banco.
- [ ] Registrar horário de início e responsável; preferir fronteira de dia de Brasília para reduzir surpresa aos usuários.
- [ ] Conferir PR draft, HEAD aprovado, CI completo verde e hash do arquivo SQL candidato.
- [ ] Consultar `pg_get_functiondef`, owner, `prosecdef`, `proconfig`, `proacl`; comparar com o snapshot `center_run_daily_100_ROLLBACK_REVIEW_ONLY.sql`. **Parar se houver divergência** desde o snapshot.
- [ ] Conferir tabelas, constraints, triggers, grants, políticas e eventuais migrações concorrentes; não alterar o Pet.
- [ ] Consultar totais agregados por dia/conta de `star_log` (`reason='corrida'`) e saldos de `players` por leitura; não exportar dados pessoais para o repositório.
- [ ] Validar que o frontend servido na PR interpreta `limite_diario` e que uma resposta legada permanece aceita.
- [ ] Confirmar o resultado verde dos dois jobs de CI e registrar limitações da homologação.

## Aplicação — somente APÓS autorização específica

- [ ] Criar migração formal versionada conforme o fluxo atual do Supabase, após revisão de manutenção/DDL.
- [ ] Guardar backup íntegro e seguro de `pg_get_functiondef` **do momento da aplicação**, ACL/owner, além do snapshot desta PR.
- [ ] Aplicar apenas `CREATE OR REPLACE FUNCTION public.terminar_corrida(...)` com a assinatura idêntica, sem `DROP FUNCTION` e sem migração das tabelas.
- [ ] Conferir função/ACL/owner efetivos logo após; interromper se diferentes do esperado.
- [ ] Evitar inserções artificiais de corridas, atualização manual de saldo ou testes destrutivos em produção.

## Pós-aplicação — verificação não destrutiva

- [ ] Comparar `pg_get_functiondef` com o candidato autorizado e confirmar retorno do campo `limite_diario`.
- [ ] Verificar `authenticated` com EXECUTE e `anon` sem EXECUTE; owner e `SECURITY DEFINER` inalterados.
- [ ] Observar telemetria de corridas reais e logs de erro; confirmar que `star_log.reason='corrida'` soma no máximo 100 créditos por conta no dia de Brasília **a partir do estado já existente**.
- [ ] Conferir que `players.stars` e `best` não sofrem quedas inesperadas; comparar agregados antes/depois, sem expor usuários.
- [ ] Verificar novas entradas e gatilhos de `leaderboard`, preservando corridas válidas mesmo sem crédito.
- [ ] Conferir créditos e regra de 50/dia do Pet por leitura e pelo teste existente, sem misturá-los à categoria `corrida`.
- [ ] Verificar mensagens: corrida inválida versus corrida válida com zero estrelas por teto; testar visualmente na preview com conta autorizada se possível.

## Critérios de interrupção e reversão

- [ ] Interromper perante erro de RPC, perda/duplicação de crédito, alteração inesperada do ranking, ACL/owner divergente, erro de trigger ou conflito de migrações.
- [ ] Com **nova autorização específica de reversão**, restaurar a definição previamente capturada da função, **sem** apagar `star_log`, `runs`, `leaderboard`, nem reverter saldos legítimos. O arquivo `center_run_daily_100_ROLLBACK_REVIEW_ONLY.sql` é uma cópia de referência do estado em 2026-11-01, **não substitui** o backup obtido imediatamente antes da implantação.
- [ ] Comparar assinatura/ACL após reversão, observar logs e reconciliar qualquer desvio de saldos por investigação individual, nunca por reset em massa.
- [ ] Registrar horário, evidências e aprovação; manter PR draft, sem merge automático.

**Arquivos:** candidato `center_run_daily_100_REVIEW_ONLY.sql`; snapshot de reversão `center_run_daily_100_ROLLBACK_REVIEW_ONLY.sql`; contexto `README-center-run-100.md`.


## Etapa 2.7 — homologação temporal isolada (2026-11-01)

- [x] CI PostgreSQL 16 temporário: relógio controlado **apenas na cópia da função** (substituição de `now()` por `public.center_test_now()` no container efêmero); o SQL candidato da PR e o SQL de produção não foram alterados.
- [x] Duas sessões PostgreSQL reais: uma mantém `players FOR UPDATE`, a outra aguarda ao finalizar com horário lógico `2026-11-01 23:59:59 America/Sao_Paulo`; observador independente avança o relógio externo fictício para `2026-11-02 00:00:01` durante a espera.
- [x] O crédito da transação bloqueada permanece no dia de seu relógio transacional. Uma corrida iniciada antes da meia-noite e finalizada sob relógio transacional posterior entra no dia seguinte.
- [x] Conta fictícia E: créditos Center **100 no dia 01 e 100 no dia 02**, incluindo créditos parciais; `minijogo` mantém 50 no histórico independente, sem consumir o teto Center.
- [x] Saldos finais fictícios, três entradas de ranking, UUID repetido sem duplicação, ACL e testes de concorrência anteriores verificados no CI.
- [x] CI #659: `static-validation` e `postgres-center-run` aprovados.
- [ ] Teste em produção **não realizado nem autorizado**. O relógio virtual reproduz a semântica temporal e a espera de lock, mas não altera o relógio real do servidor; testes de dispositivo/uso real continuam pendentes.

**Decisão preservada:** o teto segue o dia do timestamp transacional da finalização. Se a transação aguarda bloqueio durante a virada, permanece no dia em que começou a transação. Confirmar aceitação dessa regra antes de aplicar SQL em produção. Nenhuma função, tabela, saldo, histórico ou ranking de produção foi alterado.
