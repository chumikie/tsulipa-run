# STATUS — TsuLiPa⭐World

Atualizado em 30/10/2026. Atualize este arquivo no mesmo envio de qualquer mudança.

## Onde está cada coisa
- **Site no ar:** https://tsulipa-world.vercel.app (Vercel pausada pela dona até a nova versão ficar pronta).
- **Versão nova:** branch `release/index2-lancamento`, PR #34 (rascunho). Prévia: https://deploy-preview-34--tsulipa-run.netlify.app
- **PR #33:** todo o conteúdo dele já está no #34. Fechar sem merge depois do lançamento.
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
- Música de cada tema agora é cover do TsuLiPa (nomes dos temas iguais): Halloween Love Pulsar, Natal Stay With Me, Ano Novo Wish You Happiness!!, Valentine Valentine Kiss, Verão Hitonatsu no Dekigoto, Outono Samishii Nettaigyo, Inverno Monster, Primavera Cheeky Cheeky, Sakura ZIPPER, Tanabata Wagamama na Nagareboshi, Dia das Crianças Amor Grilado, Aniversário Aitakatta.

- Banner: vozes reais do trio (5 falas cada, risada a cada duas falas); balão kawaii (um só contorno com rabinho, fonte Mochiy Pop One, ~3,5 s); pets do banner clicáveis com a vozinha de cada um.
- Privacidade atualizada (30/10) em 5 idiomas: estilo do perfil, presença no Karaoke e vozes (sem microfone, sem gravação).

## Falta antes do merge
1. Teste com 2 pessoas na prévia: moderação → "Karaoke: abrir teste (30 min)", as duas entram, pedem o microfone, a vez passa.
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
