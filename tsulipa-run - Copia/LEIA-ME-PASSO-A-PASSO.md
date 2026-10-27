# TsuLiPa Center Run! — Como colocar no ar (Vercel)

Este guia assume que você nunca fez isso. Vai levar uns 20–30 minutos.
Os nomes dos botões do Vercel e do GitHub podem mudar um pouco com o tempo; se algo estiver diferente, mande um print para a Claude que ela te guia.

## O que tem nesta pasta
- `index.html` — o jogo.
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` — ícone da aba do navegador e da tela inicial do celular.
- `og.png` — a imagem que aparece quando alguém compartilha o link (WhatsApp, Instagram, etc.).
- `api/` e `lib/` — o "cérebro" do ranking online (guarda e entrega as pontuações). Você não precisa mexer.
- `package.json` — arquivo de identificação do projeto.

> Importante: mantenha as pastas `api` e `lib` exatamente como estão.

---

## Parte 1 — Contas (grátis)
1. Crie uma conta no **GitHub** (github.com). É onde ficam guardados os arquivos do jogo.
2. Crie uma conta no **Vercel** (vercel.com), escolhendo "Continue with GitHub".

## Parte 2 — Enviar os arquivos para o GitHub
1. No GitHub, clique em **New repository**. Nome sugerido: `tsulipa-center-run`. Marque **Public** (ou Private, tanto faz) e clique em **Create repository**.
2. Na página do repositório novo, clique em **uploading an existing file**.
3. Descompacte este pacote no computador e **arraste todo o conteúdo** da pasta (incluindo as pastas `api` e `lib`) para a página. Confira que as pastas aparecem na lista.
4. Clique em **Commit changes**.

## Parte 3 — Publicar no Vercel
1. No Vercel, clique em **Add New… → Project**.
2. Escolha o repositório `tsulipa-center-run` e clique em **Import**.
3. Não precisa mudar nenhuma configuração. Clique em **Deploy**.
4. Quando terminar, o Vercel mostra o endereço do jogo (algo como `tsulipa-center-run.vercel.app`). O jogo já abre, mas o **ranking online ainda não funciona** (falta o banco de dados). Siga a Parte 4.

## Parte 4 — Banco de dados do ranking (sem conta para as jogadoras)
O banco é só seu (do administrador). Quem joga **não** precisa de conta: o jogo guarda um código aleatório no aparelho e usa o apelido que a pessoa digitar.

1. No painel do seu projeto no Vercel, procure **Storage** (ou **Marketplace**) e escolha **Upstash → Redis**. Crie um banco novo (o plano gratuito costuma bastar; confira os limites na tela de criação) e **conecte ao projeto**.
2. Ao conectar, o Vercel adiciona sozinho as variáveis do banco. Para conferir: **Settings → Environment Variables**. Deve haver `KV_REST_API_URL` e `KV_REST_API_TOKEN` (ou `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`). Qualquer um dos dois pares serve.
3. Ainda em **Environment Variables**, crie uma variável chamada **`SCORE_SECRET`**. O valor é uma frase longa e aleatória que só você conhece (mais de 40 caracteres, letras e números misturados). Não compartilhe.
4. Vá em **Deployments**, abra o menu (⋯) do último deploy e clique em **Redeploy**, para o jogo enxergar as novas variáveis.

## Parte 5 — Ajustar o endereço da imagem de prévia
No arquivo `index.html`, há 3 linhas com `https://SEU-PROJETO.vercel.app`. Troque por o endereço real do seu jogo.
Para editar direto no GitHub: abra o arquivo, clique no lápis, use **Ctrl+F** para achar `SEU-PROJETO`, ajuste e clique em **Commit changes** (o Vercel republica sozinho). Ou diga o endereço à Claude e peça o `index.html` pronto.

## Parte 6 — Testar
1. Abra o endereço no celular, jogue uma partida e perca.
2. Na tela final, toque em **Semana** e **Geral**. Seu nome deve aparecer no ranking depois de alguns segundos.
3. Se aparecer "Ranking online indisponível", confira: o banco está conectado? `SCORE_SECRET` existe? Fez o Redeploy?
4. Compartilhe o link no WhatsApp para ver se o título e a imagem de prévia aparecem. (Se não aparecer na primeira vez, o aplicativo pode estar guardando a versão antiga; teste com um link novo ou aguarde.)

---

## Como funciona (resumo)
- Ao começar a partida, o jogo recebe um "ingresso" do servidor. Ao terminar, envia pontuação e ingresso.
- O servidor confere: o ingresso é verdadeiro e novo (cada um vale uma vez)? A partida durou tempo suficiente para aquela pontuação? Se sim, grava no banco.
- Cada aparelho tem um código aleatório; o ranking guarda a **melhor** pontuação desse código. Dois apelidos iguais são permitidos.
- A semana vai de segunda a domingo (horário de Brasília) e zera sozinha; o ranking geral nunca zera.

## Limites (seja realista)
- Não há conta, então a pessoa que limpar os dados do navegador ou trocar de aparelho vira "uma jogadora nova". O recorde antigo dela continua no ranking, mas não é mais dela.
- Esta checagem dificulta trapaças simples, mas não impede alguém muito determinado. Para prêmios importantes, confira os primeiros colocados à mão.
- Apelidos impróprios: não há filtro automático. Para remover um nome, entre no painel do Upstash (Data Browser), procure as chaves que começam com `p:` (nome de cada jogadora) e apague a chave e a entrada correspondente nos rankings `lb:all` e `lb:w:...`. Peça ajuda à Claude se precisar.
- Se você mudar o nome do jogo no futuro, mantenha as chaves de dados (`brs48cr_...`) no `index.html`, senão as jogadoras perdem recordes salvos no aparelho.

## Dados pessoais
O jogo guarda apelido, pontuação, estrelas, personagem e um código aleatório do aparelho. Considere avisar isso no post de divulgação.
