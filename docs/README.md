# Documentação — índice do projeto

Esta pasta contém documentação para manutenção e lançamento do TsuLiPa⭐World. Ela não é importada pelos arquivos HTML/JavaScript do jogo e não cria requisições no navegador por si só.

## Leia nesta ordem

1. [Plano de lançamento](PLANO_DE_LANCAMENTO.md) — checklist central, com os bloqueios concretos antes de liberar o recurso para membros reais.
2. [Estado do que existe](status/ETAPA3_STATUS_DO_QUE_EXISTE.md) — inventário de implementado, experimental, proposto e pendente.
3. [Auditoria da INDEX 2](auditorias/AUDITORIA_RANKING_LOJA_INDEX2.md) e [auditoria técnica V3](auditorias/AUDITORIA_V3.md) — análise de segurança, performance e integração.
4. [Plano de Karaoke e moderação](operacao/PLANO_KARAOKE_MODERACAO.md) — decisões funcionais e etapas de homologação.
5. [Documento de continuidade](continuidade/CONTINUIDADE_CHATGPT.md) — contexto para retomar o trabalho em outra conversa; contém snapshots históricos, então confirme o estado atual antes de agir.

## Por assunto

### Status e lançamento
- [ETAPA3_STATUS_DO_QUE_EXISTE.md](status/ETAPA3_STATUS_DO_QUE_EXISTE.md) — referência principal para distinguir código existente de proposta.
- [PLANO_DE_LANCAMENTO.md](PLANO_DE_LANCAMENTO.md) — portões de validação e checklist de go/no-go.

### Auditorias
- [AUDITORIA_V3.md](auditorias/AUDITORIA_V3.md) — arquitetura, responsividade, segurança e otimizações.
- [AUDITORIA_RANKING_LOJA_INDEX2.md](auditorias/AUDITORIA_RANKING_LOJA_INDEX2.md) — leitura/gravação na prévia, ranking, loja e moderação.

### Especificações de etapas
- [ETAPA3A_KARAOKE_ONLINE_9_IDOLS.md](etapas/ETAPA3A_KARAOKE_ONLINE_9_IDOLS.md) — especificação do Karaoke online para nove participantes.
- [ETAPA3A11_VIDA_UTIL_E_ESTABILIDADE.md](etapas/ETAPA3A11_VIDA_UTIL_E_ESTABILIDADE.md) — estabilidade de iframe, microfone e ciclo de vida móvel.
- [ETAPA3B_CATALOGO_KARAOKE_SORA_DUO.md](etapas/ETAPA3B_CATALOGO_KARAOKE_SORA_DUO.md) — catálogo conceitual de loja, roupas, cenários e danças.
- [ETAPA3B_TV_TOP_IDOLS_SEMANAL.md](etapas/ETAPA3B_TV_TOP_IDOLS_SEMANAL.md) — módulo semanal de TV/Top Idols; contém uma proposta de SQL que não foi aplicada à produção.
- [ETAPA3C_TEMAS_E_COVERS.md](etapas/ETAPA3C_TEMAS_E_COVERS.md) — curadoria de músicas e covers.
- [ETAPA3D_TRIO_VOZ_E_ANIMACAO.md](etapas/ETAPA3D_TRIO_VOZ_E_ANIMACAO.md) — ideia de vozes e interação com o trio.

## Como interpretar os documentos

- **Fonte da verdade de comportamento:** código existente na branch e estado real do Supabase; um documento não prova que uma funcionalidade foi publicada ou que seu SQL foi aplicado.
- **Estado do código:** use o documento de status e confirme a revisão atual do GitHub.
- **Planos e catálogos:** podem conter itens ainda não implementados; só considere concluído o que estiver confirmado no código e nos testes.
- **Auditorias e continuidade:** são snapshots com data. Use-os como histórico, não como instrução para reverter arquivos.
- **SQL:** scripts em supabase/sql/ são versionados; confirme migrações e estado de produção antes de qualquer execução.
- **Produção:** index.html e o Supabase real não devem ser alterados como parte de testes da prévia. O PR #33 continua sendo uma etapa experimental até aprovação.

Os arquivos de teste estão em tests/; os scripts de banco e seus testes reversíveis ficam em supabase/sql/ e supabase/tests/. Eles permanecem junto do código para que uma organização de documentos não altere caminhos de execução.