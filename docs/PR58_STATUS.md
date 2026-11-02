# PR #58 — Estado central e mapa de retomada

Documento de acompanhamento da PR #58 (`perf/karaoke-mobile-tile-occupancy` → `main`).

**Regra de trabalho:** continuar exclusivamente nesta PR. Não criar PR paralela, não alterar `main`, não fazer merge ou deploy, e não executar SQL no Supabase sem autorização específica do responsável.

**HEAD atual da PR:** `b41f8009eae50e7d82b8d2ed19279bd2942f4cca` — inclui as correções de visibilidade/testes, duas migrações nacionais com integração PostgreSQL, avisos por grupo, camisa tailandesa e a contribuição recente de paleta do Center Run/orelhas de coelho.
**Estado da PR (01/11/2026):** aberta, em Draft e não mesclada. Branch `perf/karaoke-mobile-tile-occupancy`; base `main`: `983852cca2e5afc612dad6f77acc687b66a951f0`. Snapshot: 548 commits, 83 arquivos alterados, 7.721 adições e 1.165 remoções.
**Workflow do HEAD atual:** execução [#41377898866](https://github.com/chumikie/tsulipa-run/actions/runs/41377898866). `static-validation` e `postgres-center-run` concluíram com sucesso; `browser-karaoke` permanecia em execução, sem falha publicada no último estado consultado.
**Última matriz Chromium integral concluída:** execução [#41377482441](https://github.com/chumikie/tsulipa-run/actions/runs/41377482441), no HEAD `34d86798e23f133ab13f4033785eaa2f10c4ef27`; os três jobs passaram, incluindo 320×900, 375×900, 390×900, 430×900, 844×390 e 1440×900. A nova rodada no HEAD `b41f8009` está repetindo essa matriz após mudanças posteriores de outro contribuidor.
**PostgreSQL no HEAD atual:** `postgres-center-run` passou. As migrações `20261102014635_grupos_nacionais.sql` e `20261102020938_avisos_grupo_e_roupa_sku.sql` foram aplicadas sequencialmente em banco PostgreSQL descartável. Duas identidades sintéticas sob a role `authenticated` passaram por grupo/time/estilo, perfil, isolamento, avisos por grupo, autorização de admin, aviso público global e consulta de preço de `roupa_tailandia` (150 estrelas, 0 pontos).
**Homologação de conta — limite explícito:** as RPCs foram exercitadas com claims sintéticas por duas contas e uma conta administrativa simulada. Não houve sessão Google/Supabase real disponível para homologar a interface autenticada com uma conta humana; essa verificação visual permanece pendente.
**Segurança de publicação:** nenhuma migração foi aplicada aos projetos Supabase ativos. O histórico registra integração Supabase–GitHub ligada; revisar o histórico e o plano de aplicação no projeto conectado antes de qualquer merge. Não fazer merge ou deploy de produção nesta etapa.
**Regra de continuidade:** manter esta PR aberta em Draft, preservar commits dos outros contribuidores e usar atualizações de referência sem force-push. As seções abaixo são históricas; em caso de divergência, prevalece este cabeçalho e a seção 10.

---
---
---

## 0. Antes de publicar (01/11/2026, 19:55)

- PR sem conflitos com a `main` (a `main` não recebeu commits novos); CI verde no HEAD `7744c49`.
- **Center⭐Run! 100 estrelas/dia — APLICADO no Supabase (01/11/2026, ~20:45)**, com autorização do responsável, pelo ChatGPT. Relato dele:
  - Função ativa antes era compatível com o arquivo; limite passou de 1.500 para 100 estrelas/dia; permissões da função preservadas.
  - Migração registrada no Supabase como versão `20261101234420`, nome `center_run_daily_100`. O arquivo do repositório foi renomeado para essa mesma versão (conteúdo idêntico), para o histórico do GitHub bater com o do banco.
  - Teste: duas finalizações de corrida com conta existente, em transação revertida: total creditado 100. Nada de teste ficou gravado.
  - Pet: `ganhar_minijogo` sem alteração (até 40 por chamada, teto de 50 por dia).
  - **Integração Supabase–GitHub: LIGADA** (confirmado pela dona em 01/11/2026, 21:14). Consequência: ao publicar na `main`, o Supabase tenta aplicar o que estiver em `supabase/migrations/`. Hoje a PR tem só `20261101234420_center_run_daily_100.sql`, com a mesma versão já registrada no banco, então deve ser reconhecida como aplicada e não rodar de novo. As propostas em `supabase/sql/` (ex.: `admin_montar_idol.sql`) **não** são aplicadas pela integração.
  - **Regra até o merge:** nenhum arquivo novo em `supabase/migrations/` sem autorização da dona e sem estar aplicado com a mesma versão. Antes do merge, conferir no painel do Supabase que a lista de migrações inclui `20261101234420`.
- **Supabase (ChatGPT/responsável):** a PR traz `supabase/migrations/20261101234420_center_run_daily_100.sql` (teto de 100 estrelas/dia). Nada no repositório aplica migrações sozinho (sem workflow `supabase db push` nem `supabase/config.toml`), mas **conferir no painel do Supabase se a integração com o GitHub está desligada** antes do merge. Se estiver ligada e o limite de 100 ainda não estiver autorizado, mover esse arquivo para fora de `supabase/migrations` antes de publicar.
- **Karaoke:** `karaoke-room-auto-mic.js` e `karaoke-room-polaroid.js` usam variáveis internas da página. O cantor automático da plateia se desliga sozinho (`krLoungeSoloPermitido is not defined`, sem quebrar a sala) e o clique nas Polaroids deve falhar ao abrir o pôster. Corrigir ou desativar antes de publicar.
- Limites de tamanho: `index.html` ~1.089.800/1.150.000 (o logo e as 6 imagens do mural do Pet saíram do HTML para `img/*.webp`, mesmos bytes da imagem; cerca de 60 KB de folga) e `karaoke-time.html` ~449.100/450.000 bytes.
- **Atualização 01/11/2026, 20:40:**
  - Mechas: o estilo escolhido (Uma, Dupla, Luzes, Escondida) agora vai junto no avatar público. Antes, Perfil, rankings, pôsteres do Karaoke, Karaoke do dia, Karaoke online e Sora mostravam todas como "Uma" (`9f15ed3`).
  - Mecha Luzes refeita: fios que acompanham a curva da cabeça, suaves na raiz e mais claros na ponta. O módulo de cabelo passou para `v=8` (`8c404c1`).
  - Janela "Confirmar show" no celular: dentro do site, as janelas modais do Karaoke (confirmar show, resultado, pôster) abriam centralizadas no iframe alto, cerca de 1.000 px abaixo da tela. Agora abrem na parte que o jogador está vendo. Verificado em Chromium a 320×900, 390×700 e 844×390, com clique real no botão; antes da correção, o clique falhava.
  - CI: as etapas de cabelos e acessórios passam. O vermelho atual vem dos testes da sala de Karaoke em andamento pelo outro contribuidor (microfone automático, visitas dos pets e pandeiros) e da etapa "shows passam pelo servidor quando há conta" do `validate-games.js`, que já falhava antes destas correções.
- Testes logados (Perfil, Montar Idol, Gacha, Pet, Moon Duo, Karaoke com tickets) ficam com o responsável.
- **Sala online removida (02/11/2026, pedido da dona):** o Karaoke⭐Time! é jogo solo — a conta joga, a plateia são contas cadastradas, o ranking semanal é online; não existe sala online.
  - Apagados: `karaoke-day.html`, `karaoke-online.js`, `karaoke-homol-client.js`, `karaoke-homol-sync.js`, `karaoke-homol-view.js`, `karaoke-online-lab.html` e os arquivos usados só por eles (`karaoke-embed.css`, `karaoke-rhythm.css`, `karaoke-rhythm.js`, `karaoke-room-model.js`), com os 6 testes e passos de CI deles. `vercel.json` mantém os redirecionamentos para a página inicial (links antigos não quebram).
  - `index.html`: saiu o horário de domingo/estreia 08/11, o aviso "sala fechada", o ensaio do Karaoke⭐Day e os textos "Sala online com até 9 Idols"; o card sempre abre o Karaoke⭐Time!. `index2-skin.css`: saíram os estilos do aviso e do card trancado. `sora-jump.html`: descrição sem "Karaoke⭐Day! ao vivo aos domingos".
  - `karaoke-time.html`: o simulador de teste perdeu os estados da sala online (aberta 7/9, fila, vaga, sábado/quarteto, trancada, cortina 13h10, aviso de 15 min, modo plateia). Ainda há código interno desses estados e do modo `?homol=1` que nunca é acionado no jogo; limpar com o outro contribuidor, que cuida da sala.
  - **Banco (ChatGPT):** a API antiga já foi desligada em 30/10 (`supabase/sql/karaoke_online_desligado.sql`, sem apagar dados). Funções da sala que o site não chama mais: `karaoke_sala`, `karaoke_sala_admin`, `karaoke_sala_elenco`, `karaoke_sala_toque`, `karaoke_ensaio`, `karaoke_ensaio_elenco`, `karaoke_ensaio_toque`, `karaoke_posteres_semana`. Apagar funções/tabelas só com autorização da dona.
- **Quadros da semana (02/11/2026, pedido da dona):** Acertos e Combo saíram da tela (repetiam as mesmas pessoas da Pontuação, porque a pontuação já soma acertos e combo). Agora: ⭐ Pontuação, 🎤 Mais shows na semana e 📈 Quem mais evoluiu (melhor pontuação da semana menos a da semana passada); o placar da sala acompanha. Na 🎵 Música da semana, quem já é 1º em Pontuação aparece com 👑 e o ouro vai para o próximo.
  - Sem conta: calculado no aparelho. Com conta: `supabase/sql/karaoke_quadros_semana.sql` **APLICADO no Supabase em 02/11/2026 (~01:45)**, com autorização da dona, pelo ChatGPT. Relato: `kt_run_finish` ativo idêntico ao da música da semana antes de aplicar; teste revertido (contador 2 e 1; evolução só para quem tinha pontuação na semana passada; só autenticados); depois: `private.kt_week_shows` com RLS, `kt_quadros_semana()` respondendo, `kt_run_finish` com 7 parâmetros, `kt_ranking()` intacto. "Quem mais evoluiu" já tem 3 jogadores; "Mais shows na semana" começa vazio (conta só shows aceitos a partir da instalação, sem histórico).
- **Recorde pessoal por música:** ao lado da Trilha aparece "🏅 Seu recorde pessoal: N pts" da música escolhida (os mesmos recordes da Biblioteca musical, guardados no aparelho).
- **Música da semana (aprovada pela dona em 02/11):** Gigoia → Doce Melodia, Liberdade → Moon⭐Duo!, Tailândia → Brilha Comigo, Harajuku → Love × Debut, Praia → Star⭐Gacha!; troca com a vista e o ranking (domingo 0h de Brasília). Detalhes em `docs/PROPOSTA_MUSICA_DA_SEMANA.md`.
  - Site (feito): selo "⭐ Música da semana" na Trilha e na Biblioteca musical; quadro "🎵 Música da semana" (Top 5 + "Você · Nº") abaixo dos três quadros; sem conta, calculado no aparelho; o show envia a música ao servidor (se o banco ainda não aceitar, repete sem ela).
  - Banco: `supabase/sql/karaoke_musica_da_semana.sql` **APLICADO no Supabase em 02/11/2026 (~01:40)**, com autorização da dona, pelo ChatGPT. Relato: corpo do `kt_run_finish` ativo idêntico ao de `karaoke_time_ranking.sql` antes de aplicar; teste em transação revertida (show com a música da semana entra no quadro especial; outra música é aceita sem mexer no quadro; chamada antiga sem `p_song` funciona; `kt_musica_semana()` certo; anônimo bloqueado); depois: `private.kt_song_scores` com RLS, `private.kt_musica_da_semana(date)`, `kt_musica_semana()` e `kt_run_finish` com `p_song` opcional ativos; `kt_ranking()` intacto. Música de 01 a 07/11: Moon⭐Duo! (`duo`); o quadro começa vazio.
- **Karaoke — "Você · 12º" (02/11/2026):** cada quadro do ranking (Pontuação, Acertos, Combo) mostra uma linha "Você" com a posição quando a pessoa está fora do Top 5. Sem conta: calculado no aparelho. Com conta: função `kt_minha_posicao` (`supabase/sql/karaoke_minha_posicao.sql`, só leitura) **ativa no Supabase** (ChatGPT confirmou em 02/11/2026).
- **Karaoke — textos antigos:** saíram da sala o "Domingo · 12h00–13h10" e o "Todo domingo, 12h às 13h10" (restos do antigo evento ao vivo). O aviso "Karaoke⭐Day! … Estreia planejada: domingo, 08/11/2026, 12h–13h10" do `index.html` pertence ao Karaoke⭐Day (sala online desativada) e não foi mexido.
- **Vistas da janela do Karaoke (02/11/2026, pedido da dona):** novo arquivo `karaoke-room-views.js` com 5 vistas (Gigoia, Liberdade, Tailândia/Wat Arun, Harajuku/Takeshita, Praia), cada uma com dia e noite. Rodízio de uma vista por semana, trocando todo **domingo à 0h de Brasília, junto com o ranking semanal** (pedido da dona em 02/11; semana de 01/11 = Liberdade; 08/11 = Tailândia; 15/11 = Harajuku; 22/11 = Praia; 29/11 = Gigoia). Dia das 6h às 18h de Brasília (o evento de domingo ao meio-dia fica com a versão de dia).
  - Gigoia e Liberdade de noite são idênticas às originais (comparadas pixel a pixel).
  - Ajustes pedidos pela dona: nada solto no ar (margem de pedra no templo, balões amarrados no portal e na mão, varal preso nos coqueiros, alguém segurando a pipa, sem confete solto) e Harajuku/Liberdade com multidão andando (de dia com roupas coloridas, sacolas, crepes e balões; de noite em silhueta com lightsticks, como a plateia do Center⭐Run!).
  - **Ligado na sala (02/11/2026)**: `karaoke-time.html` carrega `karaoke-room-views.js?v=1`; a janela troca sozinha de semana e de dia/noite sem recarregar; o desenho antigo saiu da página (449.999 → ~441.400 bytes). Botões de teste: Gigoia, Liberdade, Tailândia, Harajuku, Praia e Dia/Noite.
- **Moderação "Montar o Idol" (01/11/2026, pedido da dona):** no Perfil de um membro, o botão de admin "👗 Montar o Idol" abre o editor completo (cabelo, corte, mecha, franja, detalhe, pele, olhos, roupa e cor, acessório, óculos), com prévia. Vale para qualquer membro, menos a própria admin e outros admins. Roupas, acessórios e o detalhe Coelho seguem as regras de liberação/compra do membro; o item da mão não muda.
  - Banco: `supabase/sql/admin_montar_idol.sql` (`admin_idol_info` e `admin_montar_idol`), testado em PostgreSQL isolado (`supabase/tests/admin_idol_pg_integration.sh`). **APLICADO no Supabase em 01/11/2026 (~21:10)**, com autorização da dona, pelo ChatGPT. Relato dele: funções ativas; tabelas e funções compatíveis; só admins usam; a admin não altera o próprio Idol; itens não comprados e cores inválidas são recusados; uma montagem válida foi aceita e registrada; testes revertidos, sem mudanças em perfis; sem merge nem deploy.
  - 📷 nos dois formulários (editor completo e ajuste só de roupa) baixa um PNG transparente 1000×1000 do Idol; é só do navegador, não usa o banco.
  - **Falta (homologação):** depois de publicar a PR, testar logada como Tsu num membro automático (abrir, montar, salvar, conferir no Perfil e no jogo do membro).
  - Se a função nova falhar, o botão cai automaticamente no ajuste antigo, só de roupa (`admin_vestir`, em produção desde 31/10).

## 1. Implementado no branch — presença confirmada no código

Esta seção confirma que a implementação está presente no código da PR. **Não significa, por si só, homologação visual ou aprovação em aparelho real.**

- Controlador compartilhado de ciclo de vida em `tw-motion-lifecycle.js`: pausa de animações e loops associados a componentes inativos; limpeza de gates, observers e listeners de iframes removidos ou substituídos.
- Primeira camada de renderização móvel limitada a 30 Hz em jogos e prévias, com simulação baseada em delta-time para preservar movimento e relógio musical.
- Otimizações de desenho e caches: ocupação do piso em buffer reutilizável, caches de cenário, paletas, sprites e buffers de aparência.
- Integrações de ciclo de vida, atualização e limpeza em `index.html`, Karaoke Time/Day, Sora Jump, Backstage Pet, Hub, Perfil/Estúdio, Gacha, Moon Duo e Encontro.
- Proteções contra respostas assíncronas obsoletas após troca de conta em fluxos de perfil, autenticação, jogos e sincronização.
- Recuperação de tickets do Karaoke: chave idempotente, resposta perdida, recarga, concorrência, retomada e isolamento por conta.
- Recuperação da confirmação de crédito do Center Run após resposta perdida, sem repetir a finalização da corrida.
- Correção do cache de paleta do Center Run que podia deixar a corrida em branco.
- Módulos de cabelo e acessórios: três cortes extras ondulados, três franjas extras, mecha que acompanha a franja, Marias presas, rabo em uma peça, arco-íris em mechas tingidas, quepe militar e presilha de estrela. O módulo compartilhado foi conectado também aos renderizadores próprios do Sora Jump (jogador e parceiros) e do Karaoke Day, preservando fallback legado no Karaoke Day.
- Karaoke mobile: controles de som/pausa/timing reposicionados; correção da pausa indevida do show quando o palco sai da viewport; rolagem ao palco no início da apresentação.
- Biblioteca musical compacta do Karaoke: sete faixas, ações Ouvir/Selecionar independentes, prévia procedural sem iniciar partida e player com play/pausa/parar/progresso/tempo/volume isolado.
- Vozes do Karaoke: a lista longa foi substituída por três botões-personagem (Tsu, Lirika e Pati), com sprite desenhado pelo renderizador atual e pulinho curto ao toque; cada personagem percorre suas cinco falas existentes. Os 15 MP3 continuam disponíveis e o áudio especial do Encontro permanece em botão separado. Os recordes pessoais locais por música foram preservados.
- Sala solo do Karaoke: até três figurantes em passeio simultâneo, cada um com faixa/destino próprios; conversas continuam limitadas ao par existente; homologação continua desativando a autonomia.
- Movimento do jogador no piso do Karaoke: toque inicia rota no chão; retorno automático ao microfone após cinco segundos; tentativa/ticket não é consultado nem admitido enquanto o jogador está longe do microfone.

## 2. Testes automatizados — evidência no GitHub Actions

**CI mais recente do HEAD atual:** execução [#41349537397](https://github.com/chumikie/tsulipa-run/actions/runs/41349537397), associada ao HEAD `eca6a44f`. Os dois jobs terminaram com sucesso:

- `static-validation`: aprovado, com 43 etapas de validação. Incluiu HTML/rotas/orçamento de tamanho, performance mobile, os sete temas musicais, sincronização do gerador de beats, botões de voz, ciclo das cinco falas, preservação dos 15 MP3, retirada da lista longa e respeito a `prefers-reduced-motion`, além dos demais contratos do workflow.
- `postgres-center-run`: aprovado. Executou as integrações de Center Run e tickets em um PostgreSQL temporário do GitHub Actions.

**Evidências da etapa 1 (player musical):**

- `tests/karaoke-music-preview.test.js`: verifica as sete composições originais, a chamada do mesmo gerador de beats do jogo com alvo de reprodução independente, botões separados Ouvir/Selecionar, player, play/pausa/retomada/parada, slider ligado ao ganho isolado e bloqueio da prévia quando há uma partida ativa.
- `tests/karaoke-melody-cues.test.js`: verifica que o relógio e os ataques da partida normal continuam sincronizados com o AudioContext após a extração do player.
- `tests/karaoke-mobile-performance.test.js`: protege o limite de tamanho do HTML, o ciclo de vida do áudio, os três botões de personagem, a sequência de vozes, a preservação dos 15 IDs, a remoção da lista longa, a animação pontual e a redução de movimento.
- `tests/karaoke-show-visibility.test.js`: verifica a liberação da prévia quando a página é ocultada ou encerrada, preservando a pausa segura de uma partida ativa.

**Limites desta evidência:**

- O CI confirma testes automatizados no ambiente Linux/Node e PostgreSQL efêmero; não confirma saída audível, aparência final, qualidade subjetiva ou resposta visual em navegador.
- O teste do GainNode usa um mock; não substitui teste auditivo do slider em navegador.
- O teste de animação verifica contrato CSS e preferência de movimento; não comprova a sensação do pulinho em aparelho físico.
- O job PostgreSQL não acessa o Supabase de produção.
- **Nesta retomada não foi feita inspeção visual nova em navegador, reprodução auditiva real nem homologação em celular físico.** Não registrar esses itens como concluídos.

## 3. Homologação, pendências e fila de retomada

### 3.1. Personagens — integração de renderizadores feita; homologação visual pendente

- Os módulos `tw-avatar-hair.js` e `tw-avatar-items.js` são carregados por `index.html`/Perfil/Center Run e Karaoke Time. `sora-jump.html` também carrega ambos: jogador e parceiros usam as novas camadas compartilhadas, preservando identidades distintas. O Sora restaura o acessório salvo em `brs48cr_acc`.
- `karaoke-day.html`, com seu próprio `desenharIdol` e uso no controlador de prévias/Hub, também carrega `tw-avatar-hair.js` e compartilha as camadas de base, topo, franja, bicolor e mecha. As formas antigas permanecem como fallback.
- Os testes automatizados verificam contratos de integração e chamadas simuladas de Canvas. Isso comprova presença/uso das camadas no código, não a aparência final em tela.
- O relatório visual anterior foi feito em navegador headless, viewport 420×900, sem login, e cobriu apenas parte das telas. Perfil completo e Karaoke autenticado continuam pendentes.
- **Boneco aparecendo careca:** tratar como investigação de perda/ausência visual da base do cabelo, não como autorização para criar uma opção selecionável chamada `Careca`. A branch histórica `feat/avatar-careca-capitao-estrela` contém teste que mantém essa opção fora do menu. A causa do boneco aparecer sem cabelo ainda precisa ser localizada no personagem/renderizador em que ocorre.
- Falta inspeção visual das bases traseira/superior, franjas, acessórios e aparência em personagens masculinos/femininos, parceiros, Perfil, Estúdio, Hub, Center Run, Karaoke Time, Sora, Karaoke Day e prévias do editor.

Status: **integração dos módulos e testes automatizados concluídos; investigação da ausência da base e homologação visual pendentes**.

### 3.2. Experiência musical do Karaoke — player e botões vivos implementados; homologação auditiva/visual pendente

Pedido do responsável: permitir ouvir as sete músicas sem jogar, separar Ouvir de Selecionar, manter recordes pessoais por música, e substituir a longa lista de vozes por personagens que falem ao toque.

**Músicas e player — código presente:**

- A seção de músicas mantém as sete composições procedurais existentes: `normal`, `fast`, `chill`, `tema`, `corrida`, `gacha` e `duo`.
- Cada faixa tem duas ações independentes: **Ouvir** inicia a prévia sem jogar; **Selecionar** altera o seletor original `#ktSong` para a próxima partida. Selecionar não inicia show nem consome tentativa/ticket.
- A prévia reutiliza o sintetizador e o gerador de beats original do Karaoke, com alvo/relógio independentes. Não cria partida, não consulta quota/admissão, não credita estrelas/tickets e não escreve no ranking.
- O player compartilhado oferece play/pausa/retomada, parar, progresso, tempo e slider de volume. O volume usa um `GainNode` exclusivo da prévia; a música ambiente, as vozes e o áudio de uma partida continuam no caminho original.
- A prévia é encerrada ao trocar de faixa/voz, ativar mute, iniciar partida, ocultar/fechar a página ou sair. O player foi extraído para `karaoke-music-preview.js`; seus estilos ficam em `karaoke-time-base.css`, mantendo `karaoke-time.html` abaixo do limite de tamanho do validador.
- O recorde pessoal por conta/faixa continua no armazenamento local existente `kt_showcase_week_v1`, separado do ranking semanal compartilhado e sem RPC/Supabase.

**Vozes dos personagens — código presente:**

- A lista longa de 15 cartões foi removida da interface. A aba agora tem três botões oficiais: Tsu, Lirika e Pati.
- Os sprites continuam desenhados pelo renderizador `KaraokeAvatar.draw`, usando os personagens oficiais já exibidos na página. O desenho fica em tamanho compacto; ao tocar, o bonequinho dá um pulinho curto.
- Cada toque avança para a próxima fala daquele personagem, em ciclo de cinco vozes. A troca de personagem interrompe o áudio anterior para não sobrepor arquivos.
- O movimento do pulinho respeita `prefers-reduced-motion`; os botões recebem nomes acessíveis pelo idioma ativo.
- Os 15 MP3 originais permanecem no controlador e no repositório. O áudio especial do Encontro continua disponível num botão pequeno separado.
- Não há lista de falas longa nem novo player por voz; o próprio personagem é o controle.

**Testes e CI:** execução [#41349537397](https://github.com/chumikie/tsulipa-run/actions/runs/41349537397) aprovou `static-validation` e `postgres-center-run`. O teste de performance mobile protege a estrutura de três botões, ciclo de cinco vozes, IDs dos MP3, ausência dos antigos painéis, animação/redução de movimento e manutenção do áudio especial.

**Ainda pendente (etapa 5 — homologação):** abrir a prévia em navegador com áudio habilitado; ouvir cada uma das sete músicas até o fim; conferir pausa/retomada, slider de volume, troca entre Ouvir e Selecionar, mute e interrupção ao iniciar show; tocar em Tsu/Lirika/Pati várias vezes para ouvir o ciclo completo de cinco falas de cada uma; confirmar que o pulinho fica natural e não causa deslocamento/layout; testar desktop e celular físico. CI não substitui essas verificações.

Status: **player musical e botões vivos implementados; testes automatizados e CI aprovados; reprodução auditiva e homologação visual/física pendentes. Próxima etapa de código: plateia e movimento (etapa 3).**

### 3.3. Plateia autônoma e movimento do jogador — implementação integrada; homologação visual pendente

**Plateia autônoma:**

- O controlador singular `krLoungeActor` foi substituído por `krLoungeActors`, uma lista com limite explícito de três personagens em passeio simultâneo.
- Cada caminhante tem rota, faixa de piso e destino próprios. As três faixas são escolhidas sem duplicação; os pontos de parada são mantidos separados para reduzir cruzamentos/convergência.
- A rotina avança todos os caminhantes no mesmo loop e usa o mesmo `krFrameDelta`; não cria RAF, timer ou intervalo independente por Idol.
- Quem assume o microfone, recebe item/lanche, dança ou entra em estado incompatível deixa de passear e retorna ao assento quando necessário.
- Conversas/aplausos continuam limitados ao par existente. A existência de até três caminhantes não transforma conversas em grupos maiores.
- `krLoungeSoloPermitido()` continua desligando o comportamento autônomo durante homologação/conexão de homologação. Não foi criado modo online de sala.

**Movimento do jogador:**

- O planejador `krPlanearDestino(px,py)`, que já existia sem chamada, agora é chamado quando o jogador toca uma área livre do chão. Objetos/interações de cena e pistas de ritmo continuam tendo prioridade.
- O movimento permanece no piso/corredor permitido, contorna a área central do palco e usa o loop existente com delta-time.
- Depois de cinco segundos desde o último toque de destino, o relógio lógico programa o retorno pela lateral até o microfone fixo (`480,286`). O temporizador usa 300 quadros lógicos a 60 Hz e fica suspenso quando a sala/página está inativa.
- O pedestal do microfone fica fixo no palco e deixa de acompanhar o personagem enquanto ele caminha.
- `ktFlow.request()` verifica a posição do jogador antes de consultar tentativas/quota ou iniciar a confirmação de ticket. Se estiver longe, mostra o aviso e manda o personagem retornar; não abre a confirmação nem admite/debita uma partida.

**Proteções automatizadas:**

- `tests/karaoke-lounge-movement.test.js`: três caminhantes simultâneos, lanes/destinos distintos, atualização independente, prioridade do cantor, limpeza em homologação, toque no piso, rota de retorno e gate de posição.
- `tests/karaoke-flow.test.js`: jogador longe do microfone recebe aviso/retorno e não chega à consulta de quota/admissão.
- O workflow inclui esses contratos nos caminhos de pull request/push e em `static-validation`.

**CI de código:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), associada ao HEAD `56c3182a`, aprovou `static-validation` e `postgres-center-run`. O log estático registra explicitamente o teste de três caminhantes/retorno e o fluxo de bloqueio do microfone.

**Ainda pendente:** inspeção visual dos três Idols no palco real, colisões/oclusões em diferentes formações e viewports, toque em celular físico, retorno após uma partida real e legibilidade da sala sem esconder detalhes dos personagens. Os testes atuais são de lógica/contrato, não homologação visual nem teste físico.

Status: **implementação e testes automatizados integrados; homologação visual, de toque e em aparelhos pendente**.

### 3.4. Desempenho e apresentação

- A camada de 30 Hz e os contratos automatizados estão no código, mas não há medição de desempenho em celulares físicos nesta retomada.
- O controlador usa `render30Due` para limitar a pintura visual em dispositivos móveis e `frameDelta` para manter a simulação independente da frequência de desenho.
- Permanecem pendentes a inspeção dos loops secundários, a faixa de visitantes/Idols e a apresentação dos rankings de Karaoke.
- Não remover animações, reações, acessórios, detalhes ou efeitos para reduzir custo. Primeiro identificar o trabalho que pode ser pausado quando não está visível e medir o que realmente consome recursos.

### 3.5. Itens adicionais, separados dos pedidos acima

- A ideia de transformar o terceiro quadro em seletor com top 3 mensal por música é um ranking compartilhado diferente do histórico pessoal solicitado no item 3.2. Depende de desenho de dados e decisão específica no Supabase; não confundir as duas funcionalidades.
- Lupa de palco, itens clicáveis da mesa e glitter adicional permanecem ideias futuras, não parte da conclusão das frentes principais.

### 3.6. Verificações visuais e de uso real ainda necessárias

- O commit `76ba9e55` registra verificação em Chromium a 390×844 e 1280×900 para a regressão de pausa mobile. É verificação de navegador relatada pelo autor do commit, não homologação em celular físico.
- A revisão visual headless 420×900 sem login, registrada anteriormente, foi parcial e não cobriu Perfil completo nem Karaoke autenticado.
- As integrações recentes de Sora/Karaoke Day, biblioteca musical e movimento da sala têm confirmação automatizada de código; não foi realizada inspeção visual dessas mudanças nesta retomada.
- Não há evidência nesta auditoria de homologação em Android/iOS físico, fluxo autenticado Google completo no Perfil/Karaoke, inspeção de todos os renderizadores/parceiros/prévias do editor, ou sessões longas observando todas as animações.

### 3.7. Correções de inconsistências do mapa

Registros antigos que diziam que o quepe/estrela ainda não estavam implementados, que o redesenho dos cabelos aguardava implementação ou que a pausa mobile seguia sem correção estavam desatualizados. O código e os commits posteriores confirmam essas implementações/correções; o que permanece pendente é a homologação visual e em aparelhos, não a ausência dos respectivos módulos.

A fila de retomada permanece na ordem combinada: (1) player musical; (2) botões vivos de voz — implementados e com CI aprovado; (3) plateia lenta, circulação em piso livre e retorno aos sofás durante o show; (4) microfone fixo e deslocamento real do jogador; (5) homologação visual/auditiva das duas telas em navegador e celular; (6) investigação da base dos cabelos em todos os renderizadores; (7) revisão integral antes de qualquer decisão de merge.

## 4. Branches avaliadas

Inventário registrado na auditoria anterior: 53 branches além da PR. Método: commits exclusivos (`git rev-list`), equivalência de patch (`git cherry`), presença na PR das linhas adicionadas e busca de funções/identificadores no código. **Divergência de commits não significa funcionalidade ausente**: várias correções foram reescritas na PR com outros arquivos. Esta lista é o inventário documentado da auditoria anterior, não uma nova verificação de todas as branches nesta atualização.

### A. Já contidas na `main` (38) — nada a recuperar

Todos os commits destas branches já estavam na `main` de produção na auditoria anterior (e, portanto, também na PR):

ajustes-v213, ajustes-vitrine, chore/karaoke-estreia-08-11-2026, encontro-cena, encontro-dupla-trio, encontro-por-conta, engavetado/karaoke-day, feat/pet-sync-admin-20261030, feature/karaoke-time, feature/sora-jump-karaoke-hub-v21, fix/backstage-pet-sync-main-2026-10-30, fix/cards-hub, fix/center-run-botao-deslizar-30-10, fix/karaoke-placar-rotativo, fix/kt-ritmo-relogio, fix/mic-cd-popup-and-encounter-no-rank-2026-10-30, fix/perfil-foto-sem-slide-2026-10-30, gacha-cards, icone-topo, janelas-na-inicial, lancamento/30-10, main, moderacao-contas, moderacao-livre, moon-duo-abas, musicas-gacha-duo, musicas-temas, novidades, og-zipper-icone, og/karaoke-time, privacidade-og, release/index2-lancamento, test/karaoke-reuse-anonymous-session, titulo-world, traducoes-dicas, v2-1-2, vitrine-lugar, vitrine-reacao.

### B. Commits exclusivos, funcionalidade já presente na PR (10)

| Branch | Onde está na PR |
|---|---|
| feat/karaoke-ticket-inventory-ui | Patch equivalente já aplicado (placar rotativo do telão). |
| login-google-espacos | Todas as linhas já presentes. |
| feature/sora-jump-ranking-online | Versão anterior; ranking online ativo, `sora_run_start/finish/abort` e abas Semana/Geral já existem. |
| fix/sora-online-profile-tv | SQL e `sora-jump.html` idênticos; diferenças em `index.html` são textos antigos substituídos. |
| feature/sora-karaoke-v2-2026-10-29 | O texto do Google já saiu do botão do Gacha ("🎰 Girar!"); diferença apenas cosmética. |
| fix/karaoke-ticket-recovery | Reescrita na PR (`karaoke-tickets.js`, `karaoke-time.html`) com teste próprio. |
| fix/center-run-credit-recovery | Reescrita na PR com teste próprio. |
| feat/avatar-careca-capitao-estrela | Capitão, estrela e 3 cortes ondulados trazidos para `tw-avatar-items.js` / `tw-avatar-hair.js`. A opção careca foi removida pela própria branch; investigar a ausência da base visual sem reintroduzir opção de menu não solicitada. |
| sem-online-historico | Botão "Não funcionou? Entrar de outro jeito" (`gisAntigo`, login Google por redirecionamento) já está na `main` e na PR; só muda a classe do botão de fechar. |
| feat/backstage-admin-single-owner | Documentação e testes presentes; bloco Sora⭐Jump da proposta SQL do perfil admin permanece item separado para avaliação no Supabase. |

Estas 10 já têm o conteúdo na PR; as que dependem da PR só entram na `main` quando a PR #58 for aprovada. Até lá, a PR é o lugar onde esse trabalho está preservado.

### C. Descartadas ou adiadas (4)

| Branch | Motivo |
|---|---|
| feature/karaoke-cd-player-popup | A moldura de CD foi removida de propósito na `main` (commit `f3db9aa`, "Remove unwanted Karaoke Time CD popup shell"). |
| recovery/restore-embedded-karaoke | Altera `sora-jump-karaoke.html`, que não existe mais; o Karaoke atual é `karaoke-time.html`. |
| chumikie-refatoracao-repositorio | Ensaio de Karaoke online/multijogador (SQL lab 3a11/3a12), contrário à regra do Karaoke solo. **Adiado**: lint (`tools/lint`) e testes `static-links` / `index-critical-flows` podem ser reaproveitados depois. |
| sql/ranking-abertura | Apenas SQL, marcado como já aplicado em produção; responsabilidade do Supabase. |

### D. Funcionalidade ausente avaliada (1)

| Branch | Decisão |
|---|---|
| feature/encontro-dia-duo-trio-profiles | **Descartada.** Regra do responsável: no Encontro solo aparecem ranking e Oshi; na Dupla (terça) e no Trio (sexta), não. A PR já faz isso (`index.html` `encMostrar` + `tw-mic-cd-popup.css`: `.encp.enc-grupo #encRk, #encSelo, #encOshi { display:none }`). A branch acrescentaria ranking/Oshi por membro do grupo, o oposto do desejado. |

## 5. Alterações recuperadas de outras branches

- `feat/avatar-careca-capitao-estrela` → chapéu de Capitão, estrela, três cortes ondulados.
- `fix/karaoke-ticket-recovery` → recuperação de tickets (reescrita).
- `fix/center-run-credit-recovery` → reconciliação de crédito (reescrita).

## 6. Testes e CI — histórico com escopo explícito

- **Último HEAD de código:** `56c3182ac7811e9d75470f05f48fbce1b3fb0824`.
- **CI desse HEAD:** execução [#41345386721](https://github.com/chumikie/tsulipa-run/actions/runs/41345386721), workflow `Check TsuLiPa special games`, evento `pull_request`, concluída em 01/11/2026.
- Jobs: `static-validation` = **success**; `postgres-center-run` = **success**.
- O job estático inclui os testes de integração dos cabelos Sora/Karaoke Day, recordes pessoais por música, biblioteca compacta, três caminhantes, retorno ao microfone e bloqueio de início fora do microfone, além das verificações anteriores do workflow.
- O job PostgreSQL usa serviço temporário no CI e executa integrações isoladas de Center Run e tickets. Não representa acesso ou teste ao Supabase de produção.
- A execução local histórica de 33/33 testes Node ocorreu em HEAD anterior (`47b1c8a`); não atribuir esse resultado ao HEAD atual.
- O commit `76ba9e55` registra verificação em Chromium a 390×844 e 1280×900 para a regressão de pausa mobile. É verificação de navegador relatada pelo autor do commit, não homologação em celular físico.
- A revisão visual headless 420×900 sem login, registrada anteriormente, foi parcial e não cobriu Perfil completo nem Karaoke autenticado.
- A atualização documental mais recente da branch (commit `38948812`) também teve execução [#41345515468](https://github.com/chumikie/tsulipa-run/actions/runs/41345515468) com os dois jobs aprovados; ela não modifica o código do jogo.
- **Nesta reconstrução deste documento não foram executados testes locais, visuais, de navegador ou em aparelhos.** Não confundir CI verde com homologação visual ou física.

## 7. Supabase — estado registrado e bloqueios

Nenhuma alteração de Supabase foi executada nesta retomada. Os dados abaixo reproduzem o estado documentado na investigação de 01/11/2026; não representam uma nova consulta ao banco nesta atualização.

- Projeto registrado no histórico: `fsggtvgbyhchblyazgmt`.
- `20261031151827_karaoke_tickets_extra_shows_inventory_gacha`: consta no registro anterior como aplicada.
- A investigação anterior registrou `public.terminar_corrida` em produção com teto de 1.500 estrelas/dia. Confirmar por leitura no momento de uma futura revisão autorizada antes de tomar decisão.
- A proposta de 100 estrelas/dia por conta (`America/Sao_Paulo`) está em `supabase/migrations/20261101234420_center_run_daily_100.sql`, com checklist, runbook e SQL de rollback em `supabase/sql/`. Foi homologada em PostgreSQL isolado; **não foi aplicada em produção** e depende de autorização específica.
- A expressão `limite_diario` é `score_ok and p_stars > 0 and ganho_hoje + credito >= 100`. Portanto, no cenário de 90 créditos prévios + pedido de 30, a RPC credita 10 e retorna `limite_diario=true`. O teste `tests/center-run-daily-cap.test.js` protege esse caso e a mensagem combinada de crédito parcial + limite.
- A cópia `supabase/migrations/20261101234420_center_run_daily_100.sql` e `supabase/sql/center_run_daily_100_REVIEW_ONLY.sql` foram mantidas idênticas byte a byte. Um CI intermediário falhou durante a atualização sequencial dos comentários, pois as duas cópias ficaram temporariamente diferentes; após alinhamento, a validação de igualdade e os dois jobs passaram na execução #41346075172.
- A homologação temporal isolada usa relógio controlado apenas no PostgreSQL efêmero. A documentação também registra que a fixture de teste do Pet deve usar o motivo real `minijogo` em vez de motivo fictício antes de tratá-la como espelho exato da regra do Pet.
- Preservar o limite independente de 50 estrelas/dia dos minijogos do Pet.
- Não apagar nem resetar saldos, históricos, corridas ou rankings.
- O bloco Sora⭐Jump da proposta `admin_player_profile_proposal.sql` continua como item separado para avaliação.
- Relatório de leitura e conferência do Supabase permanece pendente.

**Bloqueio:** não executar `supabase db push`, `supabase migration up`, SQL manual, alteração de função, alteração de saldo ou operação destrutiva sem autorização específica do responsável.

## 8. Checklist para aprovação final

### Mapa e código
- [x] Reconfirmar PR #58 aberta, Draft, sem merge e branch de trabalho exclusiva.
- [x] Reconstruir o mapa de status e separar o commit de código do commit documental.
- [x] Registrar as evidências automatizadas sem classificá-las como homologação visual/física.
- [x] Registrar que os arquivos temporários do scratchpad do Claude não foram localizados; a funcionalidade equivalente foi implementada diretamente em `karaoke-time.html`.
- [ ] Fazer a revisão humana final do diff integral da PR e de todos os arquivos sensíveis.

### Personagens
- [ ] Investigar em que renderizador/personagem o boneco aparece careca e corrigir a perda da base do cabelo; não criar opção de menu `Careca` sem decisão específica.
- [x] Conectar as camadas compartilhadas de cabelo ao renderizador do Sora Jump (jogador e parceiros) e ao renderizador do Karaoke Day, mantendo os fallbacks antigos.
- [ ] Conferir visualmente a base dos cabelos e todas as camadas em personagens masculinos/femininos, parceiros e renderizadores alternativos.
- [ ] Conferir visualmente cortes, franjas, mecha, Marias, rabo, quepe e presilha em Perfil, Estúdio, Hub, Center Run, Karaoke Time, Sora e Karaoke Day.

### Karaoke — experiência musical
- [x] Substituir a Vitrine extensa por abas compactas de Músicas e Vozes, mantendo os 15 MP3 do trio e o áudio do Encontro.
- [x] Remover a lista longa de falas e usar Tsu, Lirika e Pati como três botões-personagem animados.
- [x] Fazer cada toque avançar para a próxima das cinco falas existentes do personagem escolhido.
- [x] Preservar o áudio especial do Encontro em um botão separado e manter o comportamento de áudio único, sem sobreposição.
- [x] Criar cartões das sete faixas e separar Ouvir de Selecionar.
- [x] Implementar player independente com play/pausa/retomada/parar, progresso, tempo e volume isolado.
- [x] Preservar os recordes pessoais por conta/faixa em armazenamento local, sem ranking compartilhado.
- [x] Testar sete composições, sincronização do gerador de beats, volume do GainNode, botões de voz, ciclo de cinco falas, MP3 preservados e redução de movimento no CI.
- [ ] Homologar reprodução audível das sete músicas e das 15 falas em navegador.
- [ ] Homologar visualmente sprites, pulinho, player e layout em desktop e celular físico.

### Karaoke — plateia e movimento
- [x] Permitir até três figurantes caminhando simultaneamente, com lanes/destinos independentes e prioridade de cantor.
- [x] Conectar o toque no piso ao planejador de movimento do jogador, preservando interações da cena e pistas de ritmo.
- [x] Fazer o jogador retornar ao microfone após cinco segundos longe, usando o relógio lógico da sala.
- [x] Exigir posição correta no microfone para iniciar; bloquear antes da consulta de tentativa/ticket quando o jogador está longe.
- [x] Preservar o gate solo/offline e desligar a autonomia durante homologação.
- [ ] Homologar visualmente três caminhantes simultâneos, rotas, oclusões e composição da sala.
- [ ] Testar toque no piso, retorno automático e início pelo microfone em celular físico.

### Desempenho e homologação
- [ ] Investigar faixa de visitantes e apresentação dos rankings de Karaoke.
- [ ] Revisar loops secundários e cadência em 30/60 Hz sem retirar animações ou detalhes.
- [ ] Testar em celulares físicos; registrar aparelho, viewport, cenário e resultado.
- [ ] Fazer homologação autenticada de Perfil, Karaoke, tickets e avatares.
- [x] Registrar separadamente teste estático/unitário e CI PostgreSQL isolado, sem confundir com homologação.
- [ ] Registrar nova verificação Chromium/headless após as mudanças de UI.
- [ ] Registrar homologação física em celular.

### Banco, CI e revisão final
- [x] CI do HEAD `eca6a44f` aprovado na execução [#41349537397](https://github.com/chumikie/tsulipa-run/actions/runs/41349537397): `static-validation` e `postgres-center-run` passaram.
- [ ] Fazer leitura autorizada do Supabase e conferir estado efetivo antes de qualquer proposta de mudança.
- [ ] Decidir separadamente sobre o teto de 100 estrelas/dia; não aplicar sem autorização específica.
- [ ] Revisar diff completo da PR, possíveis regressões, arquivos SQL, redirects, workflows e compatibilidade.
- [ ] Revisão humana final do responsável.
- [ ] Merge somente após autorização explícita.
- [ ] Arquivar branches antigas somente após merge autorizado e autorização específica.

## 9. Revisão preliminar integral do diff — riscos e limites remanescentes

### Automação e deploy

- O workflow versionado é `.github/workflows/validate-games.yml`. Ele executa validação estática e um serviço PostgreSQL 16 efêmero para testes de Center Run e tickets. Não contém `vercel deploy`, `netlify deploy`, `supabase db push` ou `supabase migration up`.
- `vercel.json` mantém `git.deploymentEnabled.main=true` e `**=false`; portanto, o branch da PR não está habilitado para deploy automático do Vercel por Git.
- O redirect adicionado para `/index2.html` e `/index2` aponta para `/`. O `index2.html` na própria `main` já é um stub com meta refresh, canonical e `location.replace('/')`; o redirect Vercel é redundante, mas coerente com o comportamento atual do arquivo. Os redirects de Karaoke Day e do laboratório online já existiam na `main`.
- A integração Netlify pode gerar Deploy Preview automático para a PR; isso é preview isolado, não merge nem deploy de produção. Nenhuma ação manual de deploy foi executada nesta revisão.

### Supabase e banco

- A migração `20261101234420_center_run_daily_100.sql` permanece apenas como proposta na branch. Nenhum SQL foi executado no projeto de produção.
- O workflow usa apenas um serviço PostgreSQL temporário do GitHub Actions, com banco e credenciais de teste descartáveis. Não usa URL, token ou credencial do projeto Supabase de produção.
- A migração e a cópia `REVIEW_ONLY` foram conferidas iguais byte a byte após a correção dos comentários. O CI mais recente passou pela validação.
- README e checklist foram corrigidos para refletir a lógica real do flag de teto. O comportamento funcional do SQL não foi alterado nesta revisão; os commits recentes nesse par de arquivos mudam somente comentários.
- Antes de qualquer merge futuro, confirmar se existe algum pipeline externo conectado ao repositório que aplique migrações automaticamente. O workflow versionado aqui não faz isso, mas a existência de integrações externas não pode ser inferida apenas pelos arquivos desta PR.

### Limite da revisão manual

- O diff da PR lista 51 arquivos. O endpoint de patch do GitHub não entregou patch completo para `index.html` e `karaoke-time.html`, devido ao tamanho dos arquivos. Os dois foram lidos em trechos direcionados e os contratos automatizados passaram, mas **não considero concluída uma revisão humana linha a linha de todo o diff desses dois arquivos**.
- Também permanece pendente homologação visual autenticada e em aparelhos físicos nas seções 3.1–3.4.
- Por esses motivos, a revisão integral ainda está **em andamento**. Não declarar a PR pronta para merge até terminar a leitura manual dos grandes diffs, a homologação visual/física e a revisão dos riscos externos de migração.
## 10. Homologação das migrações nacionais e visibilidade da sala (01/11/2026)

### 10.1. Visibilidade do Karaoke em 844 × 390 e desktop

- Diagnóstico: a asserção de visibilidade era executada antes de garantir que o iframe hospedeiro e o canvas interno estivessem dentro das respectivas viewports. O controlador de ciclo de vida pausava corretamente o palco fora da janela; o teste não preparava a condição de visibilidade.
- Correção em `tests/karaoke-mobile.browser.cjs`: rolagem explícita do iframe e do canvas para a área visível, registro das geometrias e espera pelos sinais de diagnóstico. A suíte continua exigindo `host`, `canvasObserver`, `canvasInViewport`, ciclo de animação ativo, operações reais de desenho e pixels opacos/variados.
- O teste também oculta e reabre o iframe, exigindo suspensão e retomada da pintura. A asserção não foi removida nem enfraquecida.
- No run [#41377482441](https://github.com/chumikie/tsulipa-run/actions/runs/41377482441), o log confirma sucesso individual para 320, 375, 390, 430, 844 e 1440 px. O `results.json` confirma os três sinais de visibilidade verdadeiros nas seis larguras, e pintura antes/depois da reabertura.
- Capturas do run: [artefato #13112166970](https://github.com/chumikie/tsulipa-run/actions/runs/41377482441/artifacts/13112166970), 49 arquivos. As telas `chromium-844-playing.png` e `chromium-1440-playing.png` foram inspecionadas visualmente; palco e controles aparecem sem tela preta.
- A alteração posterior de paleta/cabelo está sob novo run [#41377898866](https://github.com/chumikie/tsulipa-run/actions/runs/41377898866). No momento desta atualização, o job Chromium ainda estava ativo; aguardar o fechamento para considerar toda a ponta atual aprovada.

### 10.2. Teste PostgreSQL real das duas migrações

- A integração roda em banco PostgreSQL efêmero no GitHub Actions, com dados fictícios; não conecta nem grava no Supabase ativo.
- A fixture prepara `players`, `config`, `admins`, `admin_log`, `auth.uid()` e `eh_admin()`. A função `visual_preco()` usa a âncora consultada por leitura no projeto Supabase.
- O runner aplica nesta ordem: `20261102014635_grupos_nacionais.sql` e `20261102020938_avisos_grupo_e_roupa_sku.sql`.
- Sob `SET ROLE authenticated`, duas identidades sintéticas validam catálogo BRS48/SKU48, times, rejeição de valores inválidos, estilo, perfil próprio/público, lista Oshi, compatibilidade da RPC legada e isolamento de contas.
- A identidade admin fictícia cria avisos para SKU48 e BRS48; cada usuário recebe apenas o aviso do próprio grupo. A conta sem permissão administrativa não pode criar nem listar avisos; `anon` recebe somente o aviso global. O `admin_log` confirma as ações.
- Após a segunda migração, `visual_preco('roupa_tailandia')` retorna 150 estrelas e 0 pontos, preservando o mesmo preço de `roupa_brasil`.
- No run #41377898866, o log de PostgreSQL registra sucesso nos testes de Center Run, tickets, editor Idol e runner combinado de grupos/avisos/camisa.

### 10.3. CI no HEAD atual e histórico de navegador

- Run [#41377898866](https://github.com/chumikie/tsulipa-run/actions/runs/41377898866), HEAD `b41f8009`: `static-validation` success; `postgres-center-run` success; `browser-karaoke` em execução no último estado consultado.
- Run [#41377482441](https://github.com/chumikie/tsulipa-run/actions/runs/41377482441), HEAD `34d86798`: os três jobs concluíram em sucesso, incluindo a matriz completa e as larguras 844×390 e 1440×900.
- O teste de navegador usa fixture local com requisições externas bloqueadas; não equivale a acesso manual autenticado ao Deploy Preview.

### 10.4. Autenticação e proteção de produção

- A homologação autenticada foi feita em PostgreSQL com a role `authenticated`, JWT claims sintéticas de duas contas e uma conta administrativa. Isso comprova as regras das RPCs e o isolamento por identidade.
- Não havia sessão real Google/Supabase no navegador para validar a interface logada de uma conta humana. Essa homologação de UI permanece pendente.
- Nenhuma migração foi executada nos projetos Supabase ativos; não houve gravação em contas reais, merge, alteração em `main` ou deploy de produção.
- Como a integração Supabase–GitHub está registrada como ativa no histórico da PR, revisar o histórico e o plano de migrações do projeto conectado antes de qualquer merge.

### 10.5. Arquivos desta frente

- `tests/karaoke-mobile.browser.cjs`: pré-condição de scroll e comprovação da pintura/recuperação do palco.
- `supabase/tests/grupos_nacionais_pg_setup.sql`, `grupos_nacionais_pg_checks.sql` e `grupos_nacionais_pg_integration.sh`: fixture, cenários autenticados e execução PostgreSQL.
- `.github/workflows/validate-games.yml`: path filters e etapa de integração das duas migrações.
- Commits desta frente preservados em sequência, sem reescrever históricos de outros autores: `b511ff7`, `562796f`, `07036e6`, `42d5e03`, `c588058`, `385927a` e `34d8679`.

**Estado desta atualização:** PR #58 permanece aberta e em Draft. PostgreSQL e validação estática estão verdes no HEAD `b41f8009`; o Chromium dessa ponta ainda precisava concluir.
