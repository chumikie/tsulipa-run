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

# Segunda leva (13/11/2026)

Esta leva é mais curta: os seis jogos já foram trabalhados em PRs anteriores, e o foco aqui é o que falta.

> **Correção (13/11):** esta leva foi feita olhando só o começo de cada arquivo e marcou como "falta" coisas que já existem. Revisado: a Zipper⭐Shop! já tem o **Look do dia** (objetivo diário com foto), e o Backstage⭐Pet! já sente saudade, comemora a sua volta e comenta os seus recordes. Antes de mexer em Center, Karaoke e Sora, refazer o raio-X deles lendo o código por inteiro.

| Jogo | Profundidade | Integração | Técnica | Sensação | Resumo |
|---|---|---|---|---|---|
| Center⭐Run! | 4 | 4 | 4 | 5 | O mais redondo; falta motivo para jogar "só mais uma" no meio da semana |
| Karaoke⭐Time! | 4 | 4 | 3 | 5 | O mais rico, mas o ritmo ainda tem atraso e o arquivo está no limite de tamanho |
| Sora⭐Jump! | 3 | 3 | 3 | 4 | Bom de jogar; recompensa e anti-cheat ainda pendentes (PR #74) |
| Backstage⭐Pet! | 4 | 4 | 3 | 4 | Bom gancho diário, já reage à sua presença e aos recordes |
| Moon⭐Duo! | 2 | 4 | 4 | 4 | A única peça social, mas é um "editor de foto" sem objetivo |
| Zipper⭐Shop! | 3 | 5 | 4 | 4 | Loja com Look do dia; ok por enquanto |

## Center⭐Run!
- **Forte:** corrida madura, cartas e power-ups, ranking semanal, polaroid.
- **Falta:** um objetivo curto do dia. Os desafios existem, mas aparecem pouco no hub.
- **Melhoria:** desafio do dia em destaque (ex.: "pegue 3 Fever numa corrida") ligado às Missões e ao mapa (balão sobre o palco).
- **Feito (13/11):** as missões do dia do Center aparecem no mapa (🎯 no Star Stage e balão com progresso sobre o Center⭐Run!).

## Karaoke⭐Time!
- **Forte:** sala, músicas da semana, figurinos, polaroid e online.
- **Falta:** o timing do ritmo, que ainda tem um atraso percebido, e folga no tamanho do `karaoke-time.html` (PR #86 resolve).
- **Melhoria:** calibração de atraso (toque no compasso ao entrar) e aviso de "Perfeito / Bom" mais claro.

## Sora⭐Jump!
- **Forte:** subida vertical com cenários e segredo do disco voador.
- **Falta:** o prêmio de 500 m do PR #74 depende de anti-cheat (tempo mínimo realista e validação no servidor).
- **Melhoria:** fechar o anti-cheat e aplicar o PR #74; depois, cenários por estação ligados ao tema do momento.
- **Feito (13/11):** céu por estação (primavera, verão, outono, inverno no hemisfério sul, horário de Brasília) e pelo tema (Halloween, Natal): pétalas, brilhos, folhas, neve, morceguinhos — só fundo, sem efeito no jogo. Teste: `sora-jump.html?estacao=outono`.

## Backstage⭐Pet!
- **Forte:** necessidades que caem com o tempo, pets dos membros e pet montável, sincronização na nuvem.
- **Já tem:** saudade quando você some, reencontro quando volta, comentários sobre recordes.
- **Melhoria:** passear no mapa da cidade (**feito**: o pet segue o dono nas ruas) e, mais tarde, ajudar no Bloom⭐Garden!.

## Moon⭐Duo!
- **Forte:** cenas em dupla com Idols reais (`duo_convidado`), poses, falas e lojinha de extras.
- **Feito (13/11):** "Pedido de cena do dia" em `duo-pedido.js` (cena e cenário livres do dia; cumpre ao salvar a foto; ainda sem prêmio no banco).
- **Melhoria seguinte:** dar um prêmio pequeno pelo pedido cumprido (precisa de banco) e ligar ao Photo⭐Studio!.

## Zipper⭐Shop!
- **Forte:** atendimento diário pelo trio, provador, compras reais (`comprar_visual`).
- **Já tem:** Look do dia (combinar o visual do dia e tirar foto).
- **Melhoria:** nenhuma urgente.

## Conclusão da Fase 2
Os mais fracos são **Gacha, Moon⭐Duo! e Café**. A ordem da Fase 3 continua: Gacha, Café, Handshake; Moon⭐Duo! entra junto com o Photo⭐Studio!.
