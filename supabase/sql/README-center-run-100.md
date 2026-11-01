# Center⭐Run! — revisão do teto diário (PR #58)

Estado em 2026-11-01: **proposta pronta para revisão; NÃO aplicada ao Supabase**.

## Contrato preservado

- RPC `public.terminar_corrida(uuid,integer,integer,text,text)`, `SECURITY DEFINER`, `search_path=public`.
- Autenticação via `auth.uid()`, verificação de propriedade e `finished_at is null`.
- Bloqueio `players FOR UPDATE` antes do cálculo diário; bloqueio da corrida para impedir duplicatas.
- Corrida com prazo máximo de duas horas e limite de pontuação em função do tempo.
- Limite por corrida de 400 estrelas e limite adicional por segundos jogados.
- Log apenas em `star_log.reason='corrida'`; `players.stars`, melhor pontuação e ranking preservados.
- Dia civil `America/Sao_Paulo`; Pet e outras origens de estrelas não entram no limite.

A diferença é o teto de 100 estrelas por dia por conta, com `limite_diario=true` quando uma corrida válida deixa de receber crédito porque a conta já esgotou o teto. O frontend já sabe explicar esse retorno.

## Evidências e limites dos testes

- Consulta somente leitura confirmou ACL atual: `anon=false`, `authenticated=true`, `service_role=true`.
- A suíte de CI testa o contrato em JavaScript e também executa o arquivo SQL proposto em **PostgreSQL 16 temporário** (serviço do GitHub Actions, com quatro contas fictícias). Duas sessões PostgreSQL simultâneas, repetição de UUID, propriedade, corrida inválida, créditos de outro dia, ACL e saldos finais são verificados no banco real isolado.
- O schema de teste é mínimo e reproduz os campos usados pela função; não é um clone completo do projeto Supabase. A virada do calendário é verificada com timestamps fixos, sem avançar o relógio do servidor. A instância temporária é descartada após o job.
- Nenhum saldo, corrida, tabela, função ou migração de produção foi alterado.

## Riscos antes de ativar

1. Contas que já receberam 100 ou mais estrelas de corridas no dia de ativação ganharão zero em corridas seguintes até a meia-noite de São Paulo. Seus saldos atuais não serão reduzidos.
2. A substituição é de uma função `SECURITY DEFINER` sensível; conferir `pg_get_functiondef`, proprietário e privilégios antes/depois. `CREATE OR REPLACE` com assinatura idêntica mantém o objeto/ACL atual.
3. Não usar a produção para simular corridas concorrentes ou idempotência; a prova de PostgreSQL isolado foi executada no CI, mas ainda requer revisão da compatibilidade com o schema completo.
4. O frontend só informa o limite corretamente depois que a nova função retorna `limite_diario`. Até a aplicação, ele continua aceitando a resposta legada.

## Sequência de implantação proposta (exige autorização específica)

1. Revisar os resultados do job isolado `postgres-center-run` e confirmar que o schema mínimo continua equivalente aos contratos usados pela função em produção.
2. Revisar resultados, assinatura, ACL e diferença da função ativa; preparar migração formal pelo CLI Supabase (indisponível neste ambiente).
3. Após autorização explícita, aplicar em produção com janela de observação e consultar `star_log` agregado.
4. Em caso de regressão, restaurar o corpo da função original de backup, preservando `players`, `runs`, `star_log` e ranking. Não zerar saldos nem desfazer créditos legítimos.

Arquivo SQL candidato: `supabase/sql/center_run_daily_100_REVIEW_ONLY.sql`.
