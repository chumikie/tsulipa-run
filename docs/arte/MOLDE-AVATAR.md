# Molde das peças do avatar (para quem vai desenhar)

Desde 27/11/2026 o TsuLiPa⭐World monta o Idol a partir de **peças desenhadas à mão**, empilhadas como no Charat. O motor é `tw-avatar-camadas.js`. Enquanto uma peça não existe, o jogo usa o desenho atual (o da main) para aquele avatar, então dá para entregar a arte aos poucos.

## 1. A folha

- Toda peça é um **PNG transparente de 768 × 1024 px**. O jogo também lê SVG.
- O molde é `docs/arte/molde-avatar.svg` (ou o `.png` ao lado). Use-o como camada de fundo no Procreate, Ibis Paint, Clip Studio ou Krita e desenhe cada peça **na posição em que ela fica no corpo**, sem recortar a folha.
- A escala é de 16 px por unidade do jogo. A caixa tracejada (30 × 44 unidades) é a régua de colisão: os pés pisam na linha "chão".
- A faixa rosa no topo serve para orelhas, coques e chapéus.
- Se possível, desenhe em 1536 × 2048 (o dobro) e exporte em 768 × 1024.

## 2. Cor que o jogador escolhe ("tinta")

O jogador escolhe a cor do cabelo, da pele, dos olhos, da roupa e das meias. Para uma peça servir para qualquer cor:

- Desenhe as partes pintáveis **em tons de cinza**: preenchimento cinza bem claro (por volta de `#ECECEC`), sombras em cinza médio e o contorno em cinza escuro. O jogo multiplica o cinza pela cor escolhida, então a sombra e o contorno ficam no tom certo.
- O que **não** deve mudar de cor (branco do olho, brilhos, laço azul dos coques, gravata, sapato) vai num **segundo arquivo**, com o mesmo nome terminado em `-linha`. Ele é desenhado por cima, com as cores de verdade.

| Peça | Recebe a cor de |
| --- | --- |
| `cabeloTras/*`, `cabeloFrente/*`, `detalhe/*`, `rosto/sobrancelha/*` | cabelo |
| `corpo/padrao` | pele |
| `rosto/olho/*` (íris) | olhos |
| `roupa/*` | cor da roupa |
| `pernas/meias` | meias |
| `pernas/sapatos`, `baixo/*`, `rosto/boca/*`, `rosto/bochecha/*`, `acessorio/*`, `oculos/*` | nenhuma (cores finais) |

## 3. Ordem das camadas (de trás para a frente)

1. `detalhe/coques` (fica atrás da cabeça)
2. `cabeloTras/<corte>`
3. `corpo/padrao` (cabeça, pescoço, braços e pernas)
4. `pernas/meias`
5. `pernas/sapatos`
6. `baixo/saia` ou `baixo/bermuda`
7. `roupa/<look>` (o uniforme é `roupa/uniforme`)
8. `rosto/olho/<olho>`
9. `rosto/bochecha/<bochecha>`
10. `rosto/boca/<boca>`
11. `rosto/sobrancelha/<sobrancelha>`
12. `detalhe/<gato | elfo | olheiras | chifres>`
13. `cabeloFrente/<franja>`
14. `oculos/<óculos>`
15. `acessorio/<acessório>`

## 4. Expressões

O jogo usa sete expressões. A neutra é o arquivo sem sufixo; as outras repetem o nome com `@` e o número:

| Nº | Expressão | Arquivos |
| --- | --- | --- |
| 0 | neutra | `rosto/olho/padrao`, `rosto/boca/padrao` |
| 1 | esforço (> <) | `...@1` |
| 2 | feliz (olhos fechados, sorriso) | `...@2` |
| 3 | piscadinha | `...@3` |
| 4 | surpresa | `...@4` |
| 5 | choro | `...@5` |
| 6 | apaixonada | `...@6` |

Se faltar a expressão pedida, o avatar inteiro usa o desenho atual naquele momento, sem misturar estilos.

## 5. Lista completa de peças do editor

O nome do arquivo é o valor salvo no perfil; "padrão" é o valor vazio.

- **Corpo:** `corpo/padrao`, `pernas/meias`, `pernas/sapatos`
- **Parte de baixo:** `baixo/saia`, `baixo/bermuda`
- **Cabelo de trás (15):** `curto`, `pixie`, `onduladom`, `onduladom2`, `onduladof`, `chanel`, `longo`, `marias`, `rabo`, `cacheado`, `lateral`, `trancas`, `coque`, `princesa`, `hime`
- **Franja (12):** `bagunca`, `reta`, `lateral`, `espetada`, `arcoiris`, `ondulada`, `risca`, `repicada`, `cortina`, `curta`, `pontas`, `cacheada`
- **Detalhe (5):** `coques`, `gato`, `elfo`, `olheiras`, `chifres`
- **Olhos (9 × 7 expressões):** `padrao`, `redondo`, `brilhante`, `pontinho`, `gatinho`, `sereno`, `estrela`, `cilios`, `gotinha`
- **Bocas (8 × 7 expressões):** `padrao`, `sorriso`, `gato`, `aberta`, `dentinho`, `lingua`, `triangulo`, `biquinho`
- **Bochechas (5):** `padrao`, `sem`, `forte`, `sardas`, `estrelinha`
- **Sobrancelhas (6):** `padrao`, `fina`, `cheia`, `arqueada`, `preocupada`, `decidida`
- **Acessórios (7):** `presilhas`, `fones`, `boina`, `bandaid`, `coala`, `capitao`, `tiara`
- **Looks (16):** `uniforme`, `seifuku`, `estrelado`, `y2k`, `zipper`, `sweet`, `citypop`, `cr_fever`, `cr_ima`, `cr_mega`, `cr_alien`, `cr_center`, `cr_solo`, `cr_capitao`, `cr_ace`, `cr_kami`
- **Ainda fora do motor:** mecha bicolor, poses de foto (V, tchau, coração, microfone, banzai, luz, nyan), sentar no Camarim e vista de lado. Eles continuam no desenho atual e entram numa segunda etapa, com folhas de pose próprias.

### Prioridade sugerida

1. O trio no uniforme, com as peças de que ele precisa: corpo, meias, sapatos, saia, bermuda, uniforme, os cortes `pixie`, `chanel` e `curto`, as franjas `bagunca` e `reta`, os detalhes `gato` e `coques`, e olho, boca, bochecha e sobrancelha padrão nas 7 expressões.
2. O resto dos cabelos e rostos do editor.
3. Os looks de palco (Sweet, Zipper, Estrelado…) e os acessórios.
4. As folhas de pose (Studio, Camarim) e a vista de lado.

## 6. Como entregar e conferir

1. Salve os arquivos com os nomes acima numa pasta, por exemplo `arte/avatar/oficial/cabeloFrente/reta.png`.
2. Registre a pasta num `pacote.js` igual ao de `arte/avatar/prototipo/pacote.js`.
3. Abra o jogo com `?arte=oficial` no fim do endereço. Só essa aba usa as peças novas; quem joga normalmente não vê nada.
4. Para ver o que ainda falta para um avatar: `TWCamadas.pecasFaltando(CH[0])` no console.

As peças de `arte/avatar/prototipo/` são **provisórias**: formas simples que só provam o encaixe e a pintura de cor. Não são a arte do jogo.
