# ETAPA 3A — Karaoke⭐Day! Online · especificação beta de 9 vagas

**Status: design aprovado para desenvolvimento; backend NÃO implementado / NÃO ativado.**
**Incremento 3A.1 codificado (2026-10-29):** modelo local de 9 vagas e fila justa em [`karaoke-room-model.js`](./karaoke-room-model.js), testes [`tests/karaoke-room-model.test.js`](./tests/karaoke-room-model.test.js) e [página de ensaio](./karaoke-online-lab.html). **Não há multiplayer, autenticação, locks SQL, presença Realtime ou persistência reais**; demonstrar regras não equivale a sala online. Resultados sempre `demo_unverified`. Data: 2026-10-29. PR #33 permanece rascunho. Projeto privado `chumikie/tsulipa-run`.

## Decisões de produto
- Sala principal: **9 Idols simultâneos** — 1 no microfone e 8 na plateia. Ocupação calculada pelo servidor: no máximo 9 identidades distintas, independentemente de abas/dispositivos.
- Abertura pública: **domingo, 12h–13h10 no fuso `America/Sao_Paulo`**. Administração autenticada via `public.eh_admin()` pode ensaiar fora do período em sala de teste, com scores/recompensas falsos, nunca mesclados ao público.
- Um turno do microfone dura no máximo **60 s**: 5 s de entrada, **45 s** de ritmo, 10 s de aplausos/resultado e troca. Cantores participam da contagem de nove.
- A sala é acolhedora: plateia reage com emojis e mensagens *predefinidas*, sem chat livre; permitir silenciar, animações reduzidas e bloquear usuário incômodo.
- A implementação demonstrativa atual de `karaoke-day.html` (7 bots, "Simulador", contador de teste) **NÃO** representa multiplayer. Preservar arte/canvas como componente visual; esconder simulador para público depois que o servidor estiver pronto.
- Começar com uma sala de 9, não reservar artificialmente múltiplas salas vazias. Não vender acesso ou dar vantagens a quem paga; fila justa.

## Incremento 3A.1b — minijogo no Karaoke existente (testado no código, não online)
- A **cena original** de `karaoke-day.html` usa 9 como capacidade de demonstração, com 8 posições para plateia; 7 personagens de exemplo continuam simulados (incluindo o jogador local). A tela mostra explicitamente "Sala demonstrativa".
- **`karaoke-rhythm.js`** criou uma chart rítmica **original** de 40 notas, com início +5s e fim aos +50s. `karaoke-rhythm.css` dá interface para toque e teclado. `karaoke-day.html` agora conecta "Pegar microfone" a esta rodada local de 60s.
- Pontos, combo e contagem de `PERFECT` são **somente locais e não verificados**, não gravados, sem estrelas/insígnias.
- CI: `tests/karaoke-rhythm.test.js` testa tempos, julgamento de notas, duplicatas e resultado não persistido. `tests/validate-games.js` verifica integração estática. Ainda **não há sessões online nem autenticação**.
- A página do laboratório separado `karaoke-online-lab.html` continua útil para validar fila e lotação antes do backend. O jogo de ritmo está na **cena principal do Karaoke**, não apenas naquele laboratório.
- **Homologação inexistente**: único Supabase conectado é o projeto de produção e não foi alterado. Próximo incremento depende de configurar um projeto separado para testar RPC e concorrência real.

