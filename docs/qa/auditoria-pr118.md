# Auditoria da PR #118

## O que foi corrigido

- Idol⭐News!. Uma falha no carregamento dos quadrinhos podia reabrir o jornal e repetir a requisição. O restante do jornal agora abre de forma independente. A resposta de uma abertura anterior é descartada se o jornal já tiver sido fechado ou reaberto. O Calendário também evita repetir o download a cada atualização da tela.
- Foco no Calendário. Ao selecionar uma data pelo teclado ou após uma atualização da tela, o foco volta ao controle equivalente. Ao abrir um capítulo disponível, o foco vai ao botão do capítulo selecionado.
- Áudio. O mudo geral agora usa também a propriedade nativa `muted` em elementos de mídia. Isso cobre a situação em que o navegador ignora o volume numérico. A verificação simula essa limitação.
- Links públicos. As três rotas aceitam o idioma enviado na URL e apontam para atividades fixas. Cada página contém metadados próprios e um link de abertura disponível com JavaScript desabilitado. As imagens de 1200 × 630 usam arte do jogo.

## Verificações

- 120 de 120 verificações rápidas passaram, incluindo cache, tradução, economia local, salvamento e fluxos dos jogos.
- No Chromium, as telas principais abriram no celular, no computador e no tablet em pé e deitado. O teste de 320 px cobriu o Café com duas comandas. O Center⭐Run! passou pelo início, pela corrida e pelo resultado com colisão. No Karaoke a 390 px, passaram o início e a retomada do show, a foto e o retorno à sala.
- Também passaram os fluxos do Studio, Bloom, Café e Battle com movimento reduzido, a recuperação do Mapa e do Jornal e a alternância entre visitante e contas simuladas. O teste de navegação verificou busca com acento, retorno ao Festival e volume sincronizado com o Karaoke incorporado.
- A suíte nova cobre o limite e a persistência dos atalhos, navegação por teclado, retorno do Café, data e exportação do Festival no fuso de Tóquio, carregamento do Jornal com erro de rede, abertura de capítulo publicado, metadados e tamanho das três imagens, abertura das rotas e mudo nativo.
- O evento .ics registra 23h59 de sábado em Brasília como início e 0h de domingo como fim. O calendário externo converte os horários a partir do UTC. A exibição local usa o fuso do aparelho.
- A revisão de dados verificou que a preferência de atalhos usa uma chave própria no navegador, que a exportação do Festival é local e que as páginas de compartilhamento apontam para destinos fixos.

## Limites

- Os fluxos online em navegador foram simulados. OAuth real, escrita no Supabase e leitores de prévia de redes sociais em produção ficaram sem validação nesta rodada.
- A latência de áudio e o contraste entre alto-falante e Bluetooth ainda precisam de iPhone e Android físicos.
