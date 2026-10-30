# TsuLiPa⭐World — Etapa 3B: TsuLiPa TV e Top Idols SEMANAIS

Data: 29/10/2026. Destino: branch experimental PR #33. Sem merge e sem deploy.
A tela alternativa independente anterior NÃO faz parte desta implementação.

## O que mudou de verdade
A TV fica na tela de abertura da INDEX 2 real, abaixo do trio e da vitrine original de jogadores. O Hall Top Idols fica no hubMenu real, logo após os cards. A aba Perfil do próprio jogador recebe a melhor altura semanal do Sora. O sistema usa o DOM, as cores de Oshi e a tipografia originais. NADA foi recriado fora do jogo.

## Ciclo semanal
Domingo às 00:00, America/Sao_Paulo: começa a semana.
Sora: uma melhor altura por jogador por semana. Três jogadores com maiores alturas aparecem no pódio; todos os que participarem podem ver seu próprio recorde da semana no perfil. Não guardar cada tentativa para sempre.
Karaoke: exclusivamente durante a sessão dominical válida, mantém as três melhores notas por três jogadores distintos. Uma nota nova superior desloca a terceira. Uma sessão nova começa com pontuações vazias.
Center: a RPC top_scores('week') atual começa a semana na SEGUNDA. Não foi alterada. A futura RPC tw_podio_semana fornecerá o recorte domingo-sábado para a TV sem modificar o ranking oficial.

## Real vs preparado
Centro: os resultados atualmente exibidos na TV são os resultados online reais do Center, na sua janela semanal preexistente.
Sora: no término de partida verdadeira (fora das cenas de teste), o iframe avisa a INDEX 2. O pai verifica origem e registra APENAS a melhor altura local da semana em uma chave NOVA tw_index2_sora_week. O Perfil identifica a marca como deste dispositivo; ela AINDA NÃO é recorde online. Os saves brs48cr permanecem intactos.
Karaoke: a pontuação do ensaio local NÃO entra na classificação competitiva. Só um cantor de sessão válida e verificada pelo servidor poderá entrar no pódio.

## Banco de dados e privacidade
O script supabase/sql/tw_weekly_podium_proposal.sql está VERSIONADO, não aplicado. Uma tabela privada guarda uma linha por jogador, por jogo e por semana (somente 3 no Karaoke). Um helper privado transacional faz o UPSERT e descarta o 4º colocado. Não concede acesso direto a jogadores ou ao papel anon. A RPC pública é somente leitura e expõe nick e pontuação, nunca UUID ou dados internos.
A API filtra sempre a semana atual; a rotina para apagar linhas antigas será agendada via Supabase Cron só depois da aprovação e do teste em homologação. Sem alterar o banco real nesta etapa.

TW_RANK_ONLINE_READY fica false; nenhuma pontuação online é inventada.
A etapa ainda precisa de validação autenticada de resultados Sora e Karaoke no servidor, teste de concorrência, testes em celulares e aprovação da janela da sessão.
Nenhum cadastro, economia, estrela, moeda, permissão administrativa ou ranking oficial original foi mudado.

## Verificação
tests/tw-weekly-podium.test.js é um teste offline de integração estática: horário de domingo, jogadores únicos no top3, manutenção do index oficial, separação do iframe e guardas de SQL. Os testes anteriores continuam a rodar em GitHub Actions.
