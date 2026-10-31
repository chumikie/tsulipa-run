# STATUS — TsuLiPa⭐World

Atualizado em 31/10/2026. Atualize este arquivo no mesmo envio de qualquer mudança.

## Liberação da PR #49 — estado verificado em 31/10/2026

- **Correções adicionais em revisão:** Backstage⭐Pet! com fila persistente de ações, envio agrupado (4 s, limite 25 s), tentativa ao fechar, recuperação offline, aviso/decisão quando um save local conflita e leitura de versão antes de cada lote (a garantia CAS atômica ainda depende de SQL); compras pagas dependem de débito aprovado. Corrida autenticada aguarda as estrelas realmente creditadas pelo servidor.
- **Auditoria de economia, sorteios e escala:** [relatório detalhado](qa/release-49-economy-sync-audit.md). Os 49 preços pagos do cliente coincidem com o catálogo SQL; a soma dos saldos coincide com o histórico de estrelas no retrato consultado. Os sorteios usam perfis cadastrados elegíveis, inclusive offline.
- **Pendências de liberação identificadas:** contadores não recalculados ao excluir corrida pelo Admin, recompensa de minijogo sem comprovação server-side e compra de Pet ainda não transacional com inventário. A RPC legada `encontro_do_dia` já teve execução revogada para jogadores (confirmado por consulta em 31/10), mitigando a recompensa duplicada. Soluções restantes exigem decisões/migrações separadas, **não aplicadas nesta PR**.
- **Escalabilidade:** não homologada sob carga; antes de muitos membros, testar `top_scores`, `ranking_minijogos`, insígnias e sorteios no ambiente de homologação com dados sintéticos.

- **PR #49:** aberta na branch `fix/mic-cd-popup-and-encounter-no-rank-2026-10-30`, destinada à `main`; sem merge ou publicação em produção.
- **Login:** a pessoa responsável pelo jogo confirmou o fluxo do site e o acesso na prévia Netlify por **Não funcionou? Entrar de outro jeito → Google**. O aviso de origem do botão Google direto na Netlify é específico da prévia, não falha comprovada de produção.
- **Foto do Karaoke no iPhone:** funcionamento confirmado pela pessoa responsável após o último ajuste. A moldura kawaii pertence à janela de prévia; o PNG é baixado sem moldura, como aprovado. Os testes automatizados não equivalem à reprodução do compartilhamento nativo no iPhone.
- **Supabase:** confirmados os grants e as guardas presentes nas funções administrativas e nas RPCs de save; a antiga API do Karaoke online está inacessível para `anon` e `authenticated`. Isso é verificação estática/de configuração, não teste de execução com duas contas.
- **Pendente para liberação integral:** prova funcional autorizada do Backstage Pet em dois dispositivos, incluindo falha/reconexão/conflito, e das ações administrativas com uma conta comum e a conta admin; verificar abertura/retorno dos jogos e virada semanal com as contas de teste. Não usar dados de jogadores reais nem alterar produção apenas para realizar a auditoria.
- **Karaoke online:** **arquivado**. Karaoke⭐Time! solo é a versão atual, com cinco shows por dia e ranking semanal online para contas autenticadas. A antiga sala simultânea não será reativada automaticamente.



## Prévia para guardar fotos do Karaoke — PR #49 (31/10)

- A câmera agora congela o canvas no clique e abre uma janela com a foto completa em PNG 1920 × 1080, usando a identidade das janelas do site e moldura de photocard.
- Ações: compartilhar/salvar quando o navegador aceita arquivos, baixar PNG e voltar à sala. A imagem permite toque longo/clique direito como alternativa. Não há download automático nem confirmação prematura de foto salva.
- O show em andamento pausa durante a prévia e retoma ao voltar; se já estava pausado, continua assim. Cancelamentos e falhas de compartilhamento mantêm a foto disponível.
- QA em Chromium local em 320/390/1440 px e na versão avulsa, com comparação dos pixels capturados, PNG baixado, foco, Escape, pausa e liberação dos recursos. Compartilhamento nativo simulado, sem envio real. [Capturas e reprodução](qa/karaoke-photo/README.md).
- Sem merge, upload de imagens ou alterações no banco nesta entrega. A pessoa responsável confirmou o salvamento no iPhone após o último ajuste, distinguindo a moldura da prévia do PNG limpo; o teste automatizado do menu nativo continua simulado.