## Experiência detalhada
1. Login Google e status não bloqueado. Ao tocar no card, o frontend consulta **`karaoke_status()`**. Se fechado, mostra cronômetro e opções Fechar / Convidar (convites só quando backend estiver implantado).
2. Dentro da janela, `karaoke_entrar()` tenta adquirir uma das 9 vagas de forma **atômica**. `Presence` exibe pessoas conectadas, mas **não decide vagas**. Uma segunda aba da mesma pessoa não consome vaga adicional e não pode duplicar a atuação.
3. Quem entrar na plateia escolhe ficar em pé, sentado ou numa pose. Avatar/roupa já pertencentes ao usuário; reações locais não salvam dados.
4. Quem quiser cantar toca "🎤 Entrar na fila". Fila visível com apelido, avatar e previsão aproximada. **Uma inscrição por usuário**. Primeiro a entrar, primeiro a cantar; quem desistir sai da fila. Depois de uma apresentação, fica no final da fila e não pode furar a vez.
5. Servidor cria turno `turn_id` e atribui titular, `starts_at`, `rhythm_starts_at=+5s`, `rhythm_ends_at=+50s`, `expires_at=+60s`, revisão/versão monotônica. Só o titular pode publicar score aceito como *provisório*. O cliente executa notas localmente; todos veem score e animação aproximados.
6. Aos 60s, servidor fecha turno idempotentemente, valida limites/identidade/tempo, persiste **um resultado**, distribui o placar final e inicia a próxima pessoa. Se cantora sair, 10 s de tolerância para reconexão; vencido o prazo, libera microfone. Renovação de presença não deve ser necessária a cada nota.
7. Quem chega com sala cheia vê "Palco lotado por enquanto 💖", ocupação e nova tentativa manual/de baixa frequência. Não criar espera ilimitada sem reserva; estimativa de até ~8 minutos se todos os oito espectadores estiverem à frente (9 turnos x 60s, considerando a ordem).
8. Encerrar turno e convidar não devem causar concessão automática de estrelas nesta primeira fase.

## Arquitetura proposta (nomes ainda sujeitos à revisão; ambiente de homologação)
**Estado persistente mínimo (RLS + RPCs autenticadas)**

| Estrutura proposta | Campos mínimos / finalidade | Escritas |
|---|---|---|
| `karaoke_sessions` | id, domingo_BRT, status, lotacao=9, limite_abertura, versao | início/fim |
| `karaoke_seats` | session_id, user_id, last_seen_at, lease_expires_at, pose, joined_at | entrar/sair + batimento leve (15–30s) |
| `karaoke_queue` | session_id, user_id, queued_at, status | entrar/sair da fila |
| `karaoke_turns` | id, session_id, user_id, starts_at, expires_at, versao, estado | 1–2 por apresentação |
| `karaoke_results` | turn_id UNIQUE, user_id, session_id, score_final, perfect_count, chart_id, ended_at, validacao | **1 por atuação** |
| `karaoke_invites` | id, from_user, to_user, next_event_at, created_at, seen_at, declined_at | 1 por convite |
| `karaoke_invite_preferences` | user_id, receive_invites | só alteração da própria conta |
| `karaoke_perfect_totals` | user_id, verified_perfects, performances, updated_at | 1 atualização no encerramento válido |

**Interfaces autorizadas no servidor:** `karaoke_status`, `karaoke_entrar`, `karaoke_sair`, `karaoke_fila_entrar`, `karaoke_fila_sair`, `karaoke_turno_iniciar` (somente processo confiável/lock), `karaoke_turno_finalizar`, `karaoke_resultado`, `karaoke_convidar`, `karaoke_convites_pendentes`, `karaoke_convite_preferencias`. Todas validam `auth.uid()`; autorização do admin via `eh_admin()`, jamais por nick/flags do cliente. Preferir schema privado + endpoints controlados; se `SECURITY DEFINER` for realmente necessário, revogar EXECUTE público, fixar `search_path`, validar todos parâmetros e testar políticas.

**Realtime:** canal privado `karaoke:room:<session-id>`; Presence para indicadores suaves de online; Broadcast para `room_snapshot` na entrada, `turn_started`, `score_preview`, `emote`, `turn_finished`, `queue_changed`. O servidor/Edge Function (ou gateway autorizado) valida quem pode publicar eventos privilegiados. Nenhum cliente pode enviar em nome do outro, fingir nota perfeita ou tomar microfone por Broadcast sem validação.

