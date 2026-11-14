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

- Na Praça, quando um fã conhecido está próximo e há Pet visível, o Pet demonstra atenção durante a pausa. Fora do encontro, não aparece reação adicional; com movimento reduzido, o símbolo fica estático.

## ML1.8-C — sofá e lembranças mais naturais (14/11)

- **Sofá:** a almofada mostra uma sombra/dobra discreta no ponto em que o quadril se apoia ao sentar, descansar ou conviver. A compressão segue a mesma interpolação de 24 quadros e desaparece ao levantar, sem modificar posição, pernas ou roupa do Idol.
- **Lembranças:** durante o olhar já existente, a flor ou fotografia real da sessão recebe um reflexo breve. A decoração acompanha o deslocamento atual da estante.
- **Privacidade:** fotografia só recebe reflexo se a imagem local voluntária da conta estiver disponível; sem a imagem, não é simulada outra foto. A função de foto mantém o cache e a limpeza existentes.
- **Prioridades:** sono, cuidados, telefone, minijogos, arrumação e movimento reduzido mantêm suas restrições; nenhum timer, save, som, RPC, SQL ou recompensa.
- **Testes:** asserts específicos para compressão, limites do sofá, movimento reduzido, ausência de fotos e estante deslocada. Teste visual no Safari/iPhone físico e login real seguem pendentes.