## Interações da sala do Karaoke — PR #49 (31/10)

- Segundo pandeiro pendurado à esquerda, abaixo dos retratos, com o mesmo som do pandeiro da mesa. Cada instrumento tem sua própria animação e intervalo entre toques.
- Chu, Koali e Pucchi ganham olhos felizes/de coração e passinhos ao toque. Eles visitam um Idol próximo, fazem uma pausa carinhosa e retornam ao passeio original, contornando a mesa.
- Mantidas as vozinhas e os emojis. Toques em pets próximos escolhem o rostinho mais perto. As visitas são temporárias e decorativas, sem salvar estado de conta ou alterar o ritmo.
- Validação estática, 13 suítes Node e QA em Chromium local em celular/desktop; [capturas e testes](qa/karaoke-room-reactions/README.md). Sem merge ou operações no banco.

## Revisão do Karaoke no celular — PR #49 (31/10)

- Refinamento aprovado: a moldura do jogo no celular recorta 48 unidades de cada lateral do canvas (11,1% de ampliação), preservando a altura e o limite conservador dos sprites, inclusive na caminhada. Som e câmera ficam numa faixa própria no alto à direita. O botão de visão completa permanece funcional. [Comparação e testes do recorte](qa/karaoke-mobile-crop/README.md).
- O cabeçalho do Karaoke oculta apenas o placar herdado do Center Run; ao voltar, o placar original reaparece. Nenhum recorde ou saldo é alterado.
- `karaoke-mobile.css` ajusta somente o Karaoke integrado até 620 px: controles em grade, margens menores e ranking abaixo do jogo também durante uma partida.
- O aviso de tentativas permanece compacto e visível no celular, eliminando o bloco invisível antes do ranking. Quando as tentativas acabam, a mensagem de fechamento da sala assume o aviso.
- A sala mantém a proporção original; o canvas e o desenho dos personagens não foram editados. A geometria no computador e na horizontal foi comparada com a base da PR.
- Testes e capturas locais em [QA do Karaoke mobile](qa/karaoke-mobile/README.md). Não houve login real, consumo de tentativas online ou alteração no banco. WebKit/iPhone físico ainda precisam de conferência manual.
- Alterações destinadas à mesma PR #49; sem merge ou publicação em produção.

## Onde está cada coisa
- **Site no ar:** https://tsulipa-world.vercel.app
- **Fonte oficial de produção:** branch `main` no GitHub. A PR #49 reúne as alterações futuras na branch `fix/mic-cd-popup-and-encounter-no-rank-2026-10-30`; `lancamento/30-10` registra uma etapa anterior.
- **Novidades congeladas** até o lançamento fechar. Ideia nova vai para "Ideias aprovadas para depois".
- **Supabase de produção:** `fsggtvgbyhchblyazgmt`. Homologação (só testes): `hfzjoefnousiouiuchys`.

