# Scripts SQL

Um arquivo aqui **não** significa que ele está no banco. Esta lista diz onde cada um vale.

## Produção (`fsggtvgbyhchblyazgmt`, aplicados)
- `karaoke_posteres_semana.sql`: elenco semanal dos pôsteres do Karaoke.
- `karaoke_sala_online_producao.sql`: sala online do Karaoke (9 vagas, fila de 3, microfone, domingo 12h–13h10, teste da moderação). Usa as contas do site. A versão nesta branch acrescenta movimento/danças sincronizados e avatar atual; **não aplicar em produção** até validar em homologação e aprovar a migração.
- `perfil_emoji_cor_time_oshi.sql`: emoji, cor e time no perfil; Oshi entre quem joga.
- Também aplicadas direto como migração (veja `supabase_migrations` no painel): `visual_unificado_vitrine_sem_pet` (perfil e Center Run com o mesmo visual; vitrine e outdoors sem o pet da foto).

## Homologação (`hfzjoefnousiouiuchys`, só testes)
- `karaoke_lab_3a*.sql`: a sala de ensaio com contas anônimas. Ficou como laboratório; a produção usa `karaoke_sala_online_producao.sql`.
- `karaoke_lab_3a11_stage_sync.sql`: movimento/dança sincronizados e uso do apelido/visual escolhidos no navegador de cada participante. **Ainda não aplicado**; aplicar apenas depois de confirmar a configuração de CAPTCHA/Auth na homologação. Só os campos visuais permitidos e o apelido ficam no banco de teste; login, saldo, pontuação e outros dados da conta não são enviados.
- `../tests/karaoke_lab_3a11_stage_sync_rollback.sql`: verificação transacional das permissões após instalar 3A.11.
- `karaoke_lab_3a12_temporary_window.sql`: abertura manual de uma janela de teste de até 2 horas, somente pelo editor SQL da homologação; depois do prazo, a próxima consulta fecha e limpa a sala.
- `../tests/karaoke_lab_3a12_temporary_window_rollback.sql`: verifica abertura, expiração e limite de duração em uma transação desfeita.

Prévia fora de `tsulipa-world.vercel.app` escolhe automaticamente o cliente de homologação e não consulta o RPC semanal de produção. Para testar com duas pessoas, cada uma usa seu próprio perfil/apelido do jogo e uma sessão anônima isolada de homologação; apenas o apelido e a aparência são compartilhados na sala de testes. A criação de identidades segue bloqueada por padrão; primeiro confirme CAPTCHA/Anonymous Sign-ins somente no projeto de homologação.

Fluxo supervisionado: aplique 3A.11 e 3A.12 em homologação. Em cada perfil de navegador, use `?homol=1&auth_test=1` uma única vez para criar uma identidade anônima (esse modo não chama RPCs da sala); depois abra `?homol=1&reuse_session=1` no mesmo perfil para reutilizá-la. Para testar agora, o responsável pode executar no SQL Editor de `hfzjoefnousiouiuchys`:

```sql
update karaoke_lab.room
   set test_window_started_at = clock_timestamp(),
       test_window_until = clock_timestamp() + interval '60 minutes',
       joins_enabled = true
 where id = 1;
```

Essa abertura expira em até 2 horas; a próxima consulta fecha e limpa a sala. Para encerrar antes, o responsável define `joins_enabled = false`. Não execute esses comandos no Supabase de produção.

## Proposta (não aplicar sem aprovação)
- `tw_weekly_podium_proposal.sql`: pódio semanal online de Sora/Karaoke. `TW_RANK_ONLINE_READY` continua `false`.
