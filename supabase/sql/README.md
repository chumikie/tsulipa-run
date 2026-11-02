# Scripts SQL

## Pastas (02/11/2026)

- `aplicado/`: scripts que **já estão no banco de produção** (confirmados abaixo ou pelo ChatGPT na `docs/PR58_STATUS.md`). Servem de registro; não reaplicar sem conferir.
- `proposta/`: **não aplicados**. Só com autorização da dona e revisão do ChatGPT.
- `historico/`: a antiga sala online do Karaoke⭐Day! (aposentada) e os testes do laboratório `karaoke_lab_3a*`. **Nunca executar em produção.**
- Ainda na raiz, **estado a confirmar com o ChatGPT** antes de mover: `admin_corrida_contadores.sql`, `fechar_funcoes_internas.sql`, `gacha_sem_card_proprio.sql`, `karaoke_tickets_REVIEW_ONLY.sql`, `sora_jump_online_ranking.sql`, `sora_jump_tv_profile_integration.sql`, e o pacote do limite de 100 estrelas do Center⭐Run! (`center_run_daily_100_*`, `README-`, `RUNBOOK-` e `CHECKLIST-center-run-100.md`; a versão aplicada é a migração `supabase/migrations/20261101234420_center_run_daily_100.sql`).
- Migrações que o Supabase aplica sozinho pela integração com o GitHub ficam em `supabase/migrations/`, não aqui. Só entra lá o que já está aplicado (mesma versão no banco) ou foi autorizado para aplicar na publicação.
- Já aplicados também (pastas `aplicado/`): `admin_montar_idol.sql`, `karaoke_minha_posicao.sql`, `karaoke_musica_da_semana.sql`, `karaoke_quadros_semana.sql` (PR #58, 01–02/11/2026).

Um arquivo aqui **não** significa que ele está no banco. Esta lista distingue o que continua ativo, o que foi aposentado e o que é apenas uma proposta.

## Produção (`fsggtvgbyhchblyazgmt`)

- `karaoke_time_ranking.sql`: **ativo e aplicado em 30/10/2026**. Backend do Karaoke⭐Time!: jogo individual de ritmo, cinco shows por dia e ranking semanal online (pontuação, combo e acertos).
- `center_semana_domingo.sql`: aplicado em 30/10/2026. A aba Semana do Center⭐Run! começa no domingo, como os demais rankings.
- `karaoke_online_desligado.sql`: **aplicado em 30/10/2026; Karaoke⭐Day! online ARQUIVADO**. Revoga a sala simultânea antiga para `anon` e `authenticated` e remove o sinal da publicação Realtime. Não apaga tabelas nem registros. A sala não faz parte do lançamento nem tem reativação planejada.
- `karaoke_sala_online_producao.sql`, `karaoke_estreia_08_11_2026.sql` e `karaoke_online_religar.sql`: **arquivos históricos da sala antiga**. Não reaplicar nem reativar sem uma nova decisão explícita; o jogo atual é o solo Karaoke⭐Time!, com ranking semanal próprio.
- `perfil_emoji_cor_time_oshi.sql`: emoji, cor e time no perfil; Oshi entre quem joga.
- Também aplicadas diretamente como migração (veja `supabase_migrations` no painel): `visual_unificado_vitrine_sem_pet` (perfil e Center Run com o mesmo visual; vitrine e outdoors sem o pet da foto).
- `admin_pet_visual_tools.sql`: **aplicado em produção em 31/10/2026** (migração `20261031053946`). Inclui `admin_cuidar_pets`, `admin_visual_info`, `admin_vestir` e revisões das RPCs `salvar_nuvem` e `salvar_avatar`. Confirmação de leitura: `anon` sem execução; `authenticated` pode invocar, mas as ações administrativas exigem `auth.uid()` e `public.eh_admin()` internamente. Testes funcionais com contas distintas ainda são pendentes.
- `sora_my_profile_recorde.sql` e `sora_history.sql`: migrações registradas em produção em 31/10/2026 (`20261031003640` e `20261031063249`, respectivamente).

## Homologação (`hfzjoefnousiouiuchys`)

O projeto foi criado para testar a antiga sala de ensaio do Karaoke⭐Day!. Essa sala está aposentada e **não é usada pelo site público atual**.

- O banco ainda contém os objetos históricos `karaoke_lab` e três funções `karaoke_ensaio*`. As funções restantes aceitam apenas `authenticated`; não aceitam `anon`.
- Consulta em 30/10/2026: **zero usuários em `auth.users`**, incluindo zero contas anônimas. As tabelas de assentos e fila também estão vazias.
- Os scripts `karaoke_lab_3a*.sql` são testes históricos do laboratório. Não devem ser executados em produção nem confundidos com o Karaoke⭐Time!.

**A recomendação é manter o projeto de homologação como ambiente de testes de mudanças futuras** (por exemplo, a ficha administrativa ainda proposta), sem reativar a sala antiga. As ferramentas de pets/visual já foram aplicadas em produção; não são uma proposta pendente. A limpeza dos objetos de laboratório pode ser feita separadamente; nenhum projeto, tabela ou conta foi apagado nesta atualização.

## Propostas — não aplicadas; exigem aprovação e homologação

- **Grupos nacionais** (`proposta/20261102140310_grupos_nacionais.sql`, `proposta/20261102140311_avisos_grupo_e_roupa_sku.sql`, `proposta/20261102140312_acessorios_tulipa_laco_fundo_cafe.sql`): **não aplicadas** (conferido pelo ChatGPT em 02/11/2026: nenhuma das versões está em `supabase_migrations.schema_migrations`; `public.idol_grupos` e `players.grupo` não existem). Saíram de `supabase/migrations/` em 02/11/2026 para que a publicação no GitHub não as aplique sozinha (integração Supabase–GitHub ligada). Ordem obrigatória: grupos → avisos → acessórios; testadas em PostgreSQL isolado por `supabase/tests/grupos_nacionais_pg_integration.sh`. O site funciona sem elas (catálogo local de grupos). Para ativar: autorização da dona, aplicação pelo ChatGPT e, depois, voltar os arquivos para `supabase/migrations/` com a versão registrada no banco.

- `tw_weekly_podium_proposal.sql`: pódio semanal online de Sora/Karaoke. Verificar o estado atual antes de qualquer uso; o ranking do Karaoke⭐Time! já possui o backend específico `kt_ranking`.
- `admin_player_profile_proposal.sql`: proposta de RPC somente de leitura para a ficha administrativa de jogador do Backstage Admin (busca exata por nickname, recordes, participação, pets e histórico administrativo). **Não aplicada**; revisar compatibilidade do schema e homologar antes de produção.


## Insígnias locais no perfil e semana de domingo

**Aplicadas em produção (fsggtvgbyhchblyazgmt) em 31/10/2026**, após revisão e autorização:

- profile_game_badges_sunday_week.sql: adiciona players.insignias_jogos, sincroniza as sete insígnias locais da Temporada 2 do Center⭐Run! por RPC autenticada e allowlisted, e inclui as três faixas do Sora⭐Jump! calculadas a partir do recorde geral registrado no servidor.
- sora_weekly_zero_default.sql: padroniza a janela do pódio de domingo 00:00 até sábado 23:59 em America/Sao_Paulo e devolve meu_sora = 0 quando a conta ainda não pontuou.

A verificação pós-aplicação confirmou:
- as duas migrações registradas em supabase_migrations;
- a coluna e a RPC de insígnias presentes;
- anon sem permissão para executar sincronizar_insignias_jogos(text[]);
- authenticated com permissão, e a RPC limitada à conta de auth.uid();
- pódio semanal acessível aos papéis previstos e ciclo vigente iniciado em domingo.

As sete chaves importadas do Center⭐Run! são validadas por allowlist, mas a origem delas é o progresso local do aparelho: são insígnias de coleção, não uma prova antifraude de conclusão. As três insígnias do Sora⭐Jump! são calculadas no servidor.