## Arquivos do site (raiz)
| Arquivo | O que é |
|---|---|
| `index.html` | Página principal: tela de início → menu (Center Run, Pet, Perfil, Gacha, Sora, Moon Duo, Karaoke, Encontro, Missões, vitrine, Top Idols, TsuLiPa TV). |
| `index2.html` | Só redireciona para `/` (links antigos). |
| `sora-jump.html` | Sora⭐Jump!, aberto como pop-up da página principal. |
| `karaoke-time.html` | **Karaoke⭐Time!**: jogo solo de ritmo, cinco shows por dia, sete músicas, foto da sala e rankings semanais online para contas autenticadas. O modo avulso sem login usa armazenamento local. Preserva nick e visual da conta (`brs48cr_nick`, `brs48cr_char`, `brs48cr_cu2`). |
| `karaoke-day.html` + `karaoke-online.js` | **ARQUIVADO — Karaoke⭐Day! (antiga sala online simultânea).** Cópia histórica preservada na branch `engavetado/karaoke-day`; arquivos remanescentes não integram o jogo ativo. As rotas antigas redirecionam para `/` e as RPCs de sala estão revogadas para jogadores. Não reativar nem excluir o arquivo sem nova decisão. |
| `karaoke-homol-*.js`, `karaoke-online-lab.html`, `karaoke-room-model.js`, `karaoke-rhythm.*` | Componentes legados do laboratório online arquivado e módulos auxiliares do ritmo. A sala simultânea não faz parte da navegação atual. |
| `*.css` | Estilos: `index2-skin`, `index2-launch-ui` (menu, TV e pop-up do Sora), `tw-weekly-podium` (Top Idols/TV), `games-theme`, `sora-embed`, `karaoke-embed`, `karaoke-rhythm`. |
| `audio/` | Vozes do trio (5 falas cada) e o som do Encontro do dia. O resto da música é gerado no código. |
| `privacidade.html`, ícones, `manifest.json`, `og.jpg`, `googled…html` | Privacidade, ícones, imagem de compartilhamento e verificação do Google. |
| `tests/` + `.github/workflows/validate-games.yml` | Suítes Node e validação estática no GitHub Actions; QA de navegador separado, com fixtures quando indicado. |
| `supabase/` | SQL aplicado e testes de banco. `supabase/sql/README.md` diz o que já está no ar. |
| `docs/` | Este STATUS e o histórico em `docs/historico/`. |

## Histórico até 30/10 (antes do arquivamento do Karaoke online)
- **Histórico, não mais ativo:** a antiga sala simultânea permitia sessões online aos domingos; foi desativada em 30/10 e permanece arquivada.
- Página sem piscar a versão antiga; menu em coluna única no computador; cards Pet, Perfil, Gacha / Sora, Moon Duo, Karaoke.
- TsuLiPa TV: troféu voando no canto do banner abre o pop-up do ranking.
- Top Idols logo abaixo da vitrine. Encontro do dia com os nomes de todos.
- Center⭐Run! Temporada 2: 8 cenários, deslizar, obstáculos que andam, combo, corredor de fãs, desafio, Coro, Corrida do dia e seletor de cenário no Modo Teste.
- Perfil com emoji, cor e time (B, R, S, KKS); Oshi escolhido entre quem joga. Mesmo visual no perfil e no Center Run.
- Subtítulos em japonês e traduções conferidas em EN/ES/TH/JA.
- Banner: tocar na Tsu, Lirika ou Pati dá pulinho, emojis, balão kawaii e voz real (5 falas cada, risada a cada duas). Os pets também respondem.
- Músicas dos temas trocadas por covers do TsuLiPa (os nomes dos temas não mudaram).
- Privacidade atualizada em 5 idiomas. Imagem de compartilhamento com os 6 modos.

## Histórico de desenvolvimento offline (não implica funções online ativas)
- **Karaoke · sala online:** a ponte do palco refazia o layout e jogava fora o nick e o visual reais, então todo mundo virava "Idol 01" com boneco sorteado. Corrigido. Os 8 lugares do sofá ficavam empilhados dois a dois: agora espalhados.
- **Karaoke · janela da Liberdade:** a corda das lanternas flutuava sem apoio (agora dois postes na calçada), as lanternas viraram luzes de verdade, os toldos e as placas 茶 (chá) e 麺 (lámen) viraram lojinhas apoiadas no chão.
- **Sora⭐Jump!:** abre como pop-up da página, igual ao Star⭐Gacha, no cartão do tema escolhido e sobre a página escurecida. O menu, o fim de jogo e o placar saíram do vidro escuro para o pastel do site. O ⌂ Início saiu de cima do placar.
- **Som:** com o Sora ou o Karaoke abertos, a página para a própria música (antes a do Center Run voltava por cima).
- **Voltar:** dentro do pop-up, o voltar só avisa a página de fora e nunca navega o iframe (antes, quando o aviso falhava — ao abrir por `file://`, por exemplo — a página principal abria dentro do próprio pop-up). Fora do pop-up, vai para a raiz. O seletor avulso `sora-jump-karaoke.html` foi removido.
- **Teste com login simulado** (`tests/login-simulado.test.js`): roda o script do cadeado com e sem conta e falha se o interruptor de teste estiver ligado ou se o `window.contaJ` sumir.
- **Teste novo:** o `validate-games.js` confere que nenhuma página aponta para arquivo que não existe e que o voltar nunca navega o iframe.
- **Troféu da TsuLiPa TV:** ganhou uma fanfarra curta, kawaii e orgulhosa.
- **Backstage⭐Pet! · sincronização:** saves serializados, fila pendente persistida, repetição automática com backoff, confirmação somente após `ok: true` da RPC e proteção contra conflito de versão. Testes offline cobrem falha de rede, repetição, confirmação, mudança durante envio, conflito e retomada da fila. Nenhuma gravação foi feita no Supabase de produção.
- **Limpeza:** saíram `sora-jump-karaoke.html`, `og.png` (ninguém usava) e a pasta `.freebuff/`.