**Consumo inicial:** transmitir `score_preview` **a cada 2 s** (cerca de 23 eventos/45s) em vez de por nota. Em sala de 9, se 8 recebem cada evento, ordem de grandeza de **23×(1+8)=207 mensagens Broadcast por apresentação** — variar com assinantes e eventos, não é garantia de fatura. Presence, entrada/saída, reconexões e snapshots somam consumo. Monitorar [Realtime usage](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages) e [Realtime reports](https://supabase.com/docs/guides/realtime/reports). Não fazer `UPDATE` por frame nem `LISTEN postgres_changes` de cada acerto.

## Insígnia "Nota Perfeita" ⭐
- `PERFECT` é o julgamento máximo de **uma nota** no jogo de ritmo, diferente de concluir uma apresentação com score máximo.
- Proposta escalonada: **10 PERFECT** = "Primeira Nota", **50** = "Voz de Estrela", **200** = "Encore Perfeito" (nomes e marcos de design, ainda não ativos).
- Cliente acumula localmente durante 45s e envia `perfect_count` e score no resumo **uma vez**. Servidor aceita apenas sessão válida, dono do turno, chart permitido, tempo correto, quantidade ≤ total de notas daquele chart e sem duplicação por `turn_id`.
- **Limite de honestidade:** o navegador não é antifraude confiável. Mesmo validando limites, resultados podem ser forjados. Antes de insígnias permanentes com prestígio/recompensa, usar replay de entradas, seed/chart assinado ou outra verificação de integridade em servidor. Até lá, mostrar pontuação e conquistas *de ensaio*, sem premiar economia.
- Garantir acessibilidade: janela de acerto ajustada para latência, opção de reduzir estímulos, controle por toque/teclado e feedback sem som.

## Convites no fechamento
- Ação de convidar envia uma única mensagem modelo simpática, não texto livre: "💌 [Idol] gostaria de cantar com você no Karaoke⭐Day! Domingo às 12h (Brasília)."
- Limitar convites propostos a **3 destinatários por remetente/dia**, 1 convite repetido para a mesma dupla/evento, sem auto-convites, destinatários bloqueados ou que optaram por silenciar. Recusar não notifica remetente.
- Consulta de pendentes uma vez no login, sem polling contínuo; modal aceitar/lembrar depois/ignorar/silenciar; convite não dá prioridade na fila nem reserva vaga.

## Acesso administrativo e segurança
- `karaoke_status()` deve consultar horário do **servidor**, não relógio do celular, e `eh_admin()` ao acessar sala de teste fora do horário.
- Moderador: inspecionar fila, remover participante (justificativa), limpar microfone travado, silenciar reações abusivas, encerrar sala; qualquer ação destrutiva exige confirmação e `admin_log`.
- **Falta implementar** gate da URL direta, permissões Realtime de canais privados e não permitir que app de teste em INDEX 2 grave dados reais. Nunca adicionar `service_role` ao HTML.

## Matriz de testes antes de qualquer ativação
- 9 usuários entram; 10º recebe lotado; 2 abas do mesmo usuário não duplicam vaga; 2 pedidos simultâneos pela 9ª vaga concedem só 1.
- Login anônimo, bloqueado, moderador e usuário comum; teste fora do domingo; fuso e virada DST; janela expirada; relógio local adulterado.
- 2 pessoas pressionam microfone simultaneamente; só 1 recebe lease; desliga wifi/reconecta; 60s vencem com aba fechada; vencedor não consegue prolongar; moderador reseta.
- Resultados submetidos duas vezes, perfects fora de limite, chart inválido, replay de outra sessão; nenhum prêmio no modo de teste.
- 9 participantes com celular fraco: FPS, áudio, consumo de rede, Broadcast/s e presença; checar relatórios reais de Realtime. Meta de início: 9 usuários durante 70 min com estabilidade, sem erros de permissão.

## Checklist de entrega incremental
1. Criar **projeto Supabase de homologação isolado**; nenhuma tabela nova na produção.
2. Reaproveitar o canvas da sala; substituir bots por snapshot + Presence de teste.
3. Implementar transações de vaga/turno, fila e relógio de servidor.
4. Construir ritmo em tela local e transmissão de placar limitada.
5. Persistir apenas resultado final, validar e auditar; insígnias ainda provisórias.
6. Implementar convites e preferências, testes com contas de homologação.
7. Liberar testes na INDEX 2 sem tocar `index.html` e sem merge.
8. Somente depois de aprovação explícita, planejar rollout para produção.
