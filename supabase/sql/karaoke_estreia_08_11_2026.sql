-- TsuLiPa⭐World · Karaoke⭐Day! · estreia adiada para 08/11/2026.
-- Aplicada à produção (fsggtvgbyhchblyazgmt) em 30/10/2026.
-- Preserva os ensaios abertos pela moderação via karaoke_lab.room.teste_ate.
-- Não altera tabelas, participantes nem a função de administração.
create or replace function karaoke_lab.is_sunday_window(at_time timestamptz)
returns boolean
language sql stable set search_path = '' as $$
  select (at_time at time zone 'America/Sao_Paulo')::date >= date '2026-11-08'
     and extract(dow from at_time at time zone 'America/Sao_Paulo') = 0
     and (at_time at time zone 'America/Sao_Paulo')::time >= time '12:00'
     and (at_time at time zone 'America/Sao_Paulo')::time < time '13:10';
$$;
