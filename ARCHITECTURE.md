# Guia de Arquitetura - Buddy Client

Este documento serve como guia de arquitetura e convenções para desenvolvedores que contribuem com o projeto Buddy. Siga estas diretrizes para manter a consistência do código.

---

## 1. Visão Geral do Projeto

O **Buddy** é uma aplicação web de adoção de animais de estimação que conecta abrigos e adotantes no Brasil. O objetivo é facilitar o processo de adoção responsável e ajudar mais animais a encontrarem lares amorosos.

### Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 15 (App Router) com Turbopack |
| UI | React 19 |
| Estilização | Tailwind CSS 4 |
| Linguagem | TypeScript |
| Gerenciamento de Estado | TanStack Query (React Query) |
| Formulários | React Hook Form + Zod |
| Cliente HTTP | Axios |
| Ícones | Phosphor Icons |
| Testes | Jest + React Testing Library |

### Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=https://buddy.propresto.app/api
```

---

## 2. Arquitetura Híbrida FSD

O projeto utiliza uma arquitetura **Feature-Sliced Design (FSD)** adaptada para o Next.js App Router. Isso proporciona separação clara de camadas mantendo as convenções do App Router.

### Estrutura de Diretórios

```
app/
├── _entities/        # Camada 1: Modelos de domínio, operações de dados e estado
│   ├── account/
│   │   ├── model.ts        # Interfaces: AccountRequest, ConfirmEmailRequest
│   │   └── mutations.ts    # registerAccount, requestEmailVerification
│   ├── auth/
│   │   ├── model.ts        # AuthRequest, AuthResponse, ProfileResponse
│   │   ├── mutations.ts    # login, logout
│   │   ├── auth-context.tsx
│   │   ├── use-auth.ts
│   │   ├── use-logout.ts
│   │   └── user-storage.ts
│   ├── pet/
│   │   ├── model.ts        # Pet, PetImage, PetPage, PetInfiniteResponse
│   │   ├── queries.ts      # fetchPets, fetchPetById, fetchPetsInfinite
│   │   ├── mutations.ts    # create, update, delete
│   │   └── query-keys.ts   # PET_QUERY_KEYS
│   ├── shelter/
│   │   └── model.ts        # Shelter, ShelterFull
│   └── user/
│       └── model.ts        # User, UserCredentials, UserRegistration
│
├── _widgets/         # Camada 2: Blocos de UI compostos
│   ├── layouts/
│   │   ├── horizontal-layout.tsx   # Layout para páginas de auth
│   │   └── vertical-layout.tsx     # Layout principal (header, content, footer)
│   ├── page-header/
│   │   ├── page-header.tsx
│   │   ├── main-nav.tsx
│   │   └── hamburger-nav.tsx
│   └── page-footer/
│       └── page-footer.tsx
│
├── _components/      # Camada 3: Componentes base compartilhados
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── combobox.tsx
│   │   ├── back-button.tsx
│   │   └── image-skeleton.tsx
│   └── loading-spinner.tsx
│
├── _hooks/           # Hooks customizados compartilhados
│   └── use-scroll-top.ts
│
├── _lib/             # Utilitários puros e providers (sem dependências de entities)
│   ├── api/
│   │   └── axios-instance.ts   # Axios configurado com interceptor 401
│   ├── providers/
│   │   └── react-query-provider.tsx
│   ├── error-reporting.ts
│   └── utils.ts                # cn(), calculateAge(), buildSearchParamsPath()
│
├── _types/           # Tipos TypeScript compartilhados
├── _assets/          # Assets estáticos (imagens, SVGs)
│
└── [feature]/        # Camada 4: Rotas de features (UI, páginas, orquestração)
    ├── pet/
    │   ├── _components/    # Componentes específicos da feature
    │   ├── _hooks/         # Hooks específicos da feature
    │   ├── _config/        # Configurações da feature
    │   ├── details/        # Página de detalhes do pet
    │   └── adoption/       # Formulário de adoção
    ├── auth/
    │   ├── login/
    │   │   ├── _components/
    │   │   └── _hooks/
    │   ├── register/
    │   │   ├── _components/
    │   │   ├── _hooks/
    │   │   └── _config/
    │   ├── verify-email/
    │   └── verification-pending/
    ├── contact/
    └── about/
