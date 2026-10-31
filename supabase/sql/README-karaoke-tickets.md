# Karaoke⭐Time! — ativação de tickets (PR #52)

**Aprovado pelo mantenedor e aplicado ao Supabase de produção em 31/10/2026.**
Migração registrada: `20261031151827_karaoke_tickets_extra_shows_inventory_gacha`,
projeto `fsggtvgbyhchblyazgmt`. O arquivo `karaoke_tickets_REVIEW_ONLY.sql` mantém
o nome histórico da proposta revisada, mas agora é um **registro do SQL aplicado**:
não o execute manualmente outra vez. A migração foi executada pelo gerenciador de
migrações, sem rodar SQL pelo CI. O banco separado de homologação não foi alterado.

## Regras aprovadas

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
- **Star⭐Gacha!**: chance de **5% por giro** para ganhar um ticket.
  A chance dos cards passa de 45% para 40%; as outras probabilidades permanecem
  40% (estrelas pequenas), 12% (estrelas grandes), 3% (bônus). Se a carteira estiver
  cheia, ganha 5 estrelas em vez de ultrapassar o limite.
- Os tickets **não podem ser criados/editados por localStorage**, nem alterados pelo
  navegador: Gacha, doações, concessões e gastos só usam RPCs com `auth.uid()`.

## Verificação e cuidados para operação

1. Foi feito um teste transacional da migração com `ROLLBACK`, confirmando que não
   persistiu qualquer alteração; depois a migração foi aplicada e registrada.
2. A verificação posterior confirmou: carteiras e histórico criados vazios; quatro
   RPCs novas; duas colunas novas em `private.kt_runs`; RLS na carteira;
   `authenticated` pode iniciar show extra e `anon` não pode gastar/conceder;
   chamadas sem conta respondem sem alterar dados.
3. **Ainda precisa de QA funcional com contas de teste** no navegador, incluindo:
   duas abas pedindo o 5º show; 6º show com saldo zero/um; dois presentes cruzados;
   retry do mesmo `p_request`; fim/retomada em dois dispositivos; conta bloqueada;
   moderação autorizada/não autorizada; teto de 99; giro repetido no mesmo dia.
4. **Não zeramos as cinco tentativas de ninguém**. Qualquer reposição coletiva ou
   concessão de tickets exige uma operação separada e explícita da moderação.

## Comportamento do front

O módulo `karaoke-tickets.js` consulta a carteira no servidor. Se a RPC estiver
indisponível ou o usuário não estiver autenticado, o saldo local fica zerado, sem
criar tickets fictícios. As cinco apresentações gratuitas ainda usam `kt_run_start`;
o sexto show exige saldo e confirmação antes de `kt_ticket_run_start`.

Testes locais: `node tests/karaoke-tickets.test.js`, `node tests/karaoke-flow.test.js`
e `node tests/validate-games.js`. O workflow da PR executa o novo teste.
