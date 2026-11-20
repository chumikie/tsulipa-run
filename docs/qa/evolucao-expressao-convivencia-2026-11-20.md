# Expressão e convivência — rodada de 20/11/2026

Base: PR #124, `d54c33a3b65c8969e5f63eb7ba7e6e8ce58c27df`. Esta rodada é separada do trabalho do outro assistente. A PR #117 não foi incorporada. Sem merge, publicação, alteração de economia ou execução de SQL nesta rodada.

## O que pode ser experimentado

- Menu → Seu ritmo: quatro maneiras de visitar o mundo, sugestões para três minutos ou uma visita mais longa. A escolha não conclui missões nem dispara recompensas. Orientação pode ser pulada e retomada, por conta neste navegador.
- Montar Idol: aproximação dos detalhes e Desfazer para trocas manuais. O histórico de edição e a prévia são descartados ao trocar de conta. A cor da pele e as peças antigas continuam sendo escolhas explícitas.
- Loja: procedência do catálogo ou coleção sazonal; provar, vestir e comprar continuam com suas confirmações existentes. Não se inventa uma data individual de aquisição.
- Praça Central: três ações explícitas para posar, observar a fonte e rever o bairro. As duas primeiras são cenas locais, a terceira abre o sistema existente. Não são jogadores online nem acontecimentos coletivos. Respeitam movimento reduzido.
- Criação “Luzes de fim de tarde”: abre o Studio em cortina, luz de pôr do sol e corpo inteiro. Não exige peças, não compra nada, não publica, não concede prêmio e não anuncia evento ao vivo.
- Porta-retrato: novas fotos preservam origem e data disponíveis; fotos antigas continuam visíveis sem metadados inventados. O Pet usa a reação existente à lembrança. A arrumação não é alterada.
- Tours: indicação explícita de visita assíncrona, preservando a seleção de conteúdo e as regras de corações existentes.
- Avatar: acabamento das palmas no módulo compartilhado, mantendo a grade de encaixe 30×44 e os figurinos existentes.

## Cobertura dos 15 pontos e próximos critérios

| Ponto | Entrega desta rodada ou sistema reaproveitado | O que ainda não está entregue |
| --- | --- | --- |
| 1. Experiência do mundo | Seu ritmo, quatro caminhos e duração opcional, acessos originais | Medir descoberta e retorno espontâneo em uso real |
| 2. Visual dos Idols | Detalhe das mãos, zoom e três looks de referência da #124 | Redesenho completo de silhueta, rosto e cabelo precisa de prova visual antes de substituir arte aprovada |
| 3. Guarda-roupa | Editor, favoritos e provador da #124; Desfazer manual e aproximação | Conferência visual em iPhone físico |
| 4. História das roupas | Origem real do catálogo e identificação sazonal | Conquistas individuais e novas roupas como recompensa não foram criadas |
| 5. Mapa | Composição e escalas atuais preservadas; ações legíveis da Praça | Camadas adicionais da #117 continuam na revisão daquela PR; fachadas e vegetação não foram redesenhadas |
| 6. Rua interativa | Posar, fonte e retorno ao bairro | Banco com postura sentada e iniciativas persistentes não foram adicionados |
| 7. Camarim | Arrumação, Desfazer e porta-retrato existentes; procedência da foto ampliada | Conferir imagens antigas em conta real |
| 8. Pets | Descanso, brincadeira na mesa, companhia e reação existentes | Preferências novas persistentes dependem de definir os hábitos canônicos de Chu, Koali e Pucchi |
| 9. Social | Tours existentes com identificação assíncrona | Mostra pública com vista, fotografia e apresentação escolhidas ainda precisa de formato de publicação e privacidade |
| 10. Evento | Ateliê local “Luzes de fim de tarde”, fotografia e visita opcionais | Não é um evento público: anúncio, edição coletiva e participação ao vivo permanecem propostas |
| 11. História transversal | Piloto original da Rua Fofa, sua continuidade, Loja, Café, Duo, Studio e Jornal da #124 preservados | Expansão editorial “O detalhe que faltava” ainda não foi adicionada |
| 12. Primeira visita | Orientação por interesse, pulável e retomável | Validar com uma pessoa que nunca jogou |
| 13. Minijogos | Treinos e feedback da #124; caminhos diretos sem mudar física, resultados ou prêmios | Áudio e resposta em aparelhos físicos |
| 14. Fotografias | Captura, série, composições, cópia e restauração da #124; metadados do quadro | Sincronização da série entre aparelhos não foi criada |
| 15. Plano | Esta matriz, dependências e testes proporcionais | Escolher a próxima rodada a partir da revisão visual e das pendências acima |

## Compatibilidade e armazenamento

Não há migração de saves. Não há renomeação de chaves `brs48cr_*`. Preferência de orientação usa `tw_ritmo_guia_v1:<dono>`, local, sem sincronização. O porta-retrato continua no aparelho, separado por conta e Pet. A série continua privada no IndexedDB, com 24 fotos por conta. Fotos do Mural seguem o fluxo online explícito. Nenhuma foto privada é enviada para tours.

## Verificação

- `node tests/run-all.js`: 122/122 passaram, incluindo comportamento de seis idiomas, isolamento por conta, dados antigos e armazenamento indisponível.
- `node tests/mundo-expressao.browser.cjs`: Chromium, 320×844, 390×844 e 1440×844, movimento reduzido, tema escuro, rotas, preparação no Studio, Desfazer, troca de conta e três ações da Praça. Em PC a seleção usa o Canvas; no celular, os atalhos do mapa.
- A suíte ampla `tests/evolucao.browser.cjs` confirmou carregamento do mapa, três looks em Perfil/Sora/Karaoke e o Studio com favoritos. Interrompeu no download da cópia JSON da série (`download.path: canceled`) no Chrome deste Windows; os demais casos daquela execução não foram concluídos. Não considerar essa suíte toda aprovada.
- Não testado: iPhone/Android físico, login real, áudio ouvido, publicação de foto e ciclo editorial de duas semanas. A autorização desta rodada não inclui publicar para testar.

## Próxima sequência proposta

1. Conferência visual do Idol e guarda-roupa: comparar os três looks frontal, lateral, saltando e cantando. Aceite: nenhum item flutua, cortes legíveis e fotos antigas intactas.
2. Praça e Camarim: prova de banco sentado e coerência entre móveis, Idol e Pet. Aceite: encaixe por posição real, sem mover decoração do jogador.
3. História completa: revisar roteiro e duas consequências antes de ampliar o piloto. Aceite: visitante tardio entende o começo; Jornal histórico preservado.
4. Mostra pública: definir exatamente o conteúdo voluntariamente compartilhado e como retirar a publicação. Aceite: nenhuma fotografia privada fica pública por consequência de uma visita.
5. Edição coletiva e recompensas: especificar servidor e economia separadamente. Aceite: provas de autoria, privacidade e idempotência; nenhuma recompensa apenas por abrir a atividade.
