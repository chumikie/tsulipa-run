-- Grupos nacionais: somente proposta de migração; não aplicar automaticamente.
create table public.idol_grupos (
  codigo text primary key,
  nome text not null,
  pais char(2) not null,
  ativo boolean not null default true
);
create table public.idol_grupo_times (
  grupo text not null references public.idol_grupos(codigo),
  codigo text not null,
  nome text not null,
  cor text not null,
  primary key (grupo, codigo)
);
insert into public.idol_grupos(codigo,nome,pais) values
  ('BRS48','BRS48','BR'), ('SKU48','SKU48','TH');
insert into public.idol_grupo_times(grupo,codigo,nome,cor) values
  ('BRS48','B','Team B','#4169e1'),
  ('BRS48','R','Team R','#f5c400'),
  ('BRS48','S','Team S','#3cb043'),
  ('BRS48','KKS','Team KKS','#4dd8ff'),
  ('SKU48','S','Team S','#3cb043'),
  ('SKU48','K','Team K','#8448fa'),
  ('SKU48','U','Team U','#ff6fb5'),
  ('SKU48','KKS','Team KKS','#4dd8ff');
alter table public.players add column grupo text references public.idol_grupos(codigo);
-- Sem reclassificação automática: jogadores antigos preservam a escolha atual.
create index players_grupo_idx on public.players(grupo);

alter table public.idol_grupos enable row level security;
alter table public.idol_grupo_times enable row level security;
create policy grupos_publicos_ler on public.idol_grupos for select to anon, authenticated using (ativo);
create policy grupos_times_publicos_ler on public.idol_grupo_times for select to anon, authenticated
  using (exists(select 1 from public.idol_grupos g where g.codigo=grupo and g.ativo));
revoke all on public.idol_grupos, public.idol_grupo_times from public, anon, authenticated;
grant select on public.idol_grupos, public.idol_grupo_times to anon, authenticated;

create or replace function public.grupos_disponiveis() returns json
language sql stable security invoker set search_path='public' as $$
  select coalesce(json_agg(json_build_object('codigo',g.codigo,'nome',g.nome,'pais',g.pais,
    'times',(select coalesce(json_agg(json_build_object('codigo',t.codigo,'nome',t.nome,'cor',t.cor)
      order by t.codigo),'[]'::json) from public.idol_grupo_times t where t.grupo=g.codigo))
    order by g.codigo),'[]'::json)
  from public.idol_grupos g where g.ativo;
$$;
revoke all on function public.grupos_disponiveis() from public;
grant execute on function public.grupos_disponiveis() to anon, authenticated;

create or replace function public.salvar_grupo(p_grupo text, p_time text) returns json
language plpgsql security definer set search_path='public' as $$
declare g text := upper(btrim(coalesce(p_grupo,'')));
        t text := upper(btrim(coalesce(p_time,'')));
begin
  if auth.uid() is null then return json_build_object('ok',false,'erro','login'); end if;
  if not exists(select 1 from public.idol_grupos where codigo=g and ativo)
    then return json_build_object('ok',false,'erro','grupo'); end if;
  if t <> '' and not exists(select 1 from public.idol_grupo_times where grupo=g and codigo=t)
    then return json_build_object('ok',false,'erro','time'); end if;
  update public.players set grupo=g, time=t, updated_at=now() where id=auth.uid();
  return json_build_object('ok',found,'grupo',g,'time',t);
end $$;
revoke all on function public.salvar_grupo(text,text) from public, anon;
grant execute on function public.salvar_grupo(text,text) to authenticated;

-- Novo editor grava grupo, time, emoji e cor numa única transação.
create or replace function public.salvar_grupo_estilo(p_grupo text, p_time text, p_emoji text, p_cor text) returns json
language plpgsql security definer set search_path='public' as $$
declare g text := upper(btrim(coalesce(p_grupo,'')));
        t text := upper(btrim(coalesce(p_time,'')));
        e text := btrim(coalesce(p_emoji,''));
        c text := lower(btrim(coalesce(p_cor,'')));
