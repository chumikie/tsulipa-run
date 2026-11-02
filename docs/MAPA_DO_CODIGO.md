# Mapa do código — TsuLiPa⭐World

> **Foto de referência:** branch `main`, commit `01975e77b6991dbd1646da0df29238c10096dc24` (02/11/2026).
> Este mapa descreve o código que está incorporado em `main`. PRs abertas são propostas e só entram neste mapa como implementação atual depois de serem incorporadas.

## Objetivo

Usar este arquivo como índice vivo para quem mantém o TsuLiPa⭐World — pessoas e assistentes. A refatoração aqui descrita é estrutural: extrair áreas de `index.html` sem mudar aparência, textos, fluxo de jogo, regras, persistência ou integração com o Supabase.

**Regra de segurança:** cada extração deve ser pequena, isolada e revisável em sua própria PR. Não misturar refatoração com correção de bug, melhoria visual, mudança de regra ou migração de banco.

## Estado estrutural atual

- `index.html` tem aproximadamente **1.088.730 bytes** e reúne estrutura da página, estilos internos e grande parte do JavaScript das áreas principais.
- Há dois blocos `<style>`: o bloco principal de estilos e um pequeno estilo anti-flash.
- A página usa scripts clássicos e variáveis/funções globais compartilhadas. A ordem de carregamento é relevante.
- Já existem módulos JavaScript e folhas CSS externas. Eles devem ser reaproveitados; não criar cópias paralelas.
- `tw-i18n.js` já contém a tabela principal `window.TW_DICT`, mas várias tabelas de tradução ainda estão dentro de `index.html`.
- O executor `tests/run-all.js` descobre **45 verificações** neste snapshot: `validate-games.js` mais os arquivos `*.test.js`.

## Mapa por área

As linhas abaixo são referências do snapshot indicado no início deste documento. Elas ajudam a localizar o código, mas podem mudar quando as extrações forem incorporadas.

| Área / responsabilidade | Onde está hoje | Destino da extração |
|---|---|---|
| Estrutura da página, cabeçalho, overlays, canvas, containers e montagem do DOM | `index.html` | Permanecem em `index.html`, que deve ficar com o esqueleto da página e as referências aos arquivos externos |
| Backstage⭐Pet — camarim, estado, necessidades, coleção, criador, decoração, ações e minijogos | `index.html`, principalmente seções a partir das linhas 3671–6313; estilos e renderização compartilhada também aparecem antes | `pet.js` e `pet.css` |
| Perfil, perfil público, editor de Idol, avatar, Estúdio, roupas, presentes e save na nuvem | `index.html`, seção iniciada na linha 6664 e encerrada perto da 8795; renderização do avatar/Estúdio também está dentro dessa área | `perfil.js` e `perfil.css` |
| Gacha — máquina, sorteio, overlay, itens e integração sonora | `index.html`, seção iniciada perto da linha 10307; há ganchos compartilhados de áudio e fechamento de overlay em seções posteriores | `gacha.js` e `gacha.css` |
| Moon⭐Duo! — cenas, parceiros, poses, expressões, loja, câmera e falas | `index.html`, seção iniciada na linha 10711; há integrações de música e overlays em trechos posteriores | `moon-duo.js` e `moon-duo.css` |
| Encontro do dia — escolha diária, cena, participantes, falas e integração ao Hub | `index.html`, seção iniciada perto da linha 11703, com ganchos adicionais no Hub | `encontro.js` e `encontro.css` |
| Moderação e ferramentas administrativas | `index.html`, seção de administração iniciada perto da linha 8425, além de ações de moderação posteriores (por exemplo, perto da linha 12019) | `admin.js` e `admin.css` |
| Hub / página inicial — cards e blocos, Hoje, Jogos, Meu Mundo, missões, Top Idols e TsuLiPa⭐TV | `index.html`, seção iniciada perto da linha 9107; Top Idols e TV também têm código em trechos posteriores | `hub.js` e `hub.css` |
| Center⭐Run! — jogo principal, placares, temporadas, recompensas e integração de conta | Código distribuído em `index.html`; o bloco visual/lógico da Temporada 2 começa perto da linha 12379. Há estado e serviços compartilhados em outras seções | `center-run.js` e `center-run.css` |

### Limites importantes entre módulos

