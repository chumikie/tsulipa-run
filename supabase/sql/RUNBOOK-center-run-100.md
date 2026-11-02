# TsuLiPa⭐World — roteiro de janela controlada (PR #58, etapa 2.11)

**PLANEJAMENTO APENAS — NÃO AUTORIZA PRODUÇÃO.** Nenhum comando de implantação deste documento deve ser executado sem autorização específica do responsável; a PR permanece draft.

## Janela sugerida

- **Dia:** a combinar explicitamente. **Horário:** **00h10–00h40 de Brasília** (`America/Sao_Paulo`) no dia escolhido, idealmente com atividade baixa e responsável disponível.
- A virada às 00h00 é evitada para permitir que corridas iniciadas no fim do dia anterior terminem. Não é garantia de ausência de corridas; verificar `runs` abertas e atividade antes de começar.
- **Critério de iniciar:** autorização escrita específica para aplicar `20261101234420_center_run_daily_100.sql` no projeto `fsggtvgbyhchblyazgmt`, HEAD e SQL aprovados, backup privado preparado, acesso de reversão validado e nenhum deploy/migração paralelo.
- **Critério de não iniciar:** falta de aprovação, HEAD alterado, CI vermelho, outra migração pendente, função/ACL divergentes do snapshot, falha na cópia da função, banco sob incidente ou testes visuais/funcionais críticos pendentes.

## T−30 a T−10 minutos: checagens somente leitura

1. Confirmar [PR #58](https://github.com/chumikie/tsulipa-run/pull/58) draft e SHA autorizado. Confirmar dois jobs verdes no último CI.
2. Conferir `supabase/migrations/20261101234420_center_run_daily_100.sql` **idêntico byte a byte** a `supabase/sql/center_run_daily_100_REVIEW_ONLY.sql`. Conferir lista real de migrações aplicadas.
3. Registrar privadamente `pg_get_functiondef`, `proowner`, `proacl`, `prosecdef`, `proconfig` da assinatura `terminar_corrida(uuid,integer,integer,text,text)`; comparar ao backup referência `center_run_daily_100_ROLLBACK_REVIEW_ONLY.sql`. Parar em caso de diferença.
4. Registrar agregados do dia de São Paulo por `reason='corrida'` e `reason='minijogo'`, sem salvar identificadores pessoais na PR. Conferir `ganhar_minijogo`: 50/dia.
5. Ler `runs` abertas recentes, erros da RPC e situação da conexão; não iniciar caso haja atividade que impeça uma janela segura.

### SQL de diagnóstico (SELECT apenas, não modifica dados)

```sql
select (now() at time zone 'America/Sao_Paulo')::date as dia_brasilia;

select p.proowner::regrole::text as owner, p.prosecdef,
       p.proacl::text as acl, p.proconfig,
       pg_get_functiondef(p.oid) as definition
from pg_proc p
where p.oid='public.terminar_corrida(uuid,integer,integer,text,text)'::regprocedure;

select reason, count(*) as lancamentos, sum(delta) as total_creditado
from public.star_log
where reason in ('corrida','minijogo')
  and (created_at at time zone 'America/Sao_Paulo')::date =
      (now() at time zone 'America/Sao_Paulo')::date
group by reason;

select count(*) as corridas_abertas_recentes from public.runs
where finished_at is null and started_at >= now()-interval '2 hours';
```

## T0: execução condicional — **somente depois de autorização específica**

1. Fazer backup **novo** da função ativa, com resultado e ACL guardados fora do repositório público; confirmar restauração disponível.
2. Confirmar que nenhuma migração intermediária foi aplicada e que o SQL autorizado é o mesmo hash revisado.
3. Pela via aprovada de migrações do Supabase, aplicar somente a definição versionada de `terminar_corrida`, preservando assinatura e grants atuais. **Não executar testes de corrida fictícia em produção nem tocar saldos/histórico diretamente.**
4. Não promover a PR à main, não publicar o site e não executar migrations em lote sem revisar a lista de pendências.

## T+1, T+5, T+15 e T+30: observação

- Conferir função efetiva contendo `100 - ganho_hoje` e resposta `limite_diario`; owner postgres, SECURITY DEFINER, search_path, ACL: `anon` sem EXECUTE, `authenticated` e `service_role` com EXECUTE.
- Conferir que novas corridas **reais** válidas mantêm ranking e melhor pontuação mesmo quando a recompensa é zero pelo limite; acompanhar erros `corrida_invalida`, `sem_conta` e respostas ausentes, comparando à linha de base.
- Conferir `star_log.reason='corrida'` por conta no novo dia (agregado administrativo privado), jamais apagando registros. Saldo `players.stars` não pode diminuir por efeito da migração.
- Conferir `ganhar_minijogo` e créditos `reason='minijogo'`, limitados independentemente a 50/dia, e dados de ranking preservados.
- Validar aviso de crédito parcial + limite no frontend correspondente; se a interface em produção for legada, reconhecer que ela não mostrará o novo campo até a versão de frontend autorizada.
- Anotar horário, evidências e responsável. **CI verde não substitui observação das RPCs reais.**

## Critérios de interrupção e reversão

Interromper por falha de assinatura/permissão, erros persistentes de RPC, crédito acima de 100 no mesmo dia após ativação, débito ou regressão de saldo, perda de ranking, Pet afetado ou divergência do SQL/owner.

**Reversão precisa de autorização específica adicional:**

1. Capturar diagnóstico da falha e definir o escopo; não alterar contas manualmente.
2. Restaurar a definição de função capturada **imediatamente antes** de T0, por nova migração de reversão versionada. O snapshot `center_run_daily_100_ROLLBACK_REVIEW_ONLY.sql` é somente referência histórica.
3. Confirmar ACL/owner/assinatura e monitorar novamente a RPC, saldos e rankings. Não apagar entradas válidas de `star_log` nem zerar saldos.
4. Registrar incidente e manter a PR draft; nenhuma reversão de aplicação ou publicação é implícita.

## Situação antes da decisão

- A PR contém proposta, migração versionada e testes PostgreSQL temporários aprovados.
- A função ativa continua com 1.500/dia. O Pet continua com 50/dia.
- **Falta a decisão de data/janela e a aprovação específica de execução em produção.**
