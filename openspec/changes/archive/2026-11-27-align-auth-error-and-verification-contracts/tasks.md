# Tasks

## 1. Redefinição de Senha (`app/auth/reset-password`)

- [x] 1.1 Atualizar `app/auth/reset-password/_components/reset-password-form.tsx` para tratar HTTP `404` (junto com `400` e `422`) exibindo `"Token inválido ou expirado. Solicite uma nova recuperação de senha."`.
- [x] 1.2 Atualizar `app/auth/reset-password/_components/reset-password-form.test.tsx` adicionando testes unitários para respostas HTTP `404` e `429`.

## 2. Confirmação e Reenvio de Verificação de E-mail (`app/auth/verify-email` e `app/auth/verification-pending`)

- [x] 2.1 Atualizar `app/auth/verify-email/_components/verify-email-content.tsx` para tratar `400` e `404` com `"Token inválido ou expirado."` e `429` com `"Muitas tentativas. Aguarde antes de tentar novamente."`.
- [x] 2.2 Atualizar `app/auth/verify-email/_components/verify-email-content.test.tsx` alinhando os testes para `404` e `429`.
- [x] 2.3 Atualizar `app/auth/verification-pending/_components/verification-pending-content.tsx` e `app/auth/verification-pending/_components/verification-pending-content.test.tsx` para exibir a mensagem neutra anti-enumeração após o envio.

## 3. Verificação Final

- [x] 3.1 Executar `pnpm test`, `pnpm lint`, `pnpm validate:architecture` e `pnpm build` em `buddy-client`.
