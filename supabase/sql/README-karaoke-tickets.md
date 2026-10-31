# Karaoke⭐Time! — proposta de tickets (PR #52)

**Somente revisão. Não foi aplicado ao Supabase de produção nem ao de homologação.**
O arquivo `karaoke_tickets_REVIEW_ONLY.sql` é uma proposta transacional para execução
futura, exclusivamente após autorização explícita do mantenedor. Esta PR não contém
automação que execute o SQL. **Não fazer merge nem deploy de produção por esta tarefa.**

## Produto proposto

- **5 shows gratuitos por dia** por conta, horário de Brasília. Retomar uma partida
  já iniciada não gasta outra tentativa.
- **Ticket de Karaoke 🎟️**: unidade adicional de inventário (máximo de 99).
  A confirmação avisa que gastará um ticket antes de pedir autorização ao servidor.
  Um ticket é gasto ao começar o sexto show em diante; terminar ou abandonar esse
  show não devolve o ticket, assim como uma tentativa gratuita.
- **Presentes entre Idols**: uma unidade por transferência, pelo nick da conta.
  As duas carteiras são bloqueadas na transação, com trilha de auditoria.
- **Presentes da moderação**: 1 a 20 unidades por concessão, com motivo e registro
  em `admin_log`. A RPC verifica `eh_admin()` no servidor.
- **Star⭐Gacha!**: proposta inicial de chance de **5% por giro** para ganhar um ticket.
  A chance dos cards passa de 45% para 40%; as outras probabilidades permanecem
  40% (estrelas pequenas), 12% (estrelas grandes), 3% (bônus). Se a carteira estiver
  cheia, ganha 5 estrelas em vez de ultrapassar o limite. Esta probabilidade deve
  ser aprovada junto do SQL.
- Os tickets **não podem ser criados/editados por localStorage**, nem alterados pelo
  navegador: Gacha, doações, concessões e gastos só usam RPCs com `auth.uid()`.

## Antes de aplicar a proposta (etapa futura)

1. Revisar o SQL em conjunto com quem administra Supabase. Validar principalmente
   os `SECURITY DEFINER`, `REVOKE/GRANT`, a ordem de bloqueio das carteiras e o
   contrato atual do `gacha_girar`. Não usar contas reais para o ensaio.
2. Testar em **ambiente isolado**, com dados de teste e backup, incluindo:
   duas abas pedindo o 5º show; 6º show com saldo zero/um; dois presentes cruzados;
   retry do mesmo `p_request`; fim/retomada em dois dispositivos; conta bloqueada;
   moderação autorizada/não autorizada; teto de 99; giro repetido no mesmo dia.
3. Conferir políticas e privilégios da schema `private` e assinatura das funções
   antes de executar. As tabelas privadas têm RLS ativo e permissões de acesso
   direto revogadas para `anon` e `authenticated`.
4. **Só depois da aprovação**, aplicar a migração e validar o front em preview com
   contas de teste. Não zerar as cinco tentativas dos jogadores sem autorização
   específica e procedimento separado.

## Comportamento do front antes da aprovação

O módulo `karaoke-tickets.js` tenta consultar `kt_ticket_wallet`. Enquanto a RPC
não existir, mostra que os tickets aguardam ativação e mantém o saldo em zero.
O fluxo existente de cinco shows continua chamando `kt_run_start` sem alterações
no banco. O sexto show não é autorizado; ninguém recebe um ticket fictício.
As ferramentas de presente/moderação só ficam operacionais após a aplicação.

Testes locais: `node tests/karaoke-tickets.test.js`, `node tests/karaoke-flow.test.js`
e `node tests/validate-games.js`. O workflow da PR executa o novo teste.
