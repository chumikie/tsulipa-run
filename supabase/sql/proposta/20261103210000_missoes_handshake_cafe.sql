-- TsuLiPa⭐World — PROPOSTA (não aplicar sem revisão do ChatGPT e autorização do usuário)
-- Missões do dia para os jogos novos: Handshake⭐Event! e Happy⭐Cafe!
--
-- O site (PR #71) já:
--   • mostra os textos das chaves 'handshake' e 'cafe' (hub.js, HUB_MIS);
--   • chama marcar_visita(p_k => 'handshake') ao fim de uma partida com pelo menos 1 acerto;
--   • chama marcar_visita(p_k => 'cafe') ao fim de um turno com pelo menos 1 pedido perfeito.
-- Enquanto o servidor não conhecer essas chaves, a chamada falha em silêncio e nada muda.
--
-- O que falta no banco (o código de missoes() e marcar_visita() não está no repositório,
-- então o ChatGPT precisa conferir o corpo real antes de aplicar):
--   1) missoes_lista(): acrescentar as duas linhas abaixo (nível 1, meta 1, mesmo prêmio das outras do nível 1).
--   2) marcar_visita(p_k): aceitar 'handshake' e 'cafe' do mesmo jeito que já aceita 'collect'
--      (1 marcação por dia, só a própria conta, contas bloqueadas recusadas).
--   3) missoes(): contar o progresso dessas chaves a partir das marcações do dia, como em 'collect'.
--
-- Regras mantidas: o prêmio é o da missão (sistema de missões / teto ★100 do Center⭐Run!);
-- os jogos em si não dão estrelas e não usam o teto independente de ★50 dos minijogos do Pet.
-- Decisão do usuário pendente: se essas missões devem mesmo dar ★10 ou ficar só como enfeite.

CREATE OR REPLACE FUNCTION public.missoes_lista()
 RETURNS TABLE(k text, nivel integer, meta integer, premio integer, fam text)
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  select * from (values
    ('corra2', 1, 2, 10, 'corrida'), ('coracao', 1, 1, 10, 'coracao'), ('recado', 1, 1, 10, 'recado'), ('mini', 1, 1, 10, 'mini'), ('pet', 1, 1, 10, 'pet'),
    ('handshake', 1, 1, 10, 'evento'), ('cafe', 1, 1, 10, 'evento'),
    ('corra3', 2, 3, 15, 'corrida'), ('estrelas50', 2, 50, 15, 'estrela'), ('pontos2000', 2, 2000, 15, 'ponto'), ('tsulipa', 2, 3, 15, 'tsulipa'),
    ('corra5', 3, 5, 20, 'corrida'), ('pontos5000', 3, 5000, 20, 'ponto'), ('estrelas100', 3, 100, 20, 'estrela')
  ) as v(k, nivel, meta, premio, fam)
$function$;
