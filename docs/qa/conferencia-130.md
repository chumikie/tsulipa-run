# Conferência visual — PR #130

## Entregas

- Moon⭐Duo: edição antes dos menus de saída; salvar e atividades agrupados; seis cenas iniciais, com acesso às demais; rótulos novos nos seis idiomas.
- Exportações com assinatura: rodapé acrescentado fora dos pixels originais. Largura preservada; a altura cresce pelo rodapé. PNG transparente do Duo continua sem assinatura.
- Colorir: usa as formas fechadas do renderer do avatar, sem o filtro de detecção de bordas em 180 px. Desenho em 720×800, mapa de áreas independente do contorno, paleta, teclado, Desfazer (até 30 ações), Limpar reversível e PNG. Não altera o visual salvo, o contexto de render do jogo nem concede estrelas.
- Caça-palavras: acabamento da grade, seleção e palavras encontradas, contraste em tema escuro e feedback de acerto. A resposta precisa corresponder às células da palavra sorteada.
- Diferenças: pequenas peças desenhadas no Canvas em prateleiras do camarim; posições separadas, cinco diferenças únicas, marcação de acertos e alternativa por teclado.
- Labirinto: gatinho e microfone desenhados, trilha percorrida, feedback de parede e chegada e cancelamento de gesto.
- Fichinhas: cabeçalho independente da regra global `header{max-width:760px}`, composição centralizada no desktop e enquadramento inteiro maior; mantém nomes, informações, fala e pets.

## Validação local — 21/11/2026

- `node tests/moon-conferencia.test.js`: passou.
- `node tests/melhorias-20261121.test.js`: 14/14 passaram. As migrações são apenas lidas como texto por essa suíte; nenhum SQL foi executado.
- `tests/passatempos-refino.browser.cjs`: Chrome headless; quatro larguras (320, 390, 1440, 1906), três fichas em cada largura, sem transbordamento; pintura, Desfazer, Limpar, desfazer a limpeza, PNG, fundo e avatar preservados.
- Três partidas completas na UI real com RPC simulado: cinco palavras, cinco diferenças, labirinto com 44 passos na edição testada; uma chamada de conclusão por tipo. Colorir não chama a recompensa.
- Teclado e textos novos conferidos nos seis idiomas; caça-palavras em tema claro/escuro; movimento reduzido.
- Inspeção das capturas do desenho, figurino, diferenças, labirinto e fichas mobile/desktop.
- Sintaxe dos módulos alterados e scripts inline do index conferida.

## Limites

Conta, RPC e rede externa foram isolados nos testes. Não houve teste com conta real ou aparelho físico, nem avaliação de todas as combinações de figurino/acessórios. A suíte geral completa não foi executada. CI não foi aguardado. A PR continua em rascunho para os próximos itens da conferência; sem SQL, merge ou publicação.


## Segunda conferência: perfil, jardim e fotografia

- Emoji livre: as sugestões exibem a escolha salva com aria-pressed, inclusive quando não consta na lista; digitação atualiza a seleção. O cálculo visual de perfil completo usa o emoji salvo da própria conta. Não há nova restrição por lista nem alteração de SQL.
- Vitrine dentro da aba Perfil, abaixo dos números; card desenhado em 360×504, com grade responsiva de card, insígnia e música. Mantidos os bloqueios de sessão e respostas antigas existentes no módulo.
- Histórico, coleções e edição do perfil em seções expansíveis; troféus e recados continuam visíveis.
- Bloom: enfeites e caminho desenhados antes da cerca.
- Studio: palma e pulso na escala dos braços; dedos e polegar envolvem a haste. Inspeção com microfone, lightstick e flor, nas poses V, aceno e coração. Não foram conferidas todas as combinações possíveis de objetos/poses.
- Missões: título interno oculto somente quando o painel é exibido na tela nova de missões.
- Browser suite ampliada: seleção do emoji 🎙️ e digitação 🪷, perfil completo com emoji livre, card em resolução correta, saída da vitrine na troca de aba, perfil em 320/390 px, título único das missões, captura do Bloom e grade de mãos do Studio. RPCs simulados, nenhuma conta real.


## Terceira conferência (auditoria a partir de a415843)

Navegador: Chromium headless (Playwright) com RPC simulado e rede externa bloqueada. Sem conta real e sem iPhone físico; simulação de celular não equivale a aparelho.

### Reproduzido e corrigido

