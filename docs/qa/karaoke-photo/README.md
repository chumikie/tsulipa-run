# Prévia de fotos do Karaoke⭐Time!

Base: `e08e2ce30faca04fc9bd289f6ec6a2b4a9fb4538`, PR #49. Entrega de 31/10/2026.

## Comportamento

A câmera segue o padrão de prévia de imagem do Center e do Pet (`#shr`), com a identidade compartilhada de `tw-windows.css`: fonte arredondada, estrela dourada, japonês rosa, superfície/paleta do tema, bordas, sombra, × e botões. A foto recebe uma moldura de photocard com fitinhas decorativas, sem alterar os pixels do PNG.

O clique copia o canvas da sala **sincronamente, antes de abrir a janela ou pausar o show**. A codificação assíncrona usa essa cópia privada, não o canvas vivo. A imagem completa, incluindo expressões, pets, balões e clipe/notas daquele quadro, permanece congelada em PNG 1920 × 1080. O recorte de visualização mobile não corta o arquivo.

- **Compartilhar / salvar:** aparece quando `navigator.canShare({files})` aceita o PNG. O arquivo já está pronto quando a pessoa toca o botão; `navigator.share()` é chamado diretamente no gesto. A permissão `web-share` é explicitada no iframe integrado.
- **Baixar PNG:** link de download explícito para o mesmo arquivo, sem disparo automático. O aviso informa apenas que o download foi solicitado, não que uma foto foi salva no aparelho.
- **Voltar à sala / × / Escape:** fecham somente a foto, devolvendo foco à câmera. Um show que estava tocando retoma a mesma sessão; um show já pausado permanece pausado.
- **Alternativa de salvamento:** imagem real com toque longo/clique direito habilitados e orientação visível. Não depende do menu nativo de compartilhamento estar disponível.

Cancelamento do compartilhamento não vira download e não descarta a foto. Se o aparelho bloquear o compartilhamento, a janela mantém o PNG, o download e a alternativa pela imagem. Erro de codificação é mostrado sem afirmar sucesso. Fechar durante a preparação descarta callbacks tardios; URLs temporárias são revogadas e listeners no documento hospedeiro são removidos ao descarregar o iframe.

A posição e a altura da janela levam em conta a região visível da página hospedeira, evitando centralizar a foto fora da tela em um iframe alto. O contorno escurecido/blur é restrito à janela de foto. Nenhum CSS do layout da sala foi alterado.

## Capturas

- [Celular, tema claro — 320 px](mobile-light.webp).
- [Celular, tema escuro — 390 px](mobile-dark.webp).
- [Computador — 1440 px](desktop.webp).
- [Karaoke avulso](standalone.webp).
- [Resultados do fluxo integrado](results.json) e [avulso](standalone-results.json).

As capturas usam dados locais. A presença da ação de compartilhar nas capturas representa um navegador com suporte; a API foi simulada nos testes, sem abrir um destino ou enviar arquivos.

## Validação

- Sintaxe dos scripts, validação estática e 13 suítes Node aprovadas.
- Chromium em 320 px/claro, 390 px/escuro e 1440 px/escuro: a prévia corresponde aos pixels exatos do clique e não muda enquanto o canvas ao fundo continua animando.
- PNG com dimensões 1920 × 1080. Hash SHA-256 do download real igual ao arquivo preparado para compartilhar.
- Suporte a compartilhar, cancelamento e bloqueio simulados; gesto de ativação preservado, sem download ao cancelar. Navegador sem compartilhamento mantém prévia, download e orientação de salvamento.
- Foco/Tab contidos na janela, retorno do foco, Escape preservando a sala, pausa/retomada e token da sessão mantido.
- Cobertos show previamente pausado, fechamento antes da codificação terminar e falha de codificação, sem URL tardia ou falso sucesso.
- Versão avulsa: nova janela sobre o diálogo original, download PNG e retorno preservando a sala.
- Geometria da sala, canvas, controles e botões comparada à base em 390/1440 px, sem mudanças.
- Requisições externas bloqueadas. Sem login real, upload, consumo de tentativas online ou alterações no banco.

O menu nativo de salvar/compartilhar do iPhone **não foi validado em aparelho físico**. A conferência no iPhone continua complementar; os testes não tratam a simulação da API como prova desse menu.

```sh
node --check karaoke-photo.js
node tests/validate-games.js
node --test tests/*.test.js
QA_PHOTO=1 QA_WIDTHS=320,390,1440 node tests/karaoke-mobile.browser.cjs /tmp/karaoke-photo
QA_PHOTO_STANDALONE=1 node tests/karaoke-mobile.browser.cjs /tmp/karaoke-photo-standalone
```

O teste de navegador requer Playwright e Chromium. Instrumentação e mocks existem exclusivamente no servidor/respostas e contextos locais dos testes, sem acesso adicional na aplicação publicada.
