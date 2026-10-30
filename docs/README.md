# Documentação — TsuLiPa⭐World

Só existem dois documentos vivos. Todo o resto está em [historico/](historico/) e é foto de momentos antigos: serve para consulta, não para decidir nada.

- [STATUS.md](STATUS.md): como o projeto está **hoje**, o que falta e as regras. Comece sempre por aqui.
- [../supabase/sql/README.md](../supabase/sql/README.md): quais scripts SQL estão aplicados na produção e quais são só da homologação.

## Verificações locais

Antes de enviar mudanças, rode os mesmos testes do workflow de validação:

```powershell
node tests/validate-games.js
node tests/static-links.test.js
node tests/karaoke-room-model.test.js
node tests/karaoke-rhythm.test.js
node tests/karaoke-homol-view.test.js
node tests/karaoke-homol-sync.test.js
node tests/karaoke-homol-refresh.test.js
node tests/sora-stability.test.js
node tests/tw-weekly-podium.test.js
node tests/index-critical-flows.test.js
node tests/karaoke-reuse-session.test.js
node tests/karaoke-online.test.js
```

O lint cobre apenas os módulos JS separados; instale as ferramentas com `npm ci --prefix tools/lint` e rode `npm --prefix tools/lint run lint`. Os testes são offline. Extrações de lógica devem manter testes comportamentais e preservar IDs, chaves `brs48cr_*`, RPCs e URLs públicas. Mudanças de interface devem ser verificadas na prévia antes de qualquer merge; deploy em `main` é separado.

Para retomar o trabalho (Claude, Astra/ChatGPT ou qualquer pessoa): leia o STATUS.md, confira o PR aberto e a prévia da Netlify, e atualize o STATUS.md no mesmo envio em que mudar algo.
