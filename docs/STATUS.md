# STATUS — TsuLiPa⭐World

Atualizado em 30/10/2026. Atualize este arquivo no mesmo envio de qualquer mudança.

## Onde está cada coisa
- **Site no ar:** https://tsulipa-world.vercel.app
- **Trabalho atual:** na pasta do computador, offline. Nada vai para o GitHub nem para a Vercel sem a dona pedir.
- **Supabase de produção:** `fsggtvgbyhchblyazgmt`. Homologação (só testes): `hfzjoefnousiouiuchys`.

## Arquivos do site (raiz)
| Arquivo | O que é |
|---|---|
| `index.html` | Página principal: tela de início → menu (Center Run, Pet, Perfil, Gacha, Sora, Moon Duo, Karaoke, Encontro, Missões, vitrine, Top Idols, TsuLiPa TV). |
| `index2.html` | Só redireciona para `/` (links antigos). |
| `sora-jump.html` | Sora⭐Jump!, aberto como pop-up da página principal. |
| `karaoke-day.html` + `karaoke-online.js` | Karaoke⭐Day! e a sala online real. |
| `karaoke-homol-*.js`, `karaoke-online-lab.html`, `karaoke-room-model.js`, `karaoke-rhythm.*` | Módulos do Karaoke e o laboratório de homologação (`?homol=1`). |
| `*.css` | Estilos: `index2-skin`, `index2-launch-ui` (menu, TV e pop-up do Sora), `tw-weekly-podium` (Top Idols/TV), `games-theme`, `sora-embed`, `karaoke-embed`, `karaoke-rhythm`. |
| `audio/` | Vozes do trio (5 falas cada) e o som do Encontro do dia. O resto da música é gerado no código. |
| `privacidade.html`, ícones, `manifest.json`, `og.jpg`, `googled…html` | Privacidade, ícones, imagem de compartilhamento e verificação do Google. |
| `tests/` + `.github/workflows/validate-games.yml` | 9 verificações automáticas a cada envio. |
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
- **Teste novo:** o `validate-games.js` confere que nenhuma página aponta para arquivo que não existe e que o voltar nunca navega o iframe.
- **Troféu da TsuLiPa TV:** ganhou uma fanfarra curta, kawaii e orgulhosa.
- **Limpeza:** saíram `sora-jump-karaoke.html`, `og.png` (ninguém usava) e a pasta `.freebuff/`.

## Falta
1. Teste da sala do Karaoke com 2 pessoas, pelo botão "Karaoke: abrir teste (30 min)" da moderação.
2. Jogo de ritmo do Karaoke: estética e lógica a rever.
3. No celular: compra, gacha, resgate e corrida salvando.
4. Decidir a estreia do Karaoke e se o ranking semanal (Sora/Karaoke) vai para o banco.

## Ideias aprovadas para depois
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
