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

## Etapa 2.5 — auditoria de virada do dia e retorno da interface (2026-11-01)

**Estado confirmado:** HEAD de partida `56988ef`; CI #646 verde; função ativa de produção ainda usa `1500 - ganho_hoje`. Não houve DDL, deploy, merge ou escrita nos dados de produção nesta auditoria.

### Semântica comprovada

- O dia de referência é calculado na **finalização**, não no início: `hoje := (now() at time zone 'America/Sao_Paulo')::date`. Assim, corrida iniciada às 23:59 e validada após a meia-noite pertence ao dia da finalização. `star_log.created_at DEFAULT now()` usa o mesmo relógio transacional na operação; a função grava apenas crédito confirmado.
- O PostgreSQL avalia `now()` como o horário de início da transação. Se a transação aguardar o lock de `players` enquanto passa a meia-noite, ela pode contar o dia da abertura da transação, não o horário exato de liberação do lock. O `created_at` do log permanece coerente com esse mesmo instante transacional; decidir se esse comportamento é aceitável antes da ativação.
- O modelo JavaScript testa dois instantes da fronteira 03:00 UTC em novembro; o teste PostgreSQL confirma a conversão dos timestamps. **Lacuna:** nenhuma homologação acelera o relógio real ou finaliza uma corrida cruzando a meia-noite de fato.
- O campo `limite_diario` proposto é verdadeiro quando `ganho_hoje >= 100` **antes** de creditar esta corrida. Em 90 + pedido de 30, a RPC credita 10 e devolve `limite_diario=false`; a interface informa “10 estrelas”, mas não anuncia que a cota ficou esgotada. Isto não viola o teto e não rejeita crédito legítimo, mas é uma lacuna de UX. Não alterar silenciosamente o contrato: decidir se a próxima etapa deve sinalizar também o esgotamento *durante* a corrida, preservando o número de estrelas efetivamente creditadas.
- Com a função ativa legada, o frontend não recebe `limite_diario` e apresenta a quantidade que o servidor confirmar. Erros/tokens ausentes são informados como não validados; respostas atrasadas entre contas são descartadas pelo identificador da sessão.
- O teste de PostgreSQL isolado usa um motivo fictício `pet_minigame` para comprovar que motivos não-`corrida` ficam fora da soma; a RPC real do Pet utiliza `reason='minijogo'` e mantém teto independente de 50 estrelas. Reforçar a fixture antes de confiar nela como espelho exato do Pet.

### Pontos a decidir antes da autorização

1. Formalizar a regra de atribuição de dia como **instante transacional de finalização** (com a ressalva de espera por lock), ou exigir relógio de parede após o lock e re-homologar.
2. Definir feedback para crédito parcial ao completar 100: exibir simultaneamente “+10 estrelas” e “limite diário atingido” sem classificar a corrida como rejeitada.
3. Ampliar os testes fictícios para uma corrida efetivamente atravessando o dia e usar `reason='minijogo'` na fixture.
4. Revalidar função ativa, owner/ACL, migrações e totais antes de executar qualquer SQL real. **Nenhuma autorização de aplicação foi dada.**
