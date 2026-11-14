-- APLICADO EM PRODUÇÃO em 14/11/2026 com o OK do dono (migração 20261114_photo_studio).
-- Photo⭐Studio! v1 (docs/PHOTO_STUDIO_PROPOSTA.md, aprovado pelo dono em 14/11/2026).
-- Pauta do dia igual para todo mundo (sorteio determinístico pela data de Brasília), conferência das
-- escolhas no servidor (1–3 estrelas) e ★5/dia na 1ª foto com 3 estrelas (trava private.bonus_jogo_dia,
-- agora aceitando 'foto'). Nenhuma imagem é enviada nem guardada.
alter table private.bonus_jogo_dia drop constraint if exists bonus_jogo_dia_jogo_check;
alter table private.bonus_jogo_dia add constraint bonus_jogo_dia_jogo_check check (jogo in ('cafe','hand','duo','foto'));

create or replace function private.studio_pauta_de(d date)
returns jsonb language plpgsql immutable set search_path to '' as $f$
declare k int := abs(pg_catalog.hashtext(d::text || 'k')) % 3; tipo text; valor text;
begin
  if k = 0 then tipo := 'luz'; valor := (array['suave','neon','por'])[1 + abs(pg_catalog.hashtext(d::text || 'v')) % 3];
  elsif k = 1 then tipo := 'quadro'; valor := (array['rosto','meio','inteiro'])[1 + abs(pg_catalog.hashtext(d::text || 'v')) % 3];
  else tipo := 'objeto'; valor := (array['balao','microfone','lightstick'])[1 + abs(pg_catalog.hashtext(d::text || 'v')) % 3]; end if;
  return pg_catalog.jsonb_build_object('dia', d,
    'fundo', (array['rosa','cortina','nuvens','neon'])[1 + abs(pg_catalog.hashtext(d::text || 'f')) % 4],
    'pose', (array['normal','v','coracao','tchau'])[1 + abs(pg_catalog.hashtext(d::text || 'p')) % 4],
    'detalhe', pg_catalog.jsonb_build_object('tipo', tipo, 'valor', valor));
end $f$;

create or replace function public.studio_pauta()
returns json language sql stable security definer set search_path to '' as $f$
  select (private.studio_pauta_de(public.hoje_br()) || '{"ok":true}'::jsonb)::json
$f$;

create or replace function public.studio_clique(p jsonb)
returns json language plpgsql volatile security definer set search_path to '' as $f$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br(); pa jsonb; v_ac int := 0; v_est int; v_stars int; v_pago boolean := false;
  v_obj text;
begin
  if v_uid is null or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if pg_catalog.jsonb_typeof(p) is distinct from 'object'
     or coalesce(p->>'fundo','') not in ('rosa','cortina','nuvens','neon')
     or coalesce(p->>'pose','') not in ('normal','v','coracao','tchau')
     or coalesce(p->>'luz','') not in ('suave','neon','por')
     or coalesce(p->>'quadro','') not in ('rosto','meio','inteiro')
     or coalesce(p->>'objeto','') not in ('nenhum','balao','microfone','lightstick','flor_sakura','flor_tulipa','flor_girassol','flor_lunar')
  then return pg_catalog.json_build_object('ok',false,'erro','escolhas'); end if;
  v_obj := p->>'objeto';
  -- flor só entra na foto se você tiver colhido (não gasta)
  if v_obj like 'flor_%' and not exists(select 1 from private.jardim_flores where user_id=v_uid and flor=substr(v_obj,6) and qtd>0) then
    return pg_catalog.json_build_object('ok',false,'erro','flor'); end if;
  pa := private.studio_pauta_de(v_dia);
  if p->>'fundo' = pa->>'fundo' then v_ac := v_ac + 1; end if;
  if p->>'pose' = pa->>'pose' then v_ac := v_ac + 1; end if;
  if p->>(pa->'detalhe'->>'tipo') = pa->'detalhe'->>'valor' then v_ac := v_ac + 1; end if;
  v_est := greatest(1, v_ac);
  if v_est = 3 then
    insert into private.bonus_jogo_dia(user_id,jogo,dia,run_id) values(v_uid,'foto',v_dia,pg_catalog.gen_random_uuid()) on conflict do nothing;
    if found then
      v_pago := true;
      update public.players set stars=stars+5,updated_at=now() where id=v_uid returning stars into v_stars;
      insert into public.star_log(user_id,delta,reason) values(v_uid,5,'bonus_foto');
    end if;
  end if;
  return pg_catalog.json_build_object('ok',true,'estrelas',v_est,'acertos',v_ac,'premio',case when v_pago then 5 else 0 end,'stars',v_stars,'pauta',pa);
end $f$;

revoke all on function private.studio_pauta_de(date) from public, anon, authenticated;
revoke all on function public.studio_pauta() from public, anon;
revoke all on function public.studio_clique(jsonb) from public, anon;
grant execute on function public.studio_pauta() to authenticated, service_role;
grant execute on function public.studio_clique(jsonb) to authenticated, service_role;
