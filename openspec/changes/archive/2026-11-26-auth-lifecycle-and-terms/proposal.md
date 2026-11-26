# Proposta: Ciclo de Vida de Autenticação, Termos de Uso (LGPD) e Alinhamentos de Revisão (PR #142)

## Por quê (Why)

A PR #142 (`hywenklis:feat/auth-lifecycle-and-terms` em `genesluna/buddy-client`) implementa os fluxos completos de ciclo de vida de autenticação (esqueci a senha, redefinição de senha e pendência/reenvio de verificação de e-mail), consentimento de Termos de Uso (LGPD) no cadastro, navegação autenticada no cabeçalho e guardas de perfil/resiliência de imagens na listagem e detalhes de pets.

Durante a revisão do PR por `@genesluna` (`CHANGES_REQUESTED`), foram identificadas inconsistências de contrato e navegação que impedem o merge seguro em `develop`, além da necessidade de formalizar a feature com OpenSpec neste repositório:
1. **[CRÍTICO] Contrato de `ProfileType` quebrado (`'ADOPTER'` vs `'USER'`):** o backend (`buddy-api`) retorna `profileType: 'USER' | 'SHELTER' | 'ADMIN'`, mas o frontend definia `'SHELTER' | 'ADOPTER' | 'ADMIN'` em `app/_entities/auth/model.ts` e `app/_entities/auth/user-storage.ts`, fazendo `getStoredUser()` rejeitar perfis `'USER'` no reload e apagar o `localStorage`, além de forçar um cast `as string` em `pet-details-card.tsx`.
2. **[ALTO] Links quebrados (404) para `/profile/create`:** a rota `/profile/create` não existe no `buddy-client`, causando 404 em `pet-details-card.tsx`, `main-nav.tsx` e `hamburger-nav.tsx`. Conforme decisão do mantenedor, os links devem ser ocultados mantendo apenas avisos informativos até a criação da tela de perfil em outra PR.
3. **[MÉDIO] Badge de `ADMIN` rotulada incorretamente como adotante:** `main-nav.tsx` e `hamburger-nav.tsx` exibiam `🐾 Adotante` para qualquer tipo diferente de `SHELTER`, e `pet-details-card.tsx` não tratava explicitamente contas apenas `ADMIN`.
4. **[ALTO] Compatibilidade de rotas de e-mail (`/auth/verify-email` e `/auth/reset-password`):** o frontend mantém exclusivamente `/auth/verify-email` e `/auth/reset-password` (sem redirects em `next.config.mjs`); o alinhamento dos templates de e-mail no `buddy-api` será feito separadamente.
5. **[MELHORIA CONFIRMADA] Desacoplamento de `_embedded` HAL em `app/_entities/pet/queries.ts`:** remover a dependência rígida da chave `petParamsResponseList` usando extração genérica sobre `response.data._embedded`.

## O que muda (What Changes)

- **Formalização OpenSpec no `buddy-client`:** especificação canônica inicial dos domínios `auth/lifecycle`, `terms/consent` e `pet/details-and-catalog`.
- **Ciclo de vida de autenticação e sessão:**
  - Fluxos de recuperação e redefinição de senha (`/auth/forgot-password` e `/auth/reset-password`), além de `/auth/verification-pending` e `/auth/verify-email`.
  - Navegação autenticada no cabeçalho (`MainNav` e `HamburgerNav`) com dropdown, logout e exibição correta dos perfis.
  - Alinhamento estrito de `ProfileType` e `VALID_PROFILE_TYPES` para `'USER' | 'SHELTER' | 'ADMIN'`, removendo `'ADOPTER'` do código, testes e documentação de tipos, e adicionando teste de regressão de reload para `'USER'`.
  - Correção da badge `ADMIN` nos menus (`🛡️ Admin`) e remoção dos links quebrados `/profile/create` com substituição por avisos informativos.
- **Consentimento e Termos de Uso (LGPD):**
  - Entidade `_entities/terms` (`GET /terms/active`, `POST /terms/accept`) e widget `_widgets/terms-modal` integrados ao fluxo de cadastro (`/auth/register`).
- **Detalhes e catálogo de pets:**
  - Controle de ação de adoção por `ProfileType` em `pet-details-card.tsx` (incluindo tratamento para conta sem perfil sem link `/profile/create` e para conta apenas `ADMIN`, sem cast `as string`).
  - Validação defensiva de URLs de imagem (`isValidImageUrl`) em listagem, galeria e card do abrigo.
  - Desacoplamento de `_embedded` em `fetchPets`, `fetchPetsInfinite` e `fetchPetById` em `app/_entities/pet/queries.ts`.

## Camadas Hybrid FSD e Arquivos Impactados

- **Shared (`_lib`):** `app/_lib/utils.ts` (`isValidImageUrl`).
- **Entities (`_entities`):** `app/_entities/account/*`, `app/_entities/auth/{model.ts,user-storage.ts,user-storage.test.ts}`, `app/_entities/terms/*`, `app/_entities/pet/{queries.ts,queries.test.ts}`.
- **Widgets (`_widgets`):** `app/_widgets/terms-modal/*`, `app/_widgets/page-header/{main-nav.tsx,hamburger-nav.tsx}`.
- **Features:** `app/auth/{login,register,forgot-password,reset-password,verification-pending,verify-email}/**`, `app/pet/_components/pet-list-card.tsx`, `app/pet/details/_components/{pet-details-card.tsx,pet-details-card.test.tsx,pet-details-image-gallery.tsx,pet-details-shelter-card.tsx}`.
- **Documentação:** `ARCHITECTURE.md` (atualização da definição de exemplo de `ProfileType`).

## Fora de Escopo (Out of Scope)

- **Configuração de CORS no backend (`buddy-api`):** o projeto opera apenas com ambientes **local** e **produção** (sem ambiente de staging/dev publicado). Por segurança (uso de cookies `httpOnly` com `allowCredentials = true`), o CORS em produção permanece restrito exclusivamente a `https://buddyclient.vercel.app`, enquanto testes locais devem apontar para o `buddy-api` local (`application-local.yml`).
- **Atualização das URLs dos templates de e-mail no backend (`buddy-api`):** o `buddy-client` mantém exclusivamente `/auth/verify-email` e `/auth/reset-password` sem `redirects()` no `next.config.mjs`; o ajuste de `/confirm-email` e `/reset-password` nos templates do `buddy-api` será tratado em change própria no repositório da API.
- **Divergência pré-existente em `/v1/accounts/verifications/{request,confirm}`:** no `buddy-api` (`feat/m5-pets-v2`), esses endpoints exigem usuário autenticado (`@AuthenticationPrincipal` e fora de `permitAll()` em `SecurityConfig`), enquanto o `buddy-client` herdou da `develop` o fluxo público sem sessão ativa; o alinhamento desse contrato entre client e API fica fora do escopo desta PR #142.
- **Implementação da página `/profile/create`:** a tela de cadastro de perfil conectada a `POST /v1/profiles/register` será entregue em uma PR futura dedicada (e dependerá também de evolução no contrato do `buddy-api`, pois hoje `ProfileRequest` exige `accountId` obrigatório que `/v1/auth/login` não expõe no corpo de resposta).
