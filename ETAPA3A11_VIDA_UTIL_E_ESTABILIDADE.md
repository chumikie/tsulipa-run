# TsuLiPa⭐World — Etapa 3A.11
## Estabilidade do Karaoke e Sora⭐Jump

**Destino:** PR #33 — branch feature/sora-karaoke-v2-2026-10-29 (rascunho).
**Data:** 29/10/2026.
**Publicação:** somente atualização técnica controlada, com [skip netlify]. A Vercel fica pausada. Não fazer merge.

### 1. Karaoke: renovação da vaga
A sala de homologação usa 9 assentos, um microfone, uma fila de 3 e lease de 45 segundos, renovada pelo cliente a cada 30 segundos. O cliente compartilhava uma única Promise entre consultas de status e heartbeat. Uma consulta de status que estivesse em andamento podia absorver o heartbeat seguinte e deixar a vaga expirar.

O cliente agora anota renovações solicitadas e executa o heartbeat após a consulta em andamento. Se o portão fechar ou o token deixar de ser válido, não renova a lease. Dados da sala continuam vindo exclusivamente das RPC autenticadas; Realtime informa somente o número de revisão.

### 2. Celular: saída e retorno ao navegador
O pagehide continua encerrando Realtime e os dois intervalos do Karaoke, mas agora zera as referências. Em pageshow, enquanto a sessão permanecer válida, reinicia cada intervalo uma única vez e consulta o servidor. Uma lease realmente expirada nunca é recriada localmente.

O signup de homologação permanece desligado, o portão SQL continua fechado e os testes não criam contas nem alteram banco.

### 3. Adaptação revisada do Gemini: Sora⭐Jump
- Botão de voltar e fechar: executar a limpeza original antes da mensagem ao hub da INDEX 2. Escape também devolve o usuário ao hub.
- pagehide interrompe o loop e o áudio; pageshow retoma o jogo aberto após bfcache sem duplicar requestAnimationFrame.
- Nós Web Audio desconectados após cada nota.
- Plataformas, partículas, itens e perigos compactados in-place, mantendo as condições originais e evitando alocações de array em cada frame. Teto de 120 partículas em picos extremos.
- As DUAS espécies de partículas (brilhos e pulo) usam coordenadas mundiais dentro do canvas já transladado. O patch original corrigia apenas um tipo.
- Pet e acessórios restaurados do armazenamento isolado APÓS declaração das variáveis; JSON inválido não derruba o jogo. O nickname respeita exclusão no armazenamento isolado.

**Não modificados:** gravidade, impulsos, colisões, saves de produção, paleta kawaii, trilhas, economia, moedas, ranking e decisões visuais. Não aplicar brilho do pet nem nova pausa com contagem sem decisão do usuário.

### 4. Verificações automáticas
A validação continua executando: validate-games.js, karaoke-room-model.test.js, karaoke-rhythm.test.js, karaoke-homol-view.test.js, karaoke-homol-sync.test.js.
São adicionados karaoke-homol-refresh.test.js e sora-stability.test.js, executados no GitHub Actions. Todos offline, sem Supabase, Vercel ou Netlify. Não afirmar sucesso até o CI publicar o resultado.

### 5. Trabalho restante, antes de abrir a homologação
- Testar em 9 navegadores diferentes: capacidade, 10a pessoa rejeitada, fila FIFO de três e quarta pessoa rejeitada.
- Testar microfone de 60s: intro de 5, ritmo de 45, aplausos de 10, mudança de cantor sem duplicação.
- Testar quedas de conexão, leases expiradas, abas duplicadas, moderação, entrada fora do horário, fechamento do portão.
- Validar com navegador real iOS/Android: bfcache, áudio, fps, foco, teclado, retorno ao hub; não substituir isso por mocks.
- Abrir sessão de homologação apenas por decisão explícita. Não habilitar contas, economia, produção ou deployment apenas para testar.

### 6. Limites de escopo
O index.html oficial, a branch main, o Supabase de produção, o Supabase de homologação e configurações da Vercel não sofrem mudanças neste lote. A PR #33 continua em draft e a branch conserva bloqueio de deploy Git.
