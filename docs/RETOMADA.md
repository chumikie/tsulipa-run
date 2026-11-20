# Retomada — TsuLiPa⭐World (estado de hoje)

**Atualizado em 20/11/2026.** Este é o único documento de estado. Ele diz como o projeto está **agora**; o relato de cada rodada fica no diário ([`historico/diario/2026-11.md`](historico/diario/2026-11.md)).

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
- **`main`:** `9824e3e` (19/11), publicada na Vercel. Últimos merges: #119 (Início compacto), #118 (estreia no TsuPhone, atividades e pilotos da Rua Fofa), #112 (Encontro do dia sob demanda e esta RETOMADA), #113–#114 (Camarim por conta, foto do Camarim guardada, flores do Bloom no Studio), #115 (Café legível no celular), #116 (piso da sala do Karaoke), #110 (leveza, Karaoke dividido, Duo/admin/bairro sob demanda), #111 (prévia de link).
- **Outras PRs abertas:** #117 (desfecho e timing), #120 (Rua Fofa e lembranças), #121 (jogabilidade) e #122 (reencontros, pista e fotos).
- **CI (8 jobs):** `static-validation`, `postgres-center-run`, `browser-karaoke`, `browser-telas`, `webkit-continuidade`, `browser-karaoke-room` ×3.

## O site hoje
**Ideia:** um mundo de Idols do TsuLiPa (BRS48). Você monta o seu Idol, joga, ganha estrelas, cuida do pet, decora o camarim, passeia pela cidade e convive com outros jogadores por recados, corações, frases prontas e fotos, sem chat livre.

**Como se entra:** o **visual novo** (o celular do Idol, "*Nick*Phone"; sem conta, "TsuPhone") abre sozinho no celular, tablet e computador desde 17/11. O clássico continua em Ajustes ou `?celular=0`.
- Abertura com o trio Tsu·Li·Pa.
- **Início.** Palco do trio, "Hoje" (desejo do dia, missões, aniversários, Encontro do dia, bagunça da semana) e portas (Jogos, Missões, Mapa, Idol⭐News!, Camarim, Calendário). A #118 permite fixar até dois atalhos neste navegador. Nesta revisão, o palco vem primeiro, a estreia cabe em uma linha compacta, e os atalhos fixados ficam junto das portas. A edição fica em Ajustes.
- **Menu:** atalhos para o resto. No PC a coluna cresce até 1360 px. Na #118, a busca reúne Idols e atividades, e Ajustes ganha volume e som geral. Café, Studio e Festival aceitam links diretos com prévias próprias.
- **Calendário.** A #118 abre o capítulo disponível na data selecionada. O prazo do Festival aparece no fuso do aparelho e pode ser baixado em .ics.
- **Pilotos na #118.** Duas histórias da Rua Fofa em datas de Brasília, um atendimento de Café opcional e ensaio de 20 segundos no Karaoke. A Rosa reconhece a contribuição da semana anterior no Mapa e no painel da Rua Fofa. Os pilotos abrem por links de teste. [Roteiro e coleta local](qa/pilotos-estreia-bairro-karaoke.md).
- **Série de fotos na #118.** O Álbum reúne fotos guardadas explicitamente no Studio, Duo e Camarim VIP. A série fica neste navegador por conta. Uma cópia JSON permite restaurar fotos e composições em outro aparelho.

