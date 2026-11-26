# Design Técnico: Ciclo de Vida de Autenticação, Termos e Correções da PR #142

## Contexto Arquitetural (Hybrid FSD)

O `buddy-client` adota arquitetura Hybrid Feature-Sliced Design com dependências estritamente unidirecionais (`_lib/` -> `_entities/` e `_components/` -> `_hooks/` -> `_widgets/` -> rotas de feature), verificadas por `eslint-plugin-boundaries` e `pnpm validate:architecture`:

- **Infraestrutura compartilhada (`app/_lib/`):** `api` (`axios-instance.ts`) com `withCredentials: true` e fila de refresh automático (`POST /auth/refresh`), além de utilitários como `isValidImageUrl` em `app/_lib/utils.ts`.
- **Entidades (`app/_entities/`):**
  - `account/`: requests e mutations de registro, verificação de e-mail, reenvio de verificação, forgot-password e reset-password.
  - `auth/`: modelos (`AuthRequest`, `ProfileType`, `ProfileResponse`, `AuthResponse`), `user-storage.ts` (`localStorage` sob chave `buddy_user` contendo exclusivamente metadata de exibição) e hooks (`useAuth`, `useLogout`).
  - `terms/`: contrato `TermsVersionResponse`, query `fetchActiveTerms` (`GET /terms/active`), mutation `acceptTerms` (`POST /terms/accept`) e `TERMS_QUERY_KEYS`.
  - `pet/`: `fetchPets`, `fetchPetsInfinite`, `fetchPetById` via `api`.
- **Widgets (`app/_widgets/`):** `TermsModal` (`terms-modal.tsx`) e navegação do cabeçalho (`MainNav` e `HamburgerNav`).
- **Features (`app/auth/*`, `app/pet/*`):** páginas e componentes específicos por rota sem acoplamento cruzado entre features irmãs.

## Decisões Técnicas e Resolução dos Pontos da Revisão (PR #142)

### 1. Alinhamento de `ProfileType` (`'ADOPTER'` -> `'USER'`) [CRÍTICO]
- **Problema observado:** `buddy-api` define `ProfileTypeEnum` como `'USER' | 'SHELTER' | 'ADMIN'` (`'USER'` representa o perfil de adotante). Além disso, `CreateAccountImpl` (`POST /v1/accounts/register`) não cria perfil automaticamente e `AuthServiceImpl.fetchAndFilterProfiles` filtra perfis `'ADMIN'` fora de `AuthResponse.profiles` no login (mantendo `ROLE_ADMIN` no JWT), o que torna `profiles: []` um estado real para contas novas ou exclusivamente `'ADMIN'`. No `buddy-client`, `app/_entities/auth/model.ts` (linha 6) e `app/_entities/auth/user-storage.ts` (linha 20) declaravam `'SHELTER' | 'ADOPTER' | 'ADMIN'`. Como resultado, `isProfileResponse()` em `user-storage.ts` invalidava qualquer sessão com `profileType: 'USER'` no reload, limpando `localStorage` e retornando `UserStorageError`. Em `app/pet/details/_components/pet-details-card.tsx` (linha 25), havia um contorno via `(p.profileType as string) === 'USER'`.
- **Solução:**
  - Alterar `ProfileType` em `app/_entities/auth/model.ts` para `'USER' | 'SHELTER' | 'ADMIN'`.
  - Alterar `VALID_PROFILE_TYPES` em `app/_entities/auth/user-storage.ts` para `['USER', 'SHELTER', 'ADMIN']` (preservando também suporte válido para `profiles: []`).
  - Simplificar `isAdopter` em `app/pet/details/_components/pet-details-card.tsx` para `p.profileType === 'USER'`, removendo `'ADOPTER'` e o cast `as string`.
  - Atualizar `ARCHITECTURE.md` (linha 290) e testes (`app/pet/details/_components/pet-details-card.test.tsx`, `app/_entities/auth/user-storage.test.ts`), adicionando teste explícito em `user-storage.test.ts` cobrindo recuperação de `profileType: 'USER'` após reload e rejeição caso exista `'ADOPTER'`.

### 2. Remoção dos links quebrados para `/profile/create` [ALTO]
- **Contexto verificado:** `buddy-api` já expõe `POST /v1/profiles/register` (`CreateProfileController`), porém exige `accountId` obrigatório em `ProfileRequest` (campo que `AuthResponse` de `/v1/auth/login` hoje não retorna), e o `buddy-client` não possui rota `/profile/create` (inexistente em `develop` e nesta PR).
- **Decisão:** Ocultar os 3 links `href='/profile/create'` (evitando 404 em produção) mantendo avisos informativos claros:
  - `app/_widgets/page-header/main-nav.tsx`: substituir o bloco `{!hasProfiles && (<Link href='/profile/create'>...</Link>)}` por um aviso informativo não clicável (sem import ocioso de `PlusCircle`) indicando que a conta ainda não possui perfil cadastrado.
  - `app/_widgets/page-header/hamburger-nav.tsx`: substituir o `<Link href='/profile/create'>` no menu mobile por item informativo equivalente, preservando `Sair da conta`.
  - `app/pet/details/_components/pet-details-card.tsx`: no bloco `hasNoProfiles`, manter o botão `Solicitar adoção` desabilitado e exibir texto informativo sem `<Link href='/profile/create'>` (removendo import `Link` se ainda utilizado nos outros blocos — verificar uso em linhas 66, 90, 97).
  - Atualizar o teste correspondente em `app/pet/details/_components/pet-details-card.test.tsx` e cobrir `main-nav` / `hamburger-nav` conforme apropriado.

