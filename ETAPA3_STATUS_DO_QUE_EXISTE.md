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
| Ritmo 45 s e resultado do microfone | **SOMENTE PLANO** | `ETAPA3A_KARAOKE_ONLINE_9_IDOLS.md` |
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
