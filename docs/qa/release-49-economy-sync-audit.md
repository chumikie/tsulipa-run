# Auditoria de liberação — PR #49: Pet, estrelas, sorteios e escala

Data: 31/10/2026. Fonte de código: `index.html`, `pet-sync.js` e testes da branch da PR #49. Fonte do servidor: **definições e estatísticas lidas sem mutações** do projeto Supabase de produção `fsggtvgbyhchblyazgmt`. Números representam um retrato, não um teste de carga.

## Escopo e decisões
- Trabalhar somente na PR #49; **sem merge, deploy de produção, mutação de dados ou migração aplicada**.
- Preservar contas, estrelas e saves `brs48cr_*`, autenticação, cinco idiomas, catálogo, ranking e Karaoke online arquivado.
- Esta auditoria distingue o que já é validado pelo servidor, o que foi corrigido no código e o que **exige mudança SQL aprovada separadamente**.

## 1. Economia de estrelas

| Recurso | Estado verificado | Condição |
| --- | --- | --- |
| Loja de roupas, visuais, poses, fundos, expressões, extras Moon⭐Duo! | **49 itens pagos da interface**: preços e requisitos de pontos coincidem integralmente com `visual_preco`. Mais 11 temas temporários a ★60 constam no servidor. | `comprar_visual` debita e entrega direito no mesmo UPDATE/registro de log. |
| Comidas, banho, acessórios, decoração e adoção do Backstage⭐Pet! | O código anterior liberava o item localmente e só então disparava `gastar_estrelas` sem tratar negação. **Corrigido nesta PR**: aguardar `ok=true` e saldo retornado antes de conceder benefício pago; sem login, debitar saldo local. | No servidor, `gastar_estrelas` atualiza saldo com condição `stars >= p_qtd`, registra `star_log` e retorna saldo. |
| Presente Moon⭐Duo! | `duo_presente` só admite ★0/10/30/50; confere saldo, desconta, registra log e cria presente. | Débito confirmado pelo servidor. |
| Star⭐Gacha! | Um giro gratuito por dia por conta, com resultado persistido no servidor; apenas prêmios de estrelas creditam saldo. | Giro **não tem preço** por decisão de jogo. |
| Corrida Center⭐Run | `terminar_corrida` valida token de corrida, pontuação e duração. Crédito limitado por duração, ★400/corrida e ★1500/dia; log e leaderboard só para corrida válida. | **Ajuste na PR**: cliente autenticado não credita ★ de forma otimista; aguarda `creditadas`/saldo oficial. |
| Minijogos do Pet | `ganhar_minijogo` limita recompensa a ★50/dia por conta e registra log. | Pendência de segurança: parâmetro de recompensa ainda parte do cliente; servidor limita, mas não comprova jogo. |
| Missões / encontro / presentes | RPCs específicas creditam estrelas e registram eventos; `resgatar_missao` usa chave única por conta/dia/missão. | Consultar risco do caminho legado de encontro abaixo. |

**Conferência agregada do banco (31/10):** 9 contas, soma de saldos ★2933 e soma de `star_log.delta` ★2933 — diferença **zero** no retrato verificado. A amostra é pequena e não prova todos os cliques nem todos os cenários de falha. Existem 24 registros de débito `camarim`, confirmando que compras reais já ocorreram.

**Limitação remanescente:** desconto de estrelas e gravação posterior do inventário do Pet continuam sendo **duas RPCs distintas**. A alteração da PR impede ganhar item sem débito confirmado, mas uma queda da aba entre o débito e o save poderia deixar a compra pendente neste aparelho. A garantia transacional completa exigiria RPC de compra com item e `request_id` idempotente no servidor. **Não foi alterado o banco.**

## Sincronização do Backstage Pet

