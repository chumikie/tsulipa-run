# ETAPA 3B — Catálogo conceitual de loja, cenários e danças idol

**Status: catálogo proposto para aprovação visual; nenhum item foi cadastrado no banco e nenhum preço foi cobrado.** Revisado contra `index2.html` em 2026-10-29.

## Regras de integração
- Preços sugeridos em ★ seguem aproximadamente a loja atual (fundos 60–150, roupas 150–500, extras 50–150), sem economia/pay-to-win no Karaoke.
- Chaves propostas novas e únicas. **Não renomear IDs já salvos**: `roupa_gingham`, `roupa_pijama`, `fundo_ceu`, `duo_cafe` etc. Preservar inventários, saves e RPCs.
- `public.visual_preco`, `lojaItem`, catálogos do perfil, desenho `drawChar` / `perfFundo` e seletores de Moon Duo precisam reconhecer cada ID antes de qualquer ativação.
- Cenários comprados são fundos **do perfil, da foto ou de um Moon Duo privado**, não dão ao comprador o direito de mudar o palco público compartilhado de nove pessoas. Palco da sala usa ambientação comum e temporada definida por servidor; os novos cenários podem funcionar como photo booth/palco pessoal.
- Qualquer item comprado permanece no inventário; bônus sazonais/colecionáveis identificados explicitamente, sem expiração silenciosa. Variantes de alto contraste/reduced motion para partículas.

## Karaoke Idol — 8 cenários
| ID sugerido | Nome | Visual resumido | Uso permitido | ★ |
|---|---|---|---|---:|
| `fundo_kr_neon` | Palco Neon Idol | Telão lilás/rosa, luzes, mini estrelas | Perfil / foto | 140 |
| `fundo_kr_camarim` | Camarim Kawaii | Espelho com luzes, arara, penteadeira | Perfil / foto | 120 |
| `fundo_kr_cafe` | Café Musical | Mesas redondas, mic retrô, luminárias | Perfil / foto | 110 |
| `fundo_kr_porto` | Noite no Porto | Porto azul, reflexos e palco discreto | Perfil / Duo | 150 |
| `fundo_kr_disco` | Disco Moon Stage | Globo, pequenos lasers, piso pastel | Perfil / Duo | 150 |
| `fundo_kr_halloween` | Halloween Live House | Abóboras, laranja e roxo delicados | Perfil / foto, sazonal | 150 |
| `fundo_kr_snow` | Snow Melody Hall | Cortinas azuis, neve ao fundo | Perfil / foto, sazonal | 150 |
| `fundo_kr_hanami` | Hanami Performance Garden | Cerejeiras, lanternas, palco externo | Perfil / Duo, sazonal | 150 |

## Karaoke Idol — 8 roupas
| ID sugerido | Nome | Design | ★ |
|---|---|---|---:|
| `roupa_kr_micpop` | Mic Pop | Saia curta, colete branco e mini mic bordado | 290 |
| `roupa_kr_encore` | Encore Ribbon | Vestido de laços e ribana cintilante | 340 |
| `roupa_kr_heart` | Stage Heart | Rosa coral e detalhes de coração | 300 |
| `roupa_kr_moon` | Moon Chorus | Lilás, estrelas douradas e capelet | 340 |
| `roupa_kr_blue` | Blue Soda | Azul cintilante, botões-bolha | 280 |
| `roupa_kr_marina` | Marina Live | Marinho e pérola, detalhe de onda | 330 |
| `roupa_kr_halloween` | Halloween Pulse | Saia roxa, abóbora fofa e morceguinhos | 360 (sazonal) |
| `roupa_kr_peace` | White Peace Stage | Branco com fitas claras e ouro suave | 0 ★ no evento Paz; 300 ★ depois, se aprovado |

**Acessórios Karaoke** (IDs `acc_kr_*`; 50–120 ★, dependendo da complexidade): mic com laço (90), headset idol (110), pulseiras glow (65), mini lightstick (70), estrela de cabelo (55), gargantilha de palco (65), broche musical (50), mochila de ensaio (120), cartaz de fã mini (75), drink decorativo (60). A representação do drink deve ser decorativa e não incentivar álcool.

**Visuais/auras Karaoke** (IDs `visual_kr_*`; 100–240 ★): Aura de Aplausos (140), Brilho de Palco (130), Corações em Eco (150), Notas Musicais Flutuantes (120), Luz de Holofote (170), Confete Pastel (110), Fever Vocal (220), Encore Star (240). Apenas Cosméticos: não alterar nota, hitbox, fila ou tempo.

## Sky Idol / Sora — 8 cenários de perfil e Duo
| ID sugerido | Nome | Visual | ★ |
|---|---|---|---:|
| `fundo_sky_balcony` | Sky Balcony | Sacada acima das nuvens e estrelas | 110 |
| `fundo_sky_cafe` | Cloud Café | Duas xícaras e mesa de nuvem | 100 |
| `fundo_sky_sunset` | Sunset Horizon | Horizonte coral-lilás | 90 |
| `fundo_sky_dream` | Starry Dream Room | Quarto celestial com pelúcias | 140 |
| `fundo_sky_ladder` | Moon Ladder | Degraus até a lua | 140 |
| `fundo_sky_sakura` | Sakura Sky Garden | Pétalas e céu claro | 150 |
| `fundo_sky_aurora` | Aurora Bubble Sky | Aurora pastel e bolhas suaves | 150 |
| `fundo_sky_peace` | Peace Sky | Azul/branco, pombas e fitas | 0 ★ durante Paz; 90 ★ depois |