```

> **Nota**: Pastas prefixadas com underscore (`_`) são privadas e não são tratadas como rotas pelo Next.js.

### Regras de Importação Entre Camadas

As importações devem seguir uma hierarquia unidirecional. Camadas inferiores **não podem** importar de camadas superiores.

```
┌─────────────────────────────────────────────────────────────┐
│                    Feature Routes (Camada 4)                │
│              Pode importar de TODAS as camadas              │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│                      _widgets/ (Camada 2)                   │
│     Pode importar: _entities, _components, _hooks, _lib    │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│     _entities/ (Camada 1)    │    _hooks/ (compartilhados)  │
│     Pode importar: _lib      │    Pode importar: _lib,      │
│                              │    _entities                  │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│   _components/    │    _lib/    │    _types/    │  _assets/ │
│   Pode importar:  │   Apenas    │   Apenas      │   Apenas  │
│   _lib, _assets   │   _types    │   (base)      │   (base)  │
└─────────────────────────────────────────────────────────────┘
```

> **Nota**: Embora `_hooks` e `_entities` estejam no mesmo nível visual, `_hooks` pode importar de `_entities`, colocando-o efetivamente em uma camada conceitual superior.

#### Exemplos de Importações

```typescript
// =====================================================
// ✅ PERMITIDO
// =====================================================

// _entities/ importando de _lib/
// Arquivo: app/_entities/auth/mutations.ts
import { api } from '@/app/_lib/api/axios-instance';

// _widgets/ importando de _entities/
// Arquivo: app/_widgets/page-header/page-header.tsx
import { useAuth } from '@/app/_entities/auth/use-auth';

// _widgets/ importando de _components/
// Arquivo: app/_widgets/page-header/page-header.tsx
import Button from '@/app/_components/ui/button';

// Feature routes importando de qualquer camada
// Arquivo: app/auth/login/page.tsx
import { useAuth } from '@/app/_entities/auth/use-auth';
import { VerticalLayout } from '@/app/_widgets/layouts/vertical-layout';
import Button from '@/app/_components/ui/button';
import { cn } from '@/app/_lib/utils';

// Feature usando hooks específicos da própria feature
// Arquivo: app/auth/login/_components/login-form.tsx
import { useLogin } from '../_hooks/use-login';


// =====================================================
// ❌ PROIBIDO
// =====================================================

// _lib/ NÃO pode importar de _entities/
// Arquivo: app/_lib/utils.ts
import { Pet } from '@/app/_entities/pet/model'; // ERRO!

// _entities/ NÃO pode importar de _widgets/
// Arquivo: app/_entities/auth/auth-context.tsx
import { PageHeader } from '@/app/_widgets/page-header/page-header'; // ERRO!

// _components/ NÃO pode importar de _entities/
// Arquivo: app/_components/ui/button.tsx
import { useAuth } from '@/app/_entities/auth/use-auth'; // ERRO!

