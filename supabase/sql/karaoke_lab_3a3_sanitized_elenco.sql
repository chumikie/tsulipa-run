-- Etapa 3A.3: banco EXCLUSIVAMENTE DE HOMOLOGAÇÃO.
-- Consulta lista de vagas e fila com rótulos 'Idol 01', sem UUID, apelidos reais ou perfis.
-- A consulta exige usuário autenticado e já presente na sala; nenhum score ou recompensa.
-- NÃO aplicar no banco de produção.
CREATE OR REPLACE FUNCTION public.karaoke_ensaio_elenco()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_slots jsonb := '[]'::jsonb;
  v_queue jsonb := '[]'::jsonb;
  v_singer smallint;
  v_rev bigint;
begin
  if v_uid is null then
    raise exception 'sign_in_required' using errcode='28000';
  end if;
  if not exists(select 1 from karaoke_lab.seats where user_id=v_uid) then
    return jsonb_build_object('status','not_inside','slots','[]'::jsonb,'queue','[]'::jsonb);
  end if;
  with ordered as (
    select s.user_id, row_number() over (order by s.joined_at,s.user_id)::smallint as slot
    from karaoke_lab.seats s
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'slot',o.slot,
    'label','Idol '||lpad(o.slot::text,2,'0'),
    'self',o.user_id=v_uid,
    'singing',o.user_id=r.singer_id
  ) order by o.slot),'[]'::jsonb)
  into v_slots
  from ordered o cross join karaoke_lab.room r
  where r.id=1;

  with ordered as (
    select s.user_id, row_number() over (order by s.joined_at,s.user_id)::smallint as slot
    from karaoke_lab.seats s
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'slot',o.slot,'label','Idol '||lpad(o.slot::text,2,'0')
  ) order by q.seq),'[]'::jsonb)
  into v_queue from karaoke_lab.queue q join ordered o using(user_id);

  select r.revision into v_rev from karaoke_lab.room r where r.id=1;
  return jsonb_build_object('status','ok','slots',v_slots,'queue',v_queue,
                            'revision',v_rev,'verified',false);
end
$function$
revoke all on function public.karaoke_ensaio_elenco() from public, anon, authenticated;
grant execute on function public.karaoke_ensaio_elenco() to authenticated;
