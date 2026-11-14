# Vida de Idol⭐ — Cidade que Reage (primeira sequência da PR #88)

**Estado em 14/11/2026:** primeira entrega de integração **somente de frontend**, sem SQL, sem RPC, sem recompensa, sem alteração de saves `brs48cr_*` e sem merge/deploy oficial. Arquivos: `vida-cidade.js`, `vida-cidade.css`, `tests/vida-cidade.test.js` e ganchos mínimos nos módulos existentes.

## As cinco etapas entregues nesta primeira versão

1. **Cidade que Reage:** o Hub mostra um acontecimento *somente após confirmação* de Café, Handshake, Bloom, Photo Studio ou uma partida online do Battle. Fotos guardadas voluntariamente no TsuPhone também contam como memória local. Conclusões não são inferidas do clique, nem de treinos sem servidor. A fala é uma vinheta narrativa, não um NPC novo nem registro de relacionamento real.
2. **Camarim de Lembranças:** painel dentro de `#petRoom` com até três acontecimentos recentes, flor colhida simbolizada no vasinho e, quando existir, miniatura da própria fotografia já guardada temporariamente no TsuPhone. A miniatura reutiliza a URL original e respeita a chave da conta; não faz upload nem mantém outra cópia.
3. **Objetos com função:** toques no vasinho abrem o Bloom existente (que solicita login, se preciso), no porta-retratos abrem o TsuPhone existente e na estante abrem os controles existentes de cards. Não há efeitos automáticos em moedas, inventário ou plantio.
4. **Rotina espontânea leve:** a cena do Hub contém gesto CSS suave e frase vinculada ao horário de Brasília; respeita `prefers-reduced-motion`. Não cria loop de Canvas, áudio, timers ou NPCs novos.
5. **Histórias de Idol:** três capítulos opcionais nesta visita, representando cuidado (Jardim), encontro (Café/Handshake/Battle) e lembrança (Studio/TsuPhone). O próprio Diário de carreira mostra os fatos recentes **somente para o dono do perfil**, sem alterar a linha do tempo persistente.

## Origem dos acontecimentos

- `cafe_run_finalizar`: somente `ok && confirmado`, identificador da corrida para impedir repetição.
- `handshake_run_finish` ou compatibilidade de prêmio: somente retorno `ok` na finalização, identificador de sessão.
- `jardim_plantar`, `jardim_regar`, `jardim_colher`: somente resposta `ok` do servidor.
- `studio_clique` e `studio_publicar`: somente resposta `ok` do servidor.
- `battle_jogar`: somente partida online com três rodadas verificadas; treino nunca conta como vitória.
- `petPhoneMomentoGuardar*`: somente fotografia que a pessoa escolheu guardar no TsuPhone.

O histórico limita-se a oito acontecimentos **na memória da aba**, isolados por conta e pelo dia local do Brasil. Trocar de conta ou de dia reinicia a memória. Nunca persiste no navegador, SQL ou servidores.

## Limites importantes / próximas evoluções

Esta é a **primeira camada de continuidade**, não um simulador integral de NPCs. Ainda não há fãs passeando fisicamente entre os prédios, móveis arrastáveis novos, nem roteiros com ramificações persistidas. Reusar primeiro os personagens e rotinas existentes; depois avaliar cada extensão com testes móveis. Evitar escrita de dados e alterações na economia.

Verificação rápida: `node tests/vida-cidade.test.js` e `node tests/run-all.js`. O CI visual antigo do Karaoke ainda compara o Hub com uma versão anterior e não deve ser confundido com os novos testes.
