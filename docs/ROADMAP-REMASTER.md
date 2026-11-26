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
