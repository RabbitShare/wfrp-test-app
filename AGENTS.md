# AGENTS.md - Developer Guidelines

This file provides guidance for agentic coding agents working in this repository.

## Project Overview

**Warhammer Fantasy Roleplay (WFRP) character builder** - monorepo:

- **Package Manager**: pnpm 10.x with workspace support
- **Build System**: Turbo 2.x for monorepo orchestration
- **Framework**: Next.js 16 with App Router (React 19)
- **UI**: shadcn/ui components with Tailwind CSS 4.x
- **State**: Zustand with persist middleware
- **Language**: TypeScript 5.9 (strict mode)

## Directory Structure

```
apps/web/           # Next.js web app (app/, components/, hooks/, lib/)
packages/ui/        # Shared UI components
packages/eslint-config/
packages/typescript-config/
```

## Commands

### Root

| Command       | Description           |
| ------------- | --------------------- |
| `pnpm build`  | Build all packages    |
| `pnpm dev`    | Start all dev servers |
| `pnpm lint`   | Lint all packages     |
| `pnpm format` | Format with Prettier  |

### Web App (apps/web/)

| Command          | Description         |
| ---------------- | ------------------- |
| `pnpm dev`       | Next.js + Turbopack |
| `pnpm build`     | Build Next.js app   |
| `pnpm start`     | Production server   |
| `pnpm lint`      | Run ESLint          |
| `pnpm lint:fix`  | Auto-fix ESLint     |
| `pnpm typecheck` | TypeScript check    |

### Adding shadcn Components

Add components to `packages/ui` package (shared UI):

```bash
# Add to packages/ui
cd packages/ui && pnpm dlx shadcn@latest add button input card -y

# Import in app
import { Button, Input, Card } from "@workspace/ui/components/*";
```

### Testing (Playwright + Cucumber)

E2E tests using Gherkin with Playwright and Cucumber.js.

```bash
# Run all E2E tests
cd apps/web && pnpm test:e2e

# Run with output
cd apps/web && pnpm test:e2e:ui

# Run in headed mode (visible browser)
cd apps/web && pnpm test:e2e:headed
```

#### Running a Single Test

```bash
# By tag
cd apps/web && npx cucumber-js --tags "@wip"

# By name pattern
cd apps/web && npx cucumber-js --name "Создание персонажа"
```

## Code Style

### TypeScript

- Explicit types for function params/returns and component props
- Strict mode - no `any`
- Use interfaces for object shapes, types for unions

### Imports

- `@workspace/ui/components/*` - UI components (shadcn)
- `@workspace/ui/lib/utils` - cn() utility
- `@/*` - app-local imports

### Components

Use `class-variance-authority` (cva) with `cn()` for variants:

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

### Client vs Server Components

Add `"use client"` for: React hooks, browser APIs, event handlers, Zustand stores, next-themes.

### Naming Conventions

| Type       | Convention     | Example                |
| ---------- | -------------- | ---------------------- |
| Components | PascalCase     | `CharacterSheet`       |
| Functions  | camelCase      | `calculateWounds`      |
| Variables  | camelCase      | `currentCharacter`     |
| Types      | PascalCase     | `Character`            |
| Constants  | PascalCase     | `BASE_CHARACTERISTICS` |
| Files      | kebab-case.tsx | `character-sheet.tsx`  |

### React Best Practices

- Functional components
- Destructure props with defaults
- Early returns for conditionals
- Keep components focused

### State (Zustand)

```typescript
interface CharacterStore {
  characters: Character[];
  addCharacter: () => Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      addCharacter: () => {
        /* ... */
      },
      updateCharacter: (id, updates) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        }));
      },
    }),
    { name: "storage-key" },
  ),
);
```

### Error Handling

- try/catch for async ops
- Return null/undefined for not-found
- Discriminated unions for error states

### Styling

- Tailwind CSS utilities
- Use `cn()` for conditional classes
- Follow existing patterns (stone colors, amber accents)
- Responsive: sm:, md:, lg: prefixes

### Linting & Formatting

- ESLint flat config
- Run `pnpm lint` before commits

### File Organization

- `apps/web/components/` - app components
- `packages/ui/src/components/` - shared UI (shadcn)
- `apps/web/lib/wfrp/` - game rules
- Co-locate types with implementation