- Ações como alimentar, brincar, banho, adotar e vestir atualizam `localStorage` imediatamente e marcam uma pendência persistente. O relógio natural das barras grava só localmente e **não gera escrita a cada cinco segundos**.
- Alterações próximas são agrupadas com atraso de 4 segundos e limite de espera de 25 segundos; fechar o camarim tenta enviar já. Falhas são reenfileiradas, e reconexão/retorno à aba retomam o envio. O indicador distingue pendente, enviando, salvo, offline e conflito.
- Um marcador de ação feita **sem login** impede que a entrada posterior pelo Google substitua silenciosamente o Pet local; a pessoa escolhe qual save manter quando há nuvem mais recente.
- Antes de cada envio agrupado, a aplicação faz **uma leitura da versão na nuvem** para detectar alterações feitas por outro navegador desde a última versão observada. Se outra sessão avançou, bloqueia o envio e oferece escolha explícita. Isso reduz sobrescritas silenciosas, mas **não é uma trava atômica**: duas gravações simultâneas ainda podem competir entre leitura e escrita. Uma proteção absoluta depende de `expected_version`/CAS no RPC do banco.
- A conferência das funcionalidades em uma conta autorizada e dois navegadores **continua pendente**; testes automatizados não provam o comportamento da rede real.

## 2. Sorteios e universo de jogadores

| Exibição | Quem pode aparecer | Está restrito a online agora? |
| --- | --- | --- |
| Outdoors/telas do Center⭐Run (`outdoor_jogadores`) | Amostra aleatória até 8 perfis de `players` com avatar e não bloqueados; recarregada na visita à página. | **Não.** Inclui usuários cadastrados que estão offline. |
| Star⭐Gacha! (`gacha_girar`) | Carta sorteada entre todos os jogadores com avatar e não bloqueados. | **Não.** |
| Encontro do Dia (`encontro_hoje`) | Jogadores com avatar, não bloqueados e diferentes do solicitante; 1 protagonista, +1 na terça ou +2 na sexta conforme disponibilidade. Resultado fixo por conta/dia. | **Não.** |
| Moon⭐Duo! sugestões (`duo_sugestoes`) | Jogadores com avatar, não bloqueados, que ativaram o recurso (`duo_on`). | **Não.** O opt-in é intencional. |
| Encontro sem login | Amostra de `outdoor_jogadores`, sorteada localmente e mantida por aparelho/dia. | Não; depende dos 8 candidatos recebidos. |

**Observação funcional:** a base é de *contas existentes com avatar*, não de quem está conectado no momento. Quem nunca criou avatar não aparece nesses sorteios. O Centro recebe só oito candidatos por visita: cada visita pode trazer outros nomes, mas não mostra todos ao mesmo tempo. O fallback sem login foi ajustado nesta PR para usar Fisher–Yates (amostragem uniforme dentro desses oito candidatos); o sorteio autenticado continua no servidor.

## 3. Contagem de corridas, Centers e rankings

- `lb_contar` incrementa `corridas_total` por linha válida inserida em `leaderboard`, `centers_total` quando `score >= 5000`, e `dias_jogados` quando muda a data em Brasília.
- No retrato do banco, **0 contas tinham divergência** entre `corridas_total` / `centers_total` e os registros de `leaderboard`.
- `top_scores` usa melhor resultado por apelido em cada período e devolve Top 15; `sora_ranking` mantém Top 15 semanal/geral; `kt_ranking` mantém Top 5 por categoria semanal.
- A PR passa a mostrar `creditadas` após `terminar_corrida`, sem apresentar estrelas propostas pelo navegador como definitivamente recebidas.

**Problema identificado no servidor:** `admin_corrida` apaga um registro e recalcula `best`, mas **não recalcula** `corridas_total`, `centers_total` ou `dias_jogados`. Como a função de insígnias considera também esses contadores acumulados, uma corrida excluída futuramente pode continuar contando para uma insígnia. Hoje não há divergência detectada. Corrigir em uma migração aprovada antes de depender desse fluxo em produção.

## 4. Riscos SQL ainda abertos — não corrigidos nesta PR

