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
- **Mapa da cidade** (`tw-mapa.js` + `mapa-cidade.svg`):
  - é um botão "Passear pela cidade" no fim do Meu mundo, que abre e fecha;
  - `TW_LUGARES` é o registro de lugares, e cada prédio aciona o card original do hub;
  - o trio fica na praça, desenhado com `drawChar` e `perfCharContorno`;
  - o seu Idol e os Idols da vitrine passeiam pelas ruas;
  - a cidade muda com a hora de Brasília: dia, entardecer (17h) e noite (19h–6h);
  - a arte é gerada por um script Python que não está no repositório. Para mudar a arte, edite o SVG ou peça para recriar o gerador.
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
   - Distrito do Palco: Handshake, Center, Karaoke.
   - Rua Harajuku: Café, Gacha, Shop.
   - Bairro Fofo: Pet, Minha casa, horta "em breve" (Bloom⭐Garden!).
   - Praça Central: fonte (Encontro do dia), Idol⭐News!, Pedido de fã.
   - Arena: "?" (Idol⭐Battle!).
   - Céu (única coisa no alto): Sora, Moon⭐Duo!, "?" (Photo⭐Studio!).
2. **Cena da rua de cada bairro** (modelo: `tools/mapa/rua.py`, prova em `docs/mapa-provas/rua_harajuku.jpg`): tocar no bairro abre a rua dele, com os prédios grandes lado a lado (escala ~2), calçada, chão de pedrinha onde os Idols passeiam e botão "◀ Mapa". No celular a rua rola para os lados.

**Ordem de implementação (nada disso está no código ainda):**
1. Gerar `mapa-mundo.svg` (mundo2.py + sep.py) e as 6 ruas (copiar rua.py para cada bairro).
2. Em `tw-mapa.js`: estado `cena = 'mundo' | <bairro>`; caixas de clique por bairro no mundo; na rua, caixas por prédio usando o mesmo `TW_LUGARES` (clique chama o `click()` do card original).
3. Levar para a rua: passeantes (seu Idol + Idols da vitrine + pets), hora do dia (`horaBR`, `ceu`), alertas (!) e cadeados. No mundo ficam só alerta somado por bairro e o trio no palco.
4. Botão "◀ Mapa", tecla Esc e `history` (voltar do celular volta ao mundo).
5. Jogos novos entram ocupando o "?" do bairro.
6. Testar desktop + celular (rolagem, cliques, tema escuro) e os testes `for f in tests/*.js; do node $f; done`.

## Próximo passo
Implementar o mapa em 2 níveis (seção acima), no mesmo PR #88 (branch `visual/layout-hud`). Depois:
Fase 3, começando pelo Gacha: álbum com coleções, repetidos virando pó de estrela e garantia de prêmio. Isso mexe no banco (precisa do OK do dono antes de aplicar o SQL).
