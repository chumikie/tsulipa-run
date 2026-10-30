# STATUS — TsuLiPa⭐World

Atualizado em 30/10/2026. Atualize este arquivo no mesmo envio de qualquer mudança.

## Onde está cada coisa
- **Site no ar:** https://tsulipa-world.vercel.app
- **Fonte única:** a branch `lancamento/30-10` no GitHub (veio da pasta offline). Daqui em diante tudo acontece nela; nada de arquivo baixado nem cópia solta.
- **Novidades congeladas** até o lançamento fechar. Ideia nova vai para "Ideias aprovadas para depois".
- **Supabase de produção:** `fsggtvgbyhchblyazgmt`. Homologação (só testes): `hfzjoefnousiouiuchys`.

## Arquivos do site (raiz)
| Arquivo | O que é |
|---|---|
| `index.html` | Página principal: tela de início → menu (Center Run, Pet, Perfil, Gacha, Sora, Moon Duo, Karaoke, Encontro, Missões, vitrine, Top Idols, TsuLiPa TV). |
| `index2.html` | Só redireciona para `/` (links antigos). |
| `sora-jump.html` | Sora⭐Jump!, aberto como pop-up da página principal. |
| `karaoke-time.html` | **Karaoke⭐Time!**: o card 🎤 do menu abre este. Jogo solo offline, 5 shows por dia, 7 músicas, placar da semana, foto da sala. Usa o nick e o visual da conta (`brs48cr_nick`, `brs48cr_char`, `brs48cr_cu2`). |
| `karaoke-day.html` + `karaoke-online.js` | Karaoke⭐Day! online (domingos, sala real). **Guardado, desligado**: para voltar, rodar `karaoke_online_religar.sql` no banco e trocar `TW_KARAOKE_TIME` para `false` no `index.html`. |
| `karaoke-homol-*.js`, `karaoke-online-lab.html`, `karaoke-room-model.js`, `karaoke-rhythm.*` | Módulos do Karaoke e o laboratório de homologação (`?homol=1`). |
| `*.css` | Estilos: `index2-skin`, `index2-launch-ui` (menu, TV e pop-up do Sora), `tw-weekly-podium` (Top Idols/TV), `games-theme`, `sora-embed`, `karaoke-embed`, `karaoke-rhythm`. |
| `audio/` | Vozes do trio (5 falas cada) e o som do Encontro do dia. O resto da música é gerado no código. |
| `privacidade.html`, ícones, `manifest.json`, `og.jpg`, `googled…html` | Privacidade, ícones, imagem de compartilhamento e verificação do Google. |
| `tests/` + `.github/workflows/validate-games.yml` | 10 verificações automáticas a cada envio, incluindo cards com login simulado. |
| `supabase/` | SQL aplicado e testes de banco. `supabase/sql/README.md` diz o que já está no ar. |
| `docs/` | Este STATUS e o histórico em `docs/historico/`. |

## Feito até o lançamento (30/10)
- Karaoke online real na produção, com contas do site; abre todo domingo 12h–13h10; moderação abre teste de 30 min.
- Página sem piscar a versão antiga; menu em coluna única no computador; cards Pet, Perfil, Gacha / Sora, Moon Duo, Karaoke.
- TsuLiPa TV: troféu voando no canto do banner abre o pop-up do ranking.
- Top Idols logo abaixo da vitrine. Encontro do dia com os nomes de todos.
- Center⭐Run! Temporada 2: 8 cenários, deslizar, obstáculos que andam, combo, corredor de fãs, desafio, Coro, Corrida do dia e seletor de cenário no Modo Teste.
- Perfil com emoji, cor e time (B, R, S, KKS); Oshi escolhido entre quem joga. Mesmo visual no perfil e no Center Run.
- Subtítulos em japonês e traduções conferidas em EN/ES/TH/JA.
- Banner: tocar na Tsu, Lirika ou Pati dá pulinho, emojis, balão kawaii e voz real (5 falas cada, risada a cada duas). Os pets também respondem.
- Músicas dos temas trocadas por covers do TsuLiPa (os nomes dos temas não mudaram).
- Privacidade atualizada em 5 idiomas. Imagem de compartilhamento com os 6 modos.

## Feito offline, depois do lançamento
- **Karaoke · sala online:** a ponte do palco refazia o layout e jogava fora o nick e o visual reais, então todo mundo virava "Idol 01" com boneco sorteado. Corrigido. Os 8 lugares do sofá ficavam empilhados dois a dois: agora espalhados.
- **Karaoke · janela da Liberdade:** a corda das lanternas flutuava sem apoio (agora dois postes na calçada), as lanternas viraram luzes de verdade, os toldos e as placas 茶 (chá) e 麺 (lámen) viraram lojinhas apoiadas no chão.
- **Sora⭐Jump!:** abre como pop-up da página, igual ao Star⭐Gacha, no cartão do tema escolhido e sobre a página escurecida. O menu, o fim de jogo e o placar saíram do vidro escuro para o pastel do site. O ⌂ Início saiu de cima do placar.
- **Som:** com o Sora ou o Karaoke abertos, a página para a própria música (antes a do Center Run voltava por cima).
- **Voltar:** dentro do pop-up, o voltar só avisa a página de fora e nunca navega o iframe (antes, quando o aviso falhava — ao abrir por `file://`, por exemplo — a página principal abria dentro do próprio pop-up). Fora do pop-up, vai para a raiz. O seletor avulso `sora-jump-karaoke.html` foi removido.
- **Teste com login simulado** (`tests/login-simulado.test.js`): roda o script do cadeado com e sem conta e falha se o interruptor de teste estiver ligado ou se o `window.contaJ` sumir.
- **Teste novo:** o `validate-games.js` confere que nenhuma página aponta para arquivo que não existe e que o voltar nunca navega o iframe.
- **Troféu da TsuLiPa TV:** ganhou uma fanfarra curta, kawaii e orgulhosa.
- **Limpeza:** saíram `sora-jump-karaoke.html`, `og.png` (ninguém usava) e a pasta `.freebuff/`.

