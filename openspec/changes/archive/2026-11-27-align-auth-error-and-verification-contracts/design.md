# Design — `align-auth-error-and-verification-contracts`

## Visão Geral

Atualiza o mapeamento de status HTTP nos componentes de feature em `app/auth/` para refletir com exatidão os contratos REST da `buddy-api` (incluindo o fluxo público anti-enumeração de verificação de e-mail e o retorno `404 Not Found` para tokens inexistentes/expirados/consumidos).

## Alterações por Camada (Hybrid FSD)

### 1. Redefinição de Senha (`app/auth/reset-password`)
- **Arquivo**: `app/auth/reset-password/_components/reset-password-form.tsx`
- **Mudança**: Na callback `onError` de `useResetPassword`, incluir `error.response?.status === 404` junto com `400` e `422` para exibir `"Token inválido ou expirado. Solicite uma nova recuperação de senha."`.
- **Testes**: `app/auth/reset-password/_components/reset-password-form.test.tsx` — adicionar casos cobrindo erro `404` e `429`.

### 2. Confirmação de E-mail (`app/auth/verify-email`)
- **Arquivo**: `app/auth/verify-email/_components/verify-email-content.tsx`
- **Mudança**: Na callback `onError` de `useConfirmEmail`:
  - `400` ou `404`: exibir `"Token inválido ou expirado."` (pois o backend retorna `404 Not Found` para token expirado/inexistente/já consumido).
  - `429`: exibir `"Muitas tentativas. Aguarde antes de tentar novamente."`.
- **Testes**: `app/auth/verify-email/_components/verify-email-content.test.tsx` — atualizar expectativa para `404` e adicionar cenário para `429`.

### 3. Pendência de Verificação (`app/auth/verification-pending`)
- **Arquivo**: `app/auth/verification-pending/_components/verification-pending-content.tsx`
- **Mudança**:
  - No `onSuccess` (disparado em `200` e `202 Accepted`), exibir mensagem neutra anti-enumeração: `"Se o email estiver pendente de verificação, enviaremos um novo link de confirmação."`.
  - Manter tratamento defensivo para `404` e `429` em `onError`.
- **Testes**: `app/auth/verification-pending/_components/verification-pending-content.test.tsx` — atualizar mensagem esperada no sucesso.

## Fronteiras Arquiteturais

- Nenhuma dependência nova entre features ou inversão de camada FSD (`pnpm validate:architecture` deve passar sem avisos).
- `use-confirm-email.ts`, `use-resend-verification.ts` e `app/_entities/account/mutations.ts` já enviam os payloads esperados pela API pública (`{ email }` e `{ token }`) com `withCredentials: true`.