1. **Renderização compartilhada de personagens e pets:** funções de desenho são usadas por mais de uma área (Perfil/Estúdio, Hub, Pet, palco e jogos). Não mover uma função apenas porque o nome contém `pet` ou `avatar`. Primeiro registrar todos os consumidores; depois decidir se ela pertence a um módulo compartilhado ou se pode ser exportada por um dos módulos sem alterar a ordem de carregamento.
2. **Autenticação, ranking e créditos:** login, nome de Idol, saldo, ranking e validação do Center Run atravessam mais de uma área. A extração de `center-run.js` não deve duplicar nem reescrever essas regras.
3. **Administração:** esconder ou carregar `admin.js` somente para administradores é uma decisão de interface, não uma barreira de segurança. Cada ação continua protegida e validada no servidor (`eh_admin()`/RPCs e políticas existentes). Não mover chaves secretas para o navegador.
4. **Pet e nuvem:** `pet-sync.js` já é um módulo separado de sincronização. Mantê-lo como dependência especializada; `pet.js` concentra a experiência Backstage⭐Pet sem duplicar o protocolo de persistência.
5. **Karaoke⭐Time! e Sora⭐Jump!:** são páginas/experiências próprias, com arquivos e folhas de estilo externos. Esta rodada de extração do `index.html` não é autorização para reestruturar essas páginas.

## Arquivos compartilhados que já existem

### JavaScript

| Arquivo | Responsabilidade atual |
|---|---|
| `tw-i18n.js` | Tabela principal de traduções (`window.TW_DICT`) |
| `tw-avatar-hair.js` | Desenho/camadas de cabelo compartilhadas |
| `tw-avatar-items.js` | Desenho de itens e acessórios compartilhados |
| `tw-motion-lifecycle.js` | Ciclo de vida e visibilidade de animações |
| `tw-windows.js` | Comportamento compartilhado de janelas/overlays |
| `pet-sync.js` | Sincronização e persistência do Pet |
| `karaoke-tickets.js` | Integração de tickets do Karaoke⭐Time! |
| `karaoke-room-*.js`, `karaoke-mobile.js`, `karaoke-photo.js` e `karaoke-music-preview.js` | Controladores e recursos da experiência própria do Karaoke |

### CSS

Já existem folhas de estilo externas, entre elas:

- **Hub/inicial:** `index2-skin.css`, `index2-launch-ui.css`, `tw-index2-preview.css`, `tw-weekly-podium.css`.
- **Janelas e elementos compartilhados:** `tw-windows.css`, `tw-mic-cd-popup.css`.
- **Tema de jogos e Sora:** `games-theme.css`, `sora-embed.css`.
- **Karaoke:** `karaoke-time-base.css`, `karaoke-mobile.css`, `karaoke-photo.css`, `karaoke-popup.css`, `karaoke-tickets.css`, `kt-fonts.css`.

Esses arquivos não devem ser renomeados ou absorvidos automaticamente. Antes de mover estilos internos, verificar duplicações, escopo, dependências e ordem real de carregamento.

## Traduções: inventário para consolidação

- `tw-i18n.js` já possui `window.TW_DICT`, em inglês, espanhol, tailandês e japonês, com as chaves principais em ordem alfabética pela frase em português.
- Em `index.html` ainda existem tabelas da família `PET_DICT` (incluindo variantes numeradas), traduções das falas do Pet (`PET_FALAS_TR`) e a tabela de login/conta (`CONTA_DICT`).
- Também foram localizadas tabelas de Perfil/Admin/Hub e Center Run (por exemplo `PERF_DICT`, `PERF_DICT2`, `PERF_ADMIN_DICT`, `ADM_DICT`, `HUB_DICT` e `S2_DICT`), além de uma tabela de frases do Moon⭐Duo!. Elas devem ser auditadas antes da consolidação para distinguir traduções de dados, falas originais e catálogos.
- A extração deve manter os nomes globais/contratos usados hoje ou oferecer aliases de compatibilidade. Também deve preservar a ordem das mesclagens: em caso de chaves repetidas, o comportamento atual de sobrescrita não pode mudar acidentalmente.
- Ordenar as chaves pelo texto original em português dentro de cada catálogo/tabela. Não traduzir novamente nem revisar o conteúdo nesta etapa.