1. **Encontro legado (mitigado):** `encontro_do_dia` tinha potencial de creditar ★3 antes de `encontro_premio`. Em 31/10, nova consulta confirmou `EXECUTE=false` para `anon` e `authenticated` na função legada, após a revisão das funções internas. O fluxo atual usa `encontro_hoje` e `encontro_premio`; preservar a revogação.
2. **Admin excluir corrida:** `admin_corrida` não recalcula os contadores acumulados; deve corrigir o estado ou computar os valores de `leaderboard` após exclusão.
3. **Validação antitrapaça de minijogos:** `ganhar_minijogo` respeita o teto diário, mas recebe um número fornecido pelo cliente sem prova de conclusão; para proteção forte precisa de verificação server-side.
4. **Persistência CAS e compra de Pet inteiramente atômicas:** proteção de concorrência forte na RPC `salvar_nuvem` e ausência de uma RPC que una débito, entrega e idempotência; exige desenho compatível com os saves existentes e aprovação de migração.

Nenhuma dessas questões autoriza modificar dados, revogar grants ou aplicar SQL automaticamente.

## 5. Escala: dá para receber muitos membros?

**Situação atual observada:** 9 contas, aproximadamente 96 registros de `leaderboard`, 202 de `star_log`. Payload de Pet salvo: média ~533 bytes, maior ~613 bytes. **Armazenamento do Pet não é o gargalo neste retrato.** Nenhum teste de carga com centenas/milhares de sessões foi executado.

Principais hotspots quando crescer:
- `ranking_minijogos` calcula pontos extraindo JSON de todos os pets em `players` a cada consulta, com agregações e contagens.
- `top_scores` calcula `distinct on lower(trim(name))` sobre histórico de `leaderboard` e filtros de período sem índice específico por data/pontuação.
- `insignias_calc` inclui ranking semanal histórico e agregações do leaderboard; pode ficar caro quando perfis forem abertos em volume.
- Sorteios com `ORDER BY random()` sobre todos os perfis elegíveis fazem varredura/ordenação, podendo pesar no crescimento.
- `star_log` cresce por evento (adequado para auditoria), mas consultas diárias com conversão de timezone devem ser avaliadas por `EXPLAIN (ANALYZE, BUFFERS)` em ambiente de homologação sob carga.

Plano seguro antes de abertura ampla: criar dados sintéticos na homologação, simular 100/1000/10000 perfis e concorrência de logins, compra, corrida e ranking; medir latência p95, erros e custo; só então aprovar índices/cache/materialização, sem adivinhar limites de plano.

## 6. Checklist funcional de liberação

- [ ] Dois navegadores com **mesma conta**: alimentar Pet, ver “Salvando…” e “Salvo na nuvem”; fechar, abrir no outro e confirmar novo valor respeitando a queda natural pelo relógio.
- [ ] Desconectar antes de alimentar; confirmar “Pendente”; reconectar e aguardar confirmação. Verificar preservação mesmo após recarregar a página original.
- [ ] Criar conflito entre dispositivos e conferir tela de escolha, inclusive após uma edição local sem login, sem substituir automaticamente mudanças locais.
- [ ] Comprar item pago do Pet: saldo antes/depois e inventário; testar sem saldo, offline e clique duplo. A compra com perda de resposta precisa revisão de idempotência futura.
- [ ] Comprar roupa/pose/fundo em conta autorizada e comparar saldo exibido com saldo da conta após recarregar.
- [ ] Corrida válida: pontuação, `creditadas`, contador de corridas e Centers; testar teto diário e ranking semanal em virada de Brasília.
- [ ] Administrador Matheus e conta comum: permissão administrativa e exclusão de corrida depois que a correção de contadores for aprovada.
- [ ] Executar teste de carga na homologação antes de divulgação para um público grande.
- [ ] Resolver as pendências SQL ainda abertas (itens 2–4); manter a mitigação de permissão do item 1.
- [ ] Aprovar o merge da PR #49 somente após os itens críticos pertinentes.

Karaoke online permanece **arquivado**; não faz parte desta alteração.
