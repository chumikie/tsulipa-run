-- Índices nas chaves estrangeiras que o Supabase Advisor apontou sem índice (17/11/2026).
-- Deixam mais rápidas as buscas por jogador e o apagar conta (o "on delete" percorre essas colunas).
create index if not exists jardim_usos_user_id_idx on private.jardim_usos (user_id);
create index if not exists kt_ticket_events_actor_id_idx on private.kt_ticket_events (actor_id);
create index if not exists kt_ticket_events_other_player_id_idx on private.kt_ticket_events (other_player_id);
create index if not exists studio_coracoes_user_id_idx on private.studio_coracoes (user_id);
create index if not exists duo_log_para_idx on public.duo_log (para);
create index if not exists duo_presentes_para_idx on public.duo_presentes (para);
create index if not exists presentes_para_idx on public.presentes (para);
create index if not exists presentes_resgates_user_id_idx on public.presentes_resgates (user_id);
