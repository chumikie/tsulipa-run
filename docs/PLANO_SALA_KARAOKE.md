# Plano — sala do Karaoke⭐Time! menor e mais leve (14/11/2026)

Situação: a sala foi feita para ser **online e compartilhada** (fila de pedidos, vez no microfone, gente passeando e conversando).
Hoje o jogo é **solo**: os outros jogadores aparecem só como representação (NPCs). Quase tudo daquela época ainda roda.

Nada foi cortado ainda. Os números são **estimativas** (linhas que citam cada parte; uma linha pode contar em duas partes).

## O que existe hoje

| Parte | Onde | Tamanho aprox. | Para que serve hoje |
|---|---|---|---|
| Página inteira | `karaoke-time.html` | 404 KB (limite 450 KB) | um script interno de 354 KB |
| Fila de pedidos e cantores NPC | HTML (`krDemo*`, `KR_DEMO_*`) | ~26 KB | NPCs pedem música e cantam sozinhos entre os seus shows |
| Passeio e conversa dos NPCs | HTML (`krLounge*`) | ~20 KB | NPCs andam, sentam e conversam |
| Personalidades dos NPCs | `karaoke-room-personality.js` | 25 KB | tímido, extrovertido… decide o passeio |
| Microfone automático | `karaoke-room-auto-mic.js` | 10 KB | show de 15 s dos NPCs |
| Modo homologação | HTML (`krHomol*`, `?homol=1`) | ~11 KB | teste antigo da sala compartilhada |
| Vistas da janela | `karaoke-room-views.js` | 34 KB | 5 paisagens, dia e noite |
| Decoração (mesa, armário, monitor, pet) | HTML | ~11 KB | desenho da sala |
| Ponte com o site | `karaoke-online.js` | 15 KB | tentativas do dia, tickets e ranking — **manter** |
| Arena (tela do seu show) | `karaoke-arena.js` | 9 KB | **manter** |

## Proposta em 3 níveis (você escolhe)

1. **Limpeza sem mudar o que se vê** (~10–15 KB)
   - Tirar o modo homologação (`?homol=1`) e os ramos `krHomolConectado`.
   - Tirar a fila de pedidos (`KR_DEMO_QUEUE_LABELS`, `krDemoQueueRender`) que não aparece mais no solo.
2. **Sala solo com plateia parada** (~60–80 KB a menos, entre HTML e arquivos)
   - Os jogadores continuam na sala, mas **sentados na plateia**, com reações ao seu show (palmas, lightstick, balões).
   - Sai: passeio, conversa, personalidades e o microfone automático dos NPCs.
   - A sala fica mais calma e mais leve no celular (menos desenho por quadro).
3. **Sala compacta** (nível 2 + visual)
   - No celular, palco em primeiro plano, com 6 a 8 jogadores visíveis em vez de todos.
   - "Ver sala inteira" continua mostrando todo mundo.
   - Vistas da janela: 2 por semana em vez de 5 (economiza ~20 KB), ou ficam as 5 se você gosta.

## Cuidados
- O CI tem 3 máquinas só para a sala (`browser-karaoke-room`): os testes de passeio e microfone automático saem junto com o código.
- Saves `brs48cr_*` e chaves `kt_*` não mudam.
- Tudo numa branch nova, com PR separado da #88.

## Decisão do dono (14/11)
- **Sai:** a fila de pedidos do microfone (já estava escondida; código e textos removidos, ~5 KB).
- **Fica:** passeio, conversas e personalidades dos jogadores, para a sala continuar viva mesmo offline.
- Microfone automático dos NPCs e modo homologação: ainda sem decisão, continuam.
