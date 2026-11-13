# PR #71 — Recordes leves, auditáveis e sem histórico infinito

**Status: proposta técnica; SQL NÃO autorizado nem executado por este documento.** 
Escopo: Center⭐Run!, Sora⭐Jump!, Karaoke⭐Time!, Handshake⭐Event! e Happy⭐Cafe!.
Não alterar premiações, moedas, tickets, tentativas, missões, conquistas existentes, rankings públicos nem livro financeiro.

## Comportamento da primeira etapa nesta PR

- Handshake e Café: histórico **somente neste aparelho**, chave `tw_recordes_v1:<id-da-conta>:hand|cafe` (ou `aparelho` sem login), sem RPC nova.
- Cada jogo guarda a **união** de até cinco melhores e cinco partidas recentes (até dez entradas totais), além de **um** melhor da semana independente da lista. Não se guarda um resultado completo para cada partida indefinidamente.
- A semana começa no domingo, 00:00, **America/Sao_Paulo**, alinhada aos quadros semanais de jogos. O melhor semanal zera logicamente ao mudar o identificador de semana e só é substituído por pontuação superior da semana corrente.
- A comparação de pontuações é numérica e delimitada; conta logada não importa o recorde global legado de um convidado. Trocar de conta no mesmo navegador muda a chave.
- O resultado local é para consulta pessoal e **não é prova válida para ranking online**. Limpar dados do navegador apaga o histórico local, mas não afeta estrelas/tickets/registro de missão, que dependem do servidor.
- O recorde local legado de convidados ainda funciona em `tw_handshake_recorde` e `tw_cafe_recorde` até migração específica, para não alterar a experiência sem login.

## Cinco jogos: situação e caminho para padronização

| Jogo | Origem atual verificável | Esta PR | Próxima etapa, com aprovação própria |
| --- | --- | --- | --- |
| Center⭐Run! | Provas de corrida no servidor; rotina atual conserva melhores e recentes e limpa dados antigos | Apenas auditoria | Expor exatamente 5 melhores, 5 recentes e melhor semanal por conta, reutilizando as provas existentes, sem duplicar as tabelas |
| Sora⭐Jump! | `private.sora_history_add` limita o histórico; `sora_run_finish` acompanha recordes geral e semanal | Apenas auditoria | Confirmar a consulta pessoal para mostrar 5 + 5 e melhor semanal, com índices/planos revisados |
| Karaoke⭐Time! | `kt_run_finish` verifica a conclusão; quadros e pontuações semanais possuem retenção curta | Apenas auditoria | Propor função de leitura `kt_meu_historico()` e histórico pessoal 5 + 5 + melhor semanal, preenchido **somente** pelo finalizador verificado |
| Handshake⭐Event! | Sessão, resultado e prêmio diários são comprovados no servidor; o placar pessoal é local | **5 melhores, 5 recentes e melhor semanal locais** | Ranking público somente com pontuação obtida por prova assinada/verificada no servidor, nunca por localStorage |
| Happy⭐Cafe! | O servidor confirma atividades de pedidos; a pontuação completa depende do fluxo do cliente | **5 melhores, 5 recentes e melhor semanal locais** | Sem ranking público de pontos até comprovação pelo servidor da partida/placar inteiro e proteção antirrepetição |

Cada lista de melhores deve usar `pontuação DESC, instante ASC/ID ASC` para desempate estável e cada lista de recentes `instante DESC, ID DESC`. A união deve ser truncada nos pontos de escrita confiáveis; as funções de leitura não podem gerar novos registros.

## Dependências SQL já existentes: não confundir dados descartáveis com registros financeiros

