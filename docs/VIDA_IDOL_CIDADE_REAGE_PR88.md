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

## Refinamento de cenário — 14/11/2026

- **Ruas:** `tw-mapa.js` reutiliza exclusivamente os avatares já existentes no passeio. Quando ficam parados numa porta, exibem objetos vetoriais pequenos de contexto (bandeja de café, regador, câmera, lightstick ou microfone); o objeto do avatar do jogador exige uma atividade confirmada na mesma área. Um outro passeante já presente no passeio pode segurar um objeto decorativo, sem representar resultado de conta real.
- **Encontros espontâneos:** quando dois avatares já desenhados param realmente próximos, o mapa mostra um gesto visual curto (♡), limitado a um por rua; sem afirmar relação real, adicionar personagens, mover os avatares ou registrar encontros.
- **Camarim:** `pet.js` usa a estante original (respeitando seu deslocamento em Arrumar) para exibir uma flor ou uma moldura após acontecimentos da própria sessão. Não duplica PNG e não altera `petBg` persistido.
- **Foco no celular:** nenhuma rotina de animação, timer ou polling adicional; objetos são desenhados no mesmo ciclo Canvas já ativo. O resumo de atividades armazena apenas 8 ocorrências temporárias e evita recriar `Intl.DateTimeFormat` a cada quadro.
- **Testes:** `tests/vida-cenas.test.js` verifica privacidade, sinais confirmados, conexão dos objetos com Canvas e respeito ao movimento reduzido; `tests/vida-cidade.test.js` mantém os testes do Diário. O workflow “Mapa 2 níveis” passou em Chromium (execução #43543832441) e executou as provas mobile. QA de aparelho físico ainda pendente.
- **Futuro (não implementado):** animação mais fiel de mãos segurando objetos nos minijogos, reencontro com nome/persona de fãs conhecidos e interação dentro dos prédios, somente após projeto artístico e testes móveis, sem mexer no servidor.

## Acabamento do Camarim e Diário — 14/11/2026

- Uma **flor e um porta-retratos** podem ficar visíveis simultaneamente no Canvas do Camarim quando ambos foram conquistados nesta visita; preservados o posicionamento da estante e a foto original do TsuPhone.
- O Hub e o Diário mostram uma ligação narrativa após **dois capítulos** e um encerramento com três capítulos concluídos, com textos em pt/en/es/id/th/ja e somente para ações confirmadas.
- Quando nada mudou, o painel mantém os mesmos botões e o foco no celular; na troca de conta, remove os elementos anteriores do DOM e não escreve dados locais.
- Teste integrado de lembranças simultâneas, isolamento por conta e narrativa em `tests/vida-cenas.test.js`; iPhone físico continua pendente.

## Reencontro na Praça Central — 14/11/2026

O Happy⭐Cafe! registra um reencontro visual apenas após resposta `r.ok && r.confirmado && r.certo===true` de atendimento correto. O fã precisa existir na memória do Handshake da própria conta; o nome, presente e aparência são conferidos novamente. Modo treino, atendimento incorreto ou troca de conta não criam reencontros.

A Praça Central exibe no máximo **um fã NPC conhecido**, com sua aparência do Handshake e uma etiqueta 💌 durante as pausas. Usa o mesmo Canvas e loop de passeantes existentes, sem editar RPCs, saves, prêmios, ranking ou relações. Uma nova lembrança substitui a anterior da sessão.

A revisão estática preserva `click` nativo, rolagem e preferências de movimento reduzido. **Safari em iPhone físico segue sem teste real**; Chromium móvel simulado não equivale a Safari.
