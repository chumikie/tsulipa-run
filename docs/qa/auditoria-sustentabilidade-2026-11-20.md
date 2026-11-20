# Sustentabilidade e acabamento do TsuLiPa⭐World

Revisão de 20 de novembro de 2026. A análise combina o site público, a árvore da PR #124, as verificações locais e fontes oficiais dos produtos de referência. As cifras abaixo medem transferência de dados. Consumo de bateria, emissões, custos de hospedagem e retenção exigem dados próprios.

## Abertura, custo por sessão e manutenção

Medição de laboratório em Chromium, com perfis novos de 390 × 844 e cache frio. Contagem dos recursos da própria origem, da navegação a aproximadamente 1,7 s após o carregamento. No Início, inclui o toque em **Toque para começar**. Os valores são uma amostra, com bytes decimais e cabeçalhos.

| Entrada publicada | Requisições próprias | Transferência | Conteúdo descomprimido |
| --- | ---: | ---: | ---: |
| Início do TsuPhone | 93 | 822 kB | 2.237 kB |
| Sora⭐Jump! direto | 12 | 138 kB | 397 kB |
| Karaoke⭐Time! direto | 33 | 546 kB | 1.124 kB |

- **O TsuPhone carrega muito antes da primeira atividade.** O HTML e `tw-celular.js` respondem juntos por cerca de 142 kB gzip em compressão local dos corpos medidos. O ganho mais visível viria de adiar mapa e conteúdo das abas até precisarem aparecer. Meta inicial de revisão, 700 kB em cache frio com as duas ações de estreia no mesmo lugar.
- **Fontes merecem o primeiro corte no Karaoke.** `kt-fonts.css` pesa 359 kB descomprimido e cerca de 271 kB em gzip local. Separar as fontes do CSS, carregar subconjuntos por escrita e manter alternativas do sistema. Meta inicial de 450 kB, verificando português, japonês e tailandês e a aparência do palco.
- **O Sora já demonstra um caminho leve de entrada.** O próprio documento concentrou cerca de 90 kB em gzip local. Separar dados e lógica do HTML quando houver ganho real de cache e sem introduzir mais dependências no caminho até Jogar.
- **A manutenção tem apoios sólidos.** Há carregamento sob demanda, documentação de retomada, testes de scripts e suites para Chromium e WebKit. O risco vem de estados globais, arquivos grandes com código embutido e versões manuais dos recursos. O próximo corte deve seguir fronteiras que já existem, como seleção de atividades, resultados e calendário editorial.
- **Falta um ambiente de aceite que represente o lançamento.** A configuração Vercel só habilita deploy automático em `main` e duas branches antigas específicas. A PR pode passar no local e no CI sem produzir uma prévia navegável para revisão. Uma única prévia estável, aceite em aparelhos físicos e um roteiro de restauração do Álbum rendem mais do que manter várias branches de homologação.
- **Medir antes de expandir a infraestrutura.** Repetir coleta com cache quente e rede móvel limitada. Acompanhar tempo para primeira ação, tempo de quadro e descarte de frames em aparelho de entrada. Conferir as cotas e custos reais no painel antes de adicionar sincronização ou armazenar fotos remotamente. HTTPS, login e usos com conta real devem ser verificados nos fluxos de aceite. [Configuração Vercel](../../vercel.json) · [Mapa de código](../MAPA_DO_CODIGO.md)

## Acabamento comparado às referências

| Referência | O que demonstra | Aplicação no TsuLiPa⭐World |
| --- | --- | --- |
| [Link! Like! Love Live!](https://www.bandainamco.co.jp/files/E38090E382B5E382A4E38388E68EB2E8BC89E794A8E38091Re.pdf) | Registros de atividade, conversas With×MEETS e apresentações Fes×LIVE funcionavam juntos no calendário escolar. | Usar o Hoje, a Rua Fofa e o Jornal como três etapas do mesmo episódio. Manter um registro lido em ordem e dizer na tela quando sai a consequência. Um cenário, uma ação e um desfecho por edição cabem no formato 2D atual. |
| [Hatsune Miku: Colorful Stage!](https://www.colorfulstage.com/aboutgame/gameplay/) | A execução de músicas tem objetivos próprios e participa de uma experiência maior com histórias e personagens. | Tratar timing, pausa e retomada como acabamento central do Karaoke. Testar alto-falante e Bluetooth em cada plataforma antes de fazer do ranking a primeira coisa que um visitante vê. |
| [Animal Crossing: New Horizons](https://animalcrossing.nintendo.com/new-horizons/explore/) | Horário e estações dão continuidade ao mundo. Há caminho documentado de recuperação dos dados. | Deixar a contribuição visível na rua quando a pessoa volta. Explicar no próprio Álbum onde as fotos ficam e dar controle ao jogador quando chega ao limite, com cópia e restauração. |

A operação online do Link! Like! Love Live! terminou em **30 de junho de 2026**, conforme o aviso oficial. Para o TsuLiPa, a lição de continuidade é ter capítulos consultáveis, cópia de lembranças e um caminho documentado de recuperação mesmo quando um serviço mudar. O TsuLiPa já tem forças próprias para esse acabamento: o Idol criado pela pessoa aparece nos jogos e a mesma foto pode voltar como decoração. [Aviso oficial de encerramento](https://www.lovelive-anime.jp/hasunosora/refund/)

No acabamento de interface, priorizar a consistência de entrada, resultado e retorno. A tela compacta já tem duas ações de estreia reconhecíveis e a PR usa foco restaurado, redução de movimento e controles táteis em parte dos jogos. Antes de ampliar o catálogo, vale fazer a mesma ronda em todos os minijogos com teclado, toque, texto ampliado, tema escuro e perda de conexão. Cada resultado deve deixar claros a próxima ação, o que foi salvo no aparelho e o que dependeu da conta. Os modos clássico e TsuPhone precisam manter esses mesmos significados, mesmo usando layouts diferentes.

## Critérios de aceite da rodada

- Visitante chega ao resultado da corrida com o campo de nome vazio.
- Álbum preserva 24 fotos ao cancelar. A confirmação substitui exatamente a selecionada. Uma foto pode ir ao porta-retrato de um Pet ativo.
- Studio e Café confirmam contribuição e data de publicação na Rua Fofa. O piloto inclui a virada de domingo em Brasília e o retorno ao desfecho. [Roteiro com participantes](pilotos-estreia-bairro-karaoke.md)
- Treinos de colisão, pouso, memória e ritmo deixam os resultados oficiais intactos. O relatório do Café distingue receita incorreta de receita certa após o prazo. A comparação do Battle usa o mesmo placar do rival.
- A matriz física do Karaoke e a volta espontânea ao Jornal ao longo de duas semanas ficam como verificações de campo. Relógio simulado e contas de teste cobrem as transições e a persistência no navegador.
