# Idol⭐Battle! — proposta (Fase 4, 3º jogo novo) · 14/11/2026

Status: **proposta para o dono aprovar**. Nada implementado.

## Ideia em uma frase
Um **show de palco por turnos** na Star Arena: você escala uma **unit de 3 cards** do seu Álbum (os cards do Star⭐Gacha!) e disputa 3 rodadas — **Canto, Dança e Carisma** — contra uma unit rival. Ganha quem levar 2 das 3 rodadas.

## Os cards ganham atributos
Cada card é um Idol de verdade do site. Os atributos (1 a 10) saem do que essa pessoa já fez no jogo, em relação aos outros jogadores (percentil, recalculado pelo servidor):
- 🎤 **Canto**: melhor pontuação no Karaoke⭐Time!.
- 💃 **Dança**: recorde no Center⭐Run! (`best`) e quantos Centers fez.
- 💖 **Carisma**: corações e recados recebidos, e dias jogados.
- Cópias repetidas do mesmo card dão +1 no atributo mais alto (até +2). Assim o pó de estrela e as trocas passam a valer ainda mais.
- Quem não tem cards suficientes recebe uma **unit inicial** com Tsu, Lirika e Pati (cards do jogo, atributos médios), para ninguém ficar de fora.

## Como se joga
1. **Escalar a unit**: escolher 3 cards do Álbum.
2. **Ver o rival**: você vê os 3 Idols rivais, mas **não sabe em que rodada cada um entra**.
3. **Montar a ordem**: decidir qual card se apresenta em Canto, Dança e Carisma. Essa é a parte de estratégia: colocar o seu melhor contra onde você acha que o rival é fraco.
4. **Show**: as 3 rodadas acontecem no palco da arena, com a plateia, luzes e a pontuação de cada uma. Há uma pequena variação de "dia bom/dia ruim" (sorte, decidida no servidor), mas o atributo pesa mais.
5. **Resultado**: vitória ou derrota, e a foto da unit no palco para salvar (polaroid).

## Rivais
- **Rival do dia**: uma unit montada pelo servidor com cards de outros jogadores, igual para todo mundo no dia (como a pauta do Photo⭐Studio!). Dá para tentar até 5 vezes por dia.
- **Desafiar uma unit salva** (v2): cada pessoa pode deixar a sua unit salva na arena; outros jogadores desafiam a unit dela (assíncrono, ninguém precisa estar online). Quem defende ganha um ❤️ de "fã da arena" a cada vitória de defesa.

## Prêmio e economia
- **★5 por dia** na primeira vitória contra o rival do dia (mesma trava diária dos outros jogos).
- **Ranking semanal** de vitórias no Idol⭐News! (Top Idols da Arena).
- Nada é perdido ao perder: os cards não são gastos.

## Segurança
- O servidor calcula os atributos, sorteia o rival e resolve as rodadas. O navegador só envia a escolha da unit e a ordem.
- Só cards que você realmente tem no Álbum (`album_cards`/`private.cards_qtd`).
- Contas bloqueadas não aparecem nem como card rival.

## Versões
- **v1**: atributos dos cards, unit inicial, rival do dia (até 5 tentativas), show de 3 rodadas, polaroid e ★5/dia.
- **v2**: units salvas e desafio assíncrono entre jogadores + ranking semanal no Idol⭐News!.
- **v3**: torcida (levar flores do Bloom⭐Garden! ou um lightstick dá um pequeno bônus de Carisma), figurinos de palco.

## Decisões do dono
1. Atributos vindos dos **recordes reais** de cada jogador (Karaoke, Center, corações). Pode, ou prefere atributos sorteados fixos por card?
2. **Rival do dia** com até **5 tentativas** e **★5** na primeira vitória. Está bom?
3. Na v2, pode deixar a sua unit salva para os outros desafiarem (assíncrono)?
