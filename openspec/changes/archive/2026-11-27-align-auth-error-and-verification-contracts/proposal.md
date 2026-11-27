# Proposal

## Why

Durante os testes end-to-end com `buddy-api`, foram identificados desalinhamentos no tratamento de erros HTTP e mensagens exibidas no ciclo de vida de autenticação do `buddy-client`:

1. Em `/auth/reset-password`, quando o token de redefinição é inválido, expirado ou já foi consumido (single-use), o backend retorna HTTP `404 Not Found` (`NotFoundException`), mas `ResetPasswordForm` só mapeia `400` e `422` para a mensagem de token inválido/expirado — exibindo erro genérico para `404`.
2. Em `/auth/verification-pending`, com a adoção da Opção A (padrão de mercado anti-enumeração) no `buddy-api`, `POST /accounts/verifications/request` retorna `202 Accepted` sem revelar se o e-mail existe ou já foi verificado, e a UI deve refletir essa mensagem neutra (além de tratar `429` e fallback de erro).
3. Em `/auth/verify-email`, `VerifyEmailContent` deve mapear tanto `400` quanto `404` para `"Token inválido ou expirado."` e tratar `429 Too Many Requests` (`@RateLimited`) com feedback claro ao usuário.

## What Changes

- Atualizar `ResetPasswordForm` (`app/auth/reset-password/_components/reset-password-form.tsx`) para tratar HTTP `404` junto com `400` e `422` exibindo `"Token inválido ou expirado. Solicite uma nova recuperação de senha."`.
- Atualizar `VerifyEmailContent` (`app/auth/verify-email/_components/verify-email-content.tsx`) para mapear `400` e `404` como token inválido/expirado e adicionar tratamento específico para `429` (`Muitas tentativas...`).
- Atualizar `VerificationPendingContent` (`app/auth/verification-pending/_components/verification-pending-content.tsx`) para exibir feedback neutro anti-enumeração no sucesso do reenvio (`200`/`202`) mantendo suporte defensivo a `404` e `429`.
- Atualizar os testes co-localizados (`*.test.tsx`) cobrindo todos os novos status HTTP e mensagens.

## Capabilities

### New Capabilities
- (Nenhuma nova capability; alteração restrita aos fluxos já especificados em `auth/lifecycle`).

### Modified Capabilities
- `auth/lifecycle`: Alinhar tratamento de `404` em `/auth/reset-password`, feedback neutro anti-enumeração em `/auth/verification-pending` e tratamento de `400`/`404`/`429` em `/auth/verify-email`.

## Impact

- **Camadas Hybrid FSD impactadas**: Exclusivamente camada de features (`app/auth/reset-password/`, `app/auth/verification-pending/`, `app/auth/verify-email/`). Nenhuma mudança em `_entities/`, `_widgets/`, `_components/` ou `_lib/`.
- **Testes**: `reset-password-form.test.tsx`, `verification-pending-content.test.tsx` e `verify-email-content.test.tsx`.

## Fora de Escopo (Out of Scope)

- Criação de página autenticada de alteração de senha (`PATCH /v1/accounts/password`).
- Criação de página de cadastro de perfil (`/profile/create`).
- Migração do catálogo de pets para endpoints `/v2/pets`.
