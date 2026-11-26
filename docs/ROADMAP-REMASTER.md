# TsuLiPa⭐World · Remaster 3.2–3.7

A meta artística é reconhecer o trio, o bairro e a atividade numa captura sem logotipo. A referência desta rodada é o comparativo do commit `6be6b28` com a base da PR #135. O artefato 15116771233 contém 83 pares de PNGs e dois vídeos de posturas.

| Etapa | Trabalho desta rodada | Como avaliar |
| --- | --- | --- |
| 3.2 · Recuperação | Verificação das cores das meias nos caminhos de desenho compartilhado e alternativo, revisão de cache do Center⭐Run e restauração dos atalhos no primeiro desenho após Começar. | Fixar Café e Calendário, recarregar, abrir ambos por teclado e conferir o retorno do foco. |
| 3.3 · Identidade dos Idols | Ombros e cintura da camisa trainee, gola com pontas, pescoço curvo e polegar. Os coques da Lirika têm direção de enrolamento e o cabelo longo termina em mechas de comprimentos diferentes. | Comparar cabelo, manga e proporções com o mesmo visual no Perfil, Studio, Camarim, Karaoke e Sora. No mapa, conferir a leitura na escala de passeio. |
| 3.4 · Arquitetura | Ribalta no Star Stage, bancos em volta da fonte da Praça Central, vidro inclinado sobre a entrada da Star Arena e folhagem junto ao acesso do Jardim das Nuvens. As juntas marcam a perspectiva do piso. | Percorrer os quatro bairros e comparar as entradas, os pés dos passantes e a direção da calçada nas capturas compactas. A composição de cada fachada ainda comporta avaliação artística pelo dono. |
| 3.5 · Camarim e fotografia | Distribuição de peso por Idol com pivô no quadril, postura dos pés, resposta do pet ao olhar e relevo dos quadros. No Studio, a flor inclina para fora do coração e o disparo usa a fase do último quadro da prévia. | Comparar as três posturas dos três Idols e as três distâncias da câmera. Conferir haste, dedos e recorte do pulso na prévia e na cena guardada. Flash, guias e moldura de exportação ocupam camadas próprias. |
| 3.6 · Interface e atividades | Perfil compacto, separação dos atalhos fixados, agrupamento de ingredientes no Café e controles de Duo e Karaoke em telas estreitas. O skyline da corrida ganha planos, o salto do Sora alonga a silhueta, o fã desacelera ao chegar, as plantas projetam sombra na terra, a Battle destaca os dois participantes e o cantor sustenta as poses por mais tempo. | Abrir as atividades pelos acessos habituais em temas claro e escuro. Conferir nomes longos, foco, seleção, retorno e resultados. |
| 3.7 · Qualidade e desempenho | URLs de módulos e estilos atualizadas para o cache do service worker, dois gradientes fixos reaproveitados no Karaoke e cópia superficial das opções visuais no desenho do Studio. O teste de idiomas inclui indonésio nos dois tamanhos. | Testar visitante, troca de conta, recarga, movimento reduzido e falha de rede. Comparar sessões longas no Safari em iPhone físico para avaliar memória e fluidez no aparelho. |

A aprovação artística final depende da leitura das capturas pelo dono. A bateria automatizada cobre navegação e persistência com contas de teste. Medições de memória no Safari e compartilhamento pela folha nativa exigem aparelho físico.


## Identity & Soul · 3.8–4.4 (26/11/2026)

Referência: HEAD `a483dd2`, CI anterior aprovado, artefato 15126653397 (86 pares PNG e dois vídeos). Foram examinadas as folhas de contato, os quadros amostrados dos vídeos e detalhes do mapa.

