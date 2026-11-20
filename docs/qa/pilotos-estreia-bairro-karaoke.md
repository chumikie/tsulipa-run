# Pilotos de estreia, bairro e Karaoke

## Estreia no TsuPhone

Abra o site como visitante em um perfil novo do navegador. Convide cinco ou seis pessoas que ainda não jogaram. Peça que explorem por conta própria e observe se encontram uma atividade e chegam ao resultado. Registre o primeiro atalho escolhido, pontos de hesitação e se a pessoa precisou de ajuda.

Na mesma aba, o console expõe `TW_CELULAR.estreiaMedidas()`. Os campos `escolhaMs`, `inicioMs` e `conclusaoMs` são relativos à primeira exibição dos atalhos. O início corresponde à partida ou ao clique do obturador. A conclusão corresponde ao fim da corrida ou à captura bem-sucedida. Valores nulos indicam etapas ainda pendentes. Se a pessoa mudar de ideia, o relatório usa a última rota escolhida. As medidas ficam em memória até a página fechar ou recarregar.

## Duas semanas de bairro

Use a versão da #117 após a suíte passar, incluindo a verificação de cache. Valide em horários de Brasília e faça o piloto com as mesmas pessoas nas duas semanas.

| Semana em curso | Pauta | Desfecho a conferir |
|---|---|---|
| 15 a 21/11 | Passarinho na Praça. Aprender o gesto do Jardim das Nuvens e voltar ao painel. | 22/11, com caminho do Hoje e do painel para o Idol⭐News!. |
| 22 a 28/11 | Gatinho da Arena. Aprender o gesto do Star Stage e voltar ao painel. | 29/11, incluindo recado no Chat e selo no Caderninho. |

Em cada ciclo, conte quem abriu o painel pelo Hoje, quem tentou aprender o gesto, quem o realizou e quem voltou para ler o desfecho. Registre separadamente quem encontrou uma atividade que pede conta. Em prévia, use relógio de teste para conferir a virada de domingo com e sem gesto realizado. O parâmetro `?bagunca_previa=1` serve para conferir a cena, e a marcação de leitura deve ser validada no fluxo normal.

## Karaoke em dispositivos físicos

Conferir Safari em iPhone e Chrome em Android. Para cada aparelho, fazer um show no alto-falante e outro com fone Bluetooth, anotando a saída de áudio, o ajuste em milissegundos, o resultado e se a pessoa escolheu repetir a música. Na versão da #117, testar também as oito batidas de “Medir sozinho”. Repetir a calibração ao trocar de saída. No resultado, anotar toques adiantados, atrasados e notas perdidas. Comparar a mesma música antes e depois de ajustar o timing.

Durante um show, trocar de aba e voltar. Conferir a retomada da música e das notas, a pontuação e a foto completa no meio do show. Testar a volta ao TsuPhone. Registrar o primeiro show concluído por pessoa e se houve uma segunda execução voluntária. Usar essas observações para decidir o formato do ensaio de visitante.

## Continuidade entre atividades

Com conta, salvar um look que combine com o tema e abrir o Studio pelo atalho da Loja. Tirar uma foto, abrir o Duo e, com um Pet ativo, guardar uma foto do Studio e abrir Momentos no Camarim. Conferir o álbum nos dois visuais e abrir o Battle pelo novo botão. No Sora, verificar a apresentação das metas de 100 e 250 m, seguidas da missão de 500 m.

O código da estreia e os atalhos estão na #118. O piloto com participantes, as duas semanas reais e a matriz de dispositivos físicos ficam registrados à medida que forem executados.

## Como rodar os pilotos da #118

### Primeira sessão com visitantes

Use cinco ou seis perfis novos do navegador. Abra a página inicial no aparelho que cada pessoa costuma usar e peça apenas que explore o jogo. Registre a primeira escolha que ela fez, inclusive se abriu outra área. Após a partida ou a foto, leia `TW_CELULAR.estreiaMedidas()` na aba do jogo. Colete as medidas antes de fechar ou recarregar a aba.

