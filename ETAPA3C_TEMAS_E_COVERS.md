# ETAPA 3C — Revisão de temas sazonais e referências dos covers

**Status: curadoria proposta, NÃO aplicada a `TEMA_INFO` / `TEMA_MUSICA` / banco.** Dados de origem conferidos em `index2.html`, branch experimental, 2026-10-29.

## Por que separar os campos
O código hoje define `TEMAS` (datas), `TEMA_INFO` (visual + rótulo), `TEMA_MUSICA` (nome fixo apresentado no chip). Isso **não comprova** que a música seja um cover do TsuLiPa.

No futuro, sem renomear chaves internas ou itens existentes:
```js
const TEMA_EDITORIAL = {
  halloween: {
    nome: "Halloween · Noite das Estrelas",
    origem: "Especial TsuLiPa / BRS48",
    musica: "Love Pulsar", // associação proposta pelo criador; verificar vídeo exato
    videoId: null,         // só preencher após conferência
    autoria: "pendente",
    linkVisivel: false
  }
};
```
No chip mostrar `emoji + nome editorial + data`. Abaixo, apenas para músicas confirmadas como cover do TsuLiPa, mostrar `🎵 Cover: título · ▶ Assistir` com link exato do vídeo original, `rel=noopener noreferrer`. **Nunca fabricar IDs do YouTube**, atribuir versões erradas ou ativar vídeos automaticamente. Covers de outros integrantes podem ficar em uma seção de "BRS48 e amigos" sem serem apresentados como TsuLiPa.

Playlist indicada pelo criador para curadoria:
<https://www.youtube.com/playlist?list=PLNWt7c7jhJIioP7LttHhxfi19dM-iHn7v>
Não foi possível extrair/verificar a listagem de vídeos nesta sessão. A tabela abaixo registra `TEMA_MUSICA` atual diretamente do código; não é prova de autoria dos covers.

## Tabela de 12 temas existentes — proposta editorial
| Chave interna (não mudar) | Rótulo atual | `TEMA_MUSICA` atual | Novo nome público sugerido | Decisão de cover |
|---|---|---|---|---|
| `natal` | Natal | Manatsu no Christmas Rose | Natal · Jardim de Luzes | Verificar se o vídeo é TsuLiPa |
| `anonovo` | Ano Novo | Wish You Happiness!! | Ano Novo · Desejos de Estrela | Verificar |
| `verao` | Verão | Gomen ne, SUMMER | Verão · Céu de Verão | Verificar |
| `valentine` | Valentine | Valentine Kiss | Valentine · Cartas do Coração | Verificar (tema aparece duas vezes ao ano) |
| `outono` | Outono | Sugaring Off Party! | Outono · Café de Outono | Verificar |
| `sakura` | Sakura | Nagori Zakura | Sakura · Pétalas do Reencontro | Verificar |
| `inverno` | Inverno | Teion Yakedo | Inverno · Melodia de Neve | Verificar |
| `tanabata` | Tanabata | Hello, Hoshi o Kazoete | Tanabata · Mil Estrelas | Verificar |
| `primavera` | Primavera | Blooming♡Blooming | Primavera · Jardim dos Idols | Verificar |
| `halloween` | Halloween | Bad∞End∞Night | Halloween · Noite das Estrelas | Criador sugeriu **Love Pulsar** em vez de atual; verificar link exato e participação |
| `criancas` | Dia das Crianças | Visionary | Dia das Crianças · Sonhos Coloridos | Verificar |
| `aniversario` | Aniversário do BRS48 | 26 Estados e 1 Distrito | Aniversário · Nosso Palco de Estrelas | Preservar homenagem BRS48; verificar cover |

**Datas observadas em `TEMAS` (horário de Brasília):**
- Natal 01/12–26/12; Ano Novo 27/12–02/01; Verão 03/01–16/01
- Valentine 01/02–15/02 e 05/06–13/06
- Outono 20/03–31/03; Sakura 01/04–14/04; Inverno 21/06–05/07; Tanabata 06/07–08/07
- Primavera 22/09–06/10; Crianças 08/10–14/10; Halloween 24/10–02/11; Aniversário 10/11–16/11

**Observação:** `TEMA_MUSICA` é rótulo editorial e não prova de gravação, titularidade dos direitos ou participação das três integrantes. As associações ficam com estado `pendente` até verificação.

## Novo tema: Dia da Paz · Laço Branco 🕊️
- **Chave nova proposta:** `paz` (não aplicada). **Dia:** 21 de setembro, Dia Internacional da Paz; não conflita com `primavera` iniciando em 22/09 no calendário atual.
- **Nome público:** "Dia da Paz · Laço Branco"; subtítulo japonês `平和のリボン`.
- **Referência musical desejada:** **Gosenfu no Tasuki**; verificar vídeo/participação do TsuLiPa antes de linkar e revisar autorização de reprodução. O botão nunca toca música automaticamente.
- **Fundo:** céu quase branco com azul bebê, dourado leve, um horizonte gentil; fita, estrelinhas, pombas estilizadas sem símbolos políticos.
- **Partículas leves:** pequenas fitas brancas e flores, quantidade alinhada aos 14 elementos atuais; baixo contraste, respeitar reduced motion.
- **Vestuário:** `roupa_kr_peace` White Peace Stage (gratuita ao participar do evento ou proposta da loja depois); branco para Tsu/Lirika/Pati no palco; cosméticos brancos opcionais aos outros Idols, sem alterar o look de ninguém automaticamente.
- **Mensagem:** "Que todos possam brilhar em paz, lado a lado. 🕊️💖".
- **Perfil / Duo / Sora:** fundo `fundo_sky_peace`, coroa de flores brancas, mãos estendidas; acesso gratuito à decoração temporária, compra para guardar permanentemente conforme catálogo.
- Não remover temas nem criar migração de save. Renderizadores precisam reconhecer `paz`, senão escolher fallback seguro antes de ativar.

## Plano de vincular covers
1. Abrir playlist original e construir tabela `videoId, título do vídeo, integrantes, grupo, data, URL original` **com validação humana**.
2. Para cada tema, marcar `cover_verified: true/false` somente se o cover correspondente existir e for realmente do TsuLiPa.
3. O vídeo fica numa página do YouTube, não embed automático no site, para evitar peso e autoplay.
4. A tradução dos novos nomes públicos (PT, ES, EN, TH, JA) é uma camada separada de `TEMA_INFO`; nunca mudar key `halloween`, `valentine`, `sakura`, nem `tema_...` ou `roupa_...` já salvas.
5. Conferir contraste e comportamento com o tema forçado na área de moderação **somente em homologação**.
