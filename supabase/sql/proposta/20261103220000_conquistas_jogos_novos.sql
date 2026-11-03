-- TsuLiPa⭐World — PROPOSTA (não aplicar sem revisão do ChatGPT e autorização do usuário)
-- Conquistas dos jogos novos como insígnias da conta (Estante de troféus), só visuais.
--
-- O site (PR #71) já mostra estas insígnias no próprio perfil a partir do aparelho (localStorage
-- 'tw_conquistas') e chama conquista_jogo(p_k) quando o jogador ganha uma. Enquanto esta função não existir,
-- a chamada falha em silêncio e a insígnia aparece só para o próprio jogador, naquele aparelho.
--   jogo_barista  🧋 Barista perfeito  — 12 pedidos perfeitos em um turno do Happy⭐Cafe!
--   jogo_memoria  🤝 Memória de fã     — combo de 10 acertos no Handshake⭐Event!
--   jogo_caderno  📒 Caderno completo  — todas as 20 receitas do Caderno do Happy⭐Cafe!
-- Não dá estrelas e não usa o teto de ★50 do Pet nem o de ★100 do Center⭐Run!.
-- Observação honesta: a prova vem do aparelho (jogos sem servidor), então é uma insígnia de "palavra do jogador",
-- como enfeite. O ChatGPT deve encaixar no mesmo armazenamento das insígnias atuais (o nome real da tabela
-- de insígnias não está no repositório; abaixo usa-se private.player_badges como marcador a confirmar).

create or replace function public.conquista_jogo(p_k text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then return jsonb_build_object('ok', false, 'erro', 'login'); end if;
  if p_k not in ('jogo_barista', 'jogo_memoria', 'jogo_caderno') then return jsonb_build_object('ok', false, 'erro', 'chave'); end if;
  -- CONFIRMAR: tabela/colunas reais das insígnias e a checagem de conta bloqueada usada nas outras funções.
  insert into private.player_badges(player_id, badge, nivel, ganho_em)
  values (v_uid, p_k, 1, now())
  on conflict (player_id, badge) do nothing;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.conquista_jogo(text) from public, anon;
grant execute on function public.conquista_jogo(text) to authenticated;
