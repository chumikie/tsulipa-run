# Mapa do código da página inicial

Referência técnica atualizada em 20/11/2026. O estado do projeto e as pendências ficam em [RETOMADA.md](RETOMADA.md). A extração original dos módulos está descrita em [REFATORACAO_INDEX.md](REFATORACAO_INDEX.md).

## Ordem de carregamento

1. O `<head>` de `index.html` carrega os utilitários de nitidez, áudio, movimento e avatar, além dos estilos. Preserve a ordem das folhas e dos blocos de CSS inline ao alterar a cascata.
2. Antes do script principal entram o cliente Supabase, `pet-sync.js`, `tw-i18n-base.js` e o arquivo do idioma ativo quando ele tem traduções separadas. Em seguida vêm os módulos de cada área e as funções que solicitam os arquivos adicionais.
3. O visual novo é o padrão. Quando ativo, o HTML carrega `tw-celular.css`, `tw-humor.js`, `tw-bichos.js`, `tw-bairro.js`, `tw-calendario.js`, `tw-celular.js` e `tw-presenca.js`. Em Ajustes, o visual clássico também pode carregar esse conjunto ao voltar para o visual novo.
4. O script principal inicializa o estado e liga os eventos das janelas. No fim do HTML entram `tw-windows.js` e `karaoke-tickets.js`. O Mapa começa a baixar após o evento `load`, usando um intervalo ocioso quando o navegador oferece essa opção.
5. **Desde 20/11/2026:** as fontes vêm de `kt-fonts.css` (subconjuntos WOFF2 do próprio site); o Google Fonts só entra em japonês (`twFontesJa`). Dez scripts que nenhum código da abertura usa na hora do parse carregam com `defer`: `karaoke-room-views.js`, `center-recovery.js`, `gacha-po.js`, `hub-layout.js`, `vida-cidade.js`, `tw-bichos.js`, `tw-calendario.js`, `tw-presenca.js`, `tw-windows.js` e os novos `tw-acessibilidade.js` e `tw-semana.js`. **Antes de pôr `defer` em outro arquivo**, confira se o script principal (ou um arquivo síncrono) usa algum nome dele na abertura: `pet-sync.js` (`TWPetSync.create`), `bloom.js` (conta de jogos do Início) e os avatares precisam continuar síncronos. `tw-marca.js` é pequeno e fica síncrono no topo.

## Onde alterar cada área