| Etapa | Implementado no código desta rodada | Validação pendente |
| --- | --- | --- |
| 3.8 · Idol Art Direction | Silhuetas de franja, coques e Chanel redesenhadas com curvas, mãos com polegar e dedos mais definidos, cintura e ombro mais naturais. Renderizador compartilhado mantido. | Conferir o trio e o vestuário personalizado em todas as superfícies. |
| 3.9 · Figurinos | Contorno da camisa, pinças, mangas curvas nos braços erguidos, recorte do entrepernas e caimento. | Conferir poses e sobreposição dos acessórios. |
| 4.0 · Living World | Proscênio do Star Stage, pavimento da Praça Central, estrutura da cobertura da Star Arena, floreiras do Jardim das Nuvens. | Conferir profundidade, entradas e sobreposição com os passantes. |
| 4.1 · Cozy Camarim | Apoio dos pés sentados, menor recolhimento do pé, respiração por rotação no quadril em vez de flutuação vertical. | Conferir contato com assento e transições nos vídeos, pet e decoração preservados. |
| 4.2 · Photo Studio | Distância realmente distinta no retrato/meio-corpo com objeto e aceno; oscilação da câmera reduzida; mão esquerda espelhada anatomicamente e dedos diferenciados. Caminho de salvamento preservado. | Comparar pixels renderizados e fotografia guardada. |
| 4.3 · Clean UI | Quebra de texto e acomodação dos botões do Studio e dos jogos no celular; versões de cache atualizadas. | Conferir seis idiomas, claro/escuro, teclado e acessibilidade. |
| 4.4 · Game Feel | Cornijas e faces laterais no Center Run e Sora; painéis da sala do Karaoke e Café; piso do Handshake; topografia do Bloom; postura do Pet; pilares da Battle; piso em perspectiva do Moon Duo. Memórias Eternas recebe apenas o refinamento compartilhado dos avatares onde estes são redesenhados, sem alterar fotos já gravadas. | Revisão artística das dez atividades; novas animações e revisão específica das Memórias ainda incompletas. |

Verificação disponível antes do commit: análise sintática dos módulos JS alterados; quatro casos geométricos do enquadramento (normal, V, aceno e coração), com relação estrita retrato > meio-corpo > inteiro e punho dentro do retrato. Teste de regressão do Studio reforçado. Não houve clone local devido à indisponibilidade de DNS para GitHub no ambiente executor; testes completos em Chromium/WebKit, persistência e isolamento e novas capturas dependem da execução do CI existente sobre este commit. Não declarar aprovação artística ou conclusão integral antes dessas evidências. O comparativo padrão do CI usa a base da PR; o artefato da revisão anterior permite a comparação adicional entre rodadas.

Sem mudanças de mecânicas, economia, recompensas, dados salvos, banco, SQL ou Supabase. Sem publicação, merge ou nova PR.


### Continuação — revisão de 7f8f0c0 (26/11/2026)

CI anterior: execução 45855779885, Chromium, WebKit, comparação visual e PostgreSQL isolado aprovados; 127/130 verificações rápidas, com três falhas. Artefato 15136142616 baixado: 86 pares de PNGs, dois vídeos. As capturas do trio e quadros do vídeo mostram que o apoio e a silhueta sentada ainda precisavam ser diferenciados.

- 3.8–3.9: franja reta com seis mechas curvas no renderizador compartilhado, preservando o bicolor, e ritmos visuais individuais nos Idols oficiais; correção do teste de mangas para registrar os pontos finais das curvas, sem retirar as verificações de encaixe.
- 4.0: banco da praça com encosto, assento e espessura; pregas do proscênio, preservando coordenadas e acessos. Jardim e Arena mantêm a reconstrução da rodada anterior.
- 4.1: pernas afuniladas e coxas ligadas ao quadril, inclinação e respiração individuais por postura; apoio unilateral no descanso, teste de apoio e de contorno da saia adaptado à geometria curva.
- 4.2: cortinas com volume, amarração e pregas; fase congelada do retrato quando movimento reduzido está ativo. O salvamento continua usando a captura limpa e não o flash/visor.
- 4.3: chips e foco do Studio, escala e passe-partout das Memórias em tela estreita, versões de cache incrementadas.
- 4.4: cadências de corrida, alongamento na subida e compressão na descida do Sora, piscadas fora de fase do trio no Karaoke, passos e desaceleração em Café/Handshake, animação por espécie no Bloom, apoio do Pet/Camarim, reação finita na Battle, resposta ligeiramente defasada no Duo; galeria e quadro de Memórias agora têm tratamento próprio e defesa de conta no desenho. Nenhum registro histórico regravado.
- Testes: as três falhas anteriores foram tratadas no código/testes, sem suprimir os casos; novos testes verificam mechas, âncoras do Duo, isolamento da galeria e fase da fotografia. A validação integral do novo commit e as capturas em 320×640, 390×844 e desktop dependem do CI, não do resultado anterior. Clone local indisponível (DNS). Aprovação visual final continua pendente, especialmente em iPhone físico.

Sem novos textos de interface, mecânicas, mudanças de recompensas, economia, SQL, Supabase, merge, deploy manual ou PR adicional.


## Signature World — Remaster 5.1–5.9

