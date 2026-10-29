# TsuLiPa⭐World

Jogo de fã do TsuLiPa (BRS48): **Center⭐Run!** (corrida até o Center), **Backstage⭐Pet!** (camarim com pets) e **Meu Perfil** (Idol, insígnias, corações e recados).

Site: https://tsulipa-world.vercel.app/

## Arquivos
- `index.html` — jogo principal em produção (Center⭐Run, perfil, pet e demais módulos)
- `sora-jump-karaoke.html` — seletor leve de jogos especiais, compatível com a identidade visual do site
- `sora-jump.html` — Sora⭐Jump! independente (ainda carrega funções herdadas da base; otimização futura)
- `karaoke-day.html` — Karaoke⭐Day! independente, com itens e pôsteres em fan art
- `privacidade.html` — privacidade e segurança
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`, `manifest.json` — ícones e app
- `og.jpg`, `og.png` — imagem da prévia do link

Contas, ranking e nuvem ficam no Supabase. As chaves de save (`brs48cr_…`) e os nomes do banco nunca podem ser renomeados — veja o alerta no topo do `index.html`.

## Jogos especiais — V2 (branch de revisão)

Os novos jogos podem ser testados separados da página inicial: abra `sora-jump-karaoke.html` em uma prévia do mesmo domínio. O seletor carrega o jogo escolhido no iframe. **Não alterar as chaves `brs48cr_...` nem as tabelas/RPCs do Supabase sem migração.**

- **Karaoke:** apenas um item de mão por vez (microfone, pandeiro, snack ou bebida). Antenas e óculos são acessórios independentes.
- **Pôsteres:** desenhos fictícios de fãs; os apelidos podem vir da função pública `top_scores` do ranking, com fallback para nomes simulados quando ela estiver indisponível. Não são fotos reais nem presença em tempo real. A seleção usa a data semanal de São Paulo, mas uma escalação perfeitamente sincronizada exige snapshot no servidor.
- **Sora:** aberto automaticamente na página dedicada; sua refatoração profunda de dependências herdadas da página principal foi deixada para uma próxima etapa, para evitar regressões.
- **Publicação:** não atualizar `index.html` até testar os jogos na prévia, especialmente navegação de volta, som, iOS/Android e controles por toque.
