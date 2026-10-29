# TsuLiPa⭐World

Jogo de fã do TsuLiPa (BRS48): **Center⭐Run!** (corrida até o Center), **Backstage⭐Pet!** (camarim com pets) e **Meu Perfil** (Idol, insígnias, corações e recados).

Site: https://tsulipa-world.vercel.app/

## Arquivos
- `index.html` — jogo principal em produção (Center⭐Run, perfil, pet e demais módulos)
- `sora-jump-karaoke.html` — seletor leve de jogos especiais, compatível com a identidade visual do site
- `sora-jump.html` — Sora⭐Jump! independente, com CSS/DOM e JS herdados não utilizados removidos nesta branch
- `karaoke-day.html` — Karaoke⭐Day! independente, com itens, lanches japoneses e pôsteres de avatares
- `games-theme.css` — tipografia, subtítulos japoneses, botões, sombras e cores compartilhados pelos minijogos
- `privacidade.html` — privacidade e segurança
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`, `manifest.json` — ícones e app
- `og.jpg`, `og.png` — imagem da prévia do link

Contas, ranking e nuvem ficam no Supabase. As chaves de save (`brs48cr_…`) e os nomes do banco nunca podem ser renomeados — veja o alerta no topo do `index.html`.

## Jogos especiais — V2 (branch de revisão)

Os novos jogos podem ser testados separados da página inicial: abra `sora-jump-karaoke.html` em uma prévia do mesmo domínio. O seletor carrega o jogo escolhido no iframe. **Não alterar as chaves `brs48cr_...` nem as tabelas/RPCs do Supabase sem migração.**

- **Karaoke:** apenas um item de mão por vez (microfone, pandeiro, snack ou bebida). Antenas e óculos são acessórios independentes.
- **Pôsteres:** buscam somente `{nick, avatar}` pela função pública existente `outdoor_jogadores` (já usada pelo Center Run), e desenham **miniaturas vetoriais das configurações visuais públicas**. Avatares reais do jogo, não fotos de pessoas. Os efeitos avançados da foto de perfil são simplificados pela escala. Quando indisponível, mostram personagens demonstrativos. A seleção usa uma semente por semana no horário de São Paulo; garantir exatamente a mesma escalação para todos requer snapshot semanal no servidor.
- **Sora:** aberto automaticamente na página dedicada; removidos vários módulos e telas herdados do Center Run/pet que não são necessários para abrir e jogar Sora. O HTML caiu de cerca de 525 mil para 245 mil caracteres. A lógica importante das fases, física, insígnias e pontuação permanece. Ainda deve receber regressão completa antes do merge.
- **Publicação:** não atualizar `index.html` até testar os jogos na prévia, especialmente navegação de volta, som, iOS/Android e controles por toque.

## Responsividade

O Karaoke abre no celular. O 'Modo plateia' é uma opção do simulador e não é aplicado automaticamente a visitantes móveis. As ações de toque e os controles precisam de teste real em aparelhos. O simulador de desenvolvimento inicia recolhido.

## Próxima auditoria

Ver `AUDITORIA_V3.md` para recomendações de carregamento sob demanda do `index.html`, cache de avatares, quadro semanal realmente compartilhado e revisões de segurança/performance do Supabase. Nenhuma permissão ou dado do Supabase foi modificado por esta branch.
