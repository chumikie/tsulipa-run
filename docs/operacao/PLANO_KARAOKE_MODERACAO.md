# TsuLiPa⭐World — Karaoke online e moderação (plano técnico por etapas)
Atualizado: 2026-10-29. Branch: feature/sora-karaoke-v2-2026-10-29. PR #33 (rascunho).

**DECISÃO MAIS RECENTE (fonte autoritativa de design):** [ETAPA3A_KARAOKE_ONLINE_9_IDOLS.md](../etapas/ETAPA3A_KARAOKE_ONLINE_9_IDOLS.md) — capacidade inicial **9 participantes** (1 canta e 8 assistem); turno de 60 s, 45 s de ritmo, atualização parcial do placar a cada 2 s. As demais especificações: [catálogo](../etapas/ETAPA3B_CATALOGO_KARAOKE_SORA_DUO.md), [temporadas/covers](../etapas/ETAPA3C_TEMAS_E_COVERS.md), [vozes e animações](../etapas/ETAPA3D_TRIO_VOZ_E_ANIMACAO.md). Nenhuma das estruturas propostas foi ativada em produção.

## Estado verificado
- INDEX 2 usa Supabase real e deliberadamente bloqueia RPCs de escrita em `contaRpc`; não remover essa guarda enquanto a branch for laboratório.
- `public.eh_admin()` consulta `public.admins.user_id=auth.uid()`. Há uma conta administradora configurada. O perfil de quem está autenticado recebe `admin` via `meu_perfil()` (o frontend mantém `perfAdmin`); nunca liberar poderes usando nick = "Tsu" ou valores manipuláveis do navegador.
- `karaoke-day.html` atual é um protótipo de sala, com bots, estados simulados, controles de "Simulador" e saldo de teste. A rotina de cartazes consulta `karaoke_posteres_semana`, mas isso NÃO equivale à presença online nem ao microfone multiplayer.
- Na INDEX 2, moderadora autenticada pode testar o iframe fora do horário. Isso não protege a URL independente; a liberação real precisará ser validada por RPC no backend.
- Hoje não há tabelas/RPCs de convites de Karaoke, de posse de microfone ou de edição administrativa de roupa de outros jogadores. Nenhuma foi criada na produção nesta etapa.

