# Retomada — TsuLiPa⭐World (estado de hoje)

**Atualizado em 23/11/2026.** Este é o único documento de estado. Ele diz como o projeto está **agora**; o relato de cada rodada fica no diário ([`historico/diario/2026-11.md`](historico/diario/2026-11.md)).

## Como atualizar (no mesmo envio de cada PR)
1. **Onde está:** `main`, PRs abertas e o que foi publicado.
2. **Jogos e sistemas:** mude só a linha do que a PR tocou (estado e próximo passo).
3. **Pendências:** risque o que fechou e acrescente o que apareceu.
4. **Diário:** o relato da rodada (o que mudou, números, testes, o que não foi testado) vai no topo de `historico/diario/AAAA-MM.md`. Não aqui.
5. Se algo deste arquivo ficou falso, corrija aqui. Arquivo de outro lugar que diga "estado atual" está errado: aponte para cá.

## Regras do projeto (dono, 17/11/2026)
- Repositório `chumikie/tsulipa-run`; produção na `main` (Vercel). **Uma PR por rodada**, criada a partir da `main` atualizada. Merge só pelo dono ou a pedido explícito dele.
- Antes de começar, conferir PRs abertas de outra sessão e não mexer nelas.
- Desenhos 2D originais (nada de 3D, nada de personagem com direitos autorais); Karaoke é solo; não tirar função para ganhar leveza.
- Tetos de estrela: **★100/dia no Center⭐Run!** e **★50/dia nos minijogos do Pet**, independentes.
- Banco (Supabase) só com o ChatGPT e com autorização do dono. SQL aplicado fica em `supabase/sql/aplicado/`; proposta em `supabase/sql/proposta/`.
- HTML/CSS/JS puro, canvas 2D; nunca renomear chaves `brs48cr_*`; horário de Brasília; roupas unissex; nada de dado falso em produção.
- Testes rápidos aqui (`node tests/run-all.js`); os de navegador ficam para o CI, salvo o que a mudança tocou.

