## Purpose

Especificar os requisitos do ciclo de vida de autenticação de contas no `buddy-client`, incluindo recuperação e redefinição de senha, pendência e confirmação de verificação de e-mail, contrato de tipos de perfil persistidos em sessão e controles de navegação autenticada no cabeçalho.

## Requirements

### Requirement: Recuperação e redefinição de senha
O sistema SHALL disponibilizar fluxos completos em `/auth/forgot-password` e `/auth/reset-password` para que usuários solicitem link de recuperação por e-mail (`POST /accounts/password/forgot`) e definam uma nova senha com token válido (`POST /accounts/password/reset`), mantendo feedback claro para validação, sucesso e erros da API (incluindo `400`, `422` e `429`).

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
- **WHEN** o usuário envia a redefinição sem token válido ou a API retorna HTTP `400` ou `422`
- **THEN** a validação Zod bloqueia o envio sem token ou a interface exibe mensagem de erro informando token inválido ou expirado.

### Requirement: Pendência e confirmação de verificação de e-mail
O sistema SHALL manter exclusivamente as rotas canônicas `/auth/verification-pending` e `/auth/verify-email` para reenvio de e-mail de confirmação (`POST /accounts/verifications/request`) e validação do token de verificação (`POST /accounts/verifications/confirm`), sem criar rotas de redirecionamento legado em `next.config.mjs`.

#### Scenario: Reenvio de e-mail de verificação em pendência
- **WHEN** o usuário acessa `/auth/verification-pending?email=<email>` e submete o formulário de reenvio
- **THEN** o campo de e-mail é pré-preenchido com o parâmetro da URL e dispara `POST /accounts/verifications/request`
- **AND** a interface trata respostas `200`, `404` e `429` exibindo feedback acessível (`role="alert"`).

#### Scenario: Confirmação automática de e-mail com token válido
- **WHEN** o usuário acessa `/auth/verify-email?token=<token>` com token compatível com o formato esperado
- **THEN** o cliente dispara `POST /accounts/verifications/confirm` automaticamente uma única vez
- **AND** em caso de sucesso exibe confirmação e botão para navegar até `/auth/login`.

#### Scenario: Token ausente ou com formato inválido em `/auth/verify-email`
- **WHEN** o parâmetro `token` está ausente ou falha em `isValidTokenFormat`
- **THEN** nenhuma requisição HTTP é disparada e a interface exibe estado de erro com opção de retorno ao login.

### Requirement: Contrato estrito de ProfileType e persistência segura em sessão
O módulo `app/_entities/auth` MUST definir `ProfileType` como `'USER' | 'SHELTER' | 'ADMIN'` e validar esses mesmos valores em `VALID_PROFILE_TYPES` no `user-storage.ts`, alinhado ao `ProfileTypeEnum` do backend (`USER` = adotante, `SHELTER` = abrigo, `ADMIN` = administrador). O cliente MUST também aceitar `profiles: []` como estado legítimo (contas novas ou `ADMIN` filtrado no login), preservando sessões `'USER'` após recarregamento da página.

#### Scenario: Persistência e recuperação de perfil USER após reload
- **WHEN** o backend retorna um perfil com `profileType: 'USER'` no login e o usuário recarrega a página
- **THEN** `getStoredUser()` valida o objeto em `localStorage` (`buddy_user`) sem lançar `UserStorageError`
- **AND** retorna os dados do perfil preservando o estado autenticado.

#### Scenario: Sessão autenticada sem perfis em `AuthResponse.profiles`
- **WHEN** o login retorna `profiles: []` (conta recém-criada sem perfil ou conta exclusivamente `'ADMIN'` filtrada por `AuthServiceImpl`)
- **THEN** `getStoredUser()` considera `{ profiles: [] }` válido em `localStorage`
- **AND** preserva o estado autenticado sem disparar `UserStorageError`.

#### Scenario: Rejeição defensiva de tipo de perfil desconhecido ou legado
- **WHEN** `localStorage` contém um `profileType` fora de `['USER', 'SHELTER', 'ADMIN']` (como `'ADOPTER'` ou `'INVALID_TYPE'`) ou JSON malformado
- **THEN** `getStoredUser()` limpa `buddy_user` do `localStorage` e retorna `{ data: null, error: UserStorageError }`.

### Requirement: Navegação autenticada, badges de perfil e ausência de links quebrados no cabeçalho
Os componentes `MainNav` (`app/_widgets/page-header/main-nav.tsx`) e `HamburgerNav` (`app/_widgets/page-header/hamburger-nav.tsx`) SHALL exibir o perfil ativo resumido (`user?.profiles?.[0]`), ação de logout via `useLogout` e badge distinta para `'USER'`, `'SHELTER'` e `'ADMIN'` (defensivo), e NÃO MUST conter links para a rota inexistente `/profile/create`.

#### Scenario: Exibição correta da badge por tipo de perfil
- **WHEN** o usuário autenticado possui perfil ativo do tipo `'SHELTER'`, `'USER'` ou `'ADMIN'`
- **THEN** tanto `MainNav` quanto `HamburgerNav` exibem badge distinta para cada papel (`🏠 Abrigo` para `'SHELTER'`, `🐾 Adotante` para `'USER'` e badge administrativa dedicada como `🛡️ Admin` para `'ADMIN'`)
- **AND** um perfil `'ADMIN'` nunca é rotulado como `'🐾 Adotante'`.

#### Scenario: Conta autenticada sem perfis cadastrados no cabeçalho
- **WHEN** o usuário está autenticado e `user.profiles` está vazio (conta nova sem perfil ou conta apenas `'ADMIN'` filtrada no login)
- **THEN** o cabeçalho exibe o estado conectado com fallback `'Minha Conta'` sem renderizar link `<Link href="/profile/create">` (evitando navegação 404)
- **AND** exibe apenas aviso informativo de conta sem perfil cadastrado até que a criação de perfil seja disponibilizada, mantendo o botão de logout funcional.
