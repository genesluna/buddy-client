## MODIFIED Requirements

### Requirement: Recuperação e redefinição de senha
O sistema SHALL disponibilizar fluxos completos em `/auth/forgot-password` e `/auth/reset-password` para que usuários solicitem link de recuperação por e-mail (`POST /accounts/password/forgot`) e definam uma nova senha com token válido (`POST /accounts/password/reset`), mantendo feedback claro para validação, sucesso e erros da API (incluindo `400`, `404`, `422` e `429`).

#### Scenario: Solicitação de recuperação de senha com e-mail válido
- **WHEN** o usuário preenche um e-mail válido em `/auth/forgot-password` e envia o formulário
- **THEN** o cliente dispara `POST /accounts/password/forgot`
- **AND** em caso de sucesso exibe estado de confirmação orientando a verificação da caixa de entrada sem vazar se o e-mail existe na base.

#### Scenario: Rate limit ao solicitar recuperação de senha
- **WHEN** `POST /accounts/password/forgot` retorna HTTP `429`
- **THEN** o formulário exibe mensagem orientando o usuário a aguardar antes de tentar novamente.

#### Scenario: Redefinição de senha com token na URL e confirmação válida
- **WHEN** o usuário acessa `/auth/reset-password?token=<token>` e informa `newPassword` e `confirmPassword` válidos e idênticos
- **THEN** o cliente dispara `POST /accounts/password/reset` com `{ token, newPassword }`
- **AND** em caso de sucesso exibe toast de confirmação e redireciona para `/auth/login`.

#### Scenario: Token inválido, expirado ou ausente na redefinição de senha
- **WHEN** o usuário envia a redefinição sem token válido ou a API retorna HTTP `400`, `404` ou `422`
- **THEN** a validação Zod bloqueia o envio sem token ou a interface exibe mensagem de erro informando token inválido ou expirado.

### Requirement: Pendência e confirmação de verificação de e-mail
O sistema SHALL manter exclusivamente as rotas canônicas `/auth/verification-pending` e `/auth/verify-email` para reenvio público anti-enumeração (`POST /accounts/verifications/request`) e confirmação pública do token (`POST /accounts/verifications/confirm`), tratando respostas `200`/`202`, `400`, `404` e `429` com feedback acessível.

#### Scenario: Reenvio de e-mail de verificação em pendência
- **WHEN** o usuário acessa `/auth/verification-pending?email=<email>` e submete o formulário de reenvio
- **THEN** o campo de e-mail é pré-preenchido com o parâmetro da URL e dispara `POST /accounts/verifications/request`
- **AND** em sucesso (`200`/`202`) exibe feedback acessível (`role="alert"`) sem vazar se o e-mail existe ou já foi verificado, tratando também `404` e `429` defensivamente.

#### Scenario: Confirmação automática de e-mail com token válido
- **WHEN** o usuário acessa `/auth/verify-email?token=<token>` com token compatível com o formato esperado
- **THEN** o cliente dispara `POST /accounts/verifications/confirm` automaticamente uma única vez
- **AND** em caso de sucesso exibe confirmação e botão para navegar até `/auth/login`.

#### Scenario: Token inválido, expirado ou rate limit em `/auth/verify-email`
- **WHEN** a API retorna HTTP `400` ou `404` para `/accounts/verifications/confirm`, ou retorna HTTP `429`
- **THEN** a interface exibe mensagem clara de token inválido/expirado (`400`/`404`) ou orientação para aguardar antes de tentar novamente (`429`).

#### Scenario: Token ausente ou com formato inválido em `/auth/verify-email`
- **WHEN** o parâmetro `token` está ausente ou falha em `isValidTokenFormat`
- **THEN** nenhuma requisição HTTP é disparada e a interface exibe estado de erro com opção de retorno ao login.