### 3. Tratamento adequado para `ADMIN` e múltiplos perfis nos badges e detalhes de pet [MÉDIO]
- **Problema observado:** `main-nav.tsx` (linhas 98-100) e `hamburger-nav.tsx` (linha 83) usavam operador ternário binário (`profileType === 'SHELTER' ? '🏠 Abrigo' : '🐾 Adotante'`), exibindo `🐾 Adotante` caso recebessem `'ADMIN'`. Além disso, em `pet-details-card.tsx`, um usuário contendo apenas perfil `'ADMIN'` não caía em `isAdopter`, `isShelterOnly` nem `hasNoProfiles`, deixando a seção de adoção vazia. Embora `AuthServiceImpl` no backend atualmente filtre `'ADMIN'` fora de `AuthResponse.profiles` (fazendo contas apenas `'ADMIN'` chegarem com `profiles: []`), o cliente deve tratar `'ADMIN'` defensivamente caso seja exposto futuramente.
- **Solução:**
  - Extrair ou usar mapa declarativo de labels por `ProfileType` (ex.: `SHELTER: '🏠 Abrigo'`, `USER: '🐾 Adotante'`, `ADMIN: '🛡️ Admin'`) em `main-nav.tsx` e `hamburger-nav.tsx` (ou helper compartilhado em `_entities/auth`, evitando duplicação), mantendo `user?.profiles?.[0]` como perfil resumido exibido no cabeçalho.
  - Em `pet-details-card.tsx`, manter verificação por `.some((p) => p.profileType === 'USER')` (garantindo que contas com múltiplos perfis como `'USER'` + `'SHELTER'` possam adotar) e tratar usuários autenticados com perfis porém sem perfil `'USER'` (`isNonAdopterProfile = Boolean(user?.profiles?.length && !isAdopter)`), diferenciando o rótulo (`Abrigo` quando `SHELTER`, `Administrador` quando apenas `ADMIN`) para sempre exibir o botão desabilitado com orientação consistente.

### 4. Rotas de verificação de e-mail, reset de senha e políticas de ambiente (decisão arquitetural)
- **Contexto verificado:** `buddy-api/src/main/resources/application-local.yml` configura os links de e-mail para `/confirm-email?token=` e `/reset-password?token=`, enquanto o `buddy-client` implementa `/auth/verify-email` e `/auth/reset-password`. Adicionalmente, na `feat/m5-pets-v2`, os endpoints `/v1/accounts/verifications/{request,confirm}` no `buddy-api` exigem `@AuthenticationPrincipal` (divergência pré-existente herdada de `develop` no client, mantida fora do escopo desta PR #142).
- **Decisão confirmada pelo usuário:** Manter exclusivamente `/auth/verify-email` e `/auth/reset-password` no `buddy-client`, sem adicionar `redirects()` no `next.config.mjs`. Os templates de e-mail e eventuais ajustes de contrato no `buddy-api` serão alinhados separadamente. Como existem apenas ambientes local e produção, a política de CORS de produção do `buddy-api` continua restrita a `https://buddyclient.vercel.app`.

### 5. Desacoplamento de `_embedded` HAL em `app/_entities/pet/queries.ts`
- **Problema observado:** `fetchPets`, `fetchPetsInfinite` e `fetchPetById` (que consomem `/v1/pets`, distinto de `/v2/pets` que usa `PageResponse` sem HAL) acessavam diretamente `response.data._embedded?.petParamsResponseList`. Caso o backend altere a classe DTO subjacente ou adicione `@Relation(collectionRelation = "pets")` no HAL `CollectionModel`, a chave em `_embedded` muda e quebra as listagens.
- **Solução:** Criar helper local privado `extractEmbeddedPets(embedded?: Record<string, Pet[]>): Pet[]` em `app/_entities/pet/queries.ts` usando `const firstCollection = embedded ? Object.values(embedded)[0] : undefined; return Array.isArray(firstCollection) ? firstCollection : [];`.
- **Testes:** Atualizar `app/_entities/pet/queries.test.ts` mantendo os testes existentes e adicionando caso com chave `_embedded` `pets` (simulando `@Relation(collectionRelation = "pets")`) para comprovar o desacoplamento.

### 6. Observação de segurança (GitGuardian em teste unitário)
- Na revisão anterior, o GitGuardian sinalizou `app/auth/reset-password/_config/reset-password-schema.test.ts` (linha 24) como falso positivo por string de senha sintética `'Ab1!'` no teste de validação de tamanho mínimo. Não há segredo real envolvido.

## Estratégia de Verificação

Após aplicar as correções em `buddy-client`, executar em sequência:
1. `pnpm test` — garantir que toda a suíte Jest + React Testing Library + `axios-mock-adapter` passa, incluindo os novos casos para `ProfileType: 'USER'`, `ADMIN`, ausência de `/profile/create` e chave HAL alternativa.
2. `pnpm lint` — validar ESLint 9 + `eslint-plugin-boundaries`.
3. `pnpm validate:architecture` — validar fronteiras unidirecionais da arquitetura Hybrid FSD.
4. `pnpm build` — confirmar tipagem TypeScript e build de produção do Next.js 15 sem erros.
