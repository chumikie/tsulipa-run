# Mapa do código da página inicial (index.html + módulos)

Resultado da refatoração da PR #62 (02/11/2026). O `index.html` passou de ~876 KB para ~218 KB sem mudar nada
na tela: os blocos grandes foram para arquivos próprios. Método e conferências de cada etapa:
`docs/REFATORACAO_INDEX.md`.

## Como a página carrega (ordem importa)

1. `<head>`: `centerrun.css` (base do site + Center⭐Run) → `pet.css` → `perfil.css` → `hub.css` → `gacha.css`
   → `duo.css` → `encontro.css`, intercalados com os `<style>` que sobraram no `index.html` (regras mistas e admin),
   na mesma ordem de cascata de antes.
2. Scripts compartilhados: `tw-motion-lifecycle.js`, `tw-avatar-items.js`, `tw-avatar-hair.js`, Supabase,
   `pet-sync.js`, `tw-i18n.js` (traduções).
3. **Módulos (só declaram funções e tabelas fixas, não executam nada ao carregar):**
   `centerrun.js` → `pet.js` → `perfil.js` → `gacha.js` → `duo.js` → `encontro.js` → `hub.js` → `conta.js`.
4. **Script principal do `index.html`**: cria o estado, monta as janelas, liga os eventos e inicia tudo, na mesma
   ordem de antes (por isso ele pode chamar funções dos módulos em qualquer ponto).
5. Depois: `tw-index2-ux-fixes` (inline), `tw-windows.js`, `karaoke-tickets.js`.

## Onde fica cada coisa

| Arquivo | O que tem | Tamanho |
|---|---|---|
| `index.html` | Estrutura da página, estado de cada área, montagem das janelas, eventos, inicialização, ponte com o Karaoke⭐Time!/Sora⭐Jump!, **modo admin** (Etapa 6, pendente) e regras de CSS mistas | ~218 KB |
| `centerrun.js` / `centerrun.css` | Center⭐Run!: personagens (`drawChar`), corrida, cenário vivo, ranking local, foto/photocard, PNG do avatar, temas da temporada, easter eggs, outdoors, obstáculos, Temporada 2 · CSS: base visual do site inteiro | ~218 KB |
| `pet.js` / `pet.css` | Backstage⭐Pet!: camarim, ações, câmera, coleção, Meu Pet, sons, conversa, estágios, minijogos, temas do camarim | ~118 KB |
| `perfil.js` / `perfil.css` | Perfil público e pessoal, Estúdio de foto, Montar Idol, lojinha, nuvem, presente diário | ~107 KB |
| `hub.js` / `hub.css` | Tela de início: cards, missões, Top Idols, TsuLiPa⭐TV, insígnia nova, busca, música, vitrine | ~83 KB |
| `duo.js` / `duo.css` | Moon⭐Duo!: desenho da cena, telas, abas, lojinha, itens travados, aviso | ~39 KB |
| `gacha.js` / `gacha.css` | Star⭐Gacha!: giro, card do Idol, últimos cards, zoom | ~16 KB |
| `conta.js` | Login com Google, caixa de login, carregar/importar a conta, estrelas e ranking no servidor, modo teste com parceiras, apagar conta (LGPD) | ~13 KB |
| `encontro.js` / `encontro.css` | Encontro do dia: cena, halo, emojis, ordem do trio, prêmio | ~11 KB |
| `pet-sync.js` | Sincronização do pet com a nuvem (única camada; não duplicar) | — |
| `tw-i18n.js` | Traduções (en/es/th/ja) usadas pela página inicial | ~238 KB |

## O que ainda mora no index.html (de propósito)

- **Estado e ordem de execução:** variáveis com valor inicial calculado (`document.createElement`, `localStorage`…),
  `addEventListener`, `setInterval`, invólucros da Temporada 2 (`reset = function…`) e as chamadas de início
  (`hubMostrar()`, `petAlertLigar()`…). Mover isso mudaria a ordem em que as coisas acontecem.
- **Tabelas lidas antes da própria declaração** (ex.: `PERF_LOJA`, `PERF_POSES`, `LOJA_EXTRA`): se fossem para um
  módulo, passariam a existir mais cedo do que antes.
- **Modo admin** (`admin*`, `adm*`): Etapa 6, esperando a PR #60.
- Pequenos restos sem dono claro (aniversário do jogador, rodapé, botão de som das janelas, look atual no servidor,
  acessórios comprados, frases da temporada dos pets): poucos e ligados a várias áreas.

## Como mexer daqui pra frente

- **Função nova de uma área:** declare no módulo da área (ex.: `pet.js`). Nada no módulo pode executar ao carregar;
  quem chama é o script principal ou um evento. O teste `tests/index-modules.test.js` acusa se o módulo executar algo.
- **Estado ou evento novo:** no script principal do `index.html`, perto do resto da área.
- **CSS novo:** no `.css` da área. Regra que mistura áreas fica no `<style>` do `index.html`.
- **Mudou um arquivo?** Suba o `?v=` dele no `index.html` (cache do navegador).
- **Testes de texto** leem `index.html` + módulos com `tests/site-source.js` (lista `MODULOS`). Arquivo novo entra lá.
- Antes de enviar: `node tests/run-all.js`.