## CSS: fotografia de referência

No snapshot de `main` foram contadas **341 ocorrências de declarações `!important`**: 36 no CSS interno de `index.html` e 305 nas folhas CSS externas. As maiores concentrações externas são:

| Folha | Ocorrências |
|---|---:|
| `sora-embed.css` | 166 |
| `karaoke-time-base.css` | 54 |
| `index2-launch-ui.css` | 22 |
| `karaoke-popup.css` | 16 |
| `index2-skin.css` | 14 |
| Outras folhas externas | 33 |
| CSS interno de `index.html` | 36 |
| **Total** | **341** |

Essa contagem é uma fotografia, não uma meta para apagar regras. Na extração, manter especificidade e ordem de cascata equivalentes. A redução de `!important` deve ser uma frente posterior, com correções pequenas e testes próprios — não misturada à movimentação mecânica dos estilos.

## Contrato de carregamento

- Preservar scripts clássicos e a ordem em que os globais ficam disponíveis. Não converter tudo para `type="module"`, não adicionar `defer` indiscriminadamente e não mudar a ordem sem teste explícito.
- No começo, manter nomes globais e assinaturas existentes. Uma mudança de API entre áreas é refatoração funcional e deve ser tratada separadamente.
- Usar nomes de arquivo por área (`pet.js`, `perfil.js`, etc.) e versionar a URL do recurso quando o conteúdo mudar, seguindo o padrão já usado no projeto.
- `index.html` deve manter somente a estrutura, os pontos de montagem e os links ordenados para CSS/JS externos ao final do trabalho.
- Para `admin.js`, carregar a interface conforme o estado de autorização já confirmado, sem substituir validações no servidor.

## Plano de PRs e proteção contra regressões

Cada extração de área terá uma PR própria, pequena e baseada no `main` mais recente. Não empilhar oito PRs de extração sobre uma branch antiga: concluir/revisar uma área antes de criar a próxima, para evitar conflitos e tornar cada comparação compreensível.

Ordem proposta:

1. Consolidação de traduções em `tw-i18n.js` (incluindo a família Pet e login/conta).
2. `pet.js` + `pet.css`.
3. `perfil.js` + `perfil.css`.
4. `gacha.js` + `gacha.css`.
5. `moon-duo.js` + `moon-duo.css`.
6. `encontro.js` + `encontro.css`.
7. `admin.js` + `admin.css`.
8. `hub.js` + `hub.css`.
9. `center-run.js` + `center-run.css`.
10. Remoção final dos estilos/scripts residuais de `index.html), somente depois de comprovar que não há consumidor restante.

### Checklist obrigatório por PR de extração

- [ ] Confirmar o SHA-base atual do `main` e não descartar commits de outras pessoas.
- [ ] Registrar a captura **antes** no SHA-base e a captura **depois** na branch da PR, no mesmo Chromium/Playwright, com os mesmos dados de teste e viewports.
- [ ] Comparar visualmente e por imagem as mesmas telas/interações. Começar com desktop 1280×900 e celular 390×844; acrescentar viewports específicos quando a área exigir.
- [ ] Controlar hora, aleatoriedade, animações e respostas externas no modo de teste para que a comparação não gere diferenças artificiais.
- [ ] Guardar imagens e resultados como artefatos da execução do CI, inclusive quando houver falha.
- [ ] Executar `node tests/run-all.js`: manter as **45 verificações atuais verdes** e acrescentar testes de contrato da área extraída quando necessário.
- [ ] Rodar verificações de sintaxe dos novos arquivos, validação de links/recursos e `git diff --check`.
- [ ] Confirmar que não foram alterados dados, RPCs, SQL, regras de acesso, cálculo de pontos, save ou deploy.
- [ ] Revisar o diff da PR para garantir que ela contém somente a extração planejada.

**Critério de aceite:** comportamento e aparência equivalentes ao SHA-base; testes verdes; capturas antes/depois disponíveis; nenhuma mudança funcional, de banco ou de produção.

## Atualização deste mapa

Atualizar este documento na mesma PR que concluir cada extração: trocar a referência de `index.html` pelo novo arquivo, registrar dependências reais descobertas e retirar a área da lista de pendências. Se uma extração revelar que o limite do módulo está errado, documentar a decisão antes de seguir para a próxima área.
