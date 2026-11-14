# Retomada — onde paramos (13/11/2026)

Este arquivo é para continuar o trabalho em outra sessão (por exemplo, no Claude Code). Leia este arquivo, `docs/RAIOX_JOGOS.md` e `docs/MAPA_DO_CODIGO.md` antes de mexer em qualquer coisa.

## Regras do projeto
- Respostas em português, curtas e diretas. Sempre dizer o que **não** foi testado.
- HTML/CSS/JS puro, sem frameworks (só o Supabase via CDN). Canvas 2D com `requestAnimationFrame`.
- Nunca renomear chaves `brs48cr_*`.
- Nada vai para `main` sem PR, e quem faz o merge é o dono do projeto.
- Banco de produção só muda com OK explícito do dono. Os SQL já aplicados ficam em `supabase/sql/aplicado/`.
- Nada de dado falso em produção; horário de Brasília; roupas unissex.
- Nunca pedir nem mostrar chaves secretas no chat.
- Não usar personagens com direitos autorais; artes sempre originais.
- Testes: `for f in tests/*.js; do node $f; done`. O `karaoke-time.html` tem limite de 450 KB.

## Estado atual
- **Branch `visual/layout-hud` (PR #88)**, que já contém o PR #87:
  - visual dos cards e da paleta;
  - HUD do jogador;
  - destaque "Pra hoje";
  - barra de baixo no celular;
  - duas colunas no computador (≥1180px);
  - janelas com moldura;
  - abertura;
  - Top Idols no Idol⭐News!;
  - mapa da cidade.
- **PRs abertos:**
  - #86: traduções do Karaoke num arquivo próprio;
  - #72: documentação;
  - #74: Sora 500 m. Precisa de anti-cheat antes de aplicar o SQL.
  - O #87 pode ser fechado, porque já está dentro do #88.
- **Mapa da cidade original** (`tw-mapa.js` + `mapa-cidade.svg`, descrição do estado antes da navegação em 2 níveis):
  - é um botão "Passear pela cidade" no fim do Meu mundo, que abre e fecha;
  - `TW_LUGARES` é o registro de lugares, e cada prédio aciona o card original do hub;
  - o trio fica na praça, desenhado com `drawChar` e `perfCharContorno`;
  - o seu Idol e os Idols da vitrine passeiam pelas ruas;
  - a cidade muda com a hora de Brasília: dia, entardecer (17h) e noite (19h–6h);
  - histórico: a arte antiga era editada sem gerador versionado; agora `tools/mapa/` contém os geradores SVG da versão em dois níveis, sem afetar o site publicado antes do merge.
- **Pendências do dono:**
  - merges;
  - limpar os branches já mergeados.

## Planejamento (fases)
- **Fase 0:** registro de lugares. ✅
- **Fase 1:** mapa da cidade. ✅
- **Fase 2:** raio-X dos jogos atuais, em `docs/RAIOX_JOGOS.md`. ✅
- **Fase 3:** melhorar os jogos atuais. Feito no front-end: Pedido de cena do dia (Moon⭐Duo!), metas do Álbum (Gacha), hora extra do Handshake (vale já no treino sem conta). Com banco: ver a fila abaixo.
- **Fase 4:** jogos novos, na ordem Bloom⭐Garden!, Photo⭐Studio!, Idol⭐Battle!. A casa decorável ainda está em dúvida.

## Banco (atualizado 13/11, à tarde)
- **Já estava em produção:** `album_cards()` (o Álbum e as metas de coleção funcionam).
- **Aplicado hoje, com o OK do dono:** hora extra do Handshake (8 filas, até 60 respostas), Sora 500 m com anti-cheat (prêmio ★25/dia, ≥20 s e ≤25 m/s), Café "Dois no balcão" (`cafe_run_pedidos`, `cafe_run_etapa2`, `cafe_run_finalizar`). Arquivos em `supabase/sql/aplicado/20261113_*.sql`.
- **Também aplicado hoje:** `admin_corrida` (excluir corrida no admin agora desfaz os contadores).
- **Merges que destravam no site:** PR #88 (visual, mapa, hora extra no site), PR #89 (Café Dois no balcão), PR #74 (tela do prêmio do Sora; o SQL dele foi substituído pela versão com anti-cheat — não aplicar o SQL do #74).

## Economia de estrelas
- Retrato real em `docs/ECONOMIA_ESTRELAS.md` (o teto de ★100/dia do Center ESTÁ em produção desde 02/11; o README-center-run-100.md está desatualizado).
- **Aplicado em 13/11:** bônus do dia, ★10/dia no Café e no Handshake (1ª partida verificada com 600+ pontos). Arquivo em `supabase/sql/aplicado/20261113_bonus_jogo_dia.sql`.

## Mapa em 2 níveis (aprovado pelo dono em 13/11)
O mapa de 1 nível ficou lotado. Novo modelo:
1. **Mapa do mundo** (`tools/mapa/mundo2.py`, prova em `docs/mapa-provas/mundo_v2.jpg`): os prédios reais agrupados em 6 bairros, só 6 plaquinhas (nome do bairro + ícones do que tem dentro).
   - Star Stage (aprovado; ID `palco`): Handshake, Center, Karaoke.
   - Rua das Vitrines (nome **provisório**, ID legado `harajuku`): Café, Gacha, Shop. Não usar Harajuku como nome exibido.
   - Vila das Flores (nome **provisório**, ID legado `fofo`): Pet, Minha casa, horta "em breve" (Bloom⭐Garden!). Sem nome de pet.
   - Praça Central: fonte (Encontro do dia), Idol⭐News!, Pedido de fã.
   - Star Arena (aprovado; ID `arena`): "?" (Idol⭐Battle!).
   - Jardim das Nuvens (aprovado; ID `ceu`, única ilha no alto): Sora, Moon⭐Duo!, "?" (Photo⭐Studio!).
2. **Cena da rua de cada bairro** (modelo: `tools/mapa/rua.py`, prova em `docs/mapa-provas/rua_harajuku.jpg`): tocar no bairro abre a rua dele, com os prédios grandes lado a lado (escala ~2), calçada, chão de pedrinha onde os Idols passeiam e botão "◀ Mapa". No celular a rua rola para os lados.

**Ordem de implementação (1–6 implementadas na PR #88; sem merge/publicação oficial):**
1. Gerar `mapa-mundo.svg` (mundo2.py + sep.py) e as 6 ruas (copiar rua.py para cada bairro).
2. Em `tw-mapa.js`: estado `cena = 'mundo' | <bairro>`; caixas de clique por bairro no mundo; na rua, caixas por prédio usando o mesmo `TW_LUGARES` (clique chama o `click()` do card original).
3. Levar para a rua: passeantes (seu Idol + Idols da vitrine + pets), hora do dia (`horaBR`, `ceu`), alertas (!) e cadeados. No mundo ficam só alerta somado por bairro e o trio no palco.
4. Botão "◀ Mapa", tecla Esc e `history` (voltar do celular volta ao mundo).
5. Jogos novos entram ocupando o "?" do bairro.
6. Testar desktop + celular (rolagem, cliques, tema escuro) e os testes `for f in tests/*.js; do node $f; done`.

## Estado de execução do mapa (13/11/2026 — PR #88)
- **Passo 1:** mundo e seis SVGs de ruas gerados com `tools/mapa/gerar_2_niveis.py` e validados.
- **Passo 2:** navegação mundo → bairro e clique nos cards originais implementados em `tw-mapa.js`; IDs internos antigos preservados.
- **Passo 3:** Idols e pets existentes passeiam nas ruas, iluminação por horário de Brasília, cadeados e alertas por edifício; alertas agregados e trio no mundo.
- **Passo 4:** botão HTML e SVG “◀ Mapa”, Esc quando não há jogo/modal em primeiro plano, histórico de navegação para Voltar/Avançar do celular. Preserva `history.state` de outros módulos.
- **Passo 5:** três espaços reservados e ilustrados nas ruas: `bloom-garden` (horta da Vila das Flores), `photo-studio` (estúdio do Jardim das Nuvens) e `idol-battle` (arena central). Exibem “Em breve”, sem abrir jogos, criar saves ou conceder recompensas. Integração real desses jogos permanece para fase futura.
- **Passo 6:** testes JS completos `for f in tests/*.js; do node "$f"; done` e QA interativo em Chromium, usando `tools/mapa/teste-browser.cjs`: desktop 1280×800, celular 320×640, celular 390×844 em tema escuro, rolagem, clique em card original, Esc, botão Voltar e histórico. Tudo validado na execução GitHub Actions #43467172453. **Não houve teste em iPhone físico nem login OAuth real.**
- **Prévia Vercel:** `https://tsulipa-world-git-visual-layout-hud-tsu-li-pa.vercel.app/` (alias da PR #88), build verificado READY no commit `63a8b443`. Projeto existente `tsulipa-world`, sem alterar produção. A prévia tem Vercel Authentication/SSO ativo: acesso exige conta autorizada na Vercel. **Login Google/Supabase real não foi comprovado.** Se desejar autenticar na prévia, conferir allow list no Supabase Auth > URL Configuration e origem autorizada do Google Cloud para esse domínio, sem mudar Site URL de produção. Não aplicar alterações de configuração sem autorização.
- **Regras mantidas:** sem tocar em Supabase ou `main`, sem duplicar lógica dos cards, sem mexer nas chaves `brs48cr_*`. Dois nomes de bairros continuam provisórios.

## Mapa Vivo⭐ — refinamento (13/11/2026, noite)
- Textos das artes desenhados no canvas com a fonte do jogo e traduzidos (`tools/mapa/textos.py` → `mapa-textos.js`); antes saíam serifados.
- Rótulos e botões do mapa nos seis idiomas; a dica "Arraste para passear" fica abaixo da arte.
- Ruas: Idols visitam as portas em ritmos diferentes, com balãozinho (♪ ❤ ★); o pet segue e senta ao lado; passeantes abaixo das placas.
- Detalhes discretos: pétalas, floquinhos, notinhas, corações, vapor do Café, brilhos; no mundo, gotinhas na fonte e nuvens. Tudo desliga com "reduzir movimento".
- À noite as placas ficam acesas como letreiros.
- Atalho destaca o bairro; entrar na rua aproxima a câmera até ele.
- Missões do dia (as da Agenda do Idol) aparecem no mapa: 🎯 no bairro e balão com progresso sobre o prédio (ex.: 🏃 1/2 no Center⭐Run!). Sem mudança no banco.
- **Não testado:** iPhone físico e conta real.

## Star⭐Gacha! — pó de estrela e garantia (APLICADO em produção em 13/11, com o OK do dono)
- SQL auditado e testado em PostgreSQL isolado (38 verificações): `supabase/sql/aplicado/20261113_gacha_po_garantia.sql`. Detalhes em `docs/GACHA_REPETIDOS_GARANTIA_PROPOSTA.md`.
- Interface no Álbum (`gacha-po.js`, PR #88): aparece sozinha agora que a função existe no banco. Conferido com dados reais (só leitura): status responde ok. Converter/resgatar com conta real ainda não testados.

## Aplicado em 13/11 (noite), com o OK do dono
- `20261113_gacha_po_garantia`: pó de estrela (1 repetido = 1 pó, 5 pós = 1 card) e garantia após 7 "nada".
- `20261113_duo_pedido_premio`: ★5/dia pelo Pedido de cena do Moon⭐Duo! (confere o duo da cena em `duo_log`).
- `20261113_bloom_garden`: Bloom⭐Garden! v1 — 4 canteiros, sementes ★20–60, 1 rega/dia, flores na conta; nunca dá ★.
- Arquivos em `supabase/sql/aplicado/`; testes isolados em `supabase/tests/{gacha-po,duo-pedido,bloom}/rodar.sh`.
- Front no PR #88: `gacha-po.js`, `duo-pedido.js`, `bloom.js` (horta da Vila das Flores no mapa), `cafe-gorjeta.js` (só visual).

## Café VIP — APLICADO (13/11, noite, OK do dono)
- `supabase/sql/aplicado/20261113_cafe_vip.sql`: cliente VIP do Café (6ª e 11ª clientes valem o dobro). Insere uma linha em `cafe_run_etapa` e `cafe_run_etapa2` (lidas na hora de aplicar; falha se o marcador mudar). Testado isolado em `supabase/tests/cafe-vip/`. O front (`cafe-vip.js`) já está no PR #88 Conferido em produção: as duas funções têm a linha VIP e mantêm os grants.

## Handshake: fãs com dois detalhes — APLICADO (13/11, noite, OK do dono)
- SQL: `supabase/sql/aplicado/20261113_handshake_cor.sql` (testado isolado em `supabase/tests/handshake-cor/`). Compatível com a versão antiga: sem `cor` na resposta, pontuação igual a hoje.
- Front (`handshake.js?v=11`): cor do lightstick da 3ª rodada em diante, pergunta da cor depois do presente certo, +50; jeito muda o tempo da apresentação.
- Servidor: `handshake_iniciar` passa a sortear também a cor do lightstick (0–5) para os fãs a partir da rodada 3; `handshake_run_finish` aceita `cor` na resposta e soma +50 quando presente E cor estão certos.
- Cliente (`handshake.js`): depois do presente, escolher a cor (6 botões). O jeito do fã passa a valer: tímido mostra o texto por menos tempo, animado repete.
- Mexe no coração do jogo e em 2 funções em uso: fazer com teste isolado e OK do dono.

## Flores com uso + Caderno na conta — APLICADO (13/11, noite, OK do dono)
- `20261113_flores_e_caderno`: `jardim_usar_flor` (gasta 1 flor para levar à mesa do Handshake; o front dá +Hype: Sakura 10, Tulipa 15, Girassol 20, Flor-lunar 30) e `cafe_caderno` (só leitura das receitas comprovadas).
- Front: `flores.js` (PR #88). Testes: `supabase/tests/flores/rodar.sh`, `tests/flores.test.js`.

## Fase 4 — estado em 14/11/2026
- Bloom⭐Garden! v1 ✅ (aplicado), flores com uso ✅ (aplicado).
- Photo⭐Studio! v1 ✅ e v2 Mural + Capa no Idol⭐News! ✅ (aplicados) — `docs/PHOTO_STUDIO_PROPOSTA.md`.
- Idol⭐Battle! v1 ✅ **APLICADO em produção em 14/11/2026, com o OK do dono** (`supabase/sql/aplicado/20261114_idol_battle_v1.sql`): rival do dia, 5 tentativas, ★5 na 1ª vitória; ordem do rival e sorte por `random()` no servidor. Front (`battle.js`, Star Arena) na PR #88 passa a usar o servidor sozinho para quem está logado. Conferido em produção só por leitura: grants, RLS, 0 partidas. **Não testado: conta real, ★5 real, iPhone.**
- Padrão de trabalho que o dono aprovou: SQL em `supabase/sql/proposta/` + teste em PostgreSQL isolado (`supabase/tests/<nome>/rodar.sh`, com cópia INTEIRA de qualquer função de produção alterada) + front num arquivo próprio no PR #88; aplicar no banco só com a frase de OK do dono; depois mover para `aplicado/`.

## Mapa Vivo⭐ — acabamento de textos e CSS na PR #88
- Placas do mapa renderizadas em Mochiy Pop One, com largura máxima para traduções maiores e brilho/sombra discreta.
- Letreiro do Sora⭐Jump! reposicionado dentro da rua do Jardim das Nuvens pelo gerador de textos.
- Botões, chips de bairro, foco, contraste noturno e bordas refinados para acompanhar o CSS do Hub; reduzido movimento continua respeitado.
- Bloom, Photo Studio (inclusive treino sem conta) e Idol Battle (treino até aplicação de SQL) usam entradas no próprio mapa.
- CI do mapa #43540804733 aprovou JS, geração de SVGs, capturas e QA Chromium de desktop, celular e tema escuro. Testes físicos em iPhone ainda não realizados.

## Próximo passo (antes do merge)
1. Battle aplicado em 14/11: falta testar com conta real (partida oficial, limite de 5 e ★5).
2. Conferir o mapa e os jogos no iPhone físico, login e pequenos fluxos integrados.
3. Teste da página inicial (`tests/i18n-visual.browser.cjs`) refeito em 14/11 (escolha delegada pelo dono): em vez de exigir texto/layout idênticos à referência `e95e777`, reprova idioma errado, erro de JS novo, rolagem lateral nova, bloco principal mudando de aberto/fechado e tradução que voltou ao português; texto novo igual ao português vira aviso; o resto vai para `report.json`. **Atenção:** mudança de posição ou de texto não reprova mais sozinha — olhar o relatório/capturas do CI.
4. Atualizar a prévia da PR #88 e só então propor merge; os nomes provisórios Rua das Vitrines e Vila das Flores aguardam confirmação.


## Vida de Idol⭐ — Cidade que Reage (primeira sequência, PR #88)
- Implementadas cinco melhorias leves de continuidade: reações do Hub apenas após atividades confirmadas, lembranças da sessão no Camarim, atalhos em objetos já existentes, presença visual discreta por horário e três capítulos opcionais do Diário.
- Novos arquivos `vida-cidade.js`, `vida-cidade.css`, `tests/vida-cidade.test.js` e documentação `docs/VIDA_IDOL_CIDADE_REAGE_PR88.md`.
- Sem novas RPCs, SQL, saves, recompensas, alterações nos itens originais ou cópias de fotos. Memórias limitadas à sessão e isoladas por conta.
- Ainda não foram criados NPCs novos caminhando nas ruas nem uma narrativa persistente. Próxima fase depende de QA visual real no iPhone e decisão artística.

## Idol⭐Battle! — show no palco (14/11/2026, só front, PR #88)
- `battle.js?v=3` / `battle.css?v=2`: as 3 rodadas agora são encenadas num palco em canvas (holofotes, plateia com lightsticks, placar subindo, ★ WIN ★), com botão **Pular** e sem animação quando "reduzir movimento" está ligado. O show só encena o resultado que já veio do servidor; o cliente não sorteia nada.
- Rivais e a sua unit aparecem com o visual real do Idol (mesmo `drawChar` do jogo, dados da vitrine); quem não está na vitrine vira um medalhão com a inicial. Atributos 🎤💃💖 visíveis nos rivais e nos seus cards; `×N` marca cards repetidos.
- Escalação: sugestão inicial com a melhor soma; escolher um Idol já usado em outra rodada troca os dois de lugar.
- Aviso de ★5 do dia (em aberto / já conquistada), polaroid nova com a unit no palco e o placar.
- Treino sem conta ficou vencível: a ordem escolhida decide (antes era impossível ganhar).
- **Correção no mapa (`tw-mapa.js?v=39`)**: os Idols da vitrine não passeavam nas ruas porque o código lia `p.av`, mas a vitrine entrega `p.avatar`. Agora aceita os dois.
- Conferido em Chromium local (390×844, 320×640 escuro, 1280×800 com movimento reduzido) com o `index.html` inteiro e com resposta de servidor simulada; 87 testes JS OK. **Não testado: conta real, iPhone físico, Safari.**

## Idol⭐Battle! — Top da Arena — APLICADO (14/11/2026, OK do dono)
- `supabase/sql/aplicado/20261114_idol_battle_ranking.sql`: `battle_ranking()` só de leitura (vitórias da semana desde domingo, Brasília; top 10 + a sua posição; desempate por menos partidas; contas bloqueadas fora; sem ids) e índice em `private.battle_partidas(dia)`.
- Teste isolado: `supabase/tests/battle/checks_ranking.sql` (dentro do `rodar.sh` do Battle).
- Front no PR #88: seção "Top da Arena" na janela do Battle (`battle.js`) e 4º pódio no Idol⭐News! (`jornal.js?v=14`).
- Conferido em produção por leitura: anon sem acesso, authenticated executa, semana começando no domingo, ranking vazio (0 partidas). **Não testado: conta real, iPhone.**

## Idol⭐Battle! v2 — Arena dos Idols — APLICADO (14/11/2026, OK do dono)
- `supabase/sql/aplicado/20261114_idol_battle_v2_arena.sql`: cada pessoa deixa UMA unit salva; os outros desafiam sem ninguém estar online. **Sem ★** (não toca em `stars`/`star_log`), não gasta cards, não altera funções anteriores.
  - `battle_unit_salvar(p_unit)`, `battle_arena()`, `battle_desafiar(p_alvo, p_unit, p_requisicao)`; tabelas `private.battle_units` (contador `fas`) e `private.battle_desafios`; helper privado `battle_unit_resolver`.
  - Regras: 3 desafios/dia, 1 por pessoa/dia, idempotência por UUID, empate é da defesa, +1 fã ❤️ para a defesa que vence. A lista mostra os 3 Idols em ordem alfabética (ordem da defesa secreta) e nunca ids. Unit cuja dona perdeu um card fica indisponível até salvar de novo. Contas bloqueadas ficam fora.
- Teste isolado: `supabase/tests/battle/checks_arena.sql` (no mesmo `rodar.sh`).
- Conferido em produção por leitura: corpo das 4 funções idêntico ao testado (md5), anon sem acesso, authenticated só nas 3 RPCs públicas, RLS ligada sem políticas, 0 linhas.
- Front no PR #88 (`battle.js?v=7`, `battle.css?v=5`): aba "Arena dos Idols" (montar e salvar a unit ali mesmo, lista de defesas, desafiar, show e polaroid), aviso de fã da defesa, narração das rodadas para leitor de tela, data da polaroid no formato do idioma, contraste dos textos corrigido no tema escuro.
- Conferido em Chromium (claro e escuro) com servidor simulado. **Não testado: conta real, iPhone.**

## Bloom⭐Garden! — refinamento (14/11/2026, só front, PR #88)
- `bloom.js?v=3` (+ estilos em `hub-polish.css?v=33`), sem SQL novo e usando só as 4 RPCs de sempre.
- Tocar num canteiro do desenho faz a ação certa: vazio abre as sementes em botões grandes (com ★ e dias; sem ★ suficiente fica apagado), crescendo rega, florido colhe.
- "Regar tudo" e "Colher tudo" quando há 2 ou mais canteiros na mesma situação (uma chamada por canteiro, conferida no servidor).
- Balão em cada canteiro (＋, 💧, 🌼) e progresso n/m maior; o céu acompanha a hora de Brasília (dia, entardecer, noite com lua e estrelas; flor-lunar brilha à noite).
- O seu Idol e o pet ativo aparecem no jardim e vão até o canteiro cuidado.
- Conferido em Chromium (390×844) com servidor simulado. **Não testado: conta real, iPhone.**

## Idol⭐Battle! v3 — Torcida de flores — APLICADO (14/11/2026, OK do dono)
- `supabase/sql/aplicado/20261114_idol_battle_v3_torcida.sql`. Liga o Bloom⭐Garden! ao Battle: 1 flor por dia, gasta, dá +1 à sua unit nas partidas daquele dia (rival do dia e arena). 🌸 Canto, 🌷 Dança, 🌻 Carisma, ⭐ flor-lunar nas três. Teto de 11 por rodada e regra de empate mantidos. Não dá ★.
- **Atenção:** substitui `battle_jogar` (a função do prêmio ★5) e `battle_desafiar` por cópias inteiras das versões aplicadas com as linhas da torcida. `tests/idol-battle.test.js` confere que nenhuma outra linha mudou. Funções novas: `battle_torcida()`, `battle_torcida_levar(p_flor)`; tabela `private.battle_torcida`.
- Teste isolado: `supabase/tests/battle/checks_torcida.sql`; o `rodar.sh` agora também refaz TODAS as verificações antigas num banco novo já com as funções substituídas (regressão).
- Front no PR #88 (`battle.js?v=8`, `battle.css?v=6`): seção "Torcida de flores" na escalação, 🌸+1 no palco e no resultado. Só aparece quando `battle_torcida()` responde.
- Antes de aplicar, `battle_jogar`/`battle_desafiar` de produção tinham o md5 das versões aplicadas; depois, as 5 funções têm o md5 do que foi testado; anon sem acesso, RLS ligada, 0 linhas.
- Conferido em Chromium com servidor simulado. **Não testado: conta real, iPhone.**

## Bloom⭐Garden! redesenhado + jogos novos no Hub (14/11/2026, só front, PR #88)
- **Jardim (`bloom.js?v=4`, `hub-polish.css?v=34`)**: cena refeita à mão no canvas — cada flor tem o seu desenho (sakura com pétalas entalhadas, tulipa em taça, girassol com coroa e miolo, flor-lunar em estrela) e fases (semente, broto, botão, flor); caixotes de madeira, colinas, cerquinha, sol/lua pela hora de Brasília, gotas na rega e pétalas na colheita. Sem emoji como ícone: gota, broto e flor são desenhados. Canteiros em cartões 2×2 com miniatura da planta e bolinhas de progresso; sementes e "Suas flores" com a flor desenhada. Mesmas 4 RPCs.
- **Hub (`hub-novos.js?v=1`, teste `tests/hub-novos.test.js`)**: Bloom⭐Garden!, Photo⭐Studio! e Idol⭐Battle! ganham cards na lista de Jogos, no molde dos outros (embrulha `hubCardsUI`, não edita `hub.js`). O card do jardim avisa quando há rega ou colheita. Sem conta, os três seguem a regra atual do Hub (cadeado → login); o treino sem conta do Studio e do Battle continua pelo mapa.
- Conferido em Chromium (390×844 e 1280×900) com servidor simulado. **Não testado: conta real, iPhone, Safari.**

## Refinamento visual — segunda passada (14/11/2026, só front, PR #88)
- **Jardim (`bloom.js?v=5`)**: plaquinha do jardim, regador, borboletas de dia e vaga-lumes à noite (parados com "reduzir movimento").
- **Photo⭐Studio! (`studio.js`, `hub-polish.css?v=35`)**: sem emoji no título, nas abas, na pauta e nos botões; cenário, luz e flores ganham uma amostra de cor desenhada; opções em grade alinhada (2 ou 3 colunas); moldura da foto igual à do jardim. Nenhuma regra ou RPC mudou.
- **Idol⭐Battle! (`battle.js?v=9`, `battle.css?v=7`)**: sem emoji como ícone — microfone, sapatilha, coração e troféu são desenhados e usados tanto no HTML (SVG) quanto no palco e na polaroid (Path2D); flores da torcida viram bolinhas de cor; pódio do ranking com medalhas numeradas; títulos de seção só com texto. Nenhuma regra ou RPC mudou.
- Conferido em Chromium (390×844). **Não testado: conta real, iPhone, Safari.**

