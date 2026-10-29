# ETAPA 3 — O que EXISTE e o que é APENAS PROPOSTA

**Atualizado: 2026-10-29.** Este quadro evita confundir **documento** com **funcionalidade no jogo**. Os planos são guardados em arquivos Markdown, não significam implementação.

| Recurso | Estado | Onde conferir |
|---|---|---|
| Center⭐Run, perfil, loja e moderação originais | Já existem, preservar | `index.html`, `index2.html` |
| Sora⭐Jump! | Implementado em arquivo experimental, com modo embed | `sora-jump.html` |
| Karaoke⭐Day! | Sala **simulada** e cena visual, não multiplayer | `karaoke-day.html` |
| INDEX 2 e visual integrado | Implementado na branch de testes | `index2.html`, CSS do embed |
| Aviso/timer Karaoke | Implementado na INDEX 2; bloqueio de interface não é autenticação do servidor | `index2.html` |
| Teste como admin no Karaoke fechado | Implementado no frontend da INDEX 2 com flag de admin do perfil; backend do multiplayer ainda não existe | `index2.html` |
| Nome de bebida **Melon Juice!** | Rótulo corrigido **no jogo experimental**, identificador interno preservado | `karaoke-day.html` |
| Karaoke online de **9 participantes** | **MODELO LOCAL IMPLEMENTADO**, com fila/vagas/microfone e testes; **ainda NÃO é multiplayer**, sem tabelas/RPCs reais | `karaoke-room-model.js`, `tests/karaoke-room-model.test.js`, `karaoke-online-lab.html` |
| Preparação **Etapa 3A.4** | Login anônimo de teste com suporte a Cloudflare Turnstile preparado somente no cliente experimental. **Cadastro permanece bloqueado** enquanto a sitekey pública estiver vazia; proteção antiabuso precisa ser habilitada no Supabase de homologação ANTES de habilitar Anonymous Sign-ins. Nenhuma configuração de Auth foi ativada automaticamente; sem contas novas. | `karaoke-homol-client.js` |
| Homologação **Etapa 3A.2–3A.3** | Servidor de 9 vagas + fila de 3 instalado apenas no segundo Supabase; retrato sanitizado dos participantes e cliente opcional `?homol=1` no Karaoke original. **Ainda sem nove sessões reais testadas**: não há contas de teste, autenticação anônima precisa ser habilitada, Realtime e autorização de horário não foram implementados. | `supabase/sql/karaoke_lab_3a2_room_queue.sql`, `supabase/sql/karaoke_lab_3a3_sanitized_elenco.sql`, `karaoke-homol-client.js`, `karaoke-day.html` |
| Ritmo 45s / turno 60s **no Karaoke original** | **JOGÁVEL na INDEX 2 como ENSAIO LOCAL**: notas, PERFECT/GOOD, combo e placar; **sem multiplayer/sem salvar score** | `karaoke-day.html`, `karaoke-rhythm.js`, `karaoke-rhythm.css`, `tests/karaoke-rhythm.test.js` |
| Convites persistentes | **SOMENTE PLANO**; prévia visual não envia mensagens | `PLANO_KARAOKE_MODERACAO.md` |
| Insígnia Nota Perfeita | **SOMENTE PLANO**, não concedida | `ETAPA3A_KARAOKE_ONLINE_9_IDOLS.md` |
| Coleções **Karaoke Idol** e **Sora Idol** | **CATÁLOGO ESCRITO**, não desenhado, não disponível na loja, não comprado | `ETAPA3B_CATALOGO_KARAOKE_SORA_DUO.md` |
| Cenários e poses Moon⭐Duo adicionais | **CATÁLOGO ESCRITO**, não renderizados | `ETAPA3B_CATALOGO_KARAOKE_SORA_DUO.md` |
| Novas danças idol | **SOMENTE CONCEITO**, sem novas animações implementadas | `ETAPA3B_CATALOGO_KARAOKE_SORA_DUO.md` |
| Temas sazonais originais (12) | **JÁ EXISTEM, NÃO RENOMEAR** | `TEMA_INFO` do `index2.html` |
| Lista de músicas/covers da playlist TsuLiPa (151 vídeos) | **TEXTOS CONFERIDOS em duas mensagens**, incluindo `Nagori Zakura` e `Gosenfu no Tasuki`; **URLs individuais ainda não confirmadas** | `ETAPA3C_TEMAS_E_COVERS.md` |
| Dia da Paz / Gosenfu no Tasuki | **PROPOSTA**, não ativada | `ETAPA3C_TEMAS_E_COVERS.md` |
| Vozes reais / reações do trio | **ESPECIFICAÇÃO**, áudios não recebidos nem aplicados | `ETAPA3D_TRIO_VOZ_E_ANIMACAO.md` |
| Admin vestir outra pessoa | **PROPOSTA**, nenhuma RPC criada | `PLANO_KARAOKE_MODERACAO.md` |