Referência: commit 2ed2825bc758db6d28dd4365a737c0ce8467de11, CI 45871345689 (9/9 jobs, 131/131 verificações estáticas), artefato 15141904791. Seleção revisada: trio, home, perfil, Studio, mapa, Camarim e fotos, Café, Handshake, loja, álbum, modo escuro e quatro bairros. Os personagens ainda compartilham parte da grade; os cenários ainda são estilizados.

| Etapa | Alteração desta rodada | Critério ainda a conferir |
|---|---|---|
| 5.1 Signature Idols | Silhuetas de cintura/joelhos e olhos oficiais diferentes; pixie lateral reconstruído com curvas. | Identidade nas três cópias e nas poses, sem alteração de looks personalizados. |
| 5.2 Fashion Atelier | Lapelas e recortes Cheeky/City Pop; costuras próprias Estrelado, Sweet e Zipper; camisa com silhueta por Idol. | Todos os figurinos, âncoras e cores, inclusive ranks. |
| 5.3 Architectural Identity | Pedestal da fonte, pavilhão lunar, travessa do proscênio e contrafortes da Arena. | Fachadas e acessos visíveis nas quatro regiões. |
| 5.4 A Place to Belong | Carcaça e almofada do sofá, tampo e lateral de mesa/estante; postura individual. | Apoio do corpo, decoração salva e contato com Pet. |
| 5.5 Idol Photography | Ciclorama, piso da janela, microfone com cápsula; espelhamento apenas da mão, não do arranjo. | Retratos, mão e adereços nos três enquadramentos. |
| 5.6 Premium UI | Hierarquia de Vitrine, Loja, Studio e Memórias, menos bordas pesadas e sombras. | Modo escuro, seis idiomas e navegação móvel. |
| 5.7 Animação | Assinatura de postura e passada, joelhos com âncoras estáveis, dança Duo com amplitudes diferentes. | Naturalidade e movimento reduzido. |
| 5.8 Atividades | Fachadas Center Run, casco/plataforma Sora, painéis acústicos Karaoke, marcenaria Café, pórticos Handshake, caixotes Bloom, sofá Pet, treliça Battle, composição Duo e acabamento das Memórias. | Capturas e vídeos; não implica reconstrução integral de todas as cenas. |
| 5.9 Auditoria | Novo teste de geometria/expressão/espelho; CI compara main, 2ed2825 e HEAD nos mesmos tamanhos. | CI completo, capturas novas e iPhone físico; aprovação visual não automática. |

Sem novos textos de interface, estados, mecânicas, recompensas, economia, SQL ou alteração de Supabase. Fotos armazenadas não são regravadas. Sem merge, nova PR ou publicação manual.


### Revisão corretiva de b888ead — 26/11/2026

CI 45877813312 concluído: 8/9 jobs, 129/132 verificações rápidas. Navegadores e comparação visual aprovados. Artefato 15146367158: manifesto confirma main, anterior 2ed2825 e PR b888ead, todos com código 0; 86 PNG por versão e vídeos do Camarim. Revisão visual anterior/PR nas 86 telas: a evolução é discreta nas silhuetas sentadas e no pavilhão lunar, com maior diferença no ciclorama fotográfico. O retrato com aceno sem objeto tinha enquadramento horizontal que não reservava a largura da mão levantada. Nesta rodada:
- ML1.6 exige o mesmo fallback e cor de meias, agora com c na chamada de pernas; roupas Center Run conserva todas as verificações de recordes, ranks e renderização e exige versão lateral >=8; teste de rosto importa a propriedade CommonJS real. Nenhum cenário de teste removido.
- Foto: todos os retratos com aceno reservam a largura e centro adequados independentemente de adereço; novo caso verifica os dois braços, zoom e fases da animação. PNGs históricos não regravados.
- Moon Duo no Jardim das Nuvens: reconstrução da base, fustes, capitéis, cobertura e degrau na régua do SVG, sem alterar acessos.
- A comparação tripla do CI permanece ativa; novas capturas e iPhone físico ainda precisam de validação. Sem merge, publicação manual, SQL, Supabase ou alterações de regras.


## Signature World 5.10–5.15 — construção e coerência

Base e58256f66d6cc1cd17c167545ea45a7ecdca7882: CI 45881694854, 9/9 jobs e 132/132 verificações estáticas. Artefato 15148850802 confirma 86 capturas por revisão (main, 2ed2825, e58256f), código 0 no manifesto. Revisão por amostragem dos bairros, do trio, Camarim, telas compactas/desktop e três enquadramentos: cenário e poses continuam estilizados; o último refinamento do pavilhão é visível, os olhos/contornos ainda precisam de coerência.