// Uma feature NÃO pode importar de outra feature
// Arquivo: app/pet/_components/pet-card.tsx
import { useLogin } from '@/app/auth/login/_hooks/use-login'; // ERRO!
```

---

## 3. Convenções de Nomenclatura

### 3.1 Arquivos

| Tipo | Padrão | Extensão | Exemplo |
|------|--------|----------|---------|
| Componentes | kebab-case | `.tsx` | `login-form.tsx`, `pet-details-card.tsx` |
| Hooks | use-[nome] | `.ts` | `use-login.ts`, `use-pet-data.ts` |
| Modelos | model | `.ts` | `model.ts` |
| Mutations | mutations | `.ts` | `mutations.ts` |
| Queries | queries | `.ts` | `queries.ts` |
| Query Keys | query-keys | `.ts` | `query-keys.ts` |
| Schemas | [nome]-schema | `.ts` | `register-schema.ts` |
| Config/Options | [nome]-options | `.ts` | `filter-options.ts` |
| Context | [nome]-context | `.tsx` | `auth-context.tsx` |
| Testes | [arquivo].test | `.ts` ou `.tsx` | `login-form.test.tsx` |
| Páginas Next.js | page | `.tsx` | `page.tsx` |
| Layouts Next.js | layout | `.tsx` | `layout.tsx` |

### 3.2 Pastas

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Features (rotas) | kebab-case | `pet/`, `auth/`, `verify-email/` |
| Sub-features | kebab-case | `login/`, `register/`, `details/` |
| Camadas privadas | _[nome] | `_entities/`, `_components/`, `_widgets/` |
| Subpastas privadas em features | _[nome] | `_components/`, `_hooks/`, `_config/` |
| Entidades | singular, kebab-case | `pet/`, `auth/`, `shelter/` |

### 3.3 Tipos e Interfaces

```typescript
// =====================================================
// Interfaces de domínio - PascalCase
// =====================================================
export interface Pet {
  id: string;
  name: string;
  species: string;
  age: number;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
}


// =====================================================
// Interfaces de Request/Response - sufixo Request/Response
// =====================================================
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  profiles: ProfileResponse[];
}

export interface ProfileResponse {
  name: string;
  description: string;
  profileType: ProfileType;
}


// =====================================================
// Props de componentes - sufixo Props
// =====================================================
interface PetCardProps {
  pet: Pet;
  onSelect?: (id: string) => void;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}


// =====================================================
// Types - PascalCase
// =====================================================
export type ProfileType = 'SHELTER' | 'ADOPTER' | 'ADMIN';

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'other';


// =====================================================
// Form Data (inferido de Zod) - sufixo FormData ou Data
// =====================================================
export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginData = z.infer<typeof loginSchema>;


