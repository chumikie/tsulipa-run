-- PROPOSTA — NÃO APLICADA. Decisão do dono; quem aplica é o ChatGPT, com autorização.
--
-- Levar uma flor do Bloom⭐Garden! para o Happy⭐Cafe!, como já acontece no Handshake⭐Event! desde 13/11
-- (`20261113_flores_e_caderno.sql`). Hoje a função só aceita `p_uso = 'handshake'` e recusa qualquer outro uso,
-- então a parte do site não existe: seria um botão que o servidor sempre recusa.
--
-- O que muda: UMA linha da `jardim_usar_flor` — a lista de usos aceitos. Nada mais.
--   • a flor continua sendo gasta do mesmo estoque (`private.jardim_flores`), uma por partida;
--   • o uso continua registrado em `private.jardim_usos` (agora com uso = 'cafe'), então dá para auditar;
--   • **nenhum prêmio novo em estrela.** No Café a flor seria enfeite + paciência um pouco maior, como o Hype
--     do Handshake: o teto de ★10/dia do Café não muda e o cálculo do prêmio continua sendo do servidor.
--
-- Depois de aplicado, o site precisa de uma rodada própria (o `flores.js` ganha o mesmo envelope que já faz
-- no Handshake, agora em volta do `cafeAbrir`/`cafeUI`). Sem esta função, não adianta mexer no site.

create or replace function public.jardim_usar_flor(p_flor text, p_uso text)
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare v_uid uuid := auth.uid(); v_qtd int;
begin
  if v_uid is null or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  -- 18/11/2026: 'cafe' entra ao lado de 'handshake' (era `p_uso is distinct from 'handshake'`)
  if p_flor is null or p_flor not in ('sakura','tulipa','girassol','lunar') or p_uso not in ('handshake','cafe') then
    return pg_catalog.json_build_object('ok',false,'erro','parametros'); end if;
  update private.jardim_flores set qtd=qtd-1 where user_id=v_uid and flor=p_flor and qtd>0 returning qtd into v_qtd;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','sem_flor'); end if;
  insert into private.jardim_usos(user_id,flor,uso) values(v_uid,p_flor,p_uso);
  return pg_catalog.json_build_object('ok',true,'flor',p_flor,'qtd',v_qtd);
end $f$;

revoke all on function public.jardim_usar_flor(text,text) from public, anon;
grant execute on function public.jardim_usar_flor(text,text) to authenticated, service_role;
