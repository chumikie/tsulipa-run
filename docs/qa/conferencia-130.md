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
