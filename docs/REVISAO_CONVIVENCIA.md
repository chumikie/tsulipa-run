# Revisão do mapa e do Camarim

A branch feat/mapa-mobile-leitura-20261114 reúne os atalhos móveis, objetos nas mãos, reencontros na Praça e lembranças interativas na estante.

Em Conviver, após uma pausa, Idol e Pet inclinam discretamente o corpo em direção às lembranças e retornam à pose. O gesto depende de uma lembrança da sessão. Cuidados, sono, telefone e arrumação têm prioridade. Movimento reduzido desliga o gesto.

## Integração proposta

A PR #88 está em 400fa8a. A branch de melhorias parte desse histórico. Revisar o conjunto antes de decidir incorporá-lo à PR #88 ou publicá-lo numa entrega posterior.

A prévia Vercel consultada está em a40eeb5 e não representa a versão final da PR nem estas melhorias.

## Validação pendente

- Conferir mapa e Camarim em 320×640 e 390×844.
- Conferir Safari no iPhone e as quatro personalidades de Pet.
- Conferir navegação entre Jardim, Camarim, Momentos e Hub.
- Validar Battle, Jardim e Arena com conta real, incluindo repetição de ações e limites de recompensas.
- Autorizar a versão exata a ser usada na atualização da prévia.

As verificações automatizadas usam dados simulados. A reversão da interface não desfaz recompensas já gravadas.

## Microcenas de atividades — entrega incremental

- Jardim: o objeto nas mãos acompanha o fato confirmado (sementes ao plantar, regador ao regar, flor ao colher).
- Café: vapor discreto na xícara; Jardim: gotinhas ao regar e um brilho breve nas outras duas etapas. Apenas na lembrança confirmada do jogador, nunca atribuídos a outros avatares.
- Em movimento reduzido, o objeto permanece estático; sem novos timers, saves, pontuações, RPCs, inventário ou sons.
- Botões de lembranças do Camarim com alvos de 48 px e moldura Polaroid; contraste revisado no tema escuro, incluindo 320 px.
- Os testes com Canvas simulado validam as três ações do Jardim. Safari e login real continuam pendentes.
