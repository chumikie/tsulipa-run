# Raio-X dos jogos — Fase 2 (13/11/2026)

Notas de 1 a 5. Critérios: **Profundidade** (decisão, progressão, motivo para voltar), **Integração** (conversa com o resto do mundo), **Técnica** (celular, servidor, código), **Sensação** (som, animação, resultado).

Primeira leva: Café, Handshake e Gacha, os candidatos a "muito básicos". Os outros jogos entram na segunda leva.

| Jogo | Profundidade | Integração | Técnica | Sensação | Resumo |
|---|---|---|---|---|---|
| Happy⭐Cafe! | 2 | 3 | 4 | 4 | Bonito e estável, mas é só "copiar o pedido" mais rápido |
| Handshake⭐Event! | 3 | 4 | 4 | 4 | A ideia de memória é boa, mas a partida acaba cedo e é sempre igual |
| Star⭐Gacha! | 1 | 2 | 3 | 3 | Um toque por dia, sem escolha, e os cards não servem para nada |

---

## Happy⭐Cafe! (`cafe.js`)

**Como funciona hoje:** um cliente por vez pede uma bebida em camadas (base, cobertura, enfeite e, às vezes, um docinho). Você monta e serve antes de a paciência acabar. São 3 vidas, e a paciência cai a cada cliente até um mínimo de cerca de 7 s. Pedido perfeito libera um cartão no Caderno do café. Já existe o modo validado pelo servidor e a ligação com o Handshake (fã que reencontra você).

**Pontos fracos:**
- Não há decisão. A resposta certa está escrita no balão: é só copiar, e a dificuldade vem apenas do tempo.
- A progressão é só visual, e o Caderno fica salvo apenas no aparelho, então se perde ao trocar de celular.
- Toda partida é igual: mesmo balcão e mesmo ritmo.

**Melhorias de maior impacto:**
1. **Dois ou três clientes ao mesmo tempo, com paciências diferentes.** Isso cria a decisão "quem eu atendo primeiro?", que é o coração de jogos de café, e reaproveita o desenho atual.
2. **Gorjeta e combo:** servir rápido e em sequência dá bônus, e um cliente VIP (um membro do BRS48) pede a "receita assinatura" e paga em dobro.
3. **Caderno salvo na conta** e, mais tarde, ingredientes vindos do Bloom⭐Garden!.

## Handshake⭐Event! (`handshake.js`)

**Como funciona hoje:** uma fila de fãs (de 3 a 6) diz o nome e o presente favorito; depois eles voltam embaralhados e você tem de 7 s a 4 s para lembrar o presente. São 5 rodadas, e o Hype sobe com os acertos e cai com os erros. As respostas são definidas pelo servidor. Tem super fã, fãs que lembram de você e prêmio diário (ticket do Karaoke ou item do pet).

**Pontos fracos:**
- A partida termina sempre na 5ª rodada, então quem joga bem não tem para onde crescer.
- Cada fã guarda uma única informação (o presente), o que deixa a memória fácil depois de algumas partidas.
- O "jeito" do fã (animado, tímido…) muda só o texto e não muda a jogada.

**Melhorias de maior impacto:**
1. **Modo sem fim depois da 5ª rodada** ("hora extra"), com recorde, para quem quer ir longe.
2. **Fãs com dois detalhes a partir da rodada 3** (presente + cor do lightstick, ou presente + pose de foto), e o jeito passa a valer: o fã tímido fala mais baixo (o texto some mais rápido) e o animado repete.
3. **Presentes vindos do mundo:** flores do Bloom⭐Garden! e docinhos do Café como itens que você pode levar para a fila.

## Star⭐Gacha! (`gacha.js`)

**Como funciona hoje:** um giro por dia. O prêmio é um ticket, estrelas, um bônus (Ímã, Escudo ou Fever) ou nada, e a cápsula traz o card de um Idol do site, que vai para "últimos cards". O resultado vem do servidor (`gacha_girar`).

**Pontos fracos:**
- Não há nenhuma escolha: é um botão por dia.
- O resultado "nada" frustra justamente no único momento do dia.
- Os cards não têm uso nem coleção para completar.

**Melhorias de maior impacto:**
1. **Álbum com coleções** (por exemplo "TsuLiPa", "Team S", "Aniversário"): completar uma página dá um prêmio, e cards repetidos viram "pó de estrela" para trocar por um card que falta.
2. **Garantia (pity):** a cada 7 giros sem prêmio, o próximo é garantido. O "nada" deixa de ser punição.
3. **Os cards ganham função:** um bônus pequeno nos jogos quando o card do Idol está "equipado", e depois são a base do Idol⭐Battle!.

---

## Ordem sugerida para a Fase 3

1. **Gacha:** é o mais fraco e o que destrava o Battle.
2. **Café:** vários clientes ao mesmo tempo é a mudança que mais transforma.
3. **Handshake:** hora extra e fãs com dois detalhes são mudanças pequenas.

Segunda leva do raio-X: Center⭐Run!, Karaoke⭐Time!, Sora⭐Jump!, Backstage⭐Pet!, Moon⭐Duo! e Zipper⭐Shop!.
