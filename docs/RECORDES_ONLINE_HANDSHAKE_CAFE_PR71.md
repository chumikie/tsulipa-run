# PR #71 — Handshake e Happy⭐Cafe! com recordes ONLINE verificáveis

**Decisão de produto (03/11/2026):** o resultado final desejado é ONLINE, por conta, como Center⭐Run!, Sora⭐Jump! e Karaoke⭐Time!. O histórico local de até 10 resultados já feito nesta PR é apenas uma etapa de transição/offline. **Não considerar entregue o pedido de recordes online antes da autorização e execução segura do SQL.**

## Regra que precisa valer em ambos os jogos

- Cada conta: **5 maiores pontuações da vida**, **5 partidas mais recentes** e **melhor da semana** (domingo 00h, America/Sao_Paulo).
- As duas listas podem se sobrepor. Armazenar sua união, no máximo dez partidas por jogo/conta; manter separadamente **uma maior pontuação de sempre** e **uma melhor semanal**, para não apagá-las quando deixarem a lista recente. 
- Resultados de partida só entram no banco pelo finalizador que **verifica a partida no servidor**. Nunca criar RPC que aceite `p_pontos` arbitrário do navegador.
- Repetir um `run_id` confirmado deve retornar o mesmo recibo, sem duplicar resultados, prêmios, missões ou tickets.
- Um placar semanal público, se habilitado, deve ser calculado sobre a melhor pontuação verificada da semana por conta. Não publicar tentativas de treino, sessões inválidas ou nomes privados sem regras de perfil.
- Limpeza em lotes: sessões/challenges já expiradas e reconhecidas, mantendo uma semana de margem; registros pessoais podem ser reduzidos a 10 + recordes; registros semanais antigos podem ter retenção de 8–12 semanas. **Nunca** incluir `handshake_premios`, `kt_ticket_events`, logs financeiros, resgates ou provas necessárias de missões na limpeza indiscriminada.

## Bloqueios reais encontrados no banco ativo

### 🤝 Handshake

- `public.handshake_premio(p_sessao,p_respostas)` **já recalcula a pontuação** com desafios da sessão e respostas; isso serve como base para pontuação online auditável.
- `private.handshake_resultados` guarda **um máximo por dia** (`user_id,dia,acertos,pontos`); é prova válida da missão, mas não guarda as últimas cinco **partidas**.
- `handshake_iniciar()` recusa iniciar desafios após o prêmio diário; `handshake_premio()` também devolve o prêmio anterior antes de verificar outra sessão. Logo, hoje não dá para registrar online todas as partidas depois do primeiro prêmio.
- **Migração segura:** separar a confirmação de pontuação da concessão de prêmio. Deixar novas partidas verificadas acontecerem sob o limite diário de sessões, registrar `run_id` e pontuação calculada pelo servidor, e manter o prêmio ticket/item **uma única vez por dia**, sem estrelas. A API antiga deve continuar compatível até a transição completa.

### 🧋 Happy⭐Cafe!

- `cafe_iniciar()` emite uma sessão com pedido; `cafe_concluir(p_sessao,p_monta)` compara os quatro ingredientes e registra a **missão do dia** ao confirmar um pedido perfeito.
- O backend **não guarda a pontuação final das 12 rodadas**, nem o combo/tempo da partida. `private.cafe_resultados` confirma uma atividade por dia; não é prova de pontos.
- O cliente hoje calcula pontos com tempo restante, combo, ingredientes e bônus semanal. **Copiar esse número do localStorage ao Supabase permitiria trapaça.**
- **Migração segura:** servidor emite um identificador de partida, vincula as sessões de pedidos a ele, calcula e confirma cada resultado com a mesma regra de jogo (inclusive bônus semanal e ordem), e fecha uma única partida autenticada em `cafe_run_finish`. O valor de placar online deve vir do recibo do servidor. Validar diferenças entre relógio do cliente e servidor antes de substituir a pontuação mostrada.

## Proposta mínima de persistência (revisão SQL, ainda não executada)