## Sky Idol — 8 roupas
| ID sugerido | Nome | Design | ★ |
|---|---|---|---:|
| `roupa_sky_cloud` | Cloud Trainee | Branco-neve, mangas nuvem | 200 |
| `roupa_sky_ladder` | Star Ladder | Azul bebê, pequenas estrelas | 260 |
| `roupa_sky_sakura` | Sakura Breeze | Rosa pálido, flor no laço | 300 |
| `roupa_sky_moon` | Moon Float | Lilás, meias lunares | 320 |
| `roupa_sky_twinkle` | Twinkle Flight | Azul+dourado, mini asas bordadas | 390 |
| `roupa_sky_soda` | Sky Soda | Pastel azul/menta, botões brilhantes | 280 |
| `roupa_sky_sailor` | Dream Sailor | Gola marinheira, lua e estrela | 330 |
| `roupa_sky_meteor` | Pastel Meteor | Degradê branco/rosa/lilás, barra cintilante | 410 |

**Acessórios Sky** (`acc_sky_*`; 55–130 ★): nuvem de ombro (90), bolsinha estrela (85), asas pequenas decorativas (130), presilhas sakura (65), halo de estrelas (100), meias céu (70), sapato Moonlight (90), varinha de brilho (95), plush cloud (110), gatinho celestial (120).

## Moon⭐Duo — 9 extras e poses para dois
| ID sugerido | Nome | Uso | ★ |
|---|---|---|---:|
| `duo_sky_bench` | Banco de Nuvem Dupla | Sentados lado a lado | 110 |
| `duo_sky_umbrella` | Guarda-chuva Estelar | Dois avatares sob estrelas | 100 |
| `duo_sky_cups` | Xícaras Celestiais | Brinde doce sem álcool | 90 |
| `duo_sky_lightstick` | Lightsticks da Amizade | Dois bastões coloridos | 90 |
| `duo_sky_hearts` | Trilha de Corações | Efeito de foto | 100 |
| `duo_sky_gaze` | Olhando o Céu | Pose conjunta | 80 |
| `duo_sky_sit` | Sentados na Nuvem | Pose conjunta | 90 |
| `duo_sky_point` | Apontando uma Estrela | Pose conjunta | 80 |
| `duo_sky_dance` | Mini Coreografia | Dois avatares em sincronia | 150 |

## Danças originais do projeto (sem copiar coreografia protegida)
| ID conceito | Nome interno | Gestos originais | Usos |
|---|---|---|---|
| `dance_twinkle_center` | Estrela do Palco | Dois passos laterais → abre braços → giro suave → salto → pose estrela | Karaoke, duo, vitrine |
| `dance_kawaii_heart` | Coração Idol | Inclina corpo → mão no rosto → coração → aceno → mini giro | Karaoke, perfil, encontros |
| `dance_encore` | Encore de Amizade | Palmas → aceno → passo duplo → pose conjunta | Duo e final do Karaoke |
| `dance_cloud` | Dança das Nuvens | Passo flutuante → apontar lua → abraço visual | Perfil, Sora e Duo |

- Usar poses de `drawChar`/avatar com transições interpoladas; 6–12 quadros/pose sem duplicar motores de animação ou trocar a física do Sora.
- Durar 2–4 segundos por loop; em vitrines, descansar entre execuções. Respeitar `prefers-reduced-motion`, mudo e FPS.
- **Referência de gênero idol japonês, gestos originais**, sem reproduzir sequência reconhecível de uma música específica nem inserir áudio protegido sem licença.
- Os custos para danças (se vendáveis) devem ser cosméticos e podem ser reduzidos ou gratuitos em eventos; não monetizar performance do Karaoke.

## Bebidas — nomenclatura oficial
- Toda bebida escrita como **"Melon Soda"** deve passar a **"Melon Juice!"** nos *rótulos exibidos*, incluindo Karaoke, lista e tradução.
- **Preservar os identificadores internos** (`drink:'lirika'`, chave `lirika`, saves, cores e RPCs): alterar identificador seria regressão.
- Outras bebidas mantêm seus nomes até revisão específica.

## Ordem de implementação futura
1. Um fundo e uma roupa de cada coleção em preview, desenhados com o renderizador original.
2. Testar desenho em PERFIL, Moon Duo e celular (clipping, contraste, custos em byte).
3. Integrar catálogo completo com testes de `visual_preco` e IDs no ambiente de homologação.
4. Adicionar danças e skins sem introduzir compras reais na INDEX 2 read-only.
5. Submeter paletas/preços à aprovação visual antes de venda.
