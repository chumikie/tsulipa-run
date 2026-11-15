-- Idols online agora + frases prontas (15/11/2026, OK do dono no chat).
-- Só contas logadas aparecem. Sem chat livre: a frase é uma CHAVE de uma lista fixa (o texto é traduzido no aparelho).
-- A tabela não tem políticas: só as funções abaixo (security definer) leem e escrevem.
create table if not exists public.presenca(
  id uuid primary key references public.players(id) on delete cascade,
  rua text,
  frase text,
  frase_em timestamptz,
  visto_em timestamptz not null default now()
);
alter table public.presenca enable row level security;
revoke all on public.presenca from anon, authenticated;
create index if not exists presenca_visto_em on public.presenca(visto_em desc);

create or replace function public.presenca_ping(p_rua text default null, p_frase text default null)
returns json language plpgsql security definer set search_path to 'public' as $$
declare
  eu uuid := auth.uid();
  rua_ok text := case when p_rua in ('mundo','palco','harajuku','fofo','praca','arena','ceu') then p_rua end;
  frase_ok text := case when p_frase in ('oi','lindo','jogar','valeu','parabens','tchau','amei','dancar') then p_frase end;
  ultima timestamptz;
begin
  if eu is null or not exists(select 1 from public.players where id = eu and not coalesce(bloqueado, false)) then
    return json_build_object('ok', false);
  end if;
  select frase_em into ultima from public.presenca where id = eu;
  -- no máximo uma frase a cada 4 segundos (evita enxurrada de balões)
  if frase_ok is not null and ultima is not null and ultima > now() - interval '4 seconds' then frase_ok := null; end if;
  insert into public.presenca as p(id, rua, frase, frase_em, visto_em)
    values (eu, rua_ok, frase_ok, case when frase_ok is not null then now() end, now())
  on conflict (id) do update set
    rua = excluded.rua,
    frase = coalesce(excluded.frase, p.frase),
    frase_em = coalesce(excluded.frase_em, p.frase_em),
    visto_em = now();
  delete from public.presenca where visto_em < now() - interval '1 day' and random() < .05;
  return json_build_object('ok', true);
end $$;

create or replace function public.presenca_agora(p_rua text default null)
returns json language sql stable security definer set search_path to 'public' as $$
  select json_build_object(
    'online', (select count(*) from public.presenca pr join public.players pl on pl.id = pr.id
                where pr.visto_em > now() - interval '3 minutes' and not coalesce(pl.bloqueado, false)),
    'rua', coalesce((select json_agg(t) from (
      select pl.nick,
             (pl.avatar - 'pet') || jsonb_build_object('c', coalesce(pl.look->'c', pl.avatar->'c'), 'a', coalesce(pl.look->'a', pl.avatar->'a', '""'::jsonb)) as avatar,
             case when pr.frase_em > now() - interval '15 seconds' then pr.frase end as frase,
             extract(epoch from pr.frase_em) as frase_em
        from public.presenca pr join public.players pl on pl.id = pr.id
       where p_rua is not null and pr.rua = p_rua and pr.visto_em > now() - interval '3 minutes'
         and pl.avatar is not null and not coalesce(pl.bloqueado, false)
       order by pr.visto_em desc limit 8) t), '[]'::json));
$$;

revoke all on function public.presenca_ping(text, text) from public, anon;
grant execute on function public.presenca_ping(text, text) to authenticated;
revoke all on function public.presenca_agora(text) from public;
grant execute on function public.presenca_agora(text) to anon, authenticated;
