# Auditoria técnica — TsuLiPa⭐World (29/10/2026)

## Escopo e proteção
- `index.html` da branch `main` é o padrão visual e funcional; não foi alterado.
- Branch de revisão: `feature/sora-karaoke-v2-2026-10-29`; PR #33 (rascunho).
- Não renomear chaves de save `brs48cr_*`, nem nomes de tabelas/RPC do Supabase sem migração e teste.

## Identidade visual identificada
- **Títulos:** `Mochiy Pop One` com `Kosugi Maru` e `M PLUS Rounded 1c` como alternativas.
- **Corpo/controles:** `M PLUS Rounded 1c`.
- **Subtítulos em japonês:** linha `<small>` menor, rosa, sob o título (exemplos: `センターラン`, `バックステージ・ペット`, `ソラ・ジャンプ`, `カラオケ・デー`).
- **Elementos:** gradiente azul/roxo do Oshi, chips arredondados, botões de destaque com sombra deslocada e cartões de borda arredondada.
- `games-theme.css` agrupa estes padrões **apenas** para páginas especiais.

## Arquivos e transferência
- `index.html`: aproximadamente 868 mil caracteres (~927 KB de arquivo UTF-8 no GitHub), contendo múltiplos jogos, perfis, pets, lojas, textos traduzidos, estilos e JS.
- Seletor especial: ~9,6 mil caracteres, carregando os jogos sob demanda por iframe.
- `sora-jump.html`: reduzido de ~525 mil para ~245 mil caracteres por remoção dos trechos de JS, CSS e HTML legados que não eram necessários à execução isolada. Mantém motor de física, cenários, obstáculos, histórico e controles de Sora. **Atenção:** diminuição de HTML em disco não equivale a redução proporcional de transferência comprimida, nem garante FPS alto.
- `karaoke-day.html`: ~99 mil caracteres e renderização em canvas; a versão da branch usa `karaoke_posteres_semana()` para configurar retratos dos pôsteres com cores, cortes e looks dos avatares públicos. Os retratos são miniaturas do renderer do Karaoke, não exportações pixel a pixel do perfil.

## Celulares
- O Karaoke **abre no celular**. O modo plateia (`krEu.plateia`) é opção no simulador, não uma regra automática de user-agent.
- O simulador da branch inicia recolhido. Checar rolagem vertical, áreas de toque, áudio em Safari e mapeamento de cliques e redimensionamento: canvas 960×540 em telas ≤620px, 1920×1080 no desktop, com cena lógica fixa em 960×540. Exportação no celular ampliada para 1920×1080.
- O Sora foi testado localmente em Chromium em 390×844 e 1440×900, com abertura, controle inicial, histórico, áudio alternável, movimento e renderização, sem erros de script. Teste em aparelhos reais ainda necessário.

## Supabase
- Já existem RPCs públicas relevantes: `outdoor_jogadores`, `vitrine_idols` e `perfil_publico`, usadas pelo próprio `index.html`.
- Preferir **somente** `nick` e `avatar` de `karaoke_posteres_semana`, sem ler diretamente a tabela `players` do cliente. Sua tabela possui também dados não destinados à exibição: estados de conta/salvamento e campos administrativos.
- Em 29/10/2026 foi criada a tabela privada `private.karaoke_poster_elencos` e a RPC `public.karaoke_posteres_semana()`. O elenco é fixado no primeiro pedido após domingo às 12h (São Paulo), retém apenas UUIDs na tabela privada e devolve ao público somente nome e atributos visuais. Perfis bloqueados são filtrados em cada pedido. Sem Realtime e sem atualização contínua.
- Advisories obtidos em 29/10/2026 apontam 4 chaves estrangeiras sem índice de cobertura: `duo_log.para`, `duo_presentes.para`, `presentes.para`, `presentes_resgates.user_id`. Confirmar plano de execução e utilidade antes de criar índices.
- Avisos de `SECURITY DEFINER` expostas a `anon` e `authenticated` precisam de auditoria das validações de acesso **dentro** de cada função. Uma RPC intencionalmente pública não é automaticamente falha de segurança.
- RLS habilitado em tabelas sem políticas pode ser intencional quando leitura/escrita ocorre por funções SQL controladas. Não alterar sem avaliar dependências.
- Alterações aditivas no Supabase feitas nesta etapa: uma tabela privada para o elenco e uma RPC pública com `SECURITY DEFINER`, `search_path` vazio e permissão de execução explícita para `anon`/`authenticated`. Ver SQL documentado em `supabase/sql/karaoke_posteres_semana.sql`. Funções existentes, índices, políticas, contas e saves não foram alterados.

## Próxima otimização do index.html (sem reescrever)
1. Mapear módulos por tela: Center Run, Pet, Gacha, Perfil, Moon Duo, Meeting; medir bundle transferido por compressão.
2. Extrair JavaScript/CSS por responsabilidade, mantendo o HTML/ID do jogo, em commits pequenos e testáveis.
3. Carregar recursos não usados apenas no clique; não iniciar múltiplos loops e não montar menus ocultos sem necessidade.
4. Pausar `requestAnimationFrame`, áudio e timers ao ocultar a tela/aba; limitar DPR e FPS de canvas por capacidade do aparelho.
5. Reaproveitar dados públicos de avatar e cachear com TTL, evitando consultas repetidas ao Supabase em cada renderização. No Karaoke, os retratos são pré-renderizados em canvas pequeno e a animação/áudio pausa em abas ocultas.
6. Usar Vercel Analytics/Usage e Supabase Usage Dashboard para verificar números reais antes de afirmar que o plano gratuito basta.

## Testes pendentes antes do merge
- Safari/iPhone e Android: seletor, Sora, Karaoke, rolagem de itens, controles por toque e retorno.
- Karaoke: combinar e descombinar adereços, óculos, antenas, snacks, bebidas e microfone; PNG e áudio.
- Verificar RPC `karaoke_posteres_semana` pela API do navegador, fallback sem rede e estabilidade do elenco em dois aparelhos. Em SQL, função retornou quatro avatares e foi confirmada a ausência de acesso `anon` ao schema privado.
- Validar Sora em fases tardias, pets específicos, saves, progresso e tela de game over.
- Medir transferência comprimida e CPU/FPS com rede real, não somente tamanho do código.
