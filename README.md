# TsuLiPa⭐World

Jogo de fã do TsuLiPa (BRS48): **Center⭐Run!**, **Backstage⭐Pet!**, **Meu Perfil**, **Star⭐Gacha!**, **Sora⭐Jump!**, **Moon⭐Duo!** e **Karaoke⭐Time!** (jogo solo de ritmo, com ranking semanal online; não existe sala online).

Site publicado: https://tsulipa-world.vercel.app/

## Comece aqui

- [docs/STATUS.md](docs/STATUS.md): estado de hoje, mapa dos arquivos, o que falta e as regras.
- [docs/PR58_STATUS.md](docs/PR58_STATUS.md): tudo o que a PR #58 traz e o checklist antes de publicar.
- [supabase/sql/README.md](supabase/sql/README.md): o que está aplicado no banco.
- Documentos antigos ficam em [docs/historico/](docs/historico/) só para consulta.

## Onde fica cada coisa

| Caminho | O que é |
|---|---|
| `index.html` | Página inicial e Center⭐Run! (hub, perfil, pet, gacha, Moon⭐Duo!, moderação) |
| `karaoke-time.html` + `karaoke-*.js/css` | Karaoke⭐Time! (sala, ritmo, ranking, clipe do dia, vistas da janela) |
| `sora-jump.html` + `sora-embed.css` | Sora⭐Jump! |
| `tw-*.js/css` | Peças compartilhadas (cabelos, acessórios, animações, janelas) |
| `img/`, `audio/` | Imagens e sons |
| `tests/` | Verificações automáticas (`run-all.js` roda todas) |
| `supabase/migrations/` | Migrações que o Supabase aplica sozinho (integração com o GitHub **ligada**) |
| `supabase/sql/aplicado/`, `proposta/`, `historico/` | Scripts SQL por estado; ver o README da pasta |
| `docs/` | Status, propostas e histórico |

## Como testar antes de enviar

```
node tests/run-all.js        # todas as verificações rápidas (as mesmas do GitHub)
```

O GitHub também roda os testes do banco num PostgreSQL descartável (`supabase/tests/*_pg_integration.sh`) e o teste de navegador da sala do Karaoke.

## Regras que não podem ser quebradas

- Não renomear chaves de save `brs48cr_*` nem tabelas e RPCs usadas pelo jogo sem migração e testes.
- Nada entra na `main` sem PR; o merge é feito pela dona do projeto.
- Não criar dados falsos nem testar escritas com contas reais sem combinar.
- SQL só entra no banco com autorização da dona; quem aplica e confere é o responsável pelo banco (ChatGPT).
- Arquivo novo em `supabase/migrations/` é aplicado pelo Supabase no merge: só com autorização.
- `TW_JOGOS_SEM_LOGIN` no `index.html` é só para teste: precisa estar `false` antes de qualquer merge.
