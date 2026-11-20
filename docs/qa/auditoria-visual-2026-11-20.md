# Auditoria visual e de carregamento do TsuLiPa⭐World

Revisão da PR #124 em 20 de novembro de 2026. A auditoria combina inspeção em Chromium, testes de fluxo com respostas de conta simuladas e um servidor HTTP local com compressão gzip para comparar a mesma abertura antes e depois. O [estudo anterior de sustentabilidade e das referências](auditoria-sustentabilidade-2026-11-20.md) conserva a medição da versão pública.

## Fluxos revisados

| Área | O que mudou | Como foi conferido |
| --- | --- | --- |
| Photo⭐Studio! | Obturador e ações da foto junto da prévia, pauta recolhível e uma categoria de edição por vez. Em telas largas, prévia e controles lado a lado. | Com 320 × 640, tema escuro e movimento reduzido, abrir a câmera, mudar a pose, fotografar e guardar na série. Antes, o obturador estava a cerca de 1.257 px do topo nessa configuração. |
| Favoritos | Três espaços por conta neste navegador, com nome e ações para provar, vestir ou fotografar. A prévia indica categorias de peças indisponíveis que reaproveitam o visual atual. A importação dos favoritos antigos é explícita e ocupa apenas espaços livres. | Importar em uma conta, trocar para outra e confirmar que o favorito não aparece. Fotografar o favorito sem trocar o visual ativo e sem pedir publicação no Mural. |
| Zipper⭐Shop! | Abre no catálogo, com provador compacto e entradas para Vestindo, Minhas peças e Loja. Miniaturas do catálogo passam a ser desenhadas ao entrar na área visível. A saudação da atendente pode ser aberta e sua animação pausa fora da tela. | Provar por teclado, conferir o visual atual, impedir o salvamento de peça não comprada e limpar a prévia. O fluxo de Camarim continua voltando ao espelho. |
| Rua Fofa | A edição “Um céu na Rua Fofa” liga o painel da Rosa à Loja. O Studio continua disponível e quem tem conta pode fotografar no Duo. A captura enviada para a vitrine pode ser guardada na série. | Percorrer Loja, retorno ao painel, Duo, vitrine e série. Os testes de calendário usam datas de Brasília simuladas, com o desfecho pelo Idol⭐News!. |
| Avatar | Arco estelar, coroa de tulipas e torrada têm desenho lateral no Center⭐Run!. As três referências abaixo exercitam os campos do visual ao abrir os outros jogos. | Conferir o Perfil, o fallback lateral do Center⭐Run!, a importação do Idol no Sora e no Karaoke e o uso do visual na foto do Studio e no Duo. |

### Visuais de referência

- Cabelo longo rosa, pele escura, chapéu de palha, Trainee azul e microfone.
- Chanel lilás, pele clara, arco estelar, Seifuku lilás e torrada.
- Marias escuras, pele castanha, figurino City Pop e laço.

A comparação preserva cor de pele, cabelo, peça de cabeça e figurino. Vista lateral, pose e enquadramento seguem a atividade. O catálogo completo ainda tem combinações que pedem revisão visual própria.

## Transferência com cache frio

Amostra do código local em tela de 390 × 844, em português, após a abertura inicial. Valores decimais aproximados do corpo comprimido, sem cabeçalhos nem recursos de terceiros.

| Entrada | Antes | Revisão | Redução |
| --- | ---: | ---: | ---: |
| Início do TsuPhone | 776 kB | 720 kB | 7% |
| Karaoke⭐Time! | 529 kB | 430 kB | 19% |

O Mapa e seus textos baixam ao abrir a área. As fontes do Karaoke saíram do CSS e usam WOFF2 em subconjuntos correspondentes aos glifos originais. Letras fora da cobertura das fontes continuam com o fallback do navegador. O Início ainda está acima dos 700 kB propostos na auditoria anterior. A captura corresponde ao laboratório local e pode variar com a rede, o idioma e o navegador.

O teste de campo ainda inclui alto-falante e Bluetooth em iPhone e Android físicos, além de um ciclo real da Rua Fofa com retorno voluntário ao Jornal. Essas observações completam os testes de navegador sem depender de alterações no banco.

## Reprodução

- `node tests/run-all.js`
- `node tests/evolucao.browser.cjs`
- `node tests/continuidade.browser.cjs`
- `node tests/corrida.browser.cjs /tmp/tsulipa-auditoria-corrida`