| Área | Arquivos e responsabilidades |
|---|---|
| Estrutura, estilos e janelas | `index.html` reúne o HTML, a inicialização e os eventos compartilhados. `tw-windows.js` trata das janelas. `centerrun.css` inclui estilos compartilhados e cada área tem sua própria folha. |
| Início e visual novo | `hub.js` monta cards, missões, vitrine e palco. `hub-layout.js` organiza o hub. `tw-celular.js` e `tw-celular.css` montam a interface do TsuPhone e suas páginas. |
| Center⭐Run! | `centerrun.js` mantém entrada, estado compartilhado e desenho de personagens. `centerrun-corrida.js` reúne a execução da corrida e é solicitado ao entrar no jogo. |
| Backstage⭐Pet! | `pet.js` mantém estado, alertas e entrada. `pet-sala.js` monta a sala, ações e minijogos ao abrir o Pet ou pedir a foto da corrida. `pet-sync.js` concentra a sincronização com a conta. |
| Perfil, Montar Idol e conta | `perfil.js` mantém estado e integração com a conta. `perfil-tela.js` carrega ao abrir o Perfil. `charmaker.js` reúne o editor. `conta.js` trata do login e das operações da conta. |
| Star⭐Gacha!, álbum e loja | `gacha.js`, `gacha-po.js` e `album.js` tratam dos giros, do pó e das coleções. `shop.js` reúne a loja. |
| Handshake⭐Event! e Happy⭐Cafe! | `jogos-base.js` oferece dados usados no Início, no Pet e no jornal. O primeiro acesso a qualquer um dos jogos baixa, em ordem, `handshake.js`, `cafe.js`, `cafe-gorjeta.js`, `cafe-vip.js`, `cafe-duplo.js` e `flores.js`. |
| Moon⭐Duo! | `duo-base.js` mantém estado, cenários e funções compartilhadas com outras telas. Ao abrir o Duo, a base carrega `duo.js`, `duo-tela.js` e `duo-pedido.js`. |
| Encontro do dia | `encontro-base.js` determina o dia em Brasília, sorteia o encontro e expõe o botão do Hoje. Ao abrir o Encontro, `encontro.js` desenha a cena, anima a dança e trata dos toques e da foto. |
| Mapa e Vida no bairro | `mapa-textos.js` reúne textos e `tw-mapa.js` monta o Mapa. `tw-bairro.js` mantém a lógica da semana e alimenta o Hoje e o Chat. `tw-bairro-tela.js` carrega ao abrir o painel ou quando uma ação guiada precisa dele. |
| Idol⭐News! e Calendário | `jornal.js` monta o jornal, incluindo pódios e novidades. `jornal-capitulos.js` baixa ao abrir o jornal ou o Calendário. `tw-calendario.js` monta a agenda no visual novo. |
| Bloom⭐Garden!, Photo⭐Studio! e Idol⭐Battle! | `bloom.js` mantém o jardim. `studio.js` baixa ao abrir o Studio ou quando o jornal precisa montar a capa. `battle.js` e `battle.css` baixam ao abrir o Battle. |
| Administração | `admin-base.js` mantém o estado e os dados compartilhados. `perfil.js` solicita `admin.js` quando a conta retorna com permissão de admin. |
| Karaoke⭐Time! | `karaoke-time.html` é a página da sala. Ela carrega `karaoke-ranking.js` (classificação e música da semana), `karaoke-biblioteca.js` (trilhas e prévias), `karaoke-palco-desenho.js` (desenho dos enfeites) e `karaoke-show.js` (show de ritmo) junto dos demais scripts da sala. |

## Ao editar

- Preserve na base o estado e as funções que o restante da página usa antes de abrir a área. Declarações repetidas na parte sob demanda podem sobrescrever o estado já inicializado. `tests/index-modules.test.js` verifica as divisões.
- Atualize o `?v=` no ponto que carrega o arquivo alterado. Para uma parte sob demanda, procure o endereço no módulo que a solicita, além das referências diretas no HTML.
- Ao alterar traduções da página inicial, edite `tw-i18n.js` e rode `node tools/i18n/dividir.js` para atualizar os arquivos servidos.
- Ao mover código entre módulos, confira a ordem usada pelos testes de leitura em `tests/site-source.js`.
- Rode `node tests/run-all.js` antes de enviar.

## Novos em 20/11/2026

| Arquivo | O que faz |
|---|---|
| `tw-semana.js` | Cartão "Esta semana" no Início (coluna da direita no computador): Show de sábado do Karaoke⭐Time!, Festa no mapa (bandeirinhas e lembrança grátis), Jogo da semana e convite para quem joga sem conta, também no fim do Center⭐Run!. RPCs em `supabase/migrations/20261120160000_semana_show_festa_jogos.sql`. |
| `tw-marca.js` | `twMarcaPng(canvas)`: selo "tsulipa-world.vercel.app" no canto das imagens que a pessoa baixa (cards, fotos, resultados). |
| `tw-acessibilidade.js` | Dá nome (aria-label) aos botões só de ícone (✕, ✏️, 🔊…) no idioma do jogo. |

## Novos em 21/11/2026 (PR das melhorias)
- `tw-marca.js` — também o **compartilhar**: no celular, todo link de imagem com `download` abre o compartilhar do aparelho (evento `tw-foto-salva` depois). `data-tw-baixar="1"` desliga num link.
- `tw-comunidade.js` — convite com prêmio (`?convite=CODIGO`), concurso de visual da semana, instalar como app, lembrete do Show de sábado (.ics) e convite de conta para o visitante depois da foto. Atalhos no Menu (`data-twk`).
- `sw.js` — service worker: guarda no aparelho os arquivos com `?v=` e a mídia; páginas e Supabase sempre pela rede. Emergência: `ATIVO = false`.
- `tw-celular.js` — "Hoje" com até 3 itens de tipos diferentes (gira a cada dia); jogo da semana primeiro na tela de Jogos.
