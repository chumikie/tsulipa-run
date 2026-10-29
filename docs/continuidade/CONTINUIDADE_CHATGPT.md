# TsuLiPa⭐World — documento de continuidade para uma nova conversa

> **Nota de atualidade:** este arquivo contém snapshots históricos. O índice documental e o plano de lançamento estão em [índice de docs](../README.md) e [Plano de lançamento](../PLANO_DE_LANCAMENTO.md). Antes de agir, confirme sempre o head do PR e o estado real dos bancos.

**Atualizado em 29 de outubro de 2026.** Este documento consolida o estado conhecido ao final da conversa. Para continuar, confira o GitHub antes de presumir que algum commit ou preview permaneceu igual.

## 1. Identidade do projeto e objetivos do usuário

- Projeto: **TsuLiPa⭐World**, jogo web de fã com avatares vetoriais em HTML/canvas.
- Site publicado e referência visual: https://tsulipa-world.vercel.app/
- Repositório privado conectado pelo GitHub: https://github.com/chumikie/tsulipa-run
- Branch de trabalho: `feature/sora-karaoke-v2-2026-10-29`.
- Pull Request **#33**, **rascunho**, aberto e não incorporado a `main`: https://github.com/chumikie/tsulipa-run/pull/33
- URL histórica de preview Vercel (a branch tem o deploy desativado em `vercel.json`; confirme a disponibilidade antes de usar): https://tsulipa-world-git-feature-sora-karaoke-v2-2026-10-29-tsu-li-pa.vercel.app/
- **Preview da página inicial experimental:** https://tsulipa-world-git-feature-sora-karaoke-v2-2026-10-29-tsu-li-pa.vercel.app/index2.html
- Preview do seletor de jogos: https://tsulipa-world-git-feature-sora-karaoke-v2-2026-10-29-tsu-li-pa.vercel.app/sora-jump-karaoke.html
- Também houve preview do Netlify do PR: https://deploy-preview-33--tsulipa-run.netlify.app/

### Restrições e desejos fundamentais do usuário

1. **NÃO alterar `index.html` na branch `main` nem publicar mudanças em produção sem aprovação após teste.** O index atual é a base autoritativa de estética e funcionalidades.
2. O usuário deseja experimentar mudanças numa página **`index2.html`** de laboratório, com os dois novos jogos integrados ao hub principal, e poder evoluí-la antes de substituir a página inicial.
3. Preservar contas, perfis, nomes dos saves `brs48cr_*`, economia de estrelas, rankings, inventários, gacha, pet, loja, moderação e RPCs. Não refatorar silenciosamente operações de banco.
4. Visual uniforme com o index original: **Mochiy Pop One** em títulos, **M PLUS Rounded 1c** para corpo, subtítulo japonês menor, tokens de tema/Oshi, cartões e botões arredondados, sombras coerentes. A atmosfera própria de cada minijogo deve permanecer.
5. Jogos separados em HTML próprio, acionados sob demanda por iframe: **`sora-jump.html`** e **`karaoke-day.html`**. Seletor opcional leve `sora-jump-karaoke.html`.
6. No Karaoke, lógica exclusiva para objeto de mão (microfone, pandeiro, bebida ou lanche), mas óculos e antenas coexistem como acessórios de cabeça. Clima feliz, musical, idol/J-pop, alimentos japoneses, objetos visualmente bem encaixados.
7. Pôsteres semanais devem usar **avatares vetoriais e apelidos públicos reais do jogo**, não fotos reais de pessoas, sem dados de conta privados. O grupo semanal deve ser compartilhado por todos, alternando aos domingos.
8. Melhorar desempenho em Vercel, Supabase e celulares sem quebrar mecânicas já existentes; medir antes de prometer que nunca excederá planos gratuitos.
9. Usuário normalmente acessa pelo celular, mas pretende revisar a interface no computador.

## 2. Estado do GitHub verificado no fim da conversa

O PR #33 estava **aberto e em rascunho**, base `main`, com **38 commits** na branch de trabalho, **11 arquivos alterados** versus `main` e última verificação de GitHub Actions em **success** (informações confirmadas em 29/10/2026).

Arquivos relevantes:

- `index.html`: **original, mantido intacto em `main`**, aproximadamente 927 KB de arquivo UTF-8.
- `index2.html`: **cópia experimental integral** da página inicial, aproximadamente 935 KB, com dois cards novos no mesmo hub: ☁️ Sora⭐Jump! e 🎤 Karaoke⭐Day!. Não é uma reescrita da index; os botões usam `hubCardsUI` e abrem jogos em iframe sob demanda.
- `sora-jump-karaoke.html`: seletor de jogos leve (~10,4 KB de arquivo UTF-8); títulos/subtítulos alinhados ao visual original.
- `sora-jump.html`: página isolada (~250 KB UTF-8), reduzida de uma cópia anterior de mais de 500 mil caracteres pela retirada de trechos herdados. Preserva lógica de Sora. Ainda precisa de teste amplo de todas as fases e saves.
- `karaoke-day.html`: página isolada (~103 KB UTF-8), com lógica de itens, snacks japoneses, pôsteres de avatares públicos, renderização mobile adaptativa e pausa de áudio/animação quando oculto.
- `games-theme.css`: estilos compartilhados dos minijogos (fonte, subtítulos JP, bordas, sombras, botões).
- `supabase/sql/karaoke_posteres_semana.sql`: SQL versionado da tabela privada e função RPC para elenco fixo.
- `.github/workflows/validate-games.yml` e `tests/validate-games.js`: validação automatizada de sintaxe, rotas e limites de tamanho. Últimas execuções passaram.
- `docs/auditorias/AUDITORIA_V3.md`, `docs/auditorias/AUDITORIA_RANKING_LOJA_INDEX2.md`, `README.md`: documentos de auditoria com detalhes técnicos e riscos.

Documentos do GitHub:
- https://github.com/chumikie/tsulipa-run/blob/feature/sora-karaoke-v2-2026-10-29/docs/auditorias/AUDITORIA_V3.md
- https://github.com/chumikie/tsulipa-run/blob/feature/sora-karaoke-v2-2026-10-29/docs/auditorias/AUDITORIA_RANKING_LOJA_INDEX2.md
- https://github.com/chumikie/tsulipa-run/blob/feature/sora-karaoke-v2-2026-10-29/README.md

## 3. Funcionalidades que já existiam e foram preservadas no projeto principal

- Center⭐Run (jogo, ranking, missões).
- Meu Perfil, personalização do avatar, inventário e insígnias.
- Star⭐Gacha, sorteio diário.
- Backstage⭐Pet e sua economia/inventários.
- Moon⭐Duo, Encontro do Dia, amigos, recados e outras áreas do hub.
- Lojinha de roupas, poses, temas e estrelas virtuais; conta, autenticação, sincronização com Supabase.
- Moderação e avisos.

**Não confundir preservação do código com validação end-to-end completa.** A auditoria foi majoritariamente estática e por inspeção de RPCs. A `index2.html` bloqueia no helper `contaRpc` operações mutáveis (compras, gacha, resgates, moderação e outras escritas), justamente para não executar transações no banco real durante a prévia. Isso significa que certas áreas podem ser visualizadas, mas a funcionalidade de escrita não pode ser avaliada na index2 sem um ambiente de homologação separado.

## 4. Resultado da auditoria de ranking, loja, estrelas e moderação

Conforme `docs/auditorias/AUDITORIA_RANKING_LOJA_INDEX2.md` na branch:

- Ranking Center Run usa `top_scores(periodo)`, retorna até 15 posições e exclui perfis bloqueados.
- Ranking diário adota dia civil de São Paulo; semanal começa segunda-feira; trigger `lb_set_date` preenche datas.
- `terminar_corrida` verifica pertencimento da corrida, limite de 2h e teto aproximado por tempo de pontos/estrelas. **Ainda não valida toda a física da partida no servidor**; potencial tema para prevenção futura de abuso.
- `gastar_estrelas` faz débito condicional ao saldo e registra movimento em `star_log`.
- `comprar_visual` usa preço de servidor, valida progresso, item existente, requisitos e orçamento.
- Auditoria de preços: **22 roupas em `PERF_LOJA` conferem com as 22 entradas correspondentes em `visual_preco`**.
- `gacha_girar` previne repetição no mesmo dia e registra o resultado.
- `ganhar_minijogo` tem limite diário de **★50**.
- `admin_acao` valida `eh_admin()` antes de alterar perfis; chamadas por anônimos não estão concedidas nessa função.
- Contagens consultadas à época: 9 perfis, 80 registros de ranking com data, 164 movimentos de estrelas, 13 giros de gacha; nenhum saldo negativo visto. São retratos daquela data, não garantia futura.
- Verificações futuras: concorrência de compras/resgates em dois aparelhos, quedas de rede, fluxo logout/login, duplicação de eventos e revisão gradual de permissões `SECURITY DEFINER` e índices.

## 5. Karaoke Day — melhorias feitas na branch