## Karaoke⭐Time! no lugar do Karaoke⭐Day! (branch `feature/karaoke-time`)
- O card 🎤 virou **Karaoke⭐Time!** (カラオケ・タイム), sem contagem de domingo e sem cadeado de horário; mostra "5 shows por dia" nos 5 idiomas.
- Abre como o Karaoke abria (tela cheia com o cabeçalho do site), com o Oshi e o claro/escuro da página. O menu local e a barra de cima do arquivo somem dentro do site.
- Voltar (← Jogos e Esc) só avisa a página de fora; nunca navega o iframe.
- Quem joga aparece com o nick e o visual da conta; os outros 6 do sofá vêm do sorteio diário (foto dos perfis de 30/10 guardada no arquivo).
- Karaoke⭐Day!, a antiga sala online e seu laboratório permanecem como histórico arquivado. Não há reativação planejada; qualquer retomada exigiria nova aprovação.
- Textos do Karaoke⭐Time! em PT/EN/ES/TH/JA, no idioma escolhido no menu (página e telão). Nomes de músicas e de Idols não mudam.
- Voltaram as partes da versão "Clipe do dia": o clipe do dia no telão (conceito e formação mudam a cada dia de Brasília), a faixa "Sua plateia de hoje" com retratos, e os Idols da sala clicáveis (pulinho, brilhos, balão e notinha).
- **Ranking online do Karaoke⭐Time!** (`supabase/sql/karaoke_time_ranking.sql`, **aplicado em produção em 30/10/2026**): com conta, cada show passa pelo servidor (5 por dia no horário de Brasília, resultado conferido: duração mínima, notas, combo e pontos possíveis). Três quadros por semana (domingo a sábado): Pontuação, Maior combo e Acertos. A semana do Karaoke passou a começar no domingo, como o Top Idols. Sem conta, o jogo segue só no aparelho.
- **Top Idols:** a coluna do Karaoke mostra só a pontuação, igual ao Center e ao Sora (a barra extra de baixo saiu).
- **Microfone no banner:** no canto esquerdo (o troféu da TV fica no direito), um 🎤 voando abre, com um som de "acerto perfeito", o pop-up de quem acertou mais na semana (top 3 de Acertos). Combo e os três quadros completos ficam dentro da sala.
- **Viradas de semana (30/10):** todos os rankings semanais viram juntos no domingo 00h de Brasília: Top Idols, Sora, Karaoke e a aba "Semana" do Center⭐Run! (`center_semana_domingo.sql`, aplicado em produção; antes começava na segunda). Ninguém perdeu pontos.
- **Card do Karaoke:** fica rosa de alerta, com o "!", enquanto faltar algum dos 5 shows do dia (o servidor conta), e mostra quantos faltam.
- **Emojis:** os do banner (Tsu, Lirika e Pati) saíam apagados porque eram desenhados com a cor da sombra dos pés (22% de opacidade), e o emoji herda essa transparência. Agora a cor é opaca, com brilho branco e pulinho de entrada. Os efeitos da sala do Karaoke agora são emojis do mesmo jeito: estouram, sobem balançando com rastro de brilho, e os corações têm a cor de cada Idol.
- **Plateia do dia:** dentro do site, as 6 vêm das contas do site com Idol montado (todas, inclusive as que forem criadas depois), menos você; o sorteio fica o mesmo o dia todo naquele aparelho. A foto de 30/10 guardada no arquivo só vale com ele aberto sozinho.
- **Teste logado na prévia (30/10):** show completo entrou no ranking online (placar da semana na sala). 
- **Fundo dentro do site:** o Karaoke abria com uma moldura e um fundo escuros em volta; agora usa o fundo da página, no claro e no escuro, igual ao Sora.
- **Tema escuro do Karaoke:** a faixa "Sua plateia de hoje" e o quadro do clipe ficavam sem estilo no escuro (o CSS tinha caído dentro do bloco do tema claro). Corrigido.
- **Outros clipes:** Sakura ganhou galhos com volume e flores com brilho; Ocean Pop, bolhas de verdade; Mirror Disco, globo espelhado com facetas piscando; Ribbon Theatre, cortinas de veludo com dobras e corda dourada com laços.
- **Clipe Candy Parade:** pirulitos em espiral com brilho e lacinho, algodão-doce fofo ao fundo e balinhas caindo.
- **Lightstick:** usa a cor escolhida no perfil (chave nova `brs48cr_cor`); sem cor, continua a do cabelo. Vale no menu, na foto do perfil e na sala do Karaoke.
- **Clipe do dia:** fundos com profundidade (brilho na parede, bokeh, feixes de luz, palco com perspectiva e vinheta); no Diamante ninguém esconde o rosto de ninguém e ninguém fica cortado na borda.
- **Supabase de produção (30/10):** a sala online foi desligada sem apagar registros (`supabase/sql/karaoke_online_desligado.sql`); as RPCs `karaoke_sala*` e `karaoke_posteres_semana` seguem revogadas para `anon`/`authenticated`. O script `karaoke_online_religar.sql` permanece **somente histórico** e não integra o plano de publicação. Os botões de teste da sala antiga não devem ser reintroduzidos.