## Prévia funcional da etapa 3A.1 (não online)
- [Abrir laboratório local das 9 vagas](./karaoke-online-lab.html) — ensaio de fila, microfone e contagem de tempo, com Idols fictícios.
- Lógica pura: `karaoke-room-model.js`; testes automatizados: `tests/karaoke-room-model.test.js`.
- Não autentica, não sincroniza navegadores, não tem chamadas Supabase e não cria registros ou moedas. Os resultados ficam assinalados como `demo_unverified`.
- **Próxima implementação real:** montar projeto Supabase de homologação isolado, aplicar regras atômicas de vagas/filas no servidor, conectar os nove usuários de teste à sala visual existente, verificar moderação no backend. Só então criar pontuação Realtime e jogo de ritmo.


## INDEX 2 — preview do ensaio local
- **URL para testar:** https://tsulipa-world-git-feature-sora-karaoke-v2-2026-10-29-tsu-li-pa.vercel.app/index2.html
- Na INDEX 2, abrir o HUB e clicar no card **Karaoke⭐Day!**. Fora do horário de domingo, o modal oferece **🧪 Ensaiar agora**, que abre o mesmo jogo no iframe com `rehearsal=1`, sem autenticação multiplayer ou dados de jogos reais.
- O card do Karaoke informa em **PT/ES/EN/TH/JA** que o ritmo está pronto para ensaio e o multiplayer ainda está em desenvolvimento.
- A mudança é restrita à INDEX 2. A regra normal de horário no card continua; a exceção é **apenas visual de ensaio** na branch de testes e não controla uma sala real.
- Os convites continuam **não enviados**; o botão exibe aviso explícito.
- Testes de comportamento verificam que acesso normal fora do horário continua bloqueado e o ensaio manual abre o iframe corretamente.

## Incremento jogável concluído
- A cena original `karaoke-day.html` apresenta **7/9 Idols de demonstração** (6 avatares simulados + um personagem local), com 8 posições de plateia, não 12.
- O botão **Pegar microfone** inicia uma rodada local de **60s**: 5s de introdução, 45s de estrelas para acertar com toque/teclado e 10s de aplausos. Conta `PERFECT`, `GOOD`, combo e placar, sem gravar nada.
- Ao terminar, o resultado indica **ensaio** e não gera moedas ou insígnias. Sair do microfone interrompe a rodada; o tempo independe do FPS; reentrada na aba recalcula.
- **Nenhum Supabase de homologação foi criado**: o único projeto Supabase atualmente conectado é produção. Falta a implementação da **autoridade do servidor, 9 pessoas de verdade, chat/emojis sincronizados e placar compartilhado**.
- Testes de sintaxe, contratos estáticos e unidade automatizados em GitHub Actions; **não houve teste de navegador visual automatizado**.

## Decisões finais do criador
- Coleção oficial proposta: **Sora Idol**, nunca Sky Idol.
- **Manter os 12 nomes originais dos temas sazonais.** Curadoria pode propor mudança de **música associada** sem renomear tema; nenhuma modificação automática.
- Playlist `TsuLiPa - Participações`: 151 vídeos. O criador colou parte de seus títulos; já cruzamos os que batem com os nomes atuais. Não atribuir videos só por serem covers do BRS48.
- Nenhuma tabela/RPC nova, compra real, score online, voz real ou dança foi ativada nesta etapa.
- **Nunca modificar `index.html` da `main`, realizar merge ou tocar dados de produção sem autorização.**

## Próxima execução — somente após continuidade técnica
1. Criar homologação Supabase separada com contas fictícias e 9 vagas reais.
2. Simular fila/microfone com estado autorizado no servidor antes de ritmo e convites.
3. Renderizar 1 roupa + 1 cenário Sora Idol e Karaoke Idol como preview, antes de disponibilizar preços/catálogo na loja.
4. Conferir os vídeos individuais e participação TsuLiPa antes de adicionar links aos temas.
5. Integrar áudios apenas se fornecidos e consentidos.
