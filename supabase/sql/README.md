# Scripts SQL

Um arquivo aqui **não** significa que ele está no banco. Esta lista diz onde cada um vale.

## Produção (`fsggtvgbyhchblyazgmt`, aplicados)
- `karaoke_posteres_semana.sql`: elenco semanal dos pôsteres do Karaoke.
- `karaoke_sala_online_producao.sql`: sala online do Karaoke (9 vagas, fila de 3, microfone, domingo 12h–13h10, teste da moderação). Usa as contas do site.
- `center_semana_domingo.sql`: **aplicado em produção em 30/10/2026**. A aba "Semana" do Center⭐Run! (`top_scores`) passa a começar no domingo, como os outros rankings. Nada apagado.
- `karaoke_time_ranking.sql`: **aplicado em produção em 30/10/2026**. Ranking online do Karaoke⭐Time! (5 shows por dia e resultados conferidos no servidor, três quadros, Top Idols e `meu_kt_usados` para o card).
- `karaoke_online_desligado.sql`: **aplicado em produção em 30/10/2026**. Desliga a sala online do Karaoke⭐Day! sem apagar nada (tira o acesso de anon/authenticated e o tempo real). O site usa o Karaoke⭐Time! solo. Os botões de teste/abertura da sala antiga também foram removidos da moderação; a função e os scripts históricos permanecem guardados, sem uso pela interface atual. Para religar: `karaoke_online_religar.sql` (não aplicado).
- `karaoke_estreia_08_11_2026.sql`: **aplicado em produção em 30/10/2026**. Primeira abertura pública adiada de 01/11 para **08/11/2026** (domingo 12h–13h10, Brasília); ensaio manual da moderação preservado. O script original da sala permanece como base histórica.
- `perfil_emoji_cor_time_oshi.sql`: emoji, cor e time no perfil; Oshi entre quem joga.
- Também aplicadas direto como migração (veja `supabase_migrations` no painel): `visual_unificado_vitrine_sem_pet` (perfil e Center Run com o mesmo visual; vitrine e outdoors sem o pet da foto).

## Homologação (`hfzjoefnousiouiuchys`, só testes)
- `karaoke_lab_3a*.sql`: a sala de ensaio com contas anônimas. Ficou como laboratório; a produção usa `karaoke_sala_online_producao.sql`.

## Proposta (não aplicar sem aprovação)
- `admin_pet_visual_tools.sql`: ações administrativas por perfil para restaurar as quatro necessidades de todos os pets e ajustar roupa/cor do Idol. Inclui revisão de sincronização para saves antigos não desfazerem a correção. **Não aplicado**; requer homologação antes de produção.
- `tw_weekly_podium_proposal.sql`: pódio semanal online de Sora/Karaoke. `TW_RANK_ONLINE_READY` continua `false`.
