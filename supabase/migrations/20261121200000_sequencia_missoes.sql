-- 21/11/2026 · PR das melhorias (quarta parte): sequência das Missões
-- Um dia "conta" quando a pessoa completa pelo menos 3 missões do dia (a média é 3,1; 40 de 65 dias com missão
-- passam disso). Dias seguidos formam a sequência, que vale até hoje ou até ontem (hoje ainda pode completar).
-- Marcos: 3 dias = ★15 e 7 dias = ★40, uma vez por sequência (uma sequência nova paga de novo).
create table if not exists private.missao_seq_premios (
  user_id uuid not null references public.players(id) on delete cascade,
  inicio date not null,
  marco int not null,
  em timestamptz not null default now(),
  primary key (user_id, inicio, marco)
);
alter table private.missao_seq_premios enable row level security;

-- (dias seguidos, início da sequência, hoje já conta?)
create or replace function private.missao_seq(p_uid uuid, out dias int, out inicio date, out hoje_ok boolean)
 language plpgsql stable set search_path to ''
as $$
declare v_hoje date := public.hoje_br(); v_d date; v_fim date;
begin
  hoje_ok := (select count(distinct k) >= 3 from public.missoes_feitas where user_id = p_uid and dia = v_hoje);
  v_fim := case when hoje_ok then v_hoje else v_hoje - 1 end;
  dias := 0; inicio := null; v_d := v_fim;
  while (select count(distinct k) >= 3 from public.missoes_feitas where user_id = p_uid and dia = v_d) and dias < 400 loop
    dias := dias + 1; inicio := v_d; v_d := v_d - 1;
  end loop;
end $$;

create or replace function public.missoes_sequencia()
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); s record; m int; v_pagos int[] := '{}'; v_total int := 0; v_stars int;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  perform 1 from public.players where id = v_uid and not coalesce(bloqueado, false) for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  select * into s from private.missao_seq(v_uid);
  if s.dias > 0 then
    foreach m in array array[3, 7] loop
      if s.dias >= m then
        insert into private.missao_seq_premios (user_id, inicio, marco) values (v_uid, s.inicio, m) on conflict do nothing;
        if found then v_pagos := v_pagos || m; v_total := v_total + case m when 3 then 15 else 40 end; end if;
      end if;
    end loop;
  end if;
  if v_total > 0 then
    update public.players set stars = stars + v_total, updated_at = now() where id = v_uid returning stars into v_stars;
    insert into public.star_log (user_id, delta, reason) values (v_uid, v_total, 'missao_sequencia');
  end if;
  return json_build_object('ok', true, 'dias', s.dias, 'hoje_ok', s.hoje_ok, 'pagos', to_json(v_pagos), 'premio', v_total, 'stars', v_stars,
    'proximo', case when s.dias < 3 then 3 when s.dias < 7 then 7 end);
end $$;

revoke all on function private.missao_seq(uuid) from public, anon, authenticated;
revoke all on function public.missoes_sequencia() from public, anon;
grant execute on function public.missoes_sequencia() to authenticated;