- Exclusividade de itens de mão: um item dentre microfone, pandeiro, bebida e lanche por vez. Óculos/antenas independentes.
- Snacks japoneses: onigiri, takoyaki, dango, taiyaki. Desenhos vetoriais mais elaborados para mão e mesa.
- Pôsteres de parede: miniaturas vetoriais com configurações dos perfis públicos, renderizadas em canvas e cacheadas para não redesenhar detalhes todo frame.
- Uma tabela privada `private.karaoke_poster_elencos` no **Supabase real** guarda somente os 4 IDs sorteados por semana. A função pública `karaoke_posteres_semana()` devolve exclusivamente apelido e atributos visuais; elimina perfis bloqueados em cada consulta. A regra vigente é reiniciar a cada domingo às **12h (São Paulo)** e priorizar integrantes que não apareceram na semana anterior. O elenco fica estável para todos durante a semana. Teste SQL devolveu quatro avatares; `anon` executa a RPC mas não acessa o schema privado.
- Importante: **o banco de produção foi alterado de forma aditiva** para esta função/tabela; o resto não foi migrado. Há SQL versionado no GitHub.
- Cena do canvas: 960×540 de resolução interna no celular de largura ≤620px; 1920×1080 no desktop. Coordenadas dos toques fixas no espaço lógico de 960×540. Exportação de foto no celular amplia para 1920×1080 (não adiciona resolução de detalhe real).
- Pausa loop `requestAnimationFrame` e música quando a aba fica oculta. Simulador de desenvolvimento inicia recolhido. O modo plateia não é imposto automaticamente a quem usa celular.
- **Pendente**: teste real de layout em diferentes navegadores, toque, encaixe de todos os acessórios/poses, exportação PNG, áudio Safari/iOS e chamadas HTTP da RPC pela prévia HTTPS.

## 6. Sora Jump — melhorias e ressalvas

- Redução do código herdado do index e abertura automática no jogo isolado, com retorno à seleção/Hub.
- CSS visual harmonizado via `games-theme.css`. Física, plataformas, cenas, obstáculos e histórico foram mantidos.
- Testes locais Chromium de desktop/móvel e validação de sintaxe passaram segundo auditoria anterior.
- **Pendente**: regressão de fases avançadas, game over, saves específicos e teste real no dispositivo. Isolamento de histórico local de Sora da economia real: ainda não conectar recompensas a estrelas do Supabase sem regras no servidor.

## 7. `index2.html`: o pedido mais recente do usuário

- O usuário pediu ver **como a página inicial completa ficará com os novos botões**, sem mexer na produção.
- O arquivo `index2.html` **já existe e está na branch**; foi criado durante a continuação da conversa, mesmo que a mensagem anterior tenha dado a impressão de interrupção.
- A index2 é uma cópia da index com dois cards novos no próprio hub (`hubCardsUI()`): **Sora⭐Jump!** e **Karaoke⭐Day!**; os jogos carregam somente após o clique, em iframe. Botão/retorno voltam ao hub e a música do hub é pausada quando o jogo abre.
- O código da index2 contém `noindex` e estilos escopados à experiência experimental, preservando visual original.
- **ATENÇÃO: a index2 chama o MESMO Supabase de produção**, não um banco sandbox. Por isso implementou proteções no helper `contaRpc` para impedir escritas durante testes; não testar compras, gacha nem moderação de verdade nesta prévia. Os saves locais do navegador ficam no domínio do preview.
- Um projeto Supabase de homologação será necessário para teste completo de transações sem afetar jogadores reais.
- A `index2.html` NÃO foi mesclada com o `index.html` de produção. O PR #33 continua rascunho.
- Link de acesso: https://tsulipa-world-git-feature-sora-karaoke-v2-2026-10-29-tsu-li-pa.vercel.app/index2.html

## 8. Próximos passos sugeridos para uma nova conversa

1. **Primeiro**: conferir o status atual do GitHub PR #33 e abrir a preview da `index2.html`; comparar visualmente desktop/móvel com a index publicada.
2. Levantar falhas de UX, posicionamento dos dois novos cards, funcionalidade de voltar e transições sem afetar a index original.
3. Verificar JS/network console na index2; confirmação de que não há transações reais de economia/moderação durante o teste.
4. Testar as duas páginas de jogo no preview, incluindo poses, itens, toque, áudio, FPS e pôsteres reais. Corrigir somente na branch.
5. Se for testar economia real, criar ambiente de homologação Supabase com dados fictícios, jamais reativar escritas na index2 apontando para banco real sem aprovação consciente.
6. Manter `main` e site publicado intactos até revisão/decisão explícita do usuário sobre merge.
7. Depois de aprovada a integração, estudar modularização do `index.html` em commits pequenos e medidos; não refatorar todos os módulos ao mesmo tempo.

## 9. Instrução curta para colar na próxima conversa

> Estou continuando o projeto **TsuLiPa⭐World**. Leia este resumo (vou anexá-lo) e consulte meu GitHub privado `chumikie/tsulipa-run`: branch `feature/sora-karaoke-v2-2026-10-29`, Pull Request **#33** em rascunho. A página inicial publicada é https://tsulipa-world.vercel.app/ e **NÃO deve ser alterada**. Já existe uma cópia experimental `index2.html` na branch, com Sora Jump e Karaoke Day integrados, além de jogos separados `sora-jump.html` e `karaoke-day.html`. Quero continuar ajustando **a prévia `index2.html`**, comparar a aparência com o index original e testar segurança/funcionalidade antes de publicar. O Supabase de produção é compartilhado, então evite transações de compra, gacha, moderação e outras escritas na prévia. Confirme os arquivos e o estado do PR no GitHub antes de alterar qualquer coisa; explique e implemente melhorias somente na branch, sem mesclar até minha autorização.