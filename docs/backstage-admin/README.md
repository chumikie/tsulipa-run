# Backstage Admin — primeira etapa

## Decisão de produto
O TsuLiPa⭐World tem **um único administrador: o proprietário**. Não criar cargos, convites, equipe, hierarquia ou delegação de moderação.

A autorização existente é a fonte de verdade: `public.eh_admin()`, que consulta `public.admins` para o usuário autenticado (`auth.uid()`). O navegador nunca concede poderes por nickname, variável local ou botão oculto.

## Estado confirmado no banco de produção (leitura em 31/10/2026)
- Projeto: `fsggtvgbyhchblyazgmt` (BRS48's Project).
- 1 registro em `public.admins`, 9 perfis em `public.players`, 8 registros em `public.admin_log`.
- RPCs existentes: `admin_acao`, `admin_aviso`, `admin_contas`, `admin_corrida`, `admin_dar`, `admin_extra`, `admin_extrato`, `admin_missoes_completar`, `admin_painel`, `admin_presente`, `admin_resumo` e `eh_admin`.
- `admin_acao` não registra todas as alterações em `admin_log`; isso fica para a etapa de auditoria.
- O projeto `hfzjoefnousiouiuchys` é o laboratório antigo do Karaoke⭐Day!, não um espelho atual da produção. Não usar para validar esta ficha.

## Etapa 1 — ficha administrativa (este PR)
A proposta `supabase/sql/admin_player_profile_proposal.sql` adiciona uma RPC somente de leitura:
- Busca por nickname exato, sem expor email ou UUID.
- Reúne avatar/visual, estado da conta, estrelas, recordes e posição no Center⭐Run!/Sora⭐Jump!, dados semanais do Karaoke⭐Time!, contagens de participação e resumo de pets.
- Mostra até 20 ações administrativas anteriores registradas para aquele nickname.
- Exige sessão autenticada e `public.eh_admin()`; revoga execução de `PUBLIC` e `anon`, concede apenas a `authenticated`.
- Não altera saves, estrelas, inventário, recordes ou registros.

**Importante:** a RPC é uma proposta versionada, não foi aplicada ao Supabase. Não executar em produção. Primeiro revisar em ambiente de homologação que seja uma cópia compatível do schema de produção.

## Próximas etapas
1. Integrar uma busca por nickname e ficha visual ao painel da INDEX 2, usando a sessão Supabase já existente (sem criar outro cliente ou duplicar credenciais).
2. Completar auditoria das ações existentes: registrar antes/depois e motivo em `admin_log`, sem mudar contratos atuais sem testes.
3. Adicionar controles de conta e remoção de recados com confirmação, justificativa e reversão quando possível.
4. Ligar os módulos de jogos, pets/visuais e economia às RPCs existentes, sem testar escrita com contas reais.
5. Homologar autenticação, RLS, grants e comportamento com conta não administradora antes de qualquer implantação.

## Limites desta etapa
- Nenhuma alteração aplicada ao banco.
- Nenhum dado de jogador modificado.
- Nenhuma alteração na `main`, nenhum merge e nenhum deploy de produção.
- O painel visual ainda não está integrado: a raiz do repositório consultada nesta auditoria devolveu `index.html` vazio tanto em `main` quanto na branch de lançamento. Antes de editar a página principal, é necessário resolver qual artefato-fonte efetivamente alimenta o site publicado, para não sobrescrever a aplicação com uma cópia incompleta.