| Participante | Aparelho | Primeira escolha | Até começar (ms) | Até concluir (ms) | Pediu ajuda? Onde hesitou? |
|---|---|---|---|---|---|
| V1 | | | | | |
| V2 | | | | | |
| V3 | | | | | |
| V4 | | | | | |
| V5 | | | | | |
| V6 | | | | | |

Se faltar uma medida, anote a última etapa observada. Ao comparar as sessões, conte também quantas pessoas completaram uma atividade sem ajuda.

### Histórias da Rua Fofa

Abra a versão da #118 com `?piloto_bairro=1`. O piloto começa no domingo de 22/11/2026 à meia-noite de Brasília. Para rodar com um novo grupo, escolha outro domingo com `&piloto_bairro_inicio=AAAA-MM-DD` e use o mesmo link nas duas semanas. O progresso fica neste navegador, associado à conta ou ao visitante. Use o mesmo perfil de navegador nas duas visitas.

| Semana | Chamada no Hoje | Ação no bairro | Desfecho |
|---|---|---|---|
| 1 | A vitrine da Rua Fofa | Tirar uma foto no cenário rosa do Studio | A edição de domingo comenta a abertura da vitrine |
| 2 | Um céu na Rua Fofa | Tirar uma foto entre as nuvens | A edição de domingo comenta a inauguração do mural |

O cenário vem selecionado. Se a pessoa usar outro cenário, pode tirar a foto e tentar a história novamente. O Studio piloto guarda uma miniatura na vitrine local. O desfecho tem versões para quem concluiu e para quem não concluiu a atividade, sem publicação da imagem para outros jogadores.

Use `TW_PILOTO_BAIRRO.medidas()` para contar quem abriu a história, acionou o obturador no cenário pedido, concluiu a foto e leu o desfecho. Faça uma contagem por semana. Compare quantas pessoas voltaram a abrir a matéria com quantas terminaram a atividade. Registre também quem voltou mesmo sem ter concluído.

Se o retorno ao jornal justificar testar o bico, acrescente `&piloto_bico=1` ao mesmo link. O balcão da Rua Fofa tem um pedido sem relógio. A entrega correta acrescenta a plaquinha à vitrine e uma lembrança ao desfecho. O bico reaproveita a conferência de ingredientes do Café e opera fora de missões, ranking, Caderno e recompensas.

### Ensaio de visitante

Com um visitante, abra `?piloto_karaoke=1` e selecione **Ensaiar no Karaoke · 20 s**. Faça primeiro os testes físicos acima. O ensaio usa as notas, o áudio e o diagnóstico do jogo, com conclusão e repetição no próprio resultado. Ao final da sessão, no iframe do Karaoke, leia `ktEnsaioMedidas()`. Os valores contam ensaios iniciados, concluídos e novos inícios da mesma música após uma conclusão.

| Aparelho e navegador | Saída | Ajuste (ms) | Tocou e cantou sem atraso perceptível? | Retomou após troca de aba? | Foto completa? | Concluiu e repetiu? |
|---|---|---|---|---|---|---|
| iPhone / Safari | Alto-falante | | | | | |
| iPhone / Safari | Bluetooth | | | | | |
| Android / Chrome | Alto-falante | | | | | |
| Android / Chrome | Bluetooth | | | | | |

Em cada combinação, use a mesma música e anote o ajuste de timing. Durante um trecho, troque de aba, volte e toque em **Retomar**. Confira se o tempo ficou parado, se as notas voltam no ponto em que a música parou e se o resultado compara os mesmos trechos. Complete também o trecho a 75%, repita a 100% e confira se os dois resultados usam a mesma quantidade de notas. Troque a saída de áudio entre partidas. A simulação não mede latência de hardware. Rodar o ensaio com visitantes após a matriz física permite observar quantos concluem em 20 s e quantos pedem outra rodada.

### Série de fotos

Com conta, use **Guardar na série** no resultado do Studio, na cena do Duo e no Camarim VIP. A seção **Série de fotos** fica no Álbum das duas interfaces. Repita a mesma composição do Studio com dois looks e confira ordem, download e remoção. O navegador guarda até 24 imagens JPEG por conta e substitui as mais antigas ao atingir o limite. Recarregue e abra o Álbum com outra conta para verificar o isolamento.
