![Next JS](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React_19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

# 🐾 Buddy - Client

> Cliente para aplicação de adoção de animais de estimação. Vamos ajudar animais a encontrar um lar?

## Links

- 🚀 **Swagger:** [clique aqui](https://buddy.propresto.app/api/swagger-ui/index.html#/)
- 🌐 **Página WEB:** [clique aqui](https://buddyclient.vercel.app/)
- 🔙 **Repositório da API:** [clique aqui](https://github.com/hywenklis/buddy-backend)

## 💡 Motivo

A Buddy foi criada para facilitar e tornar mais seguro o processo de adoção de animais de estimação, conectando abrigos e adotantes de maneira eficiente. Nosso objetivo é promover a adoção responsável e garantir que mais animais encontrem lares amorosos. Ao implementar soluções tecnológicas inovadoras, buscamos enfrentar os maiores desafios que os animais resgatados enfrentam no Brasil, ajudando a salvar milhares de vidas e transformando o panorama da adoção de pets no país.

## 🛠️ Tecnologias

- **Framework:** Next.js 15 (App Router) com Turbopack
- **UI:** React 19 + Tailwind CSS 4
- **Linguagem:** TypeScript
- **Gerenciamento de Estado:** TanStack Query (React Query)
- **Formulários:** React Hook Form + Zod
- **Ícones:** Phosphor Icons
- **HTTP Client:** Axios

## 🚀 Começando

### Pré-requisitos

- Node.js 22.13+
- pnpm 11+ (o projeto fixa a versão em `packageManager`; use `corepack enable`)

> Versões anteriores do pnpm ignoram o `pnpm-workspace.yaml` e instalam dependências transitivas vulneráveis sem avisar.

### Instalação

```bash
# Clone o repositório
git clone https://github.com/genesluna/buddy-client.git

# Entre no diretório
cd buddy-client

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=https://buddy.propresto.app/api
```

### Comandos

```bash
pnpm dev                    # Inicia o servidor de desenvolvimento com Turbopack
pnpm build                  # Build de produção
pnpm lint                   # Executa o ESLint
pnpm test                   # Executa os testes Jest
pnpm test:watch             # Executa os testes em modo watch
pnpm test:coverage          # Executa os testes com relatório de cobertura
pnpm validate:architecture  # Valida convenções de arquitetura
```

## 📁 Estrutura do Projeto

O projeto utiliza uma arquitetura híbrida **Feature-Sliced Design (FSD)** adaptada para o Next.js App Router:

```
app/
├── _entities/        # Camada 1: Modelos de domínio, operações e estado de domínio
│   ├── account/      # Models e mutations de registro/verificação de email
│   ├── auth/         # Models, mutations, context e hooks de autenticação
│   ├── pet/          # Models, queries e query-keys de pets
│   ├── shelter/      # Models de abrigos
│   └── user/         # Models de usuários
│
├── _widgets/         # Camada 2: Blocos de UI compostos
│   ├── layouts/      # Componentes de layout (horizontal, vertical)
│   ├── page-header/  # Header com navegação
│   └── page-footer/  # Footer com links sociais
│
├── _components/      # Camada 3: Componentes base compartilhados
│   └── ui/           # Button, Input, Combobox, etc.
│
├── _hooks/           # Hooks customizados compartilhados
├── _lib/             # Utilitários puros e providers (sem dependências de entidades)
│   ├── api/          # Configuração do Axios
│   └── providers/    # React Query provider
├── _types/           # Tipos TypeScript compartilhados
├── _assets/          # Assets estáticos (imagens, SVGs)
│
└── [feature]/        # Camada 4: Rotas de features (UI e páginas)
    ├── pet/          # UI: listagem, detalhes e adoção de pets
    ├── auth/         # UI: páginas de login, registro, verificação (fluxos)
    ├── contact/      # UI: formulário de contato
    └── about/        # UI: página sobre
```

> Pastas prefixadas com underscore (`_`) são privadas e não são tratadas como rotas pelo Next.js.

## 📄 Documentação

- **[Guia de Arquitetura](ARCHITECTURE.md)** - Convenções de nomenclatura, padrões de código e regras de importação entre camadas

## 💬 Como contribuir

> **Leia nosso** [Guia Completo para Contribuidores](CONTRIBUTING.md)

Qualquer contribuição é bem-vinda! Seja backend, frontend, ou qualquer outra área. Não importa se você é um iniciante querendo aprender e compartilhar experiências ou um profissional experiente - todas as contribuições são valiosas!

O projeto foi iniciado como um projeto integrador da faculdade e gostamos muito da causa, o que nos deu a ideia de abrir o repositório e convidar mais pessoas a se juntar.

## 📜 Termos de Uso

> **Leia nosso** [Código de Conduta](CODE_OF_CONDUCT.md)

Ao contribuir para este projeto, você concorda em seguir os termos e condições definidos no nosso código de conduta.

## Autor da página WEB

| [<img src="https://github.com/genesluna.png?size=115" width=115><br><sub>@genesluna</sub>](https://github.com/genesluna) |
| :----------------------------------------------------------------------------------------------------------------------: |

## Autor da API

| [<img src="https://github.com/hywenklis.png?size=115" width=115><br><sub>@hywenklis</sub>](https://github.com/hywenklis) |
| :----------------------------------------------------------------------------------------------------------------------: |

## Pessoas que já contribuíram

<a href="https://github.com/genesluna/buddy-client/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=genesluna/buddy-client" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