1. **`handshake_premio`**: já faz concessão diária de ticket do Karaoke ou item do pet, sem estrelas, apoiada em `private.handshake_sessoes`, `private.handshake_resultados` e `public.handshake_premios`. Preservar idempotência de um prêmio/dia, limites, dados de concessão e evento de ticket.
2. **`missoes_handshake_cafe`**: `public.missoes`/`missoes_progresso` validam atividades reais (ao menos um acerto no Handshake e pedido perfeito no Café) e mantêm **★10 por missão cumprida**, sem usar placar local como comprovante. Não mudar isso nesta etapa.
3. **`conquistas_jogos_novos`**: SQL em `supabase/sql/proposta/20261103220000_conquistas_jogos_novos.sql` **ainda NÃO é seguro para execução**. A proposta chama `private.player_badges` e `public.conquista_jogo(text)`, ausentes no esquema ativo. No banco real, as insígnias persistidas estão em `public.players.insignias_jogos text[]`, sincronizadas por `public.sincronizar_insignias_jogos(text[])` com whitelist anterior. Além da incompatibilidade, aceitar conquista enviada pelo cliente sem verificação do combo/receitas permitiria fraude. A migração futura deve estender o esquema **real** e conceder somente insígnia comprovada por eventos de servidor, sem derrubar insígnias legadas. A ordenação sazonal para o fim da UI é independente desta migração.

## Retenção das sessões: proposta futura, NÃO rodar ainda

- O cron existente `tsl-limpeza-semanal` chama `public.limpar_historico()`; última execução observada em 02/11/2026, com sucesso. Verificar o próximo cron antes de mudar a rotina.
- **Candidatos à exclusão após dependências revisadas**: `private.handshake_sessoes` e `private.cafe_sessoes` expiradas há **mais de sete dias** (margem superior a 25 minutos do Handshake e 20 do Café). Usar lotes pequenos, índice de data somente se justificado por `EXPLAIN`, e execução protegida contra duplicidade/concor­rência. Nunca excluir sessões recentes ou pendentes.
- **Não excluir sem mapa de dependências completo**: `private.handshake_resultados`, `private.cafe_resultados`. Esses registros comprovam missões, notícias e potenciais conquistas; estudar retenção **mínima de 35 dias**, preservação de agregados e migração/continuidade verificável. Não definir TTL definitivo antes de inspecionar todas as consultas e prazos de contestação.
- **Não excluir como “limpeza de recordes”**: `public.handshake_premios`, `private.kt_ticket_events`, razão de estrelas/pagamentos, resgates de missão, contrapartidas de inventário, `players.insignias_jogos`, logs financeiros e provas exigidas para recomposição de créditos.
- Incluir política de `auth.uid()` e RLS para qualquer função de consulta pessoal; testar duas contas, partidas repetidas, semana cruzando domingo e falha de comunicação. Não criar RPC de gravação de recordes com números enviados pelo navegador.

## Sequência segura para uma aprovação futura

1. Levantar DDL real, índices, grants/RLS, dependências `pg_depend` e funções que consultam sessões/resultados; testar regras das três SQLs acima numa transação revertida.
2. Executar testes de regressão para cinco jogos, repetição de partida, recarga de sessão, missão ★10, bilhete/item diário e insígnias sem acesso indevido.
3. Preparar **SQL isolado e reversível** para política de retenção das sessões; revisar `EXPLAIN (ANALYZE, BUFFERS)` em ambiente de teste ou consulta limitada e estimar volume. Pedir aprovação explícita antes de produção.
4. Planejar separadamente histórico pessoal verificado do Karaoke e expansão do sistema de insígnias; manter ranking de Café/Handshake local até comprovação robusta.
5. Não misturar essa autorização com outras propostas SQL da PR #71, com merge ou publicação.

### Validação mínima da parte local

`tests/recordes-locais-71.test.js` verifica limite de dez registros, preservação dos 5 melhores + 5 recentes, melhor semanal independente, fronteira de semana em São Paulo, isolamento por conta e manutenção do recorde legado de convidado. Testar também no navegador da prévia desktop e móvel antes de publicação.

**Estado ao final desta etapa:** nenhuma função/tabela/prêmio/mission/badge no Supabase foi modificada; não se solicita SQL em produção agora.
