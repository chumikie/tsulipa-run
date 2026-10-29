# Retomar: lançamento da INDEX 2 como página principal

Atualizado em 29/10/2026. Branch: `release/index2-lancamento`, criada a partir de `test/karaoke-reuse-anonymous-session`. Lançamento preparado para PR em rascunho; sem merge ou deploy de produção por esta tarefa.

## Já feito
- **Lançamento preparado em 29/10/2026 (Astra/Codex):** `index.html` promovida da INDEX 2; `index2.html` agora redireciona para `/`.
- Removidos `INDEX2_PREVIEW_GUARD`, `TW_INDEX2_READ_RPC`, bloqueio em `contaRpc`, aviso de prévia, título de testes e `noindex` da página principal. `contaRpc` conferida byte a byte contra a implementação oficial anterior; nomes `brs48cr_*` preservados.
- Aviso de Karaoke fechado traduzido em PT/EN/ES/TH/JA; convite de rascunho removido. `TW_RANK_ONLINE_READY=false` mantido. Sala, fila, autenticação, SQL e `vercel.json` não alterados.
- Diagnóstico reproduzido: **6/8** testes passavam inicialmente; falhavam `validate-games.js` (texto de ensaio e versões dos CSS) e `sora-stability.test.js` (versão do CSS). Expectativas alinhadas ao commit `b99110d`, sem reverter suas traduções.
- **8/8 testes locais passando** após a migração. Testes agora validam a página canônica, redirecionamento e ausência da trava; aviso fechado validado em cinco idiomas. Workflow inclui `index.html` nos filtros de caminhos.
- Navegador Chromium, 390×844 e 1440×1000, PT/EN/ES/TH/JA: hub, aviso fechado, ensaio local, Sora e retorno; sem exceções JS e sem overflow horizontal no documento principal. Redirecionamento conferido. Evidências e limites em [evidencias/index2-lancamento/README.md](evidencias/index2-lancamento/README.md).
- **Limite importante:** revisão em navegador com viewports, não em aparelhos físicos; chamadas externas de aplicação bloqueadas. Login, compras, resgates e sala online não exercitados na produção. Há texto preexistente “Som” no Sora fora de PT, registrado para revisão separada; não foi alterado o jogo nesta tarefa.
- Entrega agrupada em uma única atualização da branch e PR em rascunho, sem merge. O link da Netlify e o resultado do build devem ser conferidos no PR. A integração Vercel do commit anterior foi consultada como `BLOCKED`; nenhuma configuração foi reativada.

### Histórico anterior à migração
- Suíte de testes da branch de sessão anônima: 8/8 passando, depois de corrigir 2 testes quebrados (commit `de4d726`).
- Revisão no navegador (Playwright local) da `index2.html`: celular em PT, EN, ES, TH e JA, e computador em PT. Nenhum erro de código e nenhuma rolagem lateral. Sora e Karaoke abrem e voltam ao hub.
- Sora⭐Jump!: menu, fim de partida, som e botão VOLTAR traduzidos (commit `b99110d`).
- Karaoke: textos da Sala de ensaio traduzidos. Ferramentas de teste escondidas dentro dos jogos embutidos.
- Supabase de produção: `karaoke_posteres_semana` registrada no histórico de migrações.

## Próximo passo
1. A usuária revisa o PR em rascunho e a prévia da Netlify no celular real.
2. Conferir as limitações registradas nas evidências. O teste real do Karaoke continua separado, no projeto de homologação; não abrir a sala de produção nesta tarefa.
3. Somente a usuária faz o merge. Não enviar novas alterações ou reativar deploys automaticamente.

## Regras
- Não fazer merge, não reativar deploys e não mexer na `main` sem o ok da usuária.
- Karaoke online continua fechado pelo servidor. Testes da sala só no projeto de homologação `hfzjoefnousiouiuchys`. Primeira janela real: domingo, 12h–13h10 (Brasília).
- Nunca renomear as chaves de save `brs48cr_*`. Não criar dados falsos na produção (`fsggtvgbyhchblyazgmt`).
- Evitar vários envios seguidos: cada push gera build.

## Pendências fora do lançamento
- Apagar cerca de 24 branches já mescladas (precisa do ok da usuária).
- Organizar a pasta `docs/`: um STATUS único, e documentos antigos em `docs/historico/`.
- Proteger a `main` (regra de branch, feita pela usuária nas configurações do GitHub).
- Fechar `gacha_card`, `missoes_progresso` e `recados_globais_on` para chamadas sobre outras contas.
