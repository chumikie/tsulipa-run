# ETAPA 3D — Tsu, Lirika e Pati: voz real e interação aconchegante na abertura

**Status: especificação de UX e áudio, NÃO ativada no jogo.** Requisitos: gravações reais autorizadas pelos integrantes, sem áudio automático e sem alterar saves.

## Componentes já existentes a preservar
- `hubCv`: o trio está em um canvas original de 640 × 340, com três personagens estáticos/levemente animados. `HUB_TRIO` define positions fracionárias: Tsu x=0,20; Lirika x=0,50; Pati x=0,78. `hubDesenhar()` já usa o fundo sazonal e as roupas do tema.
- `hubIdolsCv`: **outra** vitrine, de jogadores reais que aparecem deslizando no painel inferior. Já possui sistema próprio de reações à interação. **Não associar as vozes das integrantes a Idols de usuários comuns** nem misturar os dois canvases.
- A página já possui música e `muted`/Web Audio. Não criar um segundo volume global nem tocar áudios depois de fechar o hub.

## Proposta: toque em qualquer uma das três integrantes
| Idol | Ação ao toque | Emojis e efeito | Possível voz |
|---|---|---|---|
| Tsu | Aceno curto com microfone e uma estrelinha | 💜⭐🐈 | voz real: "Oi, sou a Tsu!" |
| Lirika | Inclina a cabeça, faz mini coração e volta a descansar | 💚🌼🐨 | voz real: "Oi! Lirika!" |
| Pati | Pisca, gesto lateral de mão e brilho de lua | 💙🌙✨ | voz real: "Oi, eu sou a Pati!" |

- *Não* obrigar frases específicas: são exemplos para gravar, não textos já fornecidos. Revisar preferência e consentimento de uso público de cada integrante.
- **Estado normal**: uma piscada discreta de tempos em tempos, flutuação de 1–2 px e expressões ocasionais sem sons. Não alterar `HUB_TRIO` nem fazer o trio caminhar/deslizar.
- **Estado ativo**: 1,2–2s de reação, uma onda de 3–6 emojis suaves, volta à pose original. Sem animações incessantes.
- **Som**: somente no toque/clique real, só quando `muted===false` e após o usuário habilitar áudio; cooldown individual/global de 4s; parar ao abrir jogo, trocar de página ou ocultar aba. Não tocar vozes antes de tocar "Começar".
- **Sem arquivo real:** animação e legenda funcionam normalmente, sem fingir que uma voz tocou. Nunca gerar imitação de voz sem autorização explícita.

## Interação acessível
- Sobre o canvas `hubCv` adicionar três alvos transparentes/visíveis ao foco, DOM `button` com `aria-label="Ouvir Tsu"`, "Ouvir Lirika", "Ouvir Pati"; posicionados proporcionalmente à resolução e atualizados quando hub/viewport muda. O canvas permanece arte, não controle invisível sem teclado.
- `Enter` e `Space` funcionam; `focus-visible` mostra anel e um rótulo. `prefers-reduced-motion` substitui transição pelo brilho estático. `caption` opcional com o cumprimento (não apenas áudio).
- Não capturar cliques na vitrine `hubIdolsCv`. O layout em celular pode usar três botões "💜 Tsu / 💚 Lirika / 💙 Pati" abaixo do canvas se os alvos sobrepostos forem apertados.
- Reutilizar renderizador de `drawChar` e estados da animação, sem criar canvases enormes ou recarregar a página.

## Guia de arquivos reais (ainda não fornecidos)
- Solicitar gravações que as integrantes desejam usar **e sua autorização**; nomes propostos: `audio/tsu-hello.mp3`, `audio/lirika-hello.mp3`, `audio/pati-hello.mp3`. Arquivos não existem até serem enviados; não inventar gravações ou usar vozes de terceiros.
- Master de voz limpo, normalização leve para evitar sustos; ~0,7–1,5 segundos; 32–64 kbps em MP3/AAC leve para compatibilidade móvel. Meta inicial **até 20 KB cada**, sujeita à qualidade real; não é garantia.
- **Carregamento preguiçoso:** não buscar os três áudios durante o carregamento inicial do site. Precarregar apenas se áudio ativado e necessário, ou carregar sob demanda no primeiro toque. Cache do navegador, `preload=none`, controle de volume compartilhado com o áudio existente.
- Evitar áudio que reproduza músicas protegidas de fundo; cortar trechos com direitos musicais não autorizados.
- Preferir preservar **o arquivo original enviado e seus direitos fora do repositório público**, publicando apenas a versão editada com consentimento e controle de volume.

## Testes de aprovação
1. Modo sem som: clique produz emojis e legenda, nenhum áudio. Com som: 1 voz correta por toque, sem duplo disparo.
2. Tocar/pausar o hub, fechar, abrir outro jogo: a voz não continua sozinha. Trocar tema Tsu/Lirika/Pati não troca o mapeamento da pessoa clicada.
3. iPhone Safari e Android Chrome: gesto de toque permite áudio, sem autoplay, sem mudança brusca de volume.
4. Com `prefers-reduced-motion`, aparelhos fracos e orientação vertical: sem perda perceptível de FPS. O trio permanece parado fora da reação.
5. Vitrine `hubIdolsCv` mantém todos os efeitos e cliques existentes.

## Entregas separadas
A. Primeiro a animação silenciosa do trio somente na INDEX 2.
B. Depois os controles de áudio/caption com placeholders e som desligado por padrão.
C. Por último integrar as três gravações **depois do envio e consentimento**, medir tamanho/fps e pedir aprovação de cada uma.
