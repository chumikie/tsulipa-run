# Scripts SQL

Um arquivo aqui **não** significa que ele está no banco. Esta lista distingue o que continua ativo, o que foi aposentado e o que é apenas uma proposta.

## Produção (`fsggtvgbyhchblyazgmt`)

- `karaoke_time_ranking.sql`: **ativo e aplicado em 30/10/2026**. Backend do Karaoke⭐Time!: jogo individual de ritmo, cinco shows por dia e ranking semanal online (pontuação, combo e acertos).
- `center_semana_domingo.sql`: aplicado em 30/10/2026. A aba Semana do Center⭐Run! começa no domingo, como os demais rankings.
- `karaoke_online_desligado.sql`: **aplicado em 30/10/2026**. Aposenta a antiga sala simultânea do Karaoke⭐Day!: revoga o acesso às funções antigas e remove o sinal da publicação Realtime. Não apaga tabelas nem registros.
- `karaoke_sala_online_producao.sql`, `karaoke_estreia_08_11_2026.sql` e `karaoke_online_religar.sql`: **históricos da sala antiga**. Não fazem parte do funcionamento atual e não devem ser reaplicados para o Karaoke⭐Time!.
- `perfil_emoji_cor_time_oshi.sql`: emoji, cor e time no perfil; Oshi entre quem joga.
- Também aplicadas diretamente como migração (veja `supabase_migrations` no painel): `visual_unificado_vitrine_sem_pet` (perfil e Center Run com o mesmo visual; vitrine e outdoors sem o pet da foto).

## Homologação (`hfzjoefnousiouiuchys`)

O projeto foi criado para testar a antiga sala de ensaio do Karaoke⭐Day!. Essa sala está aposentada e **não é usada pelo site público atual**.

- O banco ainda contém os objetos históricos `karaoke_lab` e três funções `karaoke_ensaio*`. As funções restantes aceitam apenas `authenticated`; não aceitam `anon`.
- Consulta em 30/10/2026: **zero usuários em `auth.users`**, incluindo zero contas anônimas. As tabelas de assentos e fila também estão vazias.
- Os scripts `karaoke_lab_3a*.sql` são testes históricos do laboratório. Não devem ser executados em produção nem confundidos com o Karaoke⭐Time!.

**A recomendação é manter o projeto de homologação como ambiente de testes para futuras migrações** (por exemplo, as ferramentas administrativas de pets e visual), mas não manter nem reativar a sala antiga. A limpeza dos objetos de laboratório pode ser feita separadamente; nenhum projeto, tabela ou conta foi apagado nesta atualização.

## Propostas — não aplicar sem aprovação e homologação

- `admin_pet_visual_tools.sql`: ações administrativas por perfil para restaurar as quatro necessidades de todos os pets e ajustar roupa/cor do Idol. Inclui revisão de sincronização para saves antigos não desfazerem a correção. **Não aplicado**; requer homologação antes de produção.
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