## Karaoke⭐Time! no lugar do Karaoke⭐Day! (branch `feature/karaoke-time`)
- O card 🎤 virou **Karaoke⭐Time!** (カラオケ・タイム), sem contagem de domingo e sem cadeado de horário; mostra "5 shows por dia" nos 5 idiomas.
- Abre como o Karaoke abria (tela cheia com o cabeçalho do site), com o Oshi e o claro/escuro da página. O menu local e a barra de cima do arquivo somem dentro do site.
- Voltar (← Jogos e Esc) só avisa a página de fora; nunca navega o iframe.
- Quem joga aparece com o nick e o visual da conta; os outros 6 do sofá vêm do sorteio diário (foto dos perfis de 30/10 guardada no arquivo).
- Karaoke⭐Day!, sala online, homologação e SQL ficaram no repositório, sem mudança, para retomar depois.
- Textos do Karaoke⭐Time! em PT/EN/ES/TH/JA, no idioma escolhido no menu (página e telão). Nomes de músicas e de Idols não mudam.
- Voltaram as partes da versão "Clipe do dia": o clipe do dia no telão (conceito e formação mudam a cada dia de Brasília), a faixa "Sua plateia de hoje" com retratos, e os Idols da sala clicáveis (pulinho, brilhos, balão e notinha).
- **Ranking online do Karaoke⭐Time!** (`supabase/sql/karaoke_time_ranking.sql`, **aplicado em produção em 30/10/2026**): com conta, cada show passa pelo servidor (5 por dia no horário de Brasília, resultado conferido: duração mínima, notas, combo e pontos possíveis). Três quadros por semana (domingo a sábado): Pontuação, Maior combo e Acertos. A semana do Karaoke passou a começar no domingo, como o Top Idols. Sem conta, o jogo segue só no aparelho.
- **Top Idols:** a coluna do Karaoke mostra a pontuação, e embaixo entra a barra "🎤 Karaoke⭐Time! · ranking da semana" (com subtítulo em japonês) e os três quadros.
- **Card do Karaoke:** fica rosa de alerta, com o "!", enquanto faltar algum dos 5 shows do dia (o servidor conta), e mostra quantos faltam.
- **Emojis:** os do banner (Tsu, Lirika e Pati) ganharam brilho branco e um pulinho de entrada, porque no computador o emoji do sistema sai mais claro. Os efeitos da sala do Karaoke agora são emojis do mesmo jeito: estouram, sobem balançando com rastro de brilho, e os corações têm a cor de cada Idol.
- **Clipe Candy Parade:** pirulitos em espiral com brilho e lacinho, algodão-doce fofo ao fundo e balinhas caindo.
- **Lightstick:** usa a cor escolhida no perfil (chave nova `brs48cr_cor`); sem cor, continua a do cabelo. Vale no menu, na foto do perfil e na sala do Karaoke.
- **Clipe do dia:** fundos com profundidade (brilho na parede, bokeh, feixes de luz, palco com perspectiva e vinheta); no Diamante ninguém esconde o rosto de ninguém e ninguém fica cortado na borda.
- **Supabase de produção (30/10):** a sala online foi desligada sem apagar nada (`supabase/sql/karaoke_online_desligado.sql`). Ninguém de fora chama mais `karaoke_sala*` nem `karaoke_posteres_semana`, o esquema `karaoke_lab` ficou fechado e o sinal saiu do tempo real. Para religar: `karaoke_online_religar.sql`. Os botões de teste do Karaoke na moderação somem enquanto `TW_KARAOKE_TIME` estiver ligado.

## Falta (para fechar o lançamento)
1. Testar a prévia do PR no Netlify, logada, no celular: Pet, Gacha, Moon Duo, Sora, Perfil e uma corrida salvando.
2. Decidir a estreia do Karaoke e se o ranking semanal (Sora/Karaoke) vai para o banco.

## Ideias aprovadas para depois
- Jogo de ritmo do Karaoke: estética e lógica a rever.
- Comidas e bebidas do Karaoke custando estrelas que vão para a conta da moderação.
- Banner que alterna os 3 primeiros da semana (Center Run, Sora, Karaoke).
- 3 fotinhas no perfil (guardando a receita da foto, não a imagem).
- Nota máxima no Karaoke: a sala comemora com frases, pulinhos e brilhos.
- Catálogo Sora Idol / Karaoke Idol (cenários, roupas, acessórios) e o tema Dia da Paz.

## Regras
- Nunca renomear chaves `brs48cr_*`. Nunca commit direto na `main`: sempre PR, e quem faz merge é a dona.
- Juntar mudanças em poucos envios (cada push gera build na Vercel).
- Não criar dados falsos na produção. Testes de banco só em transação desfeita ou na homologação.
- `TW_RANK_ONLINE_READY=false` até existir pontuação conferida no servidor para Sora/Karaoke.
- Antes de qualquer merge, `TW_JOGOS_SEM_LOGIN` tem que voltar para `false` no `index.html`.
