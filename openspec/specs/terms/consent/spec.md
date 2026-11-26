## Purpose

Especificar os requisitos de consulta e aceite dos Termos de Uso (LGPD) em `app/_entities/terms`, no widget modal `app/_widgets/terms-modal` e na integração obrigatória com o formulário de cadastro (`/auth/register`).

## Requirements

### Requirement: Entidade de Termos de Uso (`_entities/terms`)
O sistema SHALL prover modelos, chaves de cache (`TERMS_QUERY_KEYS`), query de busca dos termos ativos (`GET /terms/active`) e mutation de registro de aceite (`POST /terms/accept`) utilizando a instância compartilhada do Axios (`withCredentials: true`).

#### Scenario: Consulta da versão ativa dos Termos de Uso
- **WHEN** `fetchActiveTerms()` é chamado
- **THEN** executa `GET /terms/active` e retorna `TermsVersionResponse` com `termsVersionId`, `versionTag`, `content`, `isActive` e `publicationDate`.

#### Scenario: Registro de aceite dos Termos de Uso autenticado
- **WHEN** `acceptTerms()` é chamado
- **THEN** executa `POST /terms/accept` utilizando a instância configurada da API.

### Requirement: Modal interativo de Termos de Uso (`TermsModal`)
O widget `TermsModal` (`app/_widgets/terms-modal/terms-modal.tsx`) SHALL carregar sob demanda os termos ativos via TanStack Query quando aberto (`enabled: isOpen`), suportar fechamento por clique no backdrop, botão fechar ou tecla `Escape`, e exibir estados de carregamento, erro e conteúdo formatado com controle opcional de aceite (`showAcceptButton`).

#### Scenario: Abertura do modal com carregamento bem-sucedido dos termos
- **WHEN** `TermsModal` é aberto com `isOpen={true}`
- **THEN** exibe spinner durante o carregamento, busca `TERMS_QUERY_KEYS.active()` e renderiza título, `versionTag` e `content` dentro de um elemento acessível com `role="dialog"` e `aria-modal="true"`.

#### Scenario: Falha ao carregar os Termos de Uso no modal
- **WHEN** a consulta `GET /terms/active` falha
- **THEN** `TermsModal` exibe mensagem de erro amigável e mantém o botão `Aceitar e Continuar` desabilitado.

#### Scenario: Aceite dos termos dentro do modal durante o cadastro
- **WHEN** o usuário clica no link "Termos de Uso" em `RegisterForm`, visualiza o conteúdo em `TermsModal` (`showAcceptButton={true}`) e clica em `Aceitar e Continuar`
- **THEN** o campo `termsOfUserConsent` é marcado como `true` com revalidação no React Hook Form e o modal é fechado.

### Requirement: Exigência de consentimento LGPD no cadastro de conta
O formulário `RegisterForm` (`/auth/register`) SHALL bloquear a submissão enquanto `termsOfUserConsent` não estiver marcado como `true`, enviando `termsOfUserConsent: true` no payload de `POST /accounts/register` e redirecionando para `/auth/verification-pending` após sucesso.

#### Scenario: Bloqueio de cadastro sem aceite dos termos
- **WHEN** o usuário preenche e-mail, telefone e senha válidos, mas não marca o aceite dos termos
- **THEN** o botão `Criar conta` permanece desabilitado pela validação Zod (`registerSchema`).

#### Scenario: Cadastro bem-sucedido com aceite dos termos
- **WHEN** o usuário marca `termsOfUserConsent`, submete dados válidos e `POST /accounts/register` retorna sucesso
- **THEN** navega para `/auth/verification-pending?email=<emailCodificado>`.
