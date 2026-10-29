# Instruções para o Astra (ChatGPT): lançamento da INDEX 2

Atualizado em 29/10/2026. Leia tudo antes de qualquer ação. O plano técnico completo está em [`RETOMAR_LANCAMENTO.md`](RETOMAR_LANCAMENTO.md).

## Onde trabalhar
- Repositório: `chumikie/tsulipa-run` (público).
- Branch de trabalho: **`release/index2-lancamento`**. Não crie outra branch e não use a `feature/sora-karaoke-v2-2026-10-29`.
- Supabase de produção `fsggtvgbyhchblyazgmt`: **só leitura.** Testes de sala só no projeto de homologação `hfzjoefnousiouiuchys`.

## Regras obrigatórias (erros que já aconteceram)
1. **Nunca faça commit direto na `main`.** Tudo passa por PR, e quem faz o merge é a usuária.
2. **Agrupe as mudanças:** no máximo 1 push por tarefa concluída. Em 29/10 foram mais de 180 commits e quase 200 execuções de CI numa madrugada, com builds na Vercel e na Netlify. Não repita isso.
3. Não ative deploy na Vercel e não mexa no `vercel.json`.
4. Não renomeie chaves de save `brs48cr_*`. Não crie contas, pontuações ou dados falsos na produção.
5. Não diga que algo foi testado sem evidência: print, log ou saída de teste.
6. Não mexa no Karaoke online (sala, fila, autenticação). Ele continua fechado pelo servidor até o teste real de domingo.

## Tarefas, em ordem
1. Rodar os 8 testes de `.github/workflows/validate-games.yml` localmente (`node tests/<arquivo>`). Um deles falhou depois do commit `b99110d`: descobrir qual e corrigir.
2. Gerar a nova `index.html` a partir da `index2.html`:
   - remover o bloco `INDEX2_PREVIEW_GUARD` (`TW_INDEX2_READ_RPC` e o `if` dentro de `contaRpc`). Sem isso, compras, gacha, resgates e corridas param de funcionar;
   - remover o aviso `twPreviewAviso` ("INDEX 2 — PRÉVIA DE TESTES");
   - em `twKaraokeMostrarFechado` e no HTML de `twKaraokeFechado`: traduzir os textos fixos para EN/ES/TH/JA e esconder o botão `twKaraokeConviteRascunho`;
   - manter `TW_RANK_ONLINE_READY=false`.
3. Trocar a `index2.html` por um redirecionamento simples para `/`.
4. Rodar de novo os 8 testes e conferir, num navegador, celular e computador nos 5 idiomas.
5. Fazer **um único push** e abrir **um PR em rascunho** da `release/index2-lancamento` para a `main`, com o link da prévia da Netlify e a lista do que mudou. Parar aí e avisar a usuária.

## Ao terminar
Atualize a seção "Já feito" de `docs/RETOMAR_LANCAMENTO.md` no mesmo push, para a próxima pessoa (Claude ou Astra) saber onde parou.
