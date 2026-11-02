-- Requer a migração de grupos nacionais anterior. Não aplicar na produção sem aprovação.
do $$
begin
  if to_regclass('public.idol_grupos') is null or
     not exists(select 1 from information_schema.columns where table_schema='public' and table_name='players' and column_name='grupo')
    then raise exception 'Aplicar primeiro a migração grupos_nacionais'; end if;
end $$;

create or replace function public.admin_aviso_grupo(p_grupo text,p_texto text) returns json
language plpgsql security definer set search_path='public' as $$
declare g text:=upper(btrim(coalesce(p_grupo,'')));
        msg text:=left(btrim(coalesce(p_texto,'')),140);
begin
  if not public.eh_admin() then return json_build_object('ok',false,'erro','admin'); end if;
  if not exists(select 1 from public.idol_grupos where codigo=g and ativo)
    then return json_build_object('ok',false,'erro','grupo'); end if;
  insert into public.config(chave,valor) values ('aviso_grupo_'||g,to_jsonb(msg))
    on conflict(chave) do update set valor=excluded.valor;
  insert into public.admin_log(admin,acao,alvo,motivo)
    values(auth.uid(),'aviso_grupo',g,left(msg,80));
  return json_build_object('ok',true,'grupo',g);
end $$;
revoke all on function public.admin_aviso_grupo(text,text) from public,anon;
grant execute on function public.admin_aviso_grupo(text,text) to authenticated;

create or replace function public.admin_avisos_grupo() returns json
language sql stable security definer set search_path='public' as $$
  select case when not public.eh_admin() then '[]'::json else
    coalesce(json_agg(json_build_object('grupo',g.codigo,'texto',coalesce(c.valor #>> '{}',''))
      order by g.codigo),'[]'::json) end
  from public.idol_grupos g
  left join public.config c on c.chave='aviso_grupo_'||g.codigo
  where g.ativo;
$$;
revoke all on function public.admin_avisos_grupo() from public,anon;
grant execute on function public.admin_avisos_grupo() to authenticated;

-- Avisos globais permanecem visíveis a todos; avisos de grupo só a quem o escolheu.
-- A assinatura e o tipo de retorno de aviso_inicio() permanecem inalterados.
create or replace function public.aviso_inicio() returns text
language sql stable security definer set search_path='public' as $$
  select nullif(concat_ws(' · ',
    nullif((select valor #>> '{}' from public.config where chave='aviso'),''),
    case when auth.uid() is not null then
      (select nullif(c.valor #>> '{}','') from public.players p
       join public.config c on c.chave='aviso_grupo_'||p.grupo
       where p.id=auth.uid() and p.grupo is not null)
    end
  ),'');
$$;
revoke all on function public.aviso_inicio() from public;
grant execute on function public.aviso_inicio() to anon,authenticated;

-- O servidor define o preço oficial: mesma faixa da camisa Brasil, 150 estrelas.
do $$
declare original text; alterado text; oid_func oid;
begin
  select p.oid into oid_func from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname='visual_preco';
  if oid_func is null then raise exception 'visual_preco ausente'; end if;
  original:=pg_get_functiondef(oid_func);
  alterado:=replace(original,
    '(''roupa_brasil'', 150, 0),',
    '(''roupa_brasil'', 150, 0), (''roupa_tailandia'', 150, 0),');
  if original=alterado then raise exception 'Tabela de preços mudou; revisar visual_preco'; end if;
  execute alterado;
end $$;
