# Economia de estrelas ★ — retrato real (13/11/2026, últimos 14 dias)

Dados lidos de `public.star_log` e `public.players` em produção (só leitura).

## Quanto entra e quanto sai

- **Entraram:** ★8.257 · **Saíram:** ★6.424 → os jogadores gastam **~78%** do que ganham. É um sinal saudável: as estrelas têm onde ser usadas e os preços não estão altos demais.
- **Saldos hoje:** 20 contas, mediana ★124, média ★224, maior ★818.
- 19 contas mexeram em estrelas no período; depois do lançamento (31/10–01/11) a atividade caiu para 1–2 jogadores de Center por dia.

## De onde vêm (14 dias)

| Fonte | Total | Observação |
|---|---|---|
| Center⭐Run! (`corrida`) | ★6.420 (78%) | Quase tudo em 31/10–01/11 (antes do teto). **Desde 02/11 o teto de ★100/dia está ativo** e funcionando (maior dia por jogador: ★100). |
| Missões (`missao`) | ★990 (12%) | ★5–20 cada |
| Pet (`minijogo`) | ★404 | teto próprio de ★50/dia |
| Gacha | ★299 | média ★15 por giro |
| Encontro do dia | ★69 | ★3 |
| Sora 500 m | novo (13/11) | ★25/dia com anti-cheat |
| Café, Handshake, Karaoke, Moon⭐Duo! | **★0** | dão receitas, tickets, itens do pet — nunca estrelas |

## Para onde vão

Visual (roupas ★150–350, poses ★100–150, extras do Duo ★80–150, detalhes ★50) e o camarim do pet (itens, média ★53).

## Diagnóstico

1. **A economia não está quebrada.** O teto do Center segura a inflação e as pessoas gastam o que ganham.
2. **O problema é a concentração:** quase toda estrela vem do Center. Café e Handshake — agora mais ricos (Dois no balcão, hora extra) — não dão nenhuma estrela, então quem quer roupa nova não tem motivo para jogá-los.
3. Um jogador muito ativo hoje faz até ~★240/dia (Center 100 + pet 50 + missões ~45 + Sora 25 + gacha ~15 + encontro 3). Uma roupa de ★150–350 custa 1–2 dias assim; a mediana (★124) compra um detalhe ou uma pose.

## Proposta: "Bônus do dia por jogo" (pequeno, sem inflar)

- **★10 por dia no Happy⭐Cafe!** e **★10 por dia no Handshake⭐Event!**, na primeira partida **verificada pelo servidor** com **600+ pontos** (o mesmo corte do prêmio do Handshake).
- No máximo **+★20/dia** no total → +8% para quem já joga tudo; para quem só joga Café/Handshake, passa a valer a pena.
- Sem teto novo no Center, sem mexer em preços.
- **Aplicado em 13/11/2026** (`supabase/sql/aplicado/20261113_bonus_jogo_dia.sql`).

## Depois (quando vierem os jogos novos)

- O Bloom⭐Garden! deve ser **um lugar de gastar** (sementes, vasos), não mais uma fonte grande.
- Reavaliar com estes mesmos números um mês depois do lançamento dos merges #88/#89.
