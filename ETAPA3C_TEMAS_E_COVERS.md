# ETAPA 3C — Músicas e covers por tema: identidade original preservada

**Decisão do criador (29/10/2026): NÃO renomear os 12 temas sazonais.** Os nomes originais do jogo fazem parte da identidade do TsuLiPa⭐World. A sugestão anterior de "Jardim de Luzes", "Noite das Estrelas" etc. foi **rejeitada**, não deve ser implementada nem oferecida como decisão pendente.

**Estado atual:** apenas pesquisa/curadoria. Nenhuma alteração em `index2.html`, `TEMA_INFO`, `TEMA_MUSICA`, datas, saves ou Supabase.

## Fonte confiável recebida do criador
Playlist: [TsuLiPa — Participações (Patiliri)](https://www.youtube.com/playlist?list=PLNWt7c7jhJIioP7LttHhxfi19dM-iHn7v). A descrição informada é "Todos os vídeos que pelo menos 1 membro do TsuLiPa aparece!". A playlist contém 151 vídeos; o criador colou uma **parte da listagem** no chat. A associação editorial por título abaixo é baseada **nessa lista fornecida pelo criador**; não comprova que Tsu, Lirika e Pati participaram juntas de cada vídeo, nem inclui URLs individuais verificadas.

## Cruzamento dos 12 nomes originais com os covers que aparecem no trecho enviado
| Tema original (fica igual) | Música que o código mostra hoje | Evidência textual da playlist | Curadoria / decisão |
|---|---|---|---|
| 🎄 Natal | Manatsu no Christmas Rose | `[Especial de Véspera de Natal] Manatsu no Christmas Rose [Tea Party]` | Vídeo encontrado no trecho, não explicitamente marcado `[TsuLiPa]`. Manter associação até revisar quem participa. |
| 🥂 Ano Novo | Wish You Happiness!! | `[Unit Especial de Ano Novo] Wish You Hapiness!! (IDOLM@STER) [TsuLiPa]` | **Correspondência direta de TsuLiPa** no título (diferença de grafia `Hapiness/Happiness` a conferir). Manter nome do tema. |
| 🌞 Verão | Gomen ne, SUMMER | `BRS48 - Gomen ne, SUMMER` | Encontrado, mas título sem identificação da unit. Manter, revisar integrantes. |
| 💝 Valentine | Valentine Kiss | `BRS48 - Valentine Kiss [TsuLiPa]` | **Correspondência direta de TsuLiPa** no título. Perfeito para manter. |
| 🍁 Outono | Sugaring Off Party! | `[Unit Especial de Outono] Sugaring Off Party!` | Encontrado, unit não explicitamente TsuLiPa. Manter até conferir. |
| 🌸 Sakura | Nagori Zakura | Não localizado no **trecho fornecido** | Playlist tem 151 vídeos; não afirmar inexistência. Manter até receber/verificar trecho restante. |
| ❄️ Inverno | Teion Yakedo | `[Unit Especial de Inverno] Teion Yakedo (Tsubaki Factory)` | Encontrado, participantes não especificados no título. |
| 🎋 Tanabata | Hello, Hoshi o Kazoete | `BRS48 - Hello, Hoshi o Kazoete [H-K-L αβic Unit]` | Encontrado; outra unit identificada. Verificar quem aparece e se o vínculo com TsuLiPa faz sentido. |
| 🌼 Primavera | Blooming♡Blooming | `[Unit Especial de Primavera] Blooming♡Blooming [Lumière]` | Encontrado, nome de outra unit. Revisar participantes antes de manter referência TsuLiPa. |
| 🎃 Halloween | Bad∞End∞Night | `[Unit Especial de Halloween] Bad∞End∞Night`; **`BRS48 - Love Pulsar (Love Live) [TsuLiPa]`** | Decisão editorial sugerida: **manter o tema "Halloween"** e **avaliar trocar apenas a música exibida para "Love Pulsar"**. Não alterar até aprovação da associação e URL individual. |
| 🎈 Dia das Crianças | Visionary | `[Unit Especial de Dia das Crianças] Visionary` | Encontrado, integrantes não detalhados no título. |
| 🎂 Aniversário do BRS48 | 26 Estados e 1 Distrito | `BRS48 - 26 Estados e 1 Distrito [Especial Aniversário de 6 anos]` e `BRS48 - Aitakatta [TsuLiPa] [Especial Aniversário de 7 anos]` | Tema original permanece. **Aitakatta** é uma alternativa com TsuLiPa explicitamente identificado; avaliar com criador antes de trocar a música associada. |

## Outros títulos claramente associados à unit TsuLiPa no trecho fornecido
- `BRS48 - Love Pulsar (Love Live) [TsuLiPa]`
- `BRS48 - Valentine Kiss [TsuLiPa]`
- `[Unit Especial de Ano Novo] Wish You Hapiness!! [TsuLiPa]`
- `BRS48 - Aitakatta [TsuLiPa] [Especial Aniversário de 7 anos]`
- `TsuLiPa - Cheeky Cheeky (Kawaguchi Yurina feat. Ganbareruya)`
- `BRS48 - Monster (Arashi) [TsuLiPa & Eiko]`

O fato de um vídeo não ter `[TsuLiPa]` no título **não exclui a participação de alguma integrante**: a própria playlist se declara coletânea de participações individuais ou em grupo. Categorizar como "unit por verificar", e não como "sem TsuLiPa".

## Plano mínimo aprovado para o futuro: link do cover, nunca nome genérico substituto
1. **Manter exatamente** os nomes públicos: Natal, Ano Novo, Verão, Valentine, Outono, Sakura, Inverno, Tanabata, Primavera, Halloween, Dia das Crianças, Aniversário do BRS48.
2. Separar metadados do tema: `nome` original + `titulo_video` + `video_url` exato + `tipo_participacao` (trio, integrante, colaboração, BRS48) + `verificado`.
3. O chip pode mostrar `🎵 Cover: [título]` e link `▶ Assistir` **somente depois de confirmar o vídeo real**. Nenhum autoplay, sem inventar URL ou atribuir covers de forma incorreta.
4. Manter as chaves existentes em `TEMAS`, `TEMA_INFO`, `TEMA_MUSICA`; não renomear `tema_halloween`, `roupa_sakura`, nem outras referências dos saves. A eventual troca de **música associada** é diferente de renomear o **tema**.
5. Os vídeos na playlist não foram extraídos com IDs individuais nesta etapa; a lista textual fornecida pelo criador fundamenta a correspondência por título, mas não uma URL específica.

## Novo tema adicional: Dia da Paz
A ideia **permanece como proposta de conteúdo novo**, não substitui outro tema.
- Nome: **Dia da Paz** (preservar identidade direta, sem nome alternativo obrigatório).
- Data sugerida: **21 de setembro**, antes da Primavera começar em 22/09.
- Música desejada: **Gosenfu no Tasuki** (vídeo específico ainda não localizado no trecho recebido).
- Decoração: branco/azul suave, fitas, pombinhas e animações leves; um look **White Peace Stage** opcional para o trio e participantes. Não vestir ninguém automaticamente.
- Após verificar os covers e o calendário, decidir separadamente se implementar. Nenhum novo tema sazonal foi ativado.

## Próximo passo de curadoria
O texto já colado basta para começar o cruzamento. Quando for conveniente, o restante dos 151 vídeos pode ser colado como texto, especialmente para conferir `Nagori Zakura` e `Gosenfu no Tasuki`. Não é necessário copiar URLs individualmente até decidirmos quais vídeos vincular.
