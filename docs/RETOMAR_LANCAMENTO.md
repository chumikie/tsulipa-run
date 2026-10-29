# Retomar: lançamento da INDEX 2 como página principal

Atualizado em 29/10/2026. Branch: `release/index2-lancamento`, criada a partir de `test/karaoke-reuse-anonymous-session`. Sem PR e sem deploy de produção.

## Já feito
- Suíte de testes da branch de sessão anônima: 8/8 passando, depois de corrigir 2 testes quebrados (commit `de4d726`).
- Revisão no navegador (Playwright local) da `index2.html`: celular em PT, EN, ES, TH e JA, e computador em PT. Nenhum erro de código e nenhuma rolagem lateral. Sora e Karaoke abrem e voltam ao hub.
- Sora⭐Jump!: menu, fim de partida, som e botão VOLTAR traduzidos (commit `b99110d`).
- Karaoke: textos da Sala de ensaio traduzidos. Ferramentas de teste escondidas dentro dos jogos embutidos.
- Supabase de produção: `karaoke_posteres_semana` registrada no histórico de migrações.

## Fazer, em ordem
1. **Investigar o teste que falhou** depois do commit `b99110d`: rodar `node tests/validate-games.js` e `node tests/sora-stability.test.js`, e corrigir.
2. **`index.html` = cópia da `index2.html`** com:
   - remover o bloco `INDEX2_PREVIEW_GUARD` (`TW_INDEX2_READ_RPC` e o `if` dentro de `contaRpc`). É obrigatório, senão compras, gacha, resgates e corridas não salvam. Fora a trava, a `contaRpc` é igual à da `index.html` atual;
   - remover o aviso `twPreviewAviso` ("INDEX 2 — PRÉVIA DE TESTES") e o seu texto em `twPreviewTextos`;
   - no aviso `twKaraokeFechado`: traduzir os textos fixos em português ("O palco está descansando…", "Estreia planejada…", "Multiplayer ainda em preparação", "Fechar"), dentro de `twKaraokeMostrarFechado`, e esconder ou remover o botão `twKaraokeConviteRascunho` ("Convidar (prévia)");
   - manter `TW_RANK_ONLINE_READY=false`.
3. **`index2.html`** vira um redirecionamento curto para `/`, para existir uma página só. A versão antiga fica no histórico do git.
4. Rodar a suíte completa (8 testes) e a revisão no navegador de novo (`rev.js`: celular e computador, 5 idiomas).
5. Abrir PR em **rascunho** para a `main`. A usuária confere a prévia da Netlify no celular e faz o merge, que dispara um único deploy na Vercel.

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