// =====================================================
// Interfaces de paginação/resposta de lista
// =====================================================
export interface PetPage {
  content: Pet[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface PetInfiniteResponse {
  pets: Pet[];
  nextPage: number | null;
}
```

### 3.4 Funções e Constantes

```typescript
// =====================================================
// Componentes React - PascalCase, default export
// =====================================================
export default function LoginForm() { ... }
export default function PetDetailsCard({ pet }: PetDetailsCardProps) { ... }


// =====================================================
// Hooks - camelCase com prefixo 'use', named export
// =====================================================
export function useAuth() { ... }
export function useLogin(options?: UseLoginOptions) { ... }
export function useFetchPetsListInfinite(searchParams: string) { ... }


// =====================================================
// Funções de API - camelCase, verbo + substantivo
// =====================================================
export async function login(credentials: AuthRequest): Promise<AuthResponse> { ... }
export async function logout(): Promise<void> { ... }
export async function fetchPets(params?: string): Promise<{ pets: Pet[] }> { ... }
export async function fetchPetById(id: string): Promise<Pet> { ... }
export async function registerAccount(data: AccountRequest): Promise<void> { ... }


// =====================================================
// Query Keys - UPPER_SNAKE_CASE
// =====================================================
export const PET_QUERY_KEYS = {
  all: ['pets'] as const,
  lists: () => [...PET_QUERY_KEYS.all, 'list'] as const,
  list: (params: string) => [...PET_QUERY_KEYS.all, 'list', params] as const,
  details: () => [...PET_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PET_QUERY_KEYS.all, 'detail', id] as const,
} as const;


// =====================================================
// Schemas Zod - camelCase com sufixo 'Schema'
// =====================================================
export const registerSchema = z.object({ ... });
export const loginSchema = z.object({ ... });
export const contactSchema = z.object({ ... });


// =====================================================
// Configurações/Options - camelCase
// =====================================================
export const filterOptions = [
  { label: 'Espécie', name: 'species', options: ['Cão', 'Gato'] },
  { label: 'Sexo', name: 'gender', options: ['Macho', 'Fêmea'] },
];
```

---

## 4. Padrões de Código

### 4.1 Componentes React

#### Componente Simples

```typescript
// app/pet/_components/pet-list-card.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Pet } from '@/app/_entities/pet/model';
import { calculateAge } from '@/app/_lib/utils';

interface PetCardProps {
  pet: Pet;
}

export default function PetListCard({ pet }: PetCardProps) {
  const age = calculateAge(pet.birthDate);

  return (
    <Link href={`/pet/details/${pet.id}`}>
      <article className="rounded-lg bg-white p-4 shadow-md">
        <Image
          src={pet.images[0]?.url ?? '/placeholder.png'}
          alt={pet.name}
          width={200}
          height={200}
          className="rounded-md object-cover"
        />
        <h3 className="mt-2 font-semibold">{pet.name}</h3>
        <p className="text-sm text-content-200">{age}</p>
      </article>
    </Link>
  );
}
```

#### Componente com forwardRef (para UI components)

```typescript
// app/_components/ui/input.tsx
'use client';

import { forwardRef } from 'react';
import { cn } from '@/app/_lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-content-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'rounded-lg border border-gray-300 px-4 py-2',
            'focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20',
            error && 'border-error',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
```

#### Componente de Formulário com React Hook Form + Zod

```typescript
// app/auth/login/_components/login-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';
import { useLogin } from '../_hooks/use-login';

const loginSchema = z.object({
  email: z.string().email('Insira um email válido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: () => router.push('/pet'),
    onError: (error) => setApiError(error.message),
  });

  function handleLogin(data: LoginData) {
    setApiError(null);
    loginMutate(data);
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
      <Input
        type="email"
        placeholder="Email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        type="password"
        placeholder="Senha"
        error={errors.password?.message}
        {...register('password')}
      />

      {apiError && (
        <p className="text-sm text-error" role="alert">
          {apiError}
        </p>
      )}

      <Button type="submit" label="Entrar" isLoading={isPending} />
    </form>
  );
}
```

### 4.2 Hooks Customizados

#### Hook de Mutation com Callbacks

```typescript
// app/auth/login/_hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { login } from '@/app/_entities/auth/mutations';
import { useAuth } from '@/app/_entities/auth/use-auth';
import { AuthRequest } from '@/app/_entities/auth/model';

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const { setAuthUser } = useAuth();

  // Ref para callbacks estáveis (evita re-renders desnecessários)
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options?.onSuccess, options?.onError]);

  return useMutation({
    mutationFn: (credentials: AuthRequest) => login(credentials),
    onSuccess: (data) => {
      setAuthUser(data);
      optionsRef.current?.onSuccess?.();
    },
    onError: (error: Error) => {
      optionsRef.current?.onError?.(error);
    },
  });
}
```

#### Hook de Query com Infinite Scroll

```typescript
// app/pet/_hooks/use-pet-data.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { fetchPetsInfinite, fetchPetById } from '@/app/_entities/pet/queries';
import { PET_QUERY_KEYS } from '@/app/_entities/pet/query-keys';

export function useFetchPetsListInfinite(
  searchParamsPath: string,
  pageLimit: number
) {
  return useInfiniteQuery({
    queryKey: PET_QUERY_KEYS.list(searchParamsPath),
    queryFn: ({ pageParam }) =>
      fetchPetsInfinite(pageParam, searchParamsPath, pageLimit),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: pageLimit > 0,
  });
}

