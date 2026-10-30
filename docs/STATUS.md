# STATUS — TsuLiPa⭐World

Atualizado em 30/10/2026. Atualize este arquivo no mesmo envio de qualquer mudança.

## Onde está cada coisa
- **Site no ar:** https://tsulipa-world.vercel.app (Vercel pausada pela dona até a nova versão ficar pronta).
- **Versão de lançamento:** PR [#34](https://github.com/chumikie/tsulipa-run/pull/34), branch `release/index2-lancamento`, mesclado em 30/10/2026. Isso não confirma, por si só, um deploy em produção.
- **PR #33:** aberto como rascunho independente, na branch `feature/sora-karaoke-v2-2026-10-29`; prévia: https://deploy-preview-33--tsulipa-run.netlify.app. Não é o PR #34; revisar o conteúdo antes de fechar ou mesclar.
- **PR #15:** login com Google + espaçamentos continua aberto; prévia: https://deploy-preview-15--tsulipa-run.netlify.app.
- **Supabase de produção:** `fsggtvgbyhchblyazgmt`. Homologação (só testes): `hfzjoefnousiouiuchys`.

## Arquivos do site (raiz)
| Arquivo | O que é |
|---|---|
| `index.html` | Página principal: tela de início → menu (Center Run, Pet, Perfil, Gacha, Sora, Moon Duo, Karaoke, Encontro, Missões, vitrine, Top Idols). |
| `index2.html` | Só redireciona para `/` (links antigos). |
| `sora-jump.html` | Sora⭐Jump! (abre por iframe a partir do menu). |
| `karaoke-day.html` + `karaoke-online.js` | Karaoke⭐Day! e a sala online real. |
| `karaoke-homol-*.js`, `karaoke-online-lab.html`, `karaoke-room-model.js`, `karaoke-rhythm.*` | Módulos do Karaoke e o laboratório de homologação (`?homol=1`). |
| `sora-jump-karaoke.html` | Seletor dos dois jogos quando abertos sozinhos, fora do menu. |
| `*.css` | Estilos: `index2-skin`, `index2-launch-ui` (menu e TV), `tw-weekly-podium` (Top Idols/TV), `games-theme`, `sora-embed`, `karaoke-embed`, `karaoke-rhythm`. |
| `privacidade.html`, ícones, `manifest.json`, `og.*`, `googled…html` | Página de privacidade, ícones e verificação do Google. |
| `tests/` + `.github/workflows/validate-games.yml` | 9 verificações automáticas a cada envio. |

## Feito nesta etapa (30/10)
- Karaoke online real na produção, com contas do site; abre todo domingo 12h–13h10; moderação abre teste de 30 min.
- Página sem piscar a versão antiga; menu em coluna única no computador; cards 3×2 (Pet, Perfil, Gacha / Sora, Moon Duo, Karaoke).
- TsuLiPa TV: troféu voando no canto do banner, abre o pop-up do ranking (antes abria vazio).
- Top Idols logo abaixo da vitrine.
- Encontro do dia: nomes de todos na dupla/trio (botão, cartão e foto).
- Sora: os cenários secretos (10 toques no título) voltaram a aparecer.
- Visual único: perfil e Center Run usam o mesmo personagem; vitrine e outdoors sem o pet da foto.
- Karaoke: a cortina da direita não fechava (só a esquerda aparecia); agora as duas fecham e o varal de enfeites atravessa o palco inteiro.
- GitHub: documentos antigos em `docs/historico/`, STATUS único. Branches já mescladas (20) podem ser apagadas pela dona em GitHub → Branches; manter `main`, `release/index2-lancamento` e, até fechar os PRs, `feature/sora-karaoke-v2-2026-10-29` e `test/karaoke-reuse-anonymous-session`.

## Feito em 30/10 (2ª rodada)
- Center⭐Run! Temporada 2 integrada no `index.html` (veio da v20): 8 cenários, deslizar (seta ↓ / botão ▼), obstáculos que andam, combo, corredor de fãs, desafio, Coro, Corrida do dia e seletor de cenário no Modo Teste. Na Rua da cidade a corrida é a de antes. Placar ganhou fundo translúcido nos cenários novos.
- Perfil: emoji, cor e time (B, R, S, KKS) e Oshi escolhido entre quem joga. Banco já atualizado em 30/10 (`supabase/sql/perfil_emoji_cor_time_oshi.sql`).
- Karaoke: telão com o mesmo grupo para todos (grupo 1 às 12h00 … 6 às 12h50, novo sorteio por semana) e vista alternando Gigoia/Liberdade por semana.

- Subtítulos em japonês no Center⭐Run!, Missões do dia, vitrine de Idols e Top Idols. Traduções do menu e do Center Run conferidas em EN/ES/TH/JA.
- Banner do TsuLiPa: tocar na Tsu, Lirika ou Pati faz pulinho, emojis e um "oi" escrito (vozes entram quando as gravações chegarem).
- Música de cada tema agora é cover do TsuLiPa (nomes dos temas iguais): Halloween Love Pulsar, Natal Pittari Shitai X'mas!, Ano Novo Wish You Happiness!!, Valentine Valentine Kiss, Verão Splash Dream, Outono Samishii Nettaigyo, Inverno Monster, Primavera Cheeky Cheeky, Sakura ZIPPER, Tanabata Wagamama na Nagareboshi, Dia das Crianças Amor Grilado, Aniversário Aitakatta.

- Banner: vozes reais do trio (5 falas cada, risada a cada duas falas); balão kawaii (um só contorno com rabinho, fonte Mochiy Pop One, ~3,5 s); pets do banner clicáveis com a vozinha de cada um.
- Privacidade atualizada (30/10) em 5 idiomas: estilo do perfil, presença no Karaoke e vozes (sem microfone, sem gravação).

- Descrições do link atualizadas com todos os modos ; imagem og no estilo anterior (trio no tema ZIPPER) com os 6 modos.
- Trilha sonora: 31 faixas geradas no código (25 músicas diferentes), gravadas em MP3 fora do repositório.
- Modelo local da sala: o contador de revisão usa sinalização direta das transições, sem serializar a vez nem comparar comprimentos de arrays em atualizações sem mudanças.
- CI: testes offline de comportamento cobrem agora a guarda de login, sucesso/falha de compra e formato/chaves dos saves, sem tocar contas reais.
- CI: smoke test verifica referências locais de páginas e CSS; o workflow acompanha alterações em HTML, JS, CSS e SQL para evitar mudanças relevantes sem validação.
- Organização: as funções puras de semana/ranking do pódio estão em `tw-weekly-podium-model.js`; IDs, conteúdo exibido e regras do ranking foram mantidos e cobertos pelos mesmos casos de regressão.
- Lint progressivo: ESLint se aplica apenas aos módulos JS independentes; arquivos HTML legados continuam fora do lint.
- CI testa sessão de ensaio ausente, permanente e anônima sem criar contas nem acessar o Supabase.
- Lint segue restrito aos módulos puros: os clientes de sessão online/homologação ainda têm alertas preexistentes de `catch` vazio e variável `captchaToken` redeclarada; evitar mudança funcional incidental antes de incluí-los.
- Prévia local (30/10): desktop em 1024 px e celular em 390 px abriram sem erro; no breakpoint móvel, a última letra do logotipo quebra para a linha seguinte. Registro para ajuste visual separado; não foi alterado nesta refatoração.
- Prévia do PR #33 (30/10): páginas Sora e Karaoke abertas em largura estreita, sem login nem ações que gravem dados; não foi possível concluir o teste de dois participantes nem validar em aparelhos físicos.

## Validações pendentes antes de um novo lançamento
1. Karaoke online: a prévia seleciona homologação fora do domínio oficial e não consulta RPCs de produção. A migration 3A.11 prepara movimento/dança e usa o apelido e o visual escolhidos por cada participante, sem enviar autenticação, saldo ou pontuação; a 3A.12 permite ao responsável abrir uma janela manual de até 2 horas **somente na homologação**. Ambas ainda precisam ser aplicadas em `hfzjoefnousiouiuchys`, após confirmar CAPTCHA e Anonymous Sign-ins. Para o teste com duas pessoas, cada uma cria uma sessão de ensaio uma vez com `?homol=1&auth_test=1` e depois reutiliza com `?homol=1&reuse_session=1`; o responsável abre a janela pelo SQL Editor conforme `supabase/sql/README.md`. Nenhuma alteração foi aplicada em produção.
2. No celular: compra, gacha, resgate, corrida salvando (a trava da prévia saiu).
3. Revisar visual do Karaoke (cortina e itens) e do Sora (moldura igual à do Center Run).

## Ideias aprovadas para depois do lançamento
- Emoji, cor favorita e time (B azul, R amarelo, S verde, KKS ciano) no perfil; lista de Oshi só com quem joga.
- Comidas e bebidas do Karaoke custando estrelas que vão para a conta da moderação.
- Banner que alterna os 3 primeiros da semana (Center Run, Sora, Karaoke).
- 3 fotinhas no perfil (guardando a receita da foto, não a imagem).
- Nota máxima no Karaoke: a sala comemora com frases, pulinhos e brilhos.
- TsuLiPa e jogadores da vitrine clicáveis com som (precisa dos áudios curtos).

## Regras
- Nunca renomear chaves `brs48cr_*`. Nunca commit direto na `main`: sempre PR, e quem faz merge é a dona.
- Juntar mudanças em poucos envios (cada push gera build).
- Não criar dados falsos na produção. Testes de banco só em transação desfeita ou na homologação.
- `TW_RANK_ONLINE_READY=false` até existir pontuação conferida no servidor para Sora/Karaoke.
