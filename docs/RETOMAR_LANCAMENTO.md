# Retomar — lançamento da INDEX 2 como página principal

**Atualizado em 30/10/2026, após os ajustes autorizados do banner e do Star Gacha.** Este arquivo descreve o estado confirmado da branch de lançamento. Antes de qualquer nova alteração, confira o head do PR e os checks atuais no GitHub.

## Ponto de parada atual

- Repositório: [chumikie/tsulipa-run](https://github.com/chumikie/tsulipa-run).
- Branch de trabalho: `release/index2-lancamento`.
- PR #34: [Lançamento da INDEX 2 como página principal](https://github.com/chumikie/tsulipa-run/pull/34).
- Estado do PR: **aberto, em rascunho e não mesclado**; base `main`.
- Base desta entrega: `6a31065d5128a7492ddab7a130ee18f90279e8aa`, com CI aprovado. Esta entrega ajusta somente o tamanho do banner no hub e remove o aviso extra de login do card Star Gacha, além da validação e documentação correspondentes. Confira o head atual antes de qualquer nova alteração.
- SHA confirmado de `main`: `47b1b702d68ee205c7a44fb7da13c12165f33db6` — não alterada por esta entrega.
- PR #33: continua aberto/em rascunho e intocado.
- Prévia Netlify do PR #34: https://deploy-preview-34--tsulipa-run.netlify.app

### Checks da revisão de código e da prévia

- GitHub Actions, workflow **Check TsuLiPa special games**, execução [40983812523](https://github.com/chumikie/tsulipa-run/actions/runs/40983812523): **success** na base `6a31065d...`. Consultar os checks do novo head após esta entrega.
- Netlify Deploy Preview: usar a URL acima e conferir o status da implantação mais recente antes de testar; a prévia pode reconstruir após commits na branch.
- Vercel: status **“Deployment was blocked”**. Isso é intencional e não deve ser corrigido reativando deploy ou alterando configurações de produção.
- A aprovação do CI e da Netlify não substitui a revisão visual em aparelho físico, que ainda está pendente.

## Revisão visual e ajustes autorizados em 30/10

- A usuária aprovou a tela de abertura e a disposição dos botões nas capturas enviadas. Isso não comprova teste em celular físico.
- Banner do trio no hub: centralizado, limitado a 560 px, mantendo a proporção e o tamanho da abertura. A largura dos botões e do ranking permanece intacta.
- Star Gacha: removido somente o aviso extra “🔒 Entrar com Google”; mantidos “1 giro por dia”, cadeado no canto e exigência de login.
- A tela de abertura e os fluxos de autenticação/jogos não foram alterados.
- Próximo passo: a usuária revisa esses dois ajustes na prévia atualizada; nenhuma autorização de merge foi dada.

## O que já foi implementado

### 1. INDEX 2 promovida, sem merge

- `index.html` é a página principal da branch de lançamento; `index2.html` redireciona para `/`.
- Foram removidos a trava `INDEX2_PREVIEW_GUARD`, `TW_INDEX2_READ_RPC` e o bloqueio de chamadas mutáveis em `contaRpc`. A implementação de `contaRpc` foi conferida contra a versão oficial anterior.
- Aviso de prévia removido, metadados/título da página principal restaurados.
- Aviso de Karaoke fechado traduzido em PT/EN/ES/TH/JA; convite de rascunho escondido.
- `TW_RANK_ONLINE_READY=false` foi mantido. Chaves de save `brs48cr_*` preservadas.

### 2. Tela inicial e TsuLiPa TV

- A tela inicial de “Toque para começar” permanece limpa: os botões do hub e os jogos não aparecem antes de a pessoa iniciar.
- Depois do toque inicial, o hub apresenta os jogos e o acesso à TV.
- A TsuLiPa TV é agora **um ícone pequeno de TV**, não um cartão. Ele só aparece dentro do hub.
- Ao tocar no ícone, a própria TV abre flutuando sobre a tela. Não existe uma segunda janela/cartão envolvendo a TV.
- O botão de fechar fica integrado ao cabeçalho da TV; fechamento por botão, Escape e clique no fundo, com retorno do foco ao ícone.
- Testes de regressão verificam a posição do ícone dentro do hub oculto, o estado da tela de início e a TV como o próprio diálogo.

### 3. Sora⭐Jump! e acesso às áreas

- Apresentação do Sora adaptada à identidade kawaii do TsuLiPa, com cabeçalho, retorno e controle de som externos ao jogo.
- O controle de som se comunica com o jogo incorporado por uma ponte controlada; o jogo e sua lógica não foram substituídos.
- Center Run continua acessível anonimamente, pedindo apenas apelido.
- Meu Perfil e áreas que exigem conta indicam discretamente a necessidade de perfil, sem transformar a tela de abertura em uma sequência de bloqueios.

### 4. Karaoke⭐Day! — apenas homologação

- A janela inaugural de homologação está configurada para **domingo, 01/11/2026, das 12h às 13h10 (horário de Brasília)**.
- A prévia fica limitada a execução local/localhost e ao host de Deploy Preview da Netlify. O host de produção da Vercel é explicitamente bloqueado para essa janela.
- Isso não abre a sala online para o público nem altera a autenticação, a fila, o SQL, as políticas RLS ou o banco de produção.
- A sala online permanece fechada pelo servidor. Não remover essa proteção como parte de ajustes visuais.

### 5. Arquitetura e desempenho preservados

- Sora e Karaoke continuam separados e carregados por iframe somente quando a pessoa escolhe o jogo.
- Áudio e animações devem pausar quando a aba fica oculta.
- Não gravar estado no banco a cada frame; manter RPCs controladas e atualizações agrupadas.
- `tw-weekly-podium.css` permanece abaixo do limite de 10 KB; os estilos de lançamento ficam em `index2-launch-ui.css`.

## Validação e limites

Nesta entrega, a checagem em navegador local não foi concluída: Chromium indisponível e download do navegador falhou. A dimensão foi conferida no CSS; revisão visual da prévia atualizada permanece pendente.

O workflow passou na base `6a31065d...`. Os oito scripts de validação locais passaram após os ajustes desta entrega. O teste estrutural foi atualizado para aceitar o cadeado sem exigir o aviso extra removido. Entre as verificações automatizadas mantidas na branch estão validação estrutural dos jogos, modelo da sala de Karaoke, ritmo, homologação/fila/segurança, ciclo de vida e recuperação de sincronização, estabilidade do Sora (iframe, áudio móvel e bfcache) e regressões do pódio semanal/tela inicial.

**O que ainda não foi comprovado:** revisão da interface em um celular físico; login, compras, resgates e economia em fluxo real de produção; experiência multiplayer pública. A revisão anterior em Chromium com viewports móveis e desktop é evidência histórica, não substitui o teste do layout mais recente.

## Próximo passo exato

1. A usuária abre a [prévia Netlify do PR #34](https://deploy-preview-34--tsulipa-run.netlify.app), primeiro em um celular real e depois no computador.
2. Conferir a tela “Toque para começar” sem os botões do hub; tocar para entrar; conferir o pequeno ícone da TV; abrir e fechar a TV sem uma janela externa; abrir Sora e conferir cabeçalho/retorno/som.
3. A usuária informa o que deseja ajustar. Qualquer correção autorizada deve acontecer somente em `release/index2-lancamento`, com validação e mudanças agrupadas.
4. **Parar para a aprovação da usuária. Só ela faz o merge do PR #34.**

## Regras obrigatórias para continuar

- Não fazer merge, não alterar `main`, não publicar em produção e não ativar a Vercel.
- Não alterar `vercel.json`, configurações de projeto ou deploy.
- Não modificar Supabase, SQL, autenticação, RLS, RPCs, economia, fila ou sala online sem autorização explícita.
- Testes de sala apenas no projeto de homologação `hfzjoefnousiouiuchys`; produção `fsggtvgbyhchblyazgmt` é somente leitura nesta tarefa.
- Nunca renomear chaves `brs48cr_*`; não criar contas, pontos, compras ou dados falsos em produção.
- Não renomear nem apagar branches `brs48cr_*`; não apagar branches antigas sem autorização.
- Evitar commits/pushes desnecessários. Uma entrega autorizada deve ser agrupada em uma única atualização de branch, pois cada push pode disparar CI e prévias.
- Não declarar teste visual ou físico sem evidência correspondente.

## Pendências fora do escopo deste lançamento

- Revisar e testar a prévia em aparelho físico.
- Organizar futuramente a documentação antiga e os documentos históricos sem apagar evidências.
- Avaliar proteção da `main` nas configurações do GitHub (ação da usuária).
- Rever separadamente permissões de `gacha_card`, `missoes_progresso` e `recados_globais_on`.
- Limpeza de branches antigas somente com autorização explícita.