- **Colorir removido** a pedido da dona. Antes da remoção, a auditoria encontrou um defeito grave: o filtro `/^create|get|measure|isPoint|to/` casava "to" dentro de `restore`, então o mapa de áreas nunca restaurava o contexto e saía de sincronia com o desenho (rosto, franja e tronco não pintavam; varredura de 16 mil toques pintou só saia e cabelo de trás). Com o Colorir fora, saem também a paleta, Desfazer, Limpar e os textos; os três passatempos e as recompensas continuam iguais.
- **Passatempos evoluídos** (sem mudar regras de estrelas): botão Dica no caça-palavras (destaca a primeira letra de uma palavra que falta) e nas diferenças (círculo tracejado por 2,2 s), com aviso nos seis idiomas de que a dica não custa estrelas; labirinto com Recomeçar, contador de passos e brilho no microfone; faixa roxa grossa das diferenças trocada por um rodapé fino.
- **Studio, mãos:** a mão agora é um punho simples (palma arredondada e faixa de dedos sobre a haste), sem linhas de dedos e sem antebraço extra. Captura: `conferencia-130/studio-maos.png`.
- **Studio, regressão da própria PR:** a limpeza do avatar de outra pessoa tinha perdido `lado2` (cor do cabelo bicolor). Restaurado.
- **Moon⭐Duo:** o selo "🔒 ★preço" cobria o ícone das cenas bloqueadas; agora fica abaixo do nome. "Álbum e atividades" abria vazio até o próximo clique (atalhos montados 350 ms depois de um clique, e só com o palco visível); agora monta ao abrir. Captura: `conferencia-130/duo-cenas-390.png`.
- **Emoji livre:** o `maxlength="8"` contava unidades UTF‑16 e cortava sequências compostas que o servidor aceita (o servidor conta até 8 caracteres). Agora o campo limita por caracteres, sem cortar no meio da composição por IME. 🎙 e 🎙️ (seletor de apresentação) marcam o mesmo botão em vez de criar um botão duplicado. O valor salvo continua vindo da resposta do servidor (`re.emoji`); o indicador de perfil completo usa o perfil salvo, não o texto digitado.
- **Vitrine:** card favorito maior a partir de 700 px (196 px de largura, antes 136 px).
- **Testes que já falhavam no HEAD da PR:** `index-modules` (funções novas de perfil-tela.js sem marcador `//→` em perfil.js) e `semana-20261120` (chamada da vitrine fora do padrão). Corrigidos.
- Versões de cache: studio.js, tw-celular.css, tw-passatempos.js, duo.css, tw-comunidade.js, perfil.js e perfil-tela.js.

### Apenas inspecionado (sem defeito confirmado)

- Bloom: caminho e pedras atrás da cerca; Idol, plantas, canteiros, balões e regador na ordem certa, às 12h, 18h e 22h, claro/escuro, 390 e 1440 px. O regador encosta no balão do canteiro 4 em telas largas (sem bloquear o toque).
- Perfil: claro/escuro (tema escuro por `prefers-color-scheme`, como no site), 320/390/768/1440 px, seções expansíveis e abas. Sem transbordamento.
- Fichinhas: a faixa do título encosta na borda esquerda por desenho (mesmo componente das outras telas).
- Assinatura: rodapé fora da foto, PNG transparente do Duo sem selo, fotos guardadas na série/Momentos sem selo. A página de três fotos do Álbum continua sem assinatura (como antes da PR).
- Missões: título único na tela nova (coberto pelo teste de navegador).

### Não validado

Conta real (salvar emoji no servidor, vitrine de outra conta), iPhone/Android físico, zoom 125% real do sistema, leitores de tela e o conjunto completo de testes de navegador do CI (`telas.browser.cjs` e Karaoke não foram executados aqui).

### Testes desta rodada

- `node tests/run-all.js`: 123/123.
- `node tests/passatempos-refino.browser.cjs`: passou (fichas em 4 larguras; três partidas completas com uma recompensa por tipo; Dica nos seis idiomas; Recomeçar zera passos; emoji com seletor, sequência composta de 7 caracteres preservada e limite de 8; vitrine; título único das missões; Bloom).
- Roteiros próprios de auditoria (fora do repositório): Duo em 320/390/1440 claro/escuro, mãos do Studio em 4 poses × 5 objetos × 3 enquadramentos, Bloom em três horários.
