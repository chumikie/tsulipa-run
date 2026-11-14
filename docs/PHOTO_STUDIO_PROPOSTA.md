# Photo⭐Studio! — proposta (Fase 4, 2º jogo novo) · 14/11/2026

Status: **aprovado pelo dono em 14/11** (nome, ★5/dia, mural público com corações na v2). **v1 implementada no PR #88** (`studio.js`); SQL `supabase/sql/aplicado/20261114_photo_studio.sql` testado isolado (`supabase/tests/studio/`); **aplicado em produção em 14/11** (OK do dono).

**v2 (Mural + Capa no Idol⭐News!) implementada no PR #88**; SQL `supabase/sql/proposta/20261114_studio_mural.sql` testado isolado (`supabase/tests/studio-mural/`), esperando o OK para aplicar.

## Ideia em uma frase
Todo dia a revista Idol⭐News! publica uma **pauta de ensaio** (igual para todo mundo). Você monta a foto no estúdio do Jardim das Nuvens — cenário, pose, luz, enquadramento e objetos — e o fotógrafo dá de 1 a 3 estrelas conforme a foto atende a pauta. A foto vira uma polaroid para salvar.

## Diferença para o Moon⭐Duo!
O Duo é uma cena livre em dupla. O Studio tem **objetivo diário** (a pauta) e **ferramentas de fotógrafo** que o Duo não tem: luz, enquadramento e objetos de cena. O Duo continua igual; o Studio reaproveita o desenho dele (fundos, poses, Idols convidados).

## Como se joga (versão 1)
1. **Pauta do dia** (ex.: "Capa de outono"): três pedidos — um cenário, uma pose e um detalhe (expressão, luz ou objeto).
2. **Estúdio**:
   - Cenário: os fundos que já existem (perfil, temas, café).
   - Pose e expressão: as do jogo.
   - **Luz** (novo): suave, neon ou pôr do sol.
   - **Enquadramento** (novo): rosto, meio corpo ou corpo inteiro.
   - **Objetos de cena** (novo): balões, microfone, lightstick e **as flores que você colheu no Bloom⭐Garden!** (só ter a flor; não gasta).
   - Opcional: chamar um Idol para a foto, como no Duo.
3. **Clique**: contagem 3-2-1 e flash. O servidor confere as escolhas com a pauta e devolve 1, 2 ou 3 estrelas.
4. **Polaroid** para salvar em PNG (como as do Center e do Karaoke).

## Prêmio e economia
- **★5 por dia** na primeira foto com 3 estrelas (mesma trava diária do Duo/Café/Handshake). Pequeno de propósito, como pede `docs/ECONOMIA_ESTRELAS.md`.
- Versão 3: cenários e objetos novos à venda por ★ (lugar de gastar).

## Segurança
- A pauta e a conferência das estrelas ficam no servidor (escolhas são listas fechadas, fáceis de validar).
- Nenhuma imagem é enviada: o servidor guarda só as escolhas (ex.: `{fundo:'praia', pose:'v', luz:'neon'}`), e cada aparelho redesenha a foto. Sem upload, nada para moderar.

## Versões
- **v1**: pauta do dia + estúdio + polaroid + ★5/dia. Entrada pelo "?" do Jardim das Nuvens no mapa.
- **v2**: **Mural da revista** — você publica a foto do dia; os outros dão ❤️ (1 por foto); a mais curtida da semana vira a **Capa** no Idol⭐News!.
- **v3**: lojinha de cenários e objetos do estúdio (★).

## Decisões do dono
1. Aprovar o nome **Photo⭐Studio!** e a ideia da pauta diária.
2. Prêmio de **★5/dia** por 3 estrelas.
3. Mural público com corações (v2): pode, ou fica só pessoal?
