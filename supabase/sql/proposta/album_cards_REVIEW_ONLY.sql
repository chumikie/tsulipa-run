-- TsuLiPa⭐World / Star⭐Gacha! — PROPOSTA DE RPC DO ÁLBUM
-- REVISÃO SOMENTE: NÃO APLICAR SEM AUTORIZAÇÃO ESPECÍFICA.
-- Arquivo deliberadamente fora de supabase/migrations/.
--
-- Auditoria (03/11/2026):
--   public.gacha guarda o histórico integral dos giros e os cards em tipo='card', valor=nick.
--   public.aniver_presentes guarda os cards de aniversário usados por public.meus_cards().
--   public.meus_cards()/public.ultimos_cards() limitam a RESPOSTA a 3, não o histórico.
--   O formato de card continua sendo o de public.gacha_card(nick), sem snapshots antigos.
--
-- Contrato: public.album_cards() -> JSON array, sem parâmetros, somente leitura.
-- Um item por Idol (nome sem distinção de maiúsculas/minúsculas), card mais recente,
-- tipo 'card' ou 'aniver', dia, vezes (aquisições, inclusive presente de aniversário)
-- e primeira (timestamp da primeira aquisição).
-- Não muda public.gacha_girar(), recompensas, saldo nem limites diários.
--
-- Segurança:
--   gacha/aniver_presentes têm RLS, sem política SELECT para authenticated.
--   SECURITY DEFINER é necessário para a leitura restrita, como em meus_cards().
--   Cada fonte é filtrada por auth.uid(); não há parâmetro de usuário.
--   search_path vazio e referências qualificadas evitam objetos maliciosos.
--   EXECUTE somente para authenticated; revogar PUBLIC/anon na mesma transação.

begin;

create or replace function public.album_cards()
returns json
language sql
stable
security definer
set search_path to ''
as $function$
  with aquisicoes as (
    select lower(btrim(g.valor)) as chave,
           btrim(g.valor) as nick,
           'card'::text as tipo,
           g.created_at as quando
    from public.gacha g
    where g.user_id = (select auth.uid())
      and g.tipo = 'card'
      and nullif(btrim(g.valor), '') is not null

    union all

    select lower(btrim(p.nick)) as chave,
           p.nick as nick,
           'aniver'::text as tipo,
           a.em as quando
    from public.aniver_presentes a
    join public.players p on p.id = a.user_id
    where a.user_id = (select auth.uid())
  ),
  ordenadas as (
    select a.*,
           count(*) over (partition by a.chave)::integer as vezes,
           min(a.quando) over (partition by a.chave) as primeira,
           row_number() over (
             partition by a.chave
             order by a.quando desc, case when a.tipo = 'aniver' then 0 else 1 end
           ) as ordem
    from aquisicoes a
  )
  select coalesce(
    json_agg(
      json_build_object(
        'card', public.gacha_card(p.nick),
        'tipo', o.tipo,
        'dia', o.quando::date,
        'vezes', o.vezes,
        'primeira', o.primeira
      )
      order by o.quando desc, p.nick
    ),
    '[]'::json
  )
  from ordenadas o
  join public.players p on lower(btrim(p.nick)) = o.chave
  where o.ordem = 1
    and (select auth.uid()) is not null
$function$;

revoke all on function public.album_cards() from public, anon;
grant execute on function public.album_cards() to authenticated;

commit;

-- Antes de aplicar: confirmar novamente os esquemas, a ausência de album_cards()
-- e a propriedade/grants da função. Fazer ensaios em PostgreSQL isolado:
-- 1) anon sem EXECUTE; authenticated de outra conta recebe somente seus Idols;
-- 2) giros repetidos do mesmo Idol => uma entrada com vezes=2;
-- 3) o evento mais recente define o tipo e o card atual usa gacha_card();
-- 4) conta sem giros => []; aniversário preservado quando existir;
-- 5) nenhuma escrita em gacha, players, star_log, tickets ou missões.
-- Limitação histórica: gacha guarda nickname e horário, não snapshot do avatar;
-- caso o Idol tenha sido excluído/renomeado, gacha_card() pode não encontrá-lo.
