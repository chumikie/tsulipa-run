# Recorte suave da sala no celular — PR #49

Base aprovada: `5e8c90e0ecae45557b16a5f30479a82e117f7c8f`. Refinamento de 31/10/2026, apenas para o Karaoke integrado em larguras até 620 px.

- Janela central de 864 × 540 unidades sobre o canvas original de 960 × 540: recorte de 48 unidades por lateral, com ampliação uniforme de 11,1%. A altura inteira do desenho permanece visível.
- O limite é conservador: os lugares da plateia ficam entre x=160 e x=800, e a caminhada do próprio Idol entre x=120 e x=840. O sprite em escala máxima 2,3 ocupa até 31 unidades locais para fora de cada extremo espelhado; assim, seu envelope completo permanece entre x=48,7 e x=911,3, dentro do recorte [48, 912]. Esse envelope inclui todos os quadros/poses do sprite em cache.
- Som e câmera são os mesmos botões, movidos para uma faixa com alvos de 44 px no alto à direita da moldura, fora da imagem. Não cobrem o telão ou a plateia. O som continua alternando e a câmera continua exportando o PNG completo original.
- Durante o jogo, o botão existente alterna entre o recorte suave e a sala inteira. Os controles e as regras do ritmo não foram substituídos.
- Abaixo/ acima do limite de 620 px, `karaoke-mobile.js` move/restaura os nós originais usando marcadores. Não duplica botões ou listeners, nem altera o desenho, posições ou o mapeamento de coordenadas do canvas.
- O CSS da página principal, cabeçalho, barra de ritmo e composição no computador não foram editados nesta etapa.

## Evidência e verificação

- [Celular: antes à esquerda, depois à direita](mobile-comparison.webp).
- [Computador: antes à esquerda, depois à direita](desktop-comparison.webp).
- [Métricas da base](before-results.json) e [métricas do recorte](after-results.json).

Capturas com dados locais e animações em instantes diferentes; nomes e formações podem variar com o sorteio local. Nenhuma conta real foi utilizada.

Validação estática, sintaxe do novo adaptador e 12 suítes Node. QA em Chromium local em 320, 390, 430, 844 e 1440 px: limites do recorte e dos sprites, proporções, faixa dos botões, toque nas quatro pistas após o recorte, alternância sala inteira/recorte, som e exportação da foto. Também verificado o retorno a computador e celular sem nós duplicados, além da volta ao Center.

Comparação com a base em 1440 px confirma cena, canvas e botões nas posições e dimensões originais. A barra de ritmo anterior à sala mantém suas métricas no celular. Requisições externas são bloqueadas no teste. Não houve escrita no banco ou consumo de tentativas online. A conferência logada em iPhone físico permanece uma validação manual complementar; WebKit não está disponível neste ambiente.

```sh
node tests/validate-games.js
node --check karaoke-mobile.js
node --test tests/*.test.js
node tests/karaoke-mobile.browser.cjs /tmp/karaoke-crop-after
QA_BASELINE=1 QA_BASE_REF=5e8c90e0ecae45557b16a5f30479a82e117f7c8f QA_WIDTHS=390,1440 node tests/karaoke-mobile.browser.cjs /tmp/karaoke-crop-before
```

O teste requer Playwright/Chromium. Os acessores e a abertura com fixtures são inseridos exclusivamente na resposta HTTP do servidor local; não existem nos arquivos da aplicação.