### Jogos
| Jogo | O que é | Prêmio | Estado | Próximo passo |
|---|---|---|---|---|
| Center⭐Run! | Corrida com cartas, power-ups, Fever e Temporada 2 | ★100/dia, ranking semanal | O mais redondo; trio de perfil, pulo perdoador e metas (#106). O resultado identifica a colisão. O treino de cabo e caixa inclui uma repetição na velocidade da corrida | — |
| Karaoke⭐Time! | Sala solo com plateia de NPCs e show de ritmo | 5 shows/dia, ranking e música da semana | Dividido em 4 arquivos e mais leve no celular (#110); piso corrigido (#116); "Ajustar timing" na sala | Medir em celular real |
| Sora⭐Jump! | Pulo de nuvem em nuvem | ★25 aos 500 m, com confirmação do servidor (#105) | A bifurcação guarda marcas por rota e o resultado mostra um pouso perdido quando há dados para orientar a próxima subida | — |
| Happy⭐Cafe! | Montar bebidas; "Dois no balcão" | ★10/dia (1ª partida 600+), Caderno na conta | Comanda e missões legíveis no celular (#115). A #118 traz aviso de urgência, feedback da entrega, treino do último erro e saudação antes dos pedidos. O turno de treino oferece três comandas da categoria que mais gerou erros | Ideia antiga (Raio-X): ingredientes vindos do Bloom |
| Handshake⭐Event! | Memória com fila de fãs | ★10/dia, hora extra | Fãs com dois detalhes e "jeito" valendo, reencontro com presente novo e revisão das pistas | — |
| Star⭐Gacha! | 1 giro por dia, cards de Idols | Pó de estrela e garantia | Álbum com coleções; o card do giro pode ser comparado no Battle antes de confirmar sua entrada no trio | — |
| Idol⭐Battle! | Cards de Idols em show, torcida de flores | Ranking semanal | Habilidades, lightsticks no ritmo | Prêmio dos lightsticks (SQL proposto, não aplicado) |
| Bloom⭐Garden! | Jardim, flores com uso no Battle e no Studio | — | Flores desenhadas usadas no Studio, inclusive arranjos de 2 ou 3 espécies | — |
| Photo⭐Studio! | Fotos com pose, cenário e tema da semana | ★3/semana no tema | Composição favorita e foto do Álbum como referência. Comparação antes/depois baixável como PNG | — |
| Moon⭐Duo! | Foto em dupla com outro Idol; Pedido de cena do dia | — | Jogo baixa só ao abrir (#110) | — |
| Backstage⭐Pet! | Pet, quarto, minijogos, Camarim | ★50/dia nos minijogos | Camarim por conta, porta-retrato e cenas do pet no sofá e junto à mesa, salváveis no Álbum | — |
| Zipper⭐Shop! | Loja, Look do dia, Montar Idol (charmaker) | — | Estável | — |

### Sistemas do mundo
| Sistema | Estado | Próximo passo |
|---|---|---|
| Mapa (2 níveis) | Ruas vivas: visitas surpresa do trio, bichinhos, Idols online com frases prontas, salas por dentro | — |
| Vida no bairro (Urbz) | Bagunça da semana (domingo 0h), primeiros dias guiados, falas do trio no Chat; **bicos escondidos** desde a #109 | Capítulo de domingo no Idol⭐News! fechando a bagunça; decidir quando liberar os bicos |
| Humor, Desejo do dia, Camarim VIP | Locais, por conta (#113) | — |
| Meu Camarim | Decoração, tour de camarins, coração por dia, porta-retrato | — |
| Encontro do dia | Um Idol (dupla na terça, trio na sexta) dançando com recado; a cena baixa só ao abrir (#112) | — |
| Idol⭐News! | Pódios, capítulos (um por terça); Temporada 1 trancada | Revisão das traduções e OK da Temporada 1 |
| Calendário, Fichinhas, Álbum | Só leitura | Dia do aniversário da Lirika (ficha diz só "maio") |
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
| `mapa-textos.js` | `tw-mapa.js` | Logo depois da abertura |
| `tw-bairro.js` | `tw-bairro-tela.js` | Ao abrir o painel, ou no Mapa nos dias guiados |
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
**Do dono**
- Conferir no celular, depois da #110: Início, show no Karaoke com foto no meio, abrir o Moon⭐Duo!, "Vida no bairro" e aba de moderação na conta admin.
- Ok do Pati para o visual novo.
- Dia do aniversário da Lirika.
- Quando liberar os bicos.
- Revisão e OK da Temporada 1.
- Imagem de "Social preview" do GitHub (Settings).
- Apagar branches antigas (o proxy daqui não deixa).
- Atualizar as instruções do Projeto no claude.ai: ainda falam da PR #58.

**Banco (ChatGPT, com autorização)**
- Prêmio dos lightsticks do Battle (`supabase/sql/proposta/20261115_battle_lightsticks_premio.sql`).
- Roupa como prêmio do nível 3 do bairro.

**Código**
- Validar a #117, incluindo a versão de cache do Jornal. O piloto do bairro e a matriz física do Karaoke estão em [docs/qa](qa/pilotos-estreia-bairro-karaoke.md).
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
