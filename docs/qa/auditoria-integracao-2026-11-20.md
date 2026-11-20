# Auditoria da rodada de jogabilidade de 20/11/2026

A branch de revisão parte da produção em `9824e3e` e reúne as PRs #120–#123. A #117 segue em revisão própria.

| Fluxo | O que foi verificado no navegador |
|---|---|
| Center⭐Run! | O desafio abre pelo menu. O teste usa teclado e controles táteis, registra acerto e colisão por obstáculo e devolve o foco. Pontuação e saldo ficam iguais. O teste também passa pelo treino anterior e pela corrida normal. |
| Handshake⭐Event! | A apresentação manual aguarda o jogador, inclusive no quiz. A repetição usa os mesmos fãs e presentes com o cronômetro padrão. Reencontros mantêm as respostas da rodada. |
| Zipper⭐Shop! | É possível abrir o provador pelo teclado, comparar os dois visuais e limpar a prévia. Tentar salvar roupa sem posse mantém o Idol como estava e dispensa chamadas de compra ou gravação. |
| Moon⭐Duo! | A ficha mostra quatro critérios. A variação troca o enquadramento e as posições com a mesma dupla, fundo e pose. A foto pode ser guardada na série. |
| Rua Fofa | O piloto passou por dois ciclos. Studio e Café geram vitrines e desfechos distintos. Teclado e botões Voltar e Fechar recuperam a navegação anterior. O bico opcional ficou isolado. |
| Gacha e Battle | A prévia só altera a escalação quando confirmada. Fechar o Battle devolve o foco ao ponto de entrada no Gacha. |
| Happy⭐Cafe! e Sora⭐Jump! | O Café recupera o último pedido correto, oferece treino pela categoria mais errada e confere prazos no treino alternado. O Sora cobre os dois caminhos da bifurcação e explica um pouso perdido. |
| Álbum, Studio e Camarim | Exportação da página de três fotos, remoção de uma foto, isolamento por conta e cópia JSON com restauração de composição e filtro de duplicatas. A série aceita Studio, Duo e Camarim. O navegador também guarda fotos do pet e do arranjo do Bloom. |
| Karaoke⭐Time! | Ensaio de visitante, diagnóstico no resultado, repetição a 75% e a 100%, pausa em troca de aba e comparação dos acertos. O ensaio mantém os dados de tentativas oficiais. |
| Continuidade | Studio, Bloom, Café, Battle com movimento reduzido, troca de conta, recarga, foto VIP e recuperação do Mapa e do Jornal. |

O navegador usa contas e respostas de servidor simuladas. A auditoria cobre a interface e as regras locais. A validação com login real e a matriz de áudio no alto-falante e no Bluetooth de iPhone e Android ficam pendentes. As músicas ficam para outra rodada.

## Como repetir

- `node tests/run-all.js`
- `node tests/validate-games.js`
- `node tests/corrida.browser.cjs /tmp/tsulipa-corrida`
- `node tests/evolucao.browser.cjs`
- `node tests/continuidade.browser.cjs`
