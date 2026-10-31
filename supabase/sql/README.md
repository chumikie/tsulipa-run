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