- Tabela privada de pontuações verificadas: `(user_id, jogo, run_id, pontos, concluido_em)`, única em `(jogo,run_id)`, gravada só pelos finalizadores confiáveis. Índices compostos por `(user_id,jogo,pontos DESC, concluido_em DESC)` e `(user_id,jogo,concluido_em DESC)`; testar índices com `EXPLAIN` real.
- Tabela privada pequena de máximos agregados (all-time e semana corrente), para sobreviver à poda dos resultados recentes.
- Procedimento interno que mantém apenas a união dos cinco maiores e cinco últimos após gravação, com bloqueio serializado por conta/jogo para concorrência e idempotência por sessão. Histórico financeiro, provas e missões em tabelas independentes, sem exclusão por esse procedimento.
- RPC de **leitura** autenticada `meus_recordes_jogo(p_jogo)` que resolve usuário por `auth.uid()`, verifica conta bloqueada e devolve `melhores[5]`, `recentes[5]`, `melhor_semanal`, `maior_geral`. Revogar EXECUTE de PUBLIC e conceder só a `authenticated`; no caso de SECURITY DEFINER, manter `search_path` vazio e todas as tabelas qualificadas. Não expor gravação direta por cliente.
- PR de UI só deve mostrar estado **online confirmado** depois de receber esse recibo/consulta; em erro deve rotular histórico do aparelho claramente, sem inventar uma sincronização.

## Dependências que ficam intocadas

1. `handshake_premio`: prêmio do dia (ticket ou item do pet, sem estrelas), `public.handshake_premios` e lançamento de ticket.
2. `missoes_handshake_cafe`: **★10** mediante prova de atividade, sem usar placar local.
3. `conquistas_jogos_novos`: proposta anterior foi desativada; a nova RPC `conquista_jogo` verifica resultados registrados no servidor e acrescenta insígnias em `players.insignias_jogos`, sem apagar valores existentes.

## Critérios de aceitação para autorizar o SQL

- Duas contas: 5 melhores, 5 recentes e semanal independentes após logout/relogin, troca de aparelho e atualização de página.
- Partidas repetidas, timeout e duas solicitações simultâneas não geram duplicatas, nem um segundo prêmio de Handshake no mesmo dia.
- Missões continuam ★10 só com atividade verificada, e tickets, inventários e log financeiro permanecem iguais.
- Café: provar que pontuação final da partida é reproduzida pelo servidor; bloquear envio de score arbitrário.
- Simular 50 partidas/conta/jogo: no máximo 10 registros de partidas + os máximos necessários; cruzar domingo e retenção.
- Testar SQL em transação revertida antes de qualquer produção e pedir autorização separada. **Sem merge/deploy até a decisão do usuário.**

**Estado em 03/11/2026:** implementação de cliente preparada na PR #71 e SQL **aplicado ao Supabase de produção** (migração `20261103231720_pr71_recordes_online_insignias_verificados`).
- Handshake: `handshake_run_finish` registra toda sessão confirmada mesmo após o prêmio diário; `handshake_iniciar` permite recomeçar até 30 sessões/24h. O prêmio original só acontece uma vez por dia e há recibo idempotente vinculado à sessão.
- Café: `cafe_run_iniciar`, `cafe_run_pedido`, `cafe_run_etapa` e `cafe_run_finalizar` verificam até 12 pedidos, tempo e combo. A pontuação exibida como online vem do servidor.
- Insígnias: `conquista_jogo` permite somente `jogo_memoria`, `jogo_barista` e `jogo_caderno`, baseadas em provas armazenadas, e usa `players.insignias_jogos`.
- Recordes: `meus_recordes_jogo` retorna listas e máximos por conta. Enquanto a RPC não estiver ativa, a tela deixa claro quando mostra registros apenas deste aparelho.
- SQL aplicado após ensaio completo em transação revertida no banco real. Cópia auditável em `supabase/sql/aplicado/20261103231720_pr71_recordes_online_insignias_verificados.sql`. O frontend continua na PR em rascunho, **sem merge/deploy**.

**Validação realizada:** JS e contratos passaram; o CI aprovou `static-validation` e `postgres-center-run` com PostgreSQL 16 descartável (duas contas, 12 pedidos, combo/tempo, 50 partidas, prêmio único, idempotência, insígnias e preservação financeira). O SQL foi compilado também contra o esquema real numa transação com `ROLLBACK`, sem persistência. Após autorização separada, a migração foi aplicada com sucesso. As sete novas RPCs, as quatro tabelas privadas, RLS e permissões de autenticação foram conferidas. Leitura real das duas RPCs de recordes por conta autenticada devolveu `ok=true` e `origem=servidor`. Prêmios, tickets, missões e insígnias preexistentes permaneceram com as mesmas contagens; houve uma atualização concorrente de uma conta (+3 estrelas agregadas), sem comando de estrelas na migração.

**Pendente exclusivamente para aprovação de lançamento:** confirmar no site de prévia com uma conta real a partida completa do Café, duas partidas Handshake no mesmo dia, a recuperação de prêmios, a missão ★10 e a exibição persistente das insígnias/recordes; obter aprovação final explícita para merge/deploy. O job `browser-karaoke` foi dispensado como condição. Não executar SQL novamente ao publicar.