-- Perfil: emoji, cor e time (B, R, S, KKS) + lista de Oshi só com quem joga.
-- APLICADO na produção em 30/10/2026 (migração perfil_emoji_cor_time_oshi_jogadores), com o ok da dona.
alter table public.players add column if not exists emoji text not null default '',
  add column if not exists cor text not null default '', add column if not exists time text not null default '';

create or replace function public.salvar_estilo(p_emoji text, p_cor text, p_time text) returns json
language plpgsql security definer set search_path to 'public' as $$
declare e text := btrim(coalesce(p_emoji, '')); c text := lower(btrim(coalesce(p_cor, ''))); t text := upper(btrim(coalesce(p_time, '')));
begin
  if auth.uid() is null then return json_build_object('ok', false); end if;
  if char_length(e) > 8 or e ~ '[A-Za-z0-9<>&"''\\]' then return json_build_object('ok', false, 'erro', 'emoji'); end if;
  if c <> '' and c !~ '^#[0-9a-f]{6}$' then return json_build_object('ok', false, 'erro', 'cor'); end if;
  if t not in ('', 'B', 'R', 'S', 'KKS') then return json_build_object('ok', false, 'erro', 'time'); end if;
  update public.players set emoji = e, cor = c, time = t, updated_at = now() where id = auth.uid();
  return json_build_object('ok', found, 'emoji', e, 'cor', c, 'time', t);
end $$;
revoke all on function public.salvar_estilo(text,text,text) from public, anon;
grant execute on function public.salvar_estilo(text,text,text) to authenticated;

create or replace function public.oshi_opcoes() returns json
language sql stable security definer set search_path to 'public' as $$
  select coalesce(json_agg(json_build_object('nick', nick, 'emoji', emoji, 'cor', cor, 'time', time) order by lower(nick)), '[]'::json)
    from public.players where not coalesce(bloqueado, false) and nick is not null and nick <> '';
$$;
grant execute on function public.oshi_opcoes() to anon, authenticated;

-- meu_perfil e perfil_publico: mesmas funções de hoje + 'emoji', 'cor', 'time'.
-- (o corpo completo está na migração aplicada; adicionar a linha:  'emoji', p.emoji, 'cor', p.cor, 'time', p.time,)
