# Pandeiros e pets na sala do Karaoke

Base aprovada: `e4a7ba5a06ea3d43e3c50035c63e190e8a6eb809`, na PR #49. Entrega de 31/10/2026.

## Experiência

O pandeiro da mesa permanece no mesmo lugar. Outro fica pendurado abaixo dos retratos à esquerda (x=248, y=292), fora do telão e das áreas dos rostos. Ambos chamam a mesma receita de ruído e notas do instrumento original. O novo pandeiro também balança e solta notinhas; cada um tem estado e cooldown próprios.

Ao tocar Chu, Koali ou Pucchi, aparecem olhos felizes ou de coração, mantendo as características de cada mascote. Permanecem o pulinho, os emojis e a vozinha anterior. Os pezinhos alternam durante a corridinha.

O pet escolhe um dos três Idols mais próximos da plateia, segue para perto de seus pés, faz uma pausa de 1,4 segundo com olhos de coração e retorna ao passeio original. O retorno acompanha a órbita em movimento, recalculando o desvio quando necessário. Os percursos passam pelos corredores laterais e respeitam uma área de folga ao redor da mesa. Não há teleporte ao clicar novamente ou retornar de uma aba suspensa.

Toques em áreas sobrepostas escolhem o rosto mais próximo; empates respeitam a ordem visual. Um intervalo de 450 ms evita repetição excessiva, e os emojis temporários são limitados. A preferência de movimento reduzido suaviza a velocidade e elimina o novo balanço/passinhos da visita.

Tudo usa o loop já existente do canvas. Não há novos timers, listeners de jogo, requisições, gravações ou mudanças em pontuação, tentativas, perfil e necessidades do Backstage Pet. O recorte mobile aprovado, os controles e a composição permanecem.

## Capturas

- [Visitas na sala no celular](mobile-visits.webp).
- [Visitas na sala no computador](desktop-visits.webp).
- [Métricas e interações verificadas](results.json).

Capturas com dados locais e animações em andamento, sem login real. Instantes, figurantes e poses podem variar.

## Verificação

- Validação estática e 13 suítes Node aprovadas.
- Testes do modelo a 30, 60 e 120 fps para os três pets: ida, pausa, retorno sem salto, velocidades, limites do recorte e desvio da mesa.
- Cobertos cooldown, retargeting sem teleporte, aba suspensa, movimento reduzido, plateia vazia e seleção do rosto mais próximo.
- Comparados os parâmetros de áudio dos dois pandeiros; renderizadas todas as expressões/estados de passinhos sem perder o estado do contexto do canvas.
- Chromium local em 390 e 1440 px: toque real nos dois instrumentos e em cada pet, expressão, deslocamento e retorno ao passeio. Também verificados início do ritmo, pistas por toque no celular, som, foto e retorno ao menu. Requisições externas bloqueadas.
- Geometria da sala, canvas, botões e barra de ritmo comparada à base aprovada, sem mudança de layout.
- O teste logado em iPhone físico continua sendo uma conferência manual complementar. Não houve alteração no banco nem consumo de tentativas online.

```sh
node tests/validate-games.js
node --test tests/*.test.js
QA_REACTIONS=1 QA_WIDTHS=390,1440 node tests/karaoke-mobile.browser.cjs /tmp/karaoke-reactions
```

O teste de navegador requer Playwright/Chromium. Seus acessores existem somente na resposta HTTP local, sem modificar os arquivos publicados da aplicação.