- 5.10: identidade oficial local por referência e WeakMap no Perfil e cópias do trio do celular, sem reconhecer nomes de avatares recebidos, sem campos persistentes novos. Vista lateral reutiliza olhos compartilhados.
- 5.11: braços do aceno/coração com cotovelo curvo na frente; perna lateral com joelho articulado e flexão do cotovelo na passada, mantendo âncoras dos sapatos.
- 5.12: saia e bermuda laterais com recortes curvos; padrão sem escolha segue bermuda da frente; escolhas Sweet/Zipper/Estrelado correspondem à frente, e no Camarim.
- 5.13: partes estáticas de fonte, proscênio, contrafortes e pavilhão transferidas do Canvas para as quatro artes SVG e seu gerador, mantendo coordenadas e placas. Outros detalhes e efeitos animados permanecem no Canvas.
- 5.14: costura da almofada responde ao peso do quadril; saia/bermuda seguem a escolha. Não altera posições salvas, hitboxes nem as regras de convívio.
- 5.15: cabeçalhos de controles do Studio alinhados, abas da loja com menos efeitos, controles compactos e área de foto preservada.

Testes de identidade local/normalização, escolha dos figurinos, traçado lateral, SVG e Camarim; o CI agora compara main, e58256f e HEAD. Capturas e validação física no iPhone ainda pendentes; não implica reconstrução integral de todos os figurinos, fachadas ou poses. Sem nova PR, merge, publicação manual, force push, SQL, Supabase, economia ou novas mecânicas.


### Revisão corretiva 5.15

Base 5dd9a1e: CI 45885973874, 8/9 jobs e 130/132 verificações; comparação 15150570568 contém 86 PNGs por revisão e manifesto main/anterior/PR com saída 0. Revisão das capturas confirma a continuidade das fachadas e das telas; o sofá e a saia sentada ainda parecem planos. Corrigido o carregamento declarativo do Perfil por inicialização preguiçosa do WeakMap, sem modificar o teste index-modules; versão do celular no teste de cache atualizada para 80, preservando as demais verificações. Encosto em duas peças e braços do sofá redesenhados com superfícies próprias e mesma oclusão; barra e pregas da saia sentada acompanham os joelhos; tronco lateral recebe a assinatura corporal frontal sem deslocar manga/gola. Novos comparativos usam 5dd9a1e como anterior. A aprovação visual da nova geometria e o iPhone físico continuam pendentes. Nenhum dado persistido ou regra alterados.

## Living Canvas 6.0 · pilotos do Camarim e Photo Studio

Base da rodada: 538973a, CI 45888241919 aprovado. O manifesto de 15150538137 identifica main, 5dd9a1e e 538973a. A amostra das posturas e das fotos mostrou braços pendentes no sofá e pouco espaço entre o antebraço e a manga no coração.

| Etapa | Implementado | Como conferir |
| --- | --- | --- |
| 6.1 | [Prancha de construção do trio](living-canvas-modelos.svg) em quatro vistas, com articulações, nuca e volumes do cabelo. Ombros e cinturas individuais na camisa compartilhada, correção do contorno da franja bagunçada. | Comparar o trio sem cor. Três quartos e costas são vistas de estudo. O piloto usa os renderizadores frontal e lateral existentes. |
| 6.2 | Um traçado por segmentos liga ombro, cotovelo e punho. No sofá, a mão esquerda sobe no descanso e a direita se estende em direção ao Pet no convívio. A interpolação usa a posição visual corrente, inclusive ao levantar. Nas seis poses fotográficas, o punho mantém a âncora anterior. | Comparar o cotovelo no coração, as mãos em repouso e em convívio e a continuidade das transições em movimento reduzido. |
| 6.3 | Eixo de manga e punho do tecido seguem o braço superior. A bermuda ganha aberturas separadas e largura de quadril própria. A barra e as pregas da saia sentada acompanham o lado de apoio. | Conferir os três enquadramentos e os figurinos em pé, de perfil e no sofá. Roupas especiais ainda usam cortes próprios. |

A suíte local executa os testes de geometria, âncoras e integração. O CI produz o novo comparativo com 538973a como revisão anterior. A aprovação artística e a verificação física no iPhone permanecem abertas. Cidade, interiores, composição fotográfica e interface (6.4–6.7) continuam no planejamento.
