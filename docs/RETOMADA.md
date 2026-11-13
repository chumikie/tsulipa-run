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

## Próximo passo
Na PR #88 falta o QA em iPhone físico e a confirmação visual/autorização para merge; os dois nomes provisórios (Rua das Vitrines e Vila das Flores) ainda aguardam decisão. Depois:
Fase 3, começando pelo Gacha: álbum com coleções, repetidos virando pó de estrela e garantia de prêmio. Isso mexe no banco (precisa do OK do dono antes de aplicar o SQL).
