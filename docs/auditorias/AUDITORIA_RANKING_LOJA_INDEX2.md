# INDEX 2 — Prévia integrada e auditoria de sistemas (29/10/2026)

## Objetivo
Testar uma página inicial **idêntica em estrutura** ao `index.html` atual, acrescentando dois cards dentro do `hubCardsUI()`, sem editar a produção:
- ☁️ Sora⭐Jump! — abre `sora-jump.html` em iframe sob demanda.
- 🎤 Karaoke⭐Day! — abre `karaoke-day.html` em iframe sob demanda.
- O botão superior e as mensagens dos jogos retornam ao mesmo hub. Áudio do hub é interrompido ao abrir um jogo.
- O código da página original é copiado e recebe apenas as extensões de prévia; estilos são escopados por `tw-` e o HTML tem `noindex`.

URL de testes: `/index2.html` em uma implantação Preview da branch `feature/sora-karaoke-v2-2026-10-29`.

## Segurança da prévia
A URL da branch e a produção **não são a mesma página**. O `index.html` na branch `main` permanece intacto.
**Entretanto, ambas usam o MESMO projeto Supabase**, sem sandbox do banco. A `index2` inclui proteção de leitura: somente RPCs de consulta revisadas são permitidas pelo helper `contaRpc`; operações de compras, Gacha, resgates, moderação e outros writes são bloqueadas. `duo_avisos_pendentes` foi removida da lista de leitura após confirmar que executa UPDATE. O leitor público de ranking é um RPC direto e somente consulta dados. Não executar testes de transações reais na prévia; criar futuramente um projeto separado de homologação para testar operações de escrita.

## Auditoria da lógica atual de ranking
- `top_scores(periodo)` consulta `public.leaderboard`, retorna até 15 posições e remove entradas associadas a perfis bloqueados.
- `day` usa a data civil de São Paulo; `week` começa segunda-feira, via `date_trunc('week')`.
- O trigger `lb_set_date` preenche a data das novas entradas; 80 entradas existentes, nenhuma com data ausente na leitura de auditoria.
- `terminar_corrida` verifica a corrida criada e pertencente ao usuário, recusa corrida com mais de 2 horas e aplica teto por tempo à pontuação e às estrelas.
- **Melhoria posterior:** a pontuação ainda é informada pelo cliente e verificada por limites aproximados de tempo; não equivale a uma validação de toda a física da partida no servidor. Investigar prevenção de abuso antes de introduzir leaderboard competitivo maior.
- O ranking principal continua sendo do **Center⭐Run!**. Sora tem histórico local próprio e não foi conectado à economia online. Karaoke é uma experiência social e não usa ranking global.

## Economia, moedas e loja
- `gastar_estrelas`: desconta somente se saldo suficiente, em operação condicional, e registra movimento em `star_log`.
- `comprar_visual`: lê preço oficial do servidor, verifica estrela, desbloqueio de pontuação, tema sazonal e existência prévia do item antes de debitar. Compara os preços da loja ao servidor, não confia apenas no valor da tela.
- **22 roupas no `PERF_LOJA` e 22 valores `roupa_...` na função `visual_preco`: preços e nomes técnicos conferiram, sem divergências.**
- `gacha_girar`: bloqueia repetição no mesmo dia pelo horário brasileiro, registra cada giro e credita estrelas ou bônus conforme o prêmio.
- `ganhar_minijogo`: aplica limite diário de ★50 ao ganho de minijogo.
- Leitura da base: nove perfis, nenhum saldo de estrelas negativo, 164 movimentos de estrelas e 13 giros registrados (contagens na data da auditoria).
- **Melhoria posterior:** fazer uma conferência ponta a ponta de resgates simultâneos (dois aparelhos), fluxo de logout/login, compra durante falhas de rede, e duplicação de eventos; não há evidência aqui de falha nessas situações.

## Moderação
- `admin_acao` chama `eh_admin()` antes de qualquer alteração; a função não concede `EXECUTE` a visitantes anônimos.
- Admin pode bloquear perfil, renomear, limpar frase, apagar recado e restringir uso do Moon Duo. A exibição pública do ranking filtra perfis bloqueados.
- Foram encontrados registros de ações administrativas, sem inspecionar nomes, texto nem dados privados.
- **Revisar posteriormente** o conjunto de funções `SECURITY DEFINER`, permissões efetivas e validações internas; não remover grants ou mudar RLS às cegas.
- Os avisos do Supabase incluem quatro índices ausentes em chaves estrangeiras; não foram feitos índices, grants ou mudanças em funções existentes nessa auditoria.

## Integração dos jogos e testes pendentes
- Sora Jump: arquivo separado de ~250 KB (UTF-8) com placar/histórico de Sora **local e isolado**, não uma nova fonte de dinheiro no banco.
- Karaoke: pôsteres com avatares públicos e elenco semanal fixo (RPC `karaoke_posteres_semana` criada em etapa anterior), itens de mão mutuamente exclusivos, resolução móvel reduzida.
- A interface da `index2` usa exatamente os estilos e eventos dos cards do hub original, com dois novos cards adicionados.
- Testar em prévia HTTPS: abrir cada jogo, voltar, trocar idiomas/Oshi, abrir perfil/loja sem fazer compra, verificar card de Missões, Gacha sem girar, rolagem no celular e performance.
- `tests/validate-games.js` / GitHub Actions validam HTML, links e JavaScript, mas **não substituem testes reais de navegação, rede e compras**.

## Próximas otimizações seguras
1. Criar ambiente de Supabase de **homologação**, caso seja necessário testar transações e moderação sem atingir contas reais.
2. Extrair módulos por tela de `index.html` em pequenos commits testáveis, sem mudar a aparência nem nomes de save.
3. Carregar recursos apenas quando o jogo for aberto, guardar públicos em cache e pausar animações quando invisíveis.
4. Revalidar o ranking e a segurança das RPCs antes de integrar recompensas dos novos jogos à carteira global.