export function useFetchPetById(petId: string) {
  return useQuery({
    queryKey: PET_QUERY_KEYS.detail(petId),
    queryFn: () => fetchPetById(petId),
    enabled: !!petId,
  });
}
```

### 4.3 Entity Layer

#### Model (Interfaces)

```typescript
// app/_entities/pet/model.ts
export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  description: string;
  status: 'AVAILABLE' | 'ADOPTED' | 'PENDING';
  images: PetImage[];
  shelter: Shelter;
}

export interface PetImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface PetPage {
  content: Pet[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface PetInfiniteResponse {
  pets: Pet[];
  nextPage: number | null;
}
```

#### Query Keys

```typescript
// app/_entities/pet/query-keys.ts
export const PET_QUERY_KEYS = {
  all: ['pets'] as const,
  lists: () => [...PET_QUERY_KEYS.all, 'list'] as const,
  list: (params: string) => [...PET_QUERY_KEYS.all, 'list', params] as const,
  details: () => [...PET_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PET_QUERY_KEYS.all, 'detail', id] as const,
} as const;

export const PET_PUBLIC_QUERY_KEYS = PET_QUERY_KEYS.all;
```

#### Queries (Operações de Leitura)

```typescript
// app/_entities/pet/queries.ts
import { api } from '@/app/_lib/api/axios-instance';
import { Pet, PetPage, PetInfiniteResponse } from './model';

export async function fetchPets(params?: string): Promise<{ pets: Pet[] }> {
  const url = params ? `/pets?${params}` : '/pets';
  const response = await api.get<PetPage>(url);
  return { pets: response.data.content };
}

export async function fetchPetsInfinite(
  pageParam: number,
  searchParamsPath: string,
  pageLimit: number
): Promise<PetInfiniteResponse> {
  const params = new URLSearchParams(searchParamsPath);
  params.set('page', String(pageParam));
  params.set('size', String(pageLimit));

  const response = await api.get<PetPage>(`/pets?${params.toString()}`);
  const { content, number, totalPages } = response.data;

  return {
    pets: content,
    nextPage: number + 1 < totalPages ? number + 1 : null,
  };
}

export async function fetchPetById(id: string): Promise<Pet> {
  const response = await api.get<Pet>(`/pets/${id}`);
  return response.data;
}
```

#### Mutations (Operações de Escrita)

```typescript
// app/_entities/auth/mutations.ts
import { api } from '@/app/_lib/api/axios-instance';
import { AuthRequest, AuthResponse } from './model';

export async function login(credentials: AuthRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
```

### 4.4 Validação com Zod

```typescript
// app/auth/register/_config/register-schema.ts
import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email('Insira um email válido'),
    phoneNumber: z
      .string()
      .min(4, 'O telefone deve ter pelo menos 4 dígitos')
      .regex(/^\d+$/, 'O telefone deve conter apenas números'),
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    termsOfUserConsent: z.boolean().refine((val) => val === true, {
      message: 'Você deve aceitar os termos de uso',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

---

## 5. Padrões de Testes

### Estrutura e Convenções

- **Localização**: Testes são co-localizados com os arquivos fonte
- **Nomenclatura**: `[nome-arquivo].test.ts` ou `[nome-arquivo].test.tsx`
- **Extensão**: `.test.ts` para lógica pura, `.test.tsx` para componentes/hooks

### Teste de Componente

```typescript
// app/auth/login/_components/login-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/app/_entities/auth/auth-context';
import LoginForm from './login-form';

// Mock do hook de login
jest.mock('../_hooks/use-login', () => ({
  useLogin: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

// Mock do next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('LoginForm', () => {
  function createWrapper() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      );
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos os campos do formulário', () => {
    render(<LoginForm />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('mostra erro de validação para email inválido', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'email-invalido');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Insira um email válido')).toBeInTheDocument();
    });
  });

  it('submete o formulário com dados válidos', async () => {
    const user = userEvent.setup();
    const { useLogin } = require('../_hooks/use-login');
    const mockMutate = jest.fn();
    useLogin.mockReturnValue({ mutate: mockMutate, isPending: false });

    render(<LoginForm />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('Email'), 'test@email.com');
    await user.type(screen.getByPlaceholderText('Senha'), 'senha12345');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@email.com',
        password: 'senha12345',
      });
    });
  });
});
```

### Teste de Hook

```typescript
// app/auth/login/_hooks/use-login.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

import * as authMutations from '@/app/_entities/auth/mutations';
import { useLogin } from './use-login';

jest.mock('@/app/_entities/auth/mutations');
jest.mock('@/app/_entities/auth/use-auth', () => ({
  useAuth: () => ({
    setAuthUser: jest.fn(),
  }),
}));

const mockAuthMutations = authMutations as jest.Mocked<typeof authMutations>;

describe('useLogin', () => {
  function createWrapper() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama mutation de login e define estado de auth no sucesso', async () => {
    const authResponse = {
      accessToken: 'token',
      refreshToken: 'refresh',
      profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }],
    };
    mockAuthMutations.login.mockResolvedValue(authResponse);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useLogin({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com', password: 'password123' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it('chama callback de erro quando login falha', async () => {
    const error = new Error('Credenciais inválidas');
    mockAuthMutations.login.mockRejectedValue(error);

    const onError = jest.fn();
    const { result } = renderHook(() => useLogin({ onError }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ email: 'test@test.com', password: 'wrong' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onError).toHaveBeenCalledWith(error);
  });
});
```

### Teste de Mutation/API

```typescript
// app/_entities/auth/mutations.test.ts
import MockAdapter from 'axios-mock-adapter';

import { api } from '@/app/_lib/api/axios-instance';
import { login, logout } from './mutations';

describe('auth mutations', () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    mockApi = new MockAdapter(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  describe('login', () => {
    it('chama o endpoint correto com credenciais', async () => {
      const authResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        profiles: [{ name: 'Test', description: 'desc', profileType: 'SHELTER' }],
      };
      mockApi.onPost('/auth/login').reply(200, authResponse);

      const result = await login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toEqual(authResponse);
      expect(mockApi.history.post[0].url).toBe('/auth/login');
    });

    it('lança erro quando login falha', async () => {
      mockApi.onPost('/auth/login').reply(401, { message: 'Invalid credentials' });

      await expect(
        login({ email: 'test@test.com', password: 'wrong' })
      ).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });

  describe('logout', () => {
    it('chama o endpoint de logout', async () => {
      mockApi.onPost('/auth/logout').reply(200);

      await logout();

      expect(mockApi.history.post[0].url).toBe('/auth/logout');
    });
  });
});
```

### Teste de Schema Zod

```typescript
// app/auth/register/_config/register-schema.test.ts
import { registerSchema } from './register-schema';

describe('registerSchema', () => {
  const validData = {
    email: 'test@example.com',
    phoneNumber: '11999999999',
    password: 'password123',
    confirmPassword: 'password123',
    termsOfUserConsent: true,
  };

  function expectValidationError(
    data: Partial<typeof validData>,
    field: string,
    expectedMessage: string
  ) {
    const result = registerSchema.safeParse({ ...validData, ...data });
    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldError = result.error.issues.find((issue) =>
        issue.path.includes(field)
      );
      expect(fieldError?.message).toBe(expectedMessage);
    }
  }

  it('valida dados corretos', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejeita email inválido', () => {
    expectValidationError(
      { email: 'email-invalido' },
      'email',
      'Insira um email válido'
    );
  });

  it('rejeita senhas diferentes', () => {
    expectValidationError(
      { confirmPassword: 'senha-diferente' },
      'confirmPassword',
      'As senhas devem ser iguais'
    );
  });

  it('rejeita termos não aceitos', () => {
    expectValidationError(
      { termsOfUserConsent: false },
      'termsOfUserConsent',
      'Você deve aceitar os termos de uso'
    );
  });
});
```

---

## 6. Boas Práticas

### Acessibilidade

```typescript
// ✅ BOM: Usar elementos semânticos e ARIA
<button type="submit" aria-label="Enviar formulário">
  Enviar
</button>

<input
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email.message}
  </span>
)}

// ✅ BOM: Labels associados a inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ❌ RUIM: Divs clicáveis sem role
<div onClick={handleClick}>Clique aqui</div>

// ✅ BOM: Usar button ou role="button"
<button onClick={handleClick}>Clique aqui</button>
```

### Performance

```typescript
// ✅ BOM: Usar Image do Next.js para otimização
import Image from 'next/image';

<Image
  src="/pet.jpg"
  alt="Foto do pet"
  width={200}
  height={200}
  priority={isAboveFold}
/>

// ✅ BOM: Lazy loading de componentes pesados
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <LoadingSpinner />,
});

// ✅ BOM: Memoização quando necessário
import { memo, useMemo, useCallback } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items }: Props) {
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  return <ul>{sortedItems.map(/* ... */)}</ul>;
});
```

### Tratamento de Erros

```typescript
// ✅ BOM: Tratar erros de API com feedback ao usuário
const [apiError, setApiError] = useState<string | null>(null);

const { mutate, isPending } = useLogin({
  onSuccess: () => router.push('/pet'),
  onError: (error) => {
    if (error instanceof AxiosError) {
      setApiError(error.response?.data?.message ?? 'Erro ao fazer login');
    } else {
      setApiError('Erro inesperado. Tente novamente.');
    }
  },
});

// ✅ BOM: Error boundaries para erros de renderização
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Algo deu errado!</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
```

### Organização de Imports

```typescript
// Ordem recomendada de imports:

// 1. Imports do React
import { useState, useEffect, useCallback } from 'react';

// 2. Imports de bibliotecas externas
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// 3. Imports de entidades
import { useAuth } from '@/app/_entities/auth/use-auth';
import { AuthRequest } from '@/app/_entities/auth/model';

// 4. Imports de widgets
import { PageHeader } from '@/app/_widgets/page-header/page-header';

// 5. Imports de componentes compartilhados
import Button from '@/app/_components/ui/button';
import Input from '@/app/_components/ui/input';

// 6. Imports de utilitários
import { cn } from '@/app/_lib/utils';

// 7. Imports relativos (da própria feature)
import { useLogin } from '../_hooks/use-login';
```

---

## 7. Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento com Turbopack

# Build e Produção
pnpm build            # Build de produção
pnpm start            # Inicia servidor de produção

# Qualidade de Código
pnpm lint             # Executa ESLint

# Testes
pnpm test             # Executa todos os testes
pnpm test:watch       # Executa testes em modo watch
pnpm test:coverage    # Executa testes com relatório de cobertura
```

---

## 8. Referência Rápida

### Criando uma Nova Feature

1. Criar pasta em `app/[nome-feature]/`
2. Adicionar `page.tsx` para a rota
3. Criar subpastas privadas conforme necessário:
   - `_components/` - Componentes específicos
   - `_hooks/` - Hooks específicos
   - `_config/` - Schemas e configurações

### Criando uma Nova Entidade

1. Criar pasta em `app/_entities/[nome-entidade]/`
2. Adicionar arquivos:
   - `model.ts` - Interfaces e tipos
   - `queries.ts` - Operações de leitura (se aplicável)
   - `mutations.ts` - Operações de escrita (se aplicável)
   - `query-keys.ts` - Chaves do React Query (se aplicável)

### Criando um Novo Componente Compartilhado

1. Criar arquivo em `app/_components/ui/[nome-componente].tsx`
2. Usar `forwardRef` se o componente aceitar refs
3. Definir `displayName` para debugging
4. Criar arquivo de teste `[nome-componente].test.tsx`

---

*Este documento deve ser atualizado conforme o projeto evolui. Última atualização: Dezembro 2024*