## Falta (para fechar a PR #49)
1. Validar com contas de teste autorizadas o Backstage⭐Pet! em dois aparelhos, reconexão após perda de rede, retomada da fila e conflito de saves sem sobrepor dados.
2. Validar ações administrativas com a conta admin e uma conta comum, confirmando negação para não administrador e preservação dos dados de outros jogadores. Não executar mutações de teste em produção sem aprovação específica.
3. Fazer checklist curto dos jogos autenticados (Gacha, Pet, Moon Duo, Sora, Perfil, Encontro, Center e Karaoke) e da virada semanal de domingo em horário de Brasília.
4. Só então decidir o merge na `main`, que pode acionar publicação automática na Vercel. A sala online antiga continua arquivada; não existe decisão de estreia pendente para ela.

## Ideias aprovadas para depois
- Melhorias futuras do jogo de ritmo do Karaoke⭐Time! somente após nova aprovação; a versão solo atual permanece preservada.
- Comidas e bebidas do Karaoke custando estrelas que vão para a conta da moderação.
- Banner que alterna os 3 primeiros da semana (Center Run, Sora, Karaoke).
- 3 fotinhas no perfil (guardando a receita da foto, não a imagem).
- Nota máxima no Karaoke: a sala comemora com frases, pulinhos e brilhos.
- Catálogo Sora Idol / Karaoke Idol (cenários, roupas, acessórios) e o tema Dia da Paz.

## Regras
- Nunca renomear chaves `brs48cr_*`. Nunca commit direto na `main`: sempre PR, e quem faz merge é a dona.
- Juntar mudanças em poucos envios (cada push gera build na Vercel).
- Não criar dados falsos na produção. Testes de banco só em transação desfeita ou na homologação.
- Os rankings semanais de Sora/Karaoke já possuem backend em produção. Antes de publicar, verificar o estado real das flags no código e as RPCs, sem reutilizar os critérios antigos de pré-lançamento.
- Antes de qualquer merge, `TW_JOGOS_SEM_LOGIN` tem que voltar para `false` no `index.html`.