## Auditoria de permissões atuais (no banco)
`admin_acao`: limpar frase, renomear (gera Idol####), limpar foto, bloquear/desbloquear conta, ativar/desativar presença Moon Duo/outdoors, apagar recado, ligar/desligar recados globais.
`admin_dar`: ajustar estrelas (limites por ação/dia, star_log), conceder item, alternar insígnia especial; usa admin_log.
`admin_presente`: criar/encerrar presente global ou pessoal.
`admin_aviso`: aviso de início global.
`admin_corrida`: remover corrida indevida e recalcular recorde.
`admin_missoes_completar`: concluir missões da própria conta administrativa.
`admin_contas`, `admin_painel`, `admin_resumo`, `admin_extra`, `admin_extrato`: consultas de contas, controles e extrato. Os métodos privilegiados usam `eh_admin()` nos corpos verificados.
Lacunas: `admin_acao` não registra em `admin_log` todas as suas alterações; nenhuma função específica permite vestir outra pessoa; nenhum endpoint autentica acesso à sala fechada.
O auditor Supabase sinalizou funções SECURITY DEFINER expostas e tabelas RLS sem políticas. Isso pode ser intencional num modelo RPC-only; verificar cada `GRANT` e função antes do lançamento, em vez de remover permissões indiscriminadamente.

## Etapa A — Janelas e tema (frontend INDEX 2; já codificado)
- Tema do Oshi/idioma seguem para `?embed=index2&oshi=...&lang=...`; somente valores permitidos.
- Sora e Karaoke recebem shells de CSS isolados e não alteram o canvas. Sora oculta importação JSON no modo integrado.
- No card fechado: horário domingo 12h–13h10 BRT, aviso com fechar e uma prévia claramente não enviada de convite.
- Conta validada por `contaAdmin()` pode abrir o protótipo da sala fora do horário na INDEX 2. Ainda não representa autorização de sessão online.

## Etapa B — Convites carinhosos persistentes (BACKEND ainda não aplicado)
Criar tabela privada `karaoke_convites`:
  id, de UUID, para UUID, inicio_evento TIMESTAMPTZ, criado_em, visto_em, cancelado_em.
Regras:
1. RPC `karaoke_convidar(p_nick)` exige `auth.uid()`, remetente registrado, destinatário distinto, não bloqueado e opt-in. Limite sugerido: 3 convites/dia por emissor, um convite da mesma pessoa por destinatário e por evento, sem mensagens livres (frase fixa segura).
2. Horário do convite calculado no servidor: próximo domingo às 12:00 de Brasília. Única linha por convite com UNIQUE apropriada; sem fazer consultas constantes de presença.
3. RPC `karaoke_convites_pendentes()` devolve SOMENTE convites da própria conta e marca como vistos em transação. Consultar uma vez após login; mostrar modal fofo com avatar público de quem convidou, "Aceitar", "Agora não" e "Silenciar convites".
4. Nenhum envio de e-mail, push, perfil privado ou dados de contato por padrão. Fazer testes de bloqueio e rate limit.
5. Ativar somente após teste com duas contas reais em ambiente de homologação.

## Etapa C — Jogo de ritmo online (BACKEND ainda não aplicado)
- Palco aberto domingo 12:00–13:10 em America/Sao_Paulo; até **9 presentes (1 no microfone e 8 na plateia)**, fila.
- Uma RPC autenticada toma o microfone em transação, cria token de sessão e expiração de 60 segundos. 45 segundos de notas no cliente, ~15 segundos de introdução/encerramento. Lease expira automaticamente ao desconectar; o servidor escolhe o próximo da fila.
- Supabase Realtime Presence para participantes e Broadcast em canal privado da sala. Broadcast só para começo, troca de cantor e placar (no máximo 1 atualização/s), sem gravar acertos de notas individualmente em Postgres.
- Servidor salva UMA linha final de apresentação por cantor/sessão (pontuação, música original/autorizada, métricas não sensíveis), com validação de limites, tempo, membro e sessão; não vincular recompensa de estrelas/ranking enquanto não houver antitrapaça.
- Manter tudo dentro do jogo: score ao vivo, corações, aplausos fofos e mensagens de incentivo predefinidas, sem texto livre. Pausar Broadcast/Presence ao sair da sala.
- Medir consumo real em Realtime: transmissão conta 1 envio + destinatários. Uma apresentação de 45 s com placar a cada 2s e 9 conexões pode representar da ordem de 23 × (1 envio + 8 destinatários) ≈ 207 mensagens Broadcast, mais presença e transições. Não prometer custo zero; monitorar cotas e comportamento em desconexões.

## Etapa D — Moderação do Karaoke e roupas alheias (BACKEND ainda não aplicado)
- Novo RPC `karaoke_autorizacao()` calcula no servidor a janela semanal e `eh_admin()`; impede participação normal fora da janela mesmo com URL direta.
- Moderadora pode visitar sala de teste e visualizar fila/ocupação, remover ou silenciar participante com motivo, encerrar apresentação, reabrir sessão/limpar lease travado; sempre com `admin_log` e confirmação em ações destrutivas.
- Nova RPC separada `admin_vestir(p_nick, p_roupa, p_cor)`: `eh_admin()` obrigatório, validar o alvo, evitar edição inadvertida de outro administrador, aceitar apenas roupas reconhecidas e gratuitas ou pertencentes ao guarda-roupa do jogador; não conceder itens pagos acidentalmente.
- Preservar o avatar JSON existente, mudando só `avatar.c.out` e opcionalmente `avatar.c.outcol`. Nunca sobrescrever nome, rosto, cabelo, Oshi, pets, saves, estrela, inventário. Registrar antes/depois e motivo em log, oferecer "Desfazer" seguro.
- No perfil público, mostrar "🧵 Vestir para inauguração" SOMENTE à moderação autenticada, com prévia e confirmação. Para mudanças visíveis a todos, usar a RPC após homologação. Permitir à pessoa trocar de roupa novamente depois.
- Testes de conta não-admin, valores inválidos, roupas não possuídas, competição com edição do próprio jogador, auditoria e reversão.

## Critérios de segurança e não regressão
- Não aplicar SQL em produção nesta etapa. Não alterar `index.html` ou fazer merge.
- Não usar token service_role em HTML. Todas as funções escritas exigem auth.uid e validação server-side; tabelas com RLS e grants mínimos.
- Não usar apelidos como prova de administração. Assinar/validar autorização para entrar no Karaoke direto e garantir que os clientes comuns não possam produzir pontuações/convites alheios.
- Testes automatizados + revisão real no iPhone/desktop + testes multiusuário em homologação antes de ativar.
