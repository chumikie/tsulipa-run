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
| Pet (`minijogo`) | ★404 | teto próprio de ★50/dia; na PR #124, cada partida (Ritmo/Corda) começa no servidor (`mini_run_start`) e só paga até ★40 e no máximo ★1 por segundo jogado (`mini_run_finish`) |
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

## Auditoria de 20/11/2026 (PR #124)

Migração `supabase/migrations/20261120150000_auditoria_seguranca_20261120.sql`, incluída na PR #124 para a integração GitHub–Supabase no merge. A aplicação em produção será verificada na publicação. Testada em PostgreSQL isolado (`supabase/tests/auditoria_20261120_pg_integration.sh`, também no CI) e numa transação desfeita no banco de produção.

- `leaderboard` sem leitura direta: o ranking e o perfil continuam por `top_scores` e `perfil_publico`; `user_id` e `device_id` deixam de ficar expostos.
- Sem escrita direta (INSERT/UPDATE/DELETE) de `anon`/`authenticated` nas 16 tabelas que ainda tinham os grants padrão.
- `encontro_hoje` e `camarim_coracao` só para quem entrou com Google; perfil de conta bloqueada não aparece para os outros.
- Minijogos do camarim: `mini_run_start`/`mini_run_finish` entram com recibo para reconfirmar a mesma partida. O corte de `ganhar_minijogo` acontece após o aceite da versão nova (mesmos tetos ★40 por partida e ★50 por dia).
- Recordes de Handshake e Café numa chamada (`meus_recordes_jogos`), no máximo 1 leitura por minuto ao abrir o Início; presença online pausa com a pessoa parada e só atualiza fora do mapa se o contador estiver na tela.
- `private.sora_scores` ganhou chave primária.
- Mantidos de propósito: teto de importação ★1.000 (migração `v212_teto_importacao_1000` de 27/10), os 11 índices sem uso e a proteção de senhas vazadas desligada (login só com Google). As RPCs públicas do modo visitante seguem abertas e só devolvem o que a página de privacidade já diz que é público.

### Esta semana na #124 (20/11/2026)
- **Show de sábado:** ★20 por semana para quem termina uma música do Karaoke⭐Time! no sábado (conferido em `private.kt_runs`).
- **Jogo da semana:** a missão de nível 1 prefere o jogo menos jogado na semana anterior e vale ★5 a mais (★15 em vez de ★10).
- **Festa no mapa:** a lembrança é o cenário do camarim do tema (item de ★60 na loja), grátis uma vez por festa; não mexe no saldo.
- Somando tudo, um jogador muito ativo ganha no máximo +★25 por semana a mais.

## PR das melhorias (21/11/2026)

Migração `supabase/migrations/20261121120000_convite_e_concurso_visual.sql` (ainda não aplicada; aplicar junto com o merge).

- **Convite com prêmio:** ★30 para quem chega e ★30 para quem convidou, quando a pessoa nova termina a primeira corrida. Só conta criada há até 7 dias aceita convite; quem convida recebe no máximo 10 prêmios por mês (+★300/mês no pior caso). Insígnia `convite` (Abre-alas).
- **Concurso de visual da semana:** ★50 por semana para quem teve mais votos (empate: todo mundo empatado), com pelo menos 2 inscrições e 1 voto. Até 3 votos por conta por semana, nunca no próprio visual. Insígnia `look_semana`.
- Somando, um jogador muito ativo ganha no máximo +★50 por semana a mais; o convite só paga quando chega gente nova.

### Parte 2 (21/11/2026)
Migração `supabase/migrations/20261121150000_duetos_metas_recorde_semana.sql` (ainda não aplicada).
- **Álbum de duetos (Moon⭐Duo!):** 3, 6, 10 e 15 parceiros de cena diferentes pagam ★10, ★20, ★30 e ★50, uma vez cada (★110 no total, para sempre).
- **Metas do álbum de Idols:** 5, 15, 30 e 50 Idols pagam ★10, ★25, ★40 e ★60, uma vez cada (★135 no total, para sempre).
- **Recorde da semana:** só leitura (`meu_recorde_semana`), sem prêmio novo.

### Parte 3 — economia e começo do jogo (21/11/2026)
Migração `supabase/migrations/20261121180000_economia_e_estreia.sql` (ainda não aplicada). Diagnóstico de 30 dias: 76% das estrelas vinham do Center⭐Run!, 12 de 20 contas sem nenhum item, conta nova com ★0, só 8 de 20 seguiam depois do 7º dia.
- **Kit de estreia:** ★100 + 1 item grátis (detalhes, chapéu, expressões, fundos baratos), uma vez por conta — também para quem já joga (até ★2.000 no total para as 20 contas atuais).
- **Trilha da primeira semana:** contas com até 14 dias; corrida, giro do gacha, foto no Duo, compra e missão valem ★20 cada; completar dá +★40 e a insígnia `trilha` (★140 no total, uma vez).
- **Primeiro resultado do dia** no Sora⭐Jump!, Happy⭐Cafe!, Handshake⭐Event! e Idol⭐Battle!: ★15 cada (até +★60/dia para quem joga os quatro).
- **Promoção da semana:** uma roupa fora de temporada com 30% de desconto, em rodízio de 12 roupas (`private.promo_item`). Preços-base em `private.visual_preco_base`.
- **Gacha:** 3 primeiros giros = card; 3 giros seguidos sem card → o próximo é card; card de Idol que falta enquanto faltarem 3+; pó: 3 repetidos = 1 card (antes 5).
