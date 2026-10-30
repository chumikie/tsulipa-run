# Instruções de retomada para o Astra (ChatGPT)

**Atualizado em 30/10/2026.** Leia primeiro [`RETOMAR_LANCAMENTO.md`](RETOMAR_LANCAMENTO.md), que contém o estado, os links e os limites confirmados. Não trate documentos de continuidade antigos como estado atual.

## Estado atual confirmado

- Repositório: `chumikie/tsulipa-run`.
- Trabalhar somente na branch `release/index2-lancamento`.
- PR #34: aberto, em rascunho, base `main`, ainda não mesclado.
- Base desta entrega: `6a31065d5128a7492ddab7a130ee18f90279e8aa`, com CI aprovado. A entrega atual inclui os dois ajustes visuais autorizados descritos abaixo. Sempre consulte o head atual no GitHub antes de mexer.
- `main` continua em `47b1b702d68ee205c7a44fb7da13c12165f33db6`.
- Prévia Netlify: https://deploy-preview-34--tsulipa-run.netlify.app
- GitHub Actions: execução 40983812523 passou na base `6a31065d...`; conferir os checks da entrega atual. Netlify Preview: consulte o último status do deploy. Vercel: `Deployment was blocked`, intencional.

## Revisão visual e ajustes autorizados em 30/10

- A usuária aprovou a tela de abertura e a disposição dos botões nas capturas enviadas. Isso não comprova teste em celular físico.
- Banner do trio no hub: centralizado, limitado a 560 px, mantendo a proporção e o tamanho da abertura. A largura dos botões e do ranking permanece intacta.
- Star Gacha: removido somente o aviso extra “🔒 Entrar com Google”; mantidos “1 giro por dia”, cadeado no canto e exigência de login.
- A tela de abertura e os fluxos de autenticação/jogos não foram alterados.
- Próximo passo: a usuária revisa esses dois ajustes na prévia atualizada; nenhuma autorização de merge foi dada.

## O que fazer ao retomar

1. Confirme o head atual de `release/index2-lancamento`, o estado do PR #34 e os checks antes de editar.
2. A tarefa imediata é aguardar a revisão visual da usuária na prévia em celular real e computador. A tela de “Toque para começar” deve ficar limpa; os botões do hub só aparecem depois de iniciar. O ícone pequeno da TV fica no hub e abre a própria TV flutuante, sem outro cartão/janela ao redor.
3. A usuária pode pedir ajustes pontuais após testar. Nesse caso, edite apenas a branch autorizada, mantenha a estrutura dos jogos e valide os arquivos/testes afetados.
4. Agrupe qualquer correção autorizada em um único commit/push. Não repetir tarefas já concluídas nem criar commits apenas para “tentar” resolver checks antigos.
5. Ao encerrar uma alteração autorizada, atualize o documento de status e estas instruções no mesmo commit quando o contexto de retomada tiver mudado materialmente.

## Regras que não podem ser violadas

- **Nunca fazer merge do PR #34 ou #33.** A usuária revisa e faz o merge.
- **Nunca alterar `main`**, fechar/mesclar PRs ou reescrever histórico.
- Não ativar Vercel, não mudar configurações de deploy e não alterar `vercel.json`.
- Não criar branches, não apagar/renomear branches, especialmente as `brs48cr_*`.
- Não alterar Supabase, SQL, autenticação, RLS, RPCs, economia, fila ou multiplayer de produção sem autorização explícita.
- Supabase de produção `fsggtvgbyhchblyazgmt`: somente leitura nesta tarefa. Testes da sala online somente no projeto de homologação `hfzjoefnousiouiuchys`.
- Preservar todas as chaves locais `brs48cr_*`, os jogos e seus estados/saves.
- Não inventar aprovação, disponibilidade, testes físicos ou resultados. Diferenciar sempre GitHub Actions, Netlify e o status bloqueado da Vercel.
- Não dizer que o Karaoke está aberto ao público: a sala continua fechada pelo servidor.
- Evitar múltiplos pushes; cada um aciona builds/previews.

## Observações técnicas já resolvidas

- A tela de abertura não deve mostrar os botões da página inicial/hub antes do toque em “Começar”.
- TsuLiPa TV deve ser somente um pequeno ícone no hub. O pop-up é a TV em si, sem moldura/cartão adicional ao redor.
- O último commit já contém essas mudanças e testes de regressão; não reintroduzir a TV antiga nem a tela antiga.
- Sora e Karaoke carregam sob demanda em iframes independentes; preservar pausa de áudio/animação quando a aba fica oculta.
- A proteção do Karaoke online permanece no servidor. A janela de homologação está descrita em `RETOMAR_LANCAMENTO.md`.
- A suíte atual já passou no head confirmado. Não repetir a antiga instrução de corrigir os testes como se isso ainda estivesse pendente.

**Ponto de parada:** aguardar a avaliação da usuária no preview; fazer somente os ajustes que ela solicitar e parar antes do merge.
