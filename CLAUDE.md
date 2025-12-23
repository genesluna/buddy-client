# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Buddy is a pet adoption web application built with Next.js 15 (App Router), React 19, and Tailwind CSS 4. The project connects animal shelters with potential adopters in Brazil. The backend API is separate (https://github.com/hywenklis/buddy-backend).

## Commands

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run Jest tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Run tests with coverage report
```

## Architecture

### Hybrid FSD Architecture

The project uses a hybrid Feature-Sliced Design architecture adapted for Next.js App Router. This provides clear layer separation while maintaining App Router conventions.

### Directory Structure

```
app/
├── _entities/        # Layer 1: Domain models and data operations (queries/mutations)
│   ├── account/
│   │   ├── model.ts     # AccountRequest, ConfirmEmailRequest, ResendVerificationRequest
│   │   └── mutations.ts # registerAccount, requestEmailVerification, confirmEmailVerification
│   ├── auth/
│   │   ├── model.ts     # AuthRequest, AuthResponse, ProfileResponse, ProfileType
│   │   └── mutations.ts # login, logout (API operations only, no UI)
│   ├── pet/
│   │   ├── model.ts     # Pet, PetImage, PetPage, PetInfiniteResponse interfaces
│   │   ├── queries.ts   # Read operations (fetchPets, fetchPetById, fetchPetsInfinite)
│   │   ├── mutations.ts # Write operations (create, update, delete)
│   │   └── query-keys.ts # PET_QUERY_KEYS constants
│   ├── shelter/
│   │   └── model.ts     # Shelter, ShelterFull interfaces
│   └── user/
│       └── model.ts     # User, UserCredentials, UserRegistration interfaces
│
├── _widgets/         # Layer 2: Composed UI blocks
│   ├── layouts/      # Layout components
│   │   ├── horizontal-layout.tsx  # Layout for auth pages (logo left, content right)
│   │   └── vertical-layout.tsx    # Main page layout (header, content, footer)
│   ├── page-header/  # Header with navigation (main-nav, hamburger-nav)
│   └── page-footer/  # Footer with social links
│
├── _components/      # Layer 3: Shared base UI components
│   ├── ui/           # Button, Input, Combobox, BackButton, ImageSkeleton
│   └── loading-spinner.tsx    # Generic loading spinner
│
├── _hooks/           # Shared custom hooks (use-scroll-top)
├── _lib/             # Utilities and providers
│   ├── api/
│   │   └── axios-instance.ts  # Configured axios with 401 refresh interceptor
│   ├── auth/
│   │   ├── auth-context.tsx   # React Context for auth state
│   │   ├── use-auth.ts        # useAuth hook
│   │   ├── user-storage.ts    # localStorage management for user data
│   │   └── use-logout.ts      # useLogout hook
│   ├── providers/
│   │   └── react-query-provider.tsx  # TanStack Query setup
│   ├── query-keys.ts  # Public query key aggregator
│   └── utils.ts       # cn(), calculateAge(), buildSearchParamsPath()
├── _types/           # Shared TypeScript types
├── _assets/          # Static assets (images, SVGs)
│
└── [feature]/        # Layer 4: Feature routes (UI, pages, flow orchestration)
    ├── pet/
    │   ├── _components/   # Feature-specific UI components
    │   ├── _hooks/        # Feature-specific hooks (use-pet-data)
    │   ├── _config/       # Feature config (filter-options)
    │   ├── details/       # Pet detail page
    │   └── adoption/      # Pet adoption form
    ├── auth/              # UI pages and user flows (uses _entities/auth for API)
    │   ├── login/         # Login page with _components/, _hooks/
    │   ├── register/      # Registration page with _components/, _hooks/, _config/
    │   ├── verify-email/  # Email verification page
    │   └── verification-pending/  # Pending verification page
    ├── contact/
    └── about/
```

Underscore-prefixed folders are private and not treated as routes by Next.js.

### Layer Import Rules

- `_entities/` → Can only import from `_lib/`, `_types/`
- `_widgets/` → Can import from `_entities/`, `_components/`, `_lib/`
- `_components/` → Can import from `_lib/`, `_types/`
- Feature routes → Can import from all layers above

### Key Patterns

**Data Fetching**: Uses TanStack Query (React Query) with custom hooks in `_hooks/` directories. The `ReactQueryProvider` in `app/_lib/providers/` wraps the app with a 60-second default stale time.

**API Layer**: Entity data functions are split by operation type - `queries.ts` for read operations and `mutations.ts` for write operations. Both use Axios. API base URL is configured via `NEXT_PUBLIC_API_URL` environment variable.

**Styling**: Tailwind CSS 4 with CSS-based theme configuration in `styles/globals.css` using `@theme` directive. Custom colors, fonts, and utilities are defined as CSS variables. The `cn()` utility in `app/_lib/utils.ts` merges Tailwind classes using clsx and tailwind-merge.

### Theme

The theme is defined in `styles/globals.css` using the Tailwind CSS 4 `@theme` directive.

**Brand Colors**:
- `primary` (#EEF7FF) - Light blue, used for backgrounds
- `secondary` (#7AB2B2) - Teal, used for accents and interactive elements
- `terciary` (#CDE8E5) - Light teal, used for subtle backgrounds
- `accent` (#4D869C) - Dark teal, used for emphasis and CTAs

**Content Colors** (grayscale + utility):
- `content-100` (#ffffff) - White
- `content-150` (#f9fafc) - Off-white
- `content-200` (#575757) - Medium gray text
- `content-300` (#4f4f4f) - Dark gray text
- `content-400` (#131616) - Near-black text
- `content-500` (#D2EAFF) - Light blue highlight
- `content-600` (#F3F5F9) - Light gray background

**Status Colors**:
- `info` (#66c7ff) - Informational messages
- `success` (#87cf3a) - Success states
- `warning` (#f7c250) - Warning messages
- `danger` (#ff6347) - Destructive actions
- `error` (#ff6b6b) - Error states

**Custom Utilities**:
- `rounded-4xl` (2.25rem) - Extra-large border radius
- `drop-shadow-glow` - White glow effect for elevated elements

**Background**: The body uses a gradient from `--background-start-rgb` (#EEF7FF) to `--background-end-rgb` (#D2EAFF).

**Forms**: React Hook Form with Zod validation (`@hookform/resolvers`).

**Icons**: Phosphor Icons (`@phosphor-icons/react`).

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL

### Testing

Tests are co-located with source files using the `.test.ts` or `.test.tsx` extension.

**Test Stack**:
- Jest with TypeScript (ts-jest)
- React Testing Library for component tests
- axios-mock-adapter for API mocking

**Test Locations**:
- Entity mutations: `_entities/*/mutations.test.ts`
- Auth library: `_lib/auth/*.test.ts`
- API instance: `_lib/api/axios-instance.test.ts`
- Feature components: `[feature]/_components/*.test.tsx`
- Feature hooks: `[feature]/_hooks/*.test.tsx`
- Validation schemas: `[feature]/_config/*.test.ts`

## Git Workflow

- **main**: Stable production branch
- **develop**: Development branch (PR target)
- **feature/\***: New features (branch from develop)
- **fix/\***: Bug fixes (branch from develop)
- **hotfix/\***: Urgent fixes (branch from main)

Use squash and merge for PRs to develop.
