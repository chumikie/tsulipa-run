# Visita⭐Surpresa! — avaliação de legítimo interesse (PR #76)

- Data: 04/11/2026 (America/Sao_Paulo).
- Estado: avaliação preliminar para a prévia #76; não autoriza publicação oficial nem substitui revisão jurídica.
- Responsável pelo produto/controlador: proprietário e administrador do TsuLiPa⭐World.
- Finalidade específica: criar aparições ilustrativas e raras de outros Idols da comunidade no Happy⭐Cafe! e Handshake, sem comunicação ao vivo.

## Finalidade, necessidade e expectativa

A aparição comunitária facilita o reconhecimento entre participantes e a sensação de mundo compartilhado. Não é publicidade, classificação, indicação de relacionamento, presença online ou mensagem enviada pela pessoa representada.

Somente o nome de Idol e o avatar do jogo já exibidos na vitrine pública são necessários. Não usar e-mail, identificador de conta no desenho, frase do perfil, idade, aniversário, localização, status online, resultados, créditos ou histórico; não armazenar a visita.

O site já exibe Idols em vitrine, banner, plateia do Karaoke e outras cenas. A visita ao Café e Handshake é finalidade próxima, mas nova: por isso, esta avaliação e a explicação na política de privacidade precisam acompanhar a funcionalidade antes da ativação.

## Riscos e balanceamento

| Risco | Salvaguarda obrigatória |
| --- | --- |
| Aparecer contra preferência | Selecionar exclusivamente a interseção entre `vitrine_idols` (avatar e nome públicos) e `duo_sugestoes` (elegibilidade com `duo_on` ativo e conta não bloqueada). Falhas ou dados ausentes produzem somente NPCs. |
| Aparição da própria conta | Exigir sessão autenticada com ID e nick; excluir nick próprio normalizado. Sem login ou identidade inequívoca, usar NPCs. |
| Insinuação de fala, presença online ou endorsement | Exibir indicação discreta de aparição ilustrativa; não atribuir falas livres, comportamento pessoal, interação direta ou presença simultânea. |
| Confundir NPC, superfã ou desafio online | Visitante é somente visual temporário de um lugar comum. Não alterar pedidos, índices, presentes, perguntas, respostas, pontuação, recompensas ou tempo; não salvar visitante em memórias. |
| Exposição excessiva, inclusive de menores | Não usar foto real, perfil sensível, contato ou localização; não vincular a ranking de visitantes, não notificar nem registrar quem apareceu; limitar a uma visita por partida com sorteio raro. |
| Uso além da finalidade informada | Política em PT, ES, EN, ID, TH e JA deve informar finalidade, dados, sorteio, ausência de interação, privacidade e controle pela preferência já existente. Não criar novo botão. |

**Menores:** contas podem pertencer a crianças/adolescentes e não há mecanismo de idade validado nesta etapa. A análise considera prioritários seus interesses: avatar fictício, nome de jogo já público, ausência de comunicação, rastreamento, exposição adicional de dados privados ou atribuição de declarações pessoais, e possibilidade de excluir a conta dos sorteios usando a preferência existente. Se esses limites não puderem ser cumpridos, não ativar a visita real.

## Proporcionalidade e decisão

Risco residual estimado: baixo, condicionado à implementação integral das salvaguardas, à transparência acessível e a testes com dados simulados. O benefício comunitário é específico e os meios são proporcionais. O legítimo interesse é uma base **considerada** para esta finalidade; `duo_on=true` não é tratado como consentimento específico, mas `duo_on=false` deve sempre ser respeitado.

Autorização de implementação em rascunho: **condicionada** à verificação dos filtros, da exclusão da conta própria e do comportamento fail-closed; ativação para usuários reais e publicação oficial exigem conferência final do controlador, incluindo melhor interesse de menores. Não fazer consulta a dados pessoais em produção para esses testes.

Referências: [Guia ANPD de legítimo interesse](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_legitimo_interesse.pdf) e [Enunciado ANPD sobre crianças e adolescentes](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes).