## Onde está
- **`main`:** `789a8a1` (23/11, merge da #133). Antes: #132 (retomada, prévia de link, Humor compacto), #131 (Idol de lado e looks do Center⭐Run!), #130 (conferência visual, poda do Menu, 22/11), #129 (melhorias, 21/11), #127–#128, #126, #124 e #123 (20/11). As #118–#123 entraram pela #124.
- **#132 (merge 23/11):** prévia de link nova (`og.jpg?v=16`), Humor compacto no Menu, cartão "Seu perfil" do Início sem repetir o avatar e esta RETOMADA em dia. [Conferência](qa/menu-og-20261123/)
- **Câmeras (23/11, tarde):** Camarim VIP, Moon⭐Duo! e Photo⭐Studio! abrem a câmera no jeito do Center⭐Run! (`tw-camera.js`): nítida, com moldura, enquadramento e, no VIP, pose e expressão. [Capturas](qa/cameras-20261123/)
- **PRs abertas:** #117 (rascunho: Bagunça no Idol⭐News! + Karaoke; conflita com a main). #132 e #133 entraram em 23/11.
- **#133 (merge 23/11):** Seu ritmo (na pasta "Mais"), aproximação e Desfazer no editor, procedência das peças, ações da Praça e metadados do porta-retrato. [Escopo](qa/evolucao-expressao-convivencia-2026-11-20.md)
- **CI (8 jobs):** `static-validation`, `postgres-center-run`, `browser-karaoke`, `browser-telas`, `webkit-continuidade`, `browser-karaoke-room` ×3.

## O site hoje
**Ideia:** um mundo de Idols do TsuLiPa (BRS48). Você monta o seu Idol, joga, ganha estrelas, cuida do pet, decora o camarim, passeia pela cidade e convive com outros jogadores por recados, corações, frases prontas e fotos, sem chat livre.

**Como se entra:** o **visual novo** (o celular do Idol, "*Nick*Phone"; sem conta, "TsuPhone") abre sozinho no celular, tablet e computador desde 17/11. O clássico continua em Ajustes ou `?celular=0`.
- Abertura com o trio Tsu·Li·Pa.
- **Início.** Palco do trio, "Hoje" (desejo do dia, missões, aniversários, Encontro do dia, bagunça da semana) e portas (Jogos, Missões, Mapa, Idol⭐News!, Camarim, Calendário). A #118 permite fixar até dois atalhos neste navegador. Nesta revisão, o palco vem primeiro, a estreia cabe em uma linha compacta, e os atalhos fixados ficam junto das portas. A edição fica em Ajustes.
- **Esta semana** reúne o show de sábado, a festa do mapa, o jogo da semana e a retrospectiva. Na #130 (poda de 22/11) saiu do Início e mora no Calendário, em todas as larguras. O Perfil ganha vitrine de favoritos e o Menu oferece recados ao trio. A opção de e-mail fica oculta até validar o envio e o cancelamento. As propostas de banco da rodada devem ser conferidas na publicação. [Economia e publicação](ECONOMIA_ESTRELAS.md)
- **Menu:** na #130 (poda de 22/11) ficam o seu Idol e o Ranking, o Humor, os Idols online e 8 atalhos: Zipper Shop, Encontro do dia, Passatempos, Álbum, Procurar Idol, Fichinhas, Vida no bairro e a pasta "Mais" (Novidades, Tour, Concurso, Convidar, Show de sábado, Recado). A retrospectiva do mês fica no "Esta semana" do Calendário. Os banners de jogos saíram; o Star⭐Gacha! entrou na lista de Jogos. Cada atalho tem ícone próprio e nome em até 2 linhas. No PC a coluna cresce até 1360 px. Na #118, a busca reúne Idols e atividades, e Ajustes ganha volume e som geral. Café, Studio e Festival aceitam links diretos com prévias próprias.
- **Calendário.** A #118 abre o capítulo disponível na data selecionada. O prazo do Festival aparece no fuso do aparelho e pode ser baixado em .ics.
- **Pilotos na #118.** Duas histórias da Rua Fofa em datas de Brasília, um atendimento de Café opcional e ensaio de 20 segundos no Karaoke. A Rosa reconhece a contribuição da semana anterior no Mapa e no painel da Rua Fofa. Os pilotos abrem por links de teste. [Roteiro e coleta local](qa/pilotos-estreia-bairro-karaoke.md).
- **Série de fotos na #118.** O Álbum reúne fotos guardadas explicitamente no Studio, Duo e Camarim VIP. A série fica neste navegador por conta, com 24 lugares e escolha explícita ao substituir uma foto. A série exporta uma página com três fotos ou uma comparação de duas em PNG. Uma cópia JSON permite restaurar fotos, composições e cenas do Duo em outro aparelho. As novas fotos registram a edição do piloto quando contribuem para a vitrine.

### Jogos

A revisão de jogabilidade traz treino de cabo e caixa de som no Center⭐Run!, dois copos com ingredientes visíveis e um turno de treino com chegadas alternadas no Café, repetição de trecho a 75% ou 100% no Karaoke e uma bifurcação sinalizada a partir dos 75 m no Sora. O Sora guarda a melhor altura por caminho neste navegador e sugere a próxima meta. O Battle mostra os três atributos de cada card antes do show e o efeito da troca antes de confirmar no treino e na revanche.

| Jogo | O que é | Prêmio | Estado | Próximo passo |
|---|---|---|---|---|
| Center⭐Run! | Corrida com cartas, power-ups, Fever e Temporada 2 | ★100/dia, ranking semanal | O mais redondo; trio de perfil, pulo perdoador e metas (#106). O resultado identifica a colisão e propõe um ajuste de tempo. Há treino do obstáculo da última corrida e um desafio de quatro obstáculos alternando pulo e deslize | — |
| Karaoke⭐Time! | Sala solo com plateia de NPCs e show de ritmo | 5 shows/dia, ranking e música da semana | Dividido em 4 arquivos e mais leve no celular (#110); piso corrigido (#116); "Ajustar timing" na sala | Medir em celular real |
| Sora⭐Jump! | Pulo de nuvem em nuvem | ★25 aos 500 m, com confirmação do servidor (#105) | A bifurcação guarda marcas por rota e o resultado permite treinar o pouso perdido. Um pouso praticado orienta a próxima subida, e o prêmio dos 500 m mantém a confirmação associada à subida | — |
| Happy⭐Cafe! | Montar bebidas; "Dois no balcão" | ★10/dia (1ª partida 600+), Caderno na conta | Comanda e missões legíveis no celular (#115). A #118 traz aviso de urgência, feedback da entrega, treino do último erro e saudação antes dos pedidos. O turno de treino oferece três comandas da categoria que mais gerou erros. A próxima partida acompanha a categoria praticada | Ideia antiga (Raio-X): ingredientes vindos do Bloom |
| Handshake⭐Event! | Memória com fila de fãs | ★10/dia, hora extra | Fãs com dois detalhes e "jeito" valendo, reencontro com presente novo, revisão das pistas e treino no próprio ritmo com reapresentação de uma pista confundida em outra sessão | — |
| Star⭐Gacha! | 1 giro por dia, cards de Idols | Pó de estrela e garantia | Álbum com coleções; o card do giro pode ser comparado no Battle antes de confirmar sua entrada no trio | — |
| Idol⭐Battle! | Cards de Idols em show, torcida de flores | Ranking semanal | Habilidades, lightsticks no ritmo e comparação da ordem do trio após derrotas | Prêmio dos lightsticks (SQL proposto, não aplicado) |
| Bloom⭐Garden! | Jardim, flores com uso no Battle e no Studio | — | Flores desenhadas usadas no Studio, inclusive arranjos de 2 ou 3 espécies | — |
| Photo⭐Studio! | Fotos com pose, cenário e tema da semana | ★3/semana no tema | Obturador junto da prévia, composição favorita e foto do Álbum como referência. Comparação antes/depois baixável como PNG | — |
| Moon⭐Duo! | Foto em dupla com outro Idol; Pedido de cena do dia | — | O Pedido de cena mostra o que já combina e permite variar enquadramento e posições com a mesma dupla. Fotos novas da série permitem recriar a cena | — |
| Backstage⭐Pet! | Pet, quarto, minijogos, Camarim | ★50/dia nos minijogos | Camarim por conta, porta-retrato e cenas do pet no sofá e junto à mesa, salváveis no Álbum | — |
| Zipper⭐Shop! | Loja, Look do dia, Montar Idol (charmaker) | — | Provador compacto junto do catálogo, peças compradas e montagem com favoritos nomeados por conta, incluindo o item de mão e aviso de substituição antes da foto | — |

### Sistemas do mundo
| Sistema | Estado | Próximo passo |
|---|---|---|
| Mapa (2 níveis) | Ruas vivas: visitas surpresa do trio, bichinhos, Idols online com frases prontas, salas por dentro | — |
| Vida no bairro (Urbz) | Bagunça da semana (domingo 0h), primeiros dias guiados, falas do trio no Chat. **Bicos prontos e desligados** (`BICOS = false` em `tw-bairro.js`): a contagem anda por baixo e, sem eles, o gesto da rua se aprende jogando 2 vezes nela | Capítulo de domingo no Idol⭐News! fechando a bagunça; ligar os bicos é trocar uma linha, quando a dona quiser |
| Humor, Desejo do dia, Camarim VIP | Locais, por conta (#113) | — |
| Meu Camarim | Decoração, tour de camarins, coração por dia, porta-retrato | — |
| Encontro do dia | Um Idol (dupla na terça, trio na sexta) dançando com recado; a cena baixa só ao abrir (#112) | — |
| Idol⭐News! | Pódios e capítulos no domingo, por horário de Brasília. Temporada 1 trancada | Revisão das traduções e OK da Temporada 1 |
| Calendário, Fichinhas, Álbum | Calendário e fichas para consulta. Ler abre o capítulo exato. Álbum com filtros por origem e edição, fotos fixadas, exportação PNG e cópia JSON. A Lirika fica só com "maio" (decisão da dona, 23/11: sem dia) | — |
| Você / charmaker | Editor estilo Charat, favoritos, rosto à escolha | — |
| Admin | Moderação, telemetria, Montar Idol; ferramentas baixam só para admin (#110) | — |

## Arquivos sob demanda (leveza)
| Na abertura | Baixa depois | Quando |
|---|---|---|
| `centerrun.js` | `centerrun-corrida.js` | Ao sair do Hub para correr |
| `pet.js` | `pet-sala.js` | Ao abrir o pet ou o 📸 da corrida |
| `perfil.js` | `perfil-tela.js` | Ao abrir um Perfil |
| `jogos-base.js` | Handshake e Café | Ao abrir o jogo |
| — | `battle.js` e `battle.css` | Ao abrir o Battle |
| — | `studio.js` | Ao abrir o Studio ou montar a capa do jornal |
| `jornal.js` | `jornal-capitulos.js` | Ao abrir o jornal ou o Calendário |
| `mapa-textos.js` | `tw-mapa.js` | Ao abrir o Mapa |
| `tw-bairro.js` | `tw-bairro-tela.js` | Ao abrir o painel, ou no Mapa nos dias guiados |
| Início | `jornal.js`, cenas do telão | Ao abrir Jornal, Calendário ou a galeria do Jornal no Pet |
| `duo-base.js` | `duo.js`, `duo-tela.js`, `duo-pedido.js` | Ao abrir o Duo |
| `admin-base.js` | `admin.js` | Quando o Perfil confirma conta admin |
| `encontro-base.js` | `encontro.js` (#112) | Ao abrir o Encontro |
| `karaoke-time.html` | `karaoke-ranking.js`, `karaoke-biblioteca.js`, `karaoke-palco-desenho.js`, `karaoke-show.js` (carregam com a sala) | — |

**Regras dessas divisões:**
- O que o resto do site lê na abertura fica na base. Nunca duplicar: o `var` da parte zeraria o valor.
- A base tem substitutos (`duoAbrir`, `encMostrar`…) que pedem a parte e chamam a de verdade quando ela chega.
- Mudou uma parte? Suba o `?v=` dentro da base que a baixa.
- `tests/index-modules.test.js` confere que as partes só declaram e não repetem nada.
- `tests/site-source.js` lista os arquivos na ordem original, para os testes que recortam código por posição.

## Pendências
- Publicação do Camarim em duas etapas, com aceite das funções novas, referência de rollback e corte final do crédito legado. [Roteiro de publicação](qa/pilotos-estreia-bairro-karaoke.md#ordem-da-publicação-do-camarim)
**Da dona**
- Conferir no celular: Início, Menu (Humor compacto), Karaoke com foto no meio, Moon⭐Duo!, "Vida no bairro" e a moderação na conta admin.
- Se quiser, ligar os bicos (estão prontos, só escondidos).
- Revisão e OK da Temporada 1 do Idol⭐News!.
- Imagem de "Social preview" do GitHub: é a figura que aparece quando alguém compartilha o link do **repositório** (github.com/chumikie/tsulipa-run). Não muda o site. Dá para subir a `og.jpg` em Settings → General → Social preview.
- Apagar branches antigas.
- Atualizar as instruções do Projeto no claude.ai: ainda falam da PR #58.

**Banco (ChatGPT, com autorização)**
- ~~Roupas do Center⭐Run! no admin~~ (`20261122120000_roupas_center_run.sql`): aplicada em 22/11, conferida em 23/11.
- Prêmio dos lightsticks do Battle (`supabase/sql/proposta/20261115_battle_lightsticks_premio.sql`).
- Roupa como prêmio do nível 3 do bairro.

**Código**
- PR #135, Clean UI (28/11): pendentes a carga no iPhone 3× (Pet e Gacha), o Perfil com muitos cartões e a unificação de títulos (janelas centralizadas × abas à esquerda). Auditoria: `tools/auditoria-interface.cjs`.
- PR #135, Identity Restoration: desenho dos personagens voltou ao da main. Próximo passo é a **arte desenhada à mão** seguindo `docs/arte/MOLDE-AVATAR.md` (prévia com `?arte=<pacote>`); depois, folhas de pose, vista de lado e mecha bicolor no motor `tw-avatar-camadas.js`. iPhone físico pendente.
- Conferir com a conta real a pasta "Mais", o Gacha em Jogos e o Esta semana no Calendário (#130).
- `tests/atalhos-calendario.browser.cjs` falha também na main (espera os atalhos fixados `cafe` e `cal`, que a #130 tirou do Início). Fora do CI; atualizar ou aposentar o teste.
- A #117 continua separada e conflita com a main. Revisar desfecho, calibração e versões do Jornal em separado dos arquivos de áudio, cuja revisão ficou para depois.
- Testar a #124 com conta real e conferência no aparelho de login, vitrine, retrospectiva e recompensas semanais. [Pilotos e matriz física do Karaoke](qa/pilotos-estreia-bairro-karaoke.md).
- Medir em Android e PC reais: o teste aqui roda sem placa de vídeo.

**Nunca testado de verdade:** login real em todos os fluxos novos, iPhone/Android físicos, sons ouvidos.

## Armadilhas conhecidas
- Um robô regera os SVGs do mapa a cada push com um commit "[skip ci]": faça `git fetch` + `rebase` antes de enviar.
- Arquivo alterado sem trocar o `?v=` mistura versões no celular; o teste `cache-versoes` reprova.
- `hub-polish.css`: depois do marcador "Mapa Vivo⭐", nada de `display:none`, `transform:scale`, `touch-action`, `animation:` nem `transition:` (teste `mapa-mobile-leitura`).
- Ao mudar `tw-i18n.js`, rode `node tools/i18n/dividir.js`. Antes de criar uma chave, confira se ela já existe: chave repetida sobrescreve outra tradução.
- O `drawChar` existe em três cópias. Peças novas vão para os módulos `tw-avatar-*.js`.
- `karaoke-time.html` tem teto de 450 KB (hoje ~320 KB).

## Documentos
- **Vivos:**
  - este arquivo;
  - [`MAPA_DO_CODIGO.md`](MAPA_DO_CODIGO.md): pontos de entrada, módulos e carregamento;
  - [`../supabase/sql/README.md`](../supabase/sql/README.md): o que está aplicado no banco;
  - [`ECONOMIA_ESTRELAS.md`](ECONOMIA_ESTRELAS.md): retrato de 13/11.
- **Propostas e planos:**
  - `GACHA_REPETIDOS_GARANTIA_PROPOSTA.md`;
  - `IDOL_BATTLE_PROPOSTA.md`;
  - `PHOTO_STUDIO_PROPOSTA.md`;
  - `PROPOSTA_MUSICA_DA_SEMANA.md`;
  - `PLANO_SALA_KARAOKE.md`.
- **Referência com data** (pode estar defasada):
  - `REFATORACAO_INDEX.md` (02/11);
  - `RAIOX_JOGOS.md` (13/11; as notas são anteriores às melhorias de 13–18/11);
  - `qa/`.
- **Histórico:** [`historico/`](historico/), com o diário, `status/PR58_STATUS.md` (PR #58, 1º/11) e `status/STATUS_2026-10-31.md`. Serve para consulta, não para decidir.
