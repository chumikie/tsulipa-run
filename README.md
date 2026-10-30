# TsuLiPa⭐World

Jogo de fã do TsuLiPa (BRS48): **Center⭐Run!**, **Backstage⭐Pet!**, **Meu Perfil**, **Star⭐Gacha!**, **Sora⭐Jump!**, **Moon⭐Duo!** e **Karaoke⭐Day!**.

Site publicado: https://tsulipa-world.vercel.app/

## Comece aqui

- [docs/STATUS.md](docs/STATUS.md): estado de hoje, mapa dos arquivos, o que falta e as regras.
- [supabase/sql/README.md](supabase/sql/README.md): o que está aplicado no banco.
- Documentos antigos ficam em [docs/historico/](docs/historico/) só para consulta.

## Como testar antes de enviar

```
node tests/validate-games.js      # confere os arquivos do site
for f in tests/*.js; do node $f; done   # as 10 verificações
```

As mesmas verificações rodam sozinhas no GitHub a cada envio.

## Regras que não podem ser quebradas

- Não renomear chaves de save `brs48cr_*` nem tabelas e RPCs usadas pelo jogo sem migração e testes.
- Nada entra na `main` sem PR; o merge é feito pela dona do projeto.
- Não criar dados falsos nem testar escritas com contas reais sem combinar.
- `TW_JOGOS_SEM_LOGIN` no `index.html` é só para teste: precisa voltar para `false` antes de qualquer merge.
