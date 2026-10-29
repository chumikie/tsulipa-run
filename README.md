# TsuLiPa⭐World

Jogo de fã do TsuLiPa (BRS48): **Center⭐Run!**, **Backstage⭐Pet!**, perfil e jogos especiais.

Site publicado: https://tsulipa-world.vercel.app/

## Estado atual

- **index.html** é a página principal atual. Ela não deve ser substituída automaticamente.
- **index2.html** é o laboratório visual que integra Sora⭐Jump! e Karaoke⭐Day! ao hub. **Não é a página principal de produção.**
- O PR [#33](https://github.com/chumikie/tsulipa-run/pull/33) continua em rascunho. A branch experimental tem o deploy da Vercel explicitamente desativado em **vercel.json**.
- A prévia usa o mesmo projeto Supabase de produção para algumas leituras. A proteção de leitura da index2 não transforma esse projeto num banco sandbox.

## Mapa do código

- **index.html** — site principal.
- **index2.html** — página inicial experimental para revisão.
- **sora-jump.html** — Sora⭐Jump! isolado.
- **karaoke-day.html** — Karaoke⭐Day! isolado.
- **sora-jump-karaoke.html** — seletor independente dos jogos.
- **games-theme.css**, **sora-embed.css**, **karaoke-embed.css**, **index2-skin.css**, **tw-weekly-podium.css** — estilos.
- **tests/** — verificações automatizadas, predominantemente offline.
- **supabase/sql/** e **supabase/tests/** — scripts SQL e testes reversíveis; um arquivo SQL versionado não significa que tenha sido aplicado.
- **docs/** — instruções, auditorias, status, especificações e plano de lançamento.

## Por onde começar

1. [Índice da documentação](docs/README.md) — encontra cada documento sem ter de ler tudo.
2. [Plano de lançamento](docs/PLANO_DE_LANCAMENTO.md) — checklist central para corrigir, testar e liberar com segurança.
3. [Estado do que existe](docs/status/ETAPA3_STATUS_DO_QUE_EXISTE.md) — distingue funcionalidades implementadas, experimentais e propostas.
4. [Auditoria da prévia INDEX 2](docs/auditorias/AUDITORIA_RANKING_LOJA_INDEX2.md) e [auditoria técnica V3](docs/auditorias/AUDITORIA_V3.md).

## Regras que não podem ser quebradas

- Não renomear chaves de save brs48cr_* nem tabelas, funções RPC ou contratos usados pelo jogo sem uma migração e testes.
- Não fazer merge nem atualizar a página principal até passar pelas verificações do plano de lançamento e obter aprovação explícita.
- Não testar compras, Gacha, resgates, moderação ou outras escritas da prévia contra contas reais.
- O pódio semanal de Sora/Karaoke é uma proposta: seu SQL não deve ser aplicado à produção até existir validação no servidor e aprovação específica.

A documentação é para pessoas que desenvolvem e mantêm o projeto; os arquivos Markdown não são importados pelo jogo no navegador.