begin
  if auth.uid() is null then return json_build_object('ok',false,'erro','login'); end if;
  if char_length(e)>8 or e ~ '[A-Za-z0-9<>&"''\\]' then return json_build_object('ok',false,'erro','emoji'); end if;
  if c<>'' and c !~ '^#[0-9a-f]{6}$' then return json_build_object('ok',false,'erro','cor'); end if;
  if not exists(select 1 from public.idol_grupos where codigo=g and ativo)
    then return json_build_object('ok',false,'erro','grupo'); end if;
  if t<>'' and not exists(select 1 from public.idol_grupo_times where grupo=g and codigo=t)
    then return json_build_object('ok',false,'erro','time'); end if;
  update public.players set grupo=g, time=t, emoji=e, cor=c, updated_at=now() where id=auth.uid();
  return json_build_object('ok',found,'grupo',g,'time',t,'emoji',e,'cor',c);
end $$;
revoke all on function public.salvar_grupo_estilo(text,text,text,text) from public, anon;
grant execute on function public.salvar_grupo_estilo(text,text,text,text) to authenticated;

-- As antigas assinaturas continuam válidas. A chamada legada não muda o grupo.
-- Grupos sem seleção explícita mantêm a interpretação antiga de BRS48.
create or replace function public.salvar_estilo(p_emoji text, p_cor text, p_time text) returns json
language plpgsql security definer set search_path='public' as $$
declare e text := btrim(coalesce(p_emoji,''));
        c text := lower(btrim(coalesce(p_cor,'')));
        t text := upper(btrim(coalesce(p_time,'')));
        g text;
begin
  if auth.uid() is null then return json_build_object('ok',false); end if;
  if char_length(e)>8 or e ~ '[A-Za-z0-9<>&"''\\]' then return json_build_object('ok',false,'erro','emoji'); end if;
  if c<>'' and c !~ '^#[0-9a-f]{6}$' then return json_build_object('ok',false,'erro','cor'); end if;
  select coalesce(grupo,'BRS48') into g from public.players where id=auth.uid();
  if not found then return json_build_object('ok',false,'erro','perfil'); end if;
  if t<>'' and not exists(select 1 from public.idol_grupo_times where grupo=g and codigo=t)
    then return json_build_object('ok',false,'erro','time'); end if;
  update public.players set emoji=e, cor=c, time=t, updated_at=now() where id=auth.uid();
  return json_build_object('ok',found,'emoji',e,'cor',c,'time',t);
end $$;
revoke all on function public.salvar_estilo(text,text,text) from public, anon;
grant execute on function public.salvar_estilo(text,text,text) to authenticated;

-- Preserva integralmente os demais campos das RPCs existentes e só anexa grupo.
do $$
declare n text; source text; altered text; oid_ref oid;
begin
  foreach n in array array['meu_perfil','perfil_publico'] loop
    select p.oid into oid_ref from pg_proc p join pg_namespace ns on ns.oid=p.pronamespace
      where ns.nspname='public' and p.proname=n;
    if oid_ref is null then raise exception 'RPC ausente: %',n; end if;
    source := pg_get_functiondef(oid_ref);
    altered := replace(source, '''emoji'', p.emoji, ''cor'', p.cor, ''time'', p.time,',
                      '''emoji'', p.emoji, ''cor'', p.cor, ''grupo'', p.grupo, ''time'', p.time,');
    if altered=source then raise exception 'Assinatura de % mudou; revisar antes de aplicar',n; end if;
    execute altered;
  end loop;
  select p.oid into oid_ref from pg_proc p join pg_namespace ns on ns.oid=p.pronamespace
    where ns.nspname='public' and p.proname='oshi_opcoes';
  if oid_ref is null then raise exception 'RPC ausente: oshi_opcoes'; end if;
  source := pg_get_functiondef(oid_ref);
  altered := replace(source, '''time'', time)', '''time'', time, ''grupo'', grupo)');
  if altered=source then raise exception 'Assinatura de oshi_opcoes mudou; revisar antes de aplicar'; end if;
  execute altered;
end $$;
