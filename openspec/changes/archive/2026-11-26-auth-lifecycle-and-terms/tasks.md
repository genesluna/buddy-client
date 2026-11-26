# Tarefas: Ciclo de Vida de Autenticação, Termos de Uso e Correções da PR #142

## 1. Baseline já implementado na PR #142

- [x] **Entidade `account`:** endpoints `requestEmailVerification`, `confirmEmailVerification`, `requestForgotPassword` e `resetPassword` com tipos e testes em `app/_entities/account/`.
- [x] **Entidade `terms`:** `TermsVersionResponse`, `TERMS_QUERY_KEYS`, `fetchActiveTerms`, `acceptTerms` e testes unitários em `app/_entities/terms/`.
- [x] **Widget `TermsModal`:** modal acessível em `app/_widgets/terms-modal/terms-modal.tsx` com busca via TanStack Query, tecla `Escape` e suporte a aceite no cadastro.
- [x] **Páginas de ciclo de vida de autenticação:** fluxos `/auth/forgot-password`, `/auth/reset-password`, `/auth/verification-pending`, `/auth/verify-email` e integração de `TermsModal` em `app/auth/register/_components/register-form.tsx` com testes co-localizados.
- [x] **Navegação autenticada e logout:** dropdown de usuário no `app/_widgets/page-header/main-nav.tsx` e seção autenticada no `app/_widgets/page-header/hamburger-nav.tsx`.
- [x] **Validação de URLs de imagem:** helper `isValidImageUrl` em `app/_lib/utils.ts` aplicado em `pet-list-card.tsx`, `pet-details-image-gallery.tsx` e `pet-details-shelter-card.tsx`.

## 2. Correções da revisão (PR #142 — `@genesluna`)

- [x] **Alinhar contrato de `ProfileType` para `'USER' | 'SHELTER' | 'ADMIN'`:**
  - Atualizar `ProfileType` em `app/_entities/auth/model.ts` substituindo `'ADOPTER'` por `'USER'`.
  - Atualizar `VALID_PROFILE_TYPES` em `app/_entities/auth/user-storage.ts` para `['USER', 'SHELTER', 'ADMIN']`.
  - Adicionar teste de regressão em `app/_entities/auth/user-storage.test.ts` validando persistência/recuperação de `profileType: 'USER'` após reload e rejeição de `'ADOPTER'`.
  - Atualizar o exemplo `ProfileType` na linha 290 de `ARCHITECTURE.md` para `'USER' | 'SHELTER' | 'ADMIN'`.
- [x] **Remover cast e `'ADOPTER'` em detalhes do pet e tratar perfil `ADMIN`:**
  - Atualizar `app/pet/details/_components/pet-details-card.tsx` para verificar `p.profileType === 'USER'` sem `'ADOPTER'` e sem `as string`.
  - Tratar conta autenticada com apenas `ADMIN` (ou sem perfil `'USER'`) para exibir botão desabilitado e aviso informativo adequado (em vez de omitir a área de ação).
  - Atualizar `app/pet/details/_components/pet-details-card.test.tsx` trocando `'ADOPTER'` por `'USER'` e adicionando cenário para conta apenas `'ADMIN'`.
- [x] **Ocultar links quebrados `/profile/create` mantendo apenas avisos informativos:**
  - Em `app/pet/details/_components/pet-details-card.tsx`, remover `<Link href='/profile/create'>` do estado `hasNoProfiles` mantendo aviso informativo de que a conta ainda não possui perfil de adotante.
  - Em `app/_widgets/page-header/main-nav.tsx` e `app/_widgets/page-header/hamburger-nav.tsx`, remover `<Link href='/profile/create'>` quando `!hasProfiles` e exibir aviso informativo não clicável (removendo import não utilizado de `PlusCircle`).
  - Atualizar `app/pet/details/_components/pet-details-card.test.tsx` (e adicionar/atualizar testes de header, se aplicável) garantindo ausência de link `/profile/create`.
- [x] **Corrigir badge de `ADMIN` no cabeçalho:**
  - Definir mapeamento claro por `ProfileType` (`SHELTER` -> `'🏠 Abrigo'`, `USER` -> `'🐾 Adotante'`, `ADMIN` -> `'🛡️ Admin'`) em `app/_entities/auth` (ou helper compartilhado) e aplicar em `app/_widgets/page-header/main-nav.tsx` e `app/_widgets/page-header/hamburger-nav.tsx`.
  - Cobrir a renderização correta das badges `USER`, `SHELTER` e `ADMIN` em testes de componente (`main-nav.test.tsx` / `hamburger-nav.test.tsx`).
- [x] **Desacoplar extração `_embedded` nas queries de pets:**
  - Atualizar `fetchPets`, `fetchPetsInfinite` e `fetchPetById` em `app/_entities/pet/queries.ts` para usar helper `extractEmbeddedPets` sobre `Object.values(response.data._embedded ?? {})[0]` sem acoplamento à chave `petParamsResponseList`.
  - Atualizar `app/_entities/pet/queries.test.ts` adicionando teste com outra chave HAL em `_embedded` (ex.: `pets`, simulando `@Relation(collectionRelation = "pets")`) confirmando compatibilidade.

## 3. Quality Gate e Validação Final

- [x] Executar `pnpm install` (se necessário após merge de `origin/develop`) garantindo dependências atualizadas.
- [x] Executar `pnpm test` confirmando 100% dos testes passando sem falhas.
- [x] Executar `pnpm lint` confirmando ausência de erros ou warnings de ESLint e `eslint-plugin-boundaries`.
- [x] Executar `pnpm validate:architecture` confirmando conformidade com as fronteiras Hybrid FSD.
- [x] Executar `pnpm build` confirmando compilação TypeScript e build de produção do Next.js 15 sem erros.
- [x] Validar a change OpenSpec com `openspec validate auth-lifecycle-and-terms --strict`.
