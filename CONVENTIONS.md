# Project conventions

## Monorepo layout

This is a pnpm + Turborepo monorepo with two apps and two shared packages:

```
/
  apps/
    bp-cantina/     # internal admin panel (Setup, Cashier, Kitchen, Orders, Report, Profile, Login)
    bp-reserva/     # public reservation flow (Reservation, ReservationSuccess) — guest only, no login
  packages/
    bp-ui/          # visual components, theme, animations, formatting utils — no domain knowledge
    bp-core/        # domain types, contexts, hooks, Supabase client — shared by both apps
  turbo.json        # build pipeline (packages build before apps)
  tsconfig.base.json
```

Rule of thumb for where new code goes:

- **Used by a single app, no domain coupling** → that app's own `src/components/` (e.g. `Layout`, admin-only).
- **Used by both apps, purely visual** → `packages/bp-ui` (e.g. `Button`, `Modal`, `Typography`).
- **Used by both apps, domain-aware** (needs `Order`, `Dish`, `PaymentMethod`, etc.) → `packages/bp-core` for contexts/hooks/types, or `packages/bp-ui` for components that render domain data (e.g. `OrdersList`, `DishSelector` — they depend on `bp-core` for types, which is fine; `bp-core` must never depend on `bp-ui`, to avoid a circular package dependency).
- **Used by a single page only** → stays inside that page's own folder, per the page structure below.

Each app and package still follows the same internal folder conventions described in this document (`styles/`, `hooks/`, `types/`, `domain/`, `validators/`, `index.tsx`/`index.ts` as the barrel). The rules below apply **inside** each app/package, not just at the old single-`src/` root.

Import shared code by package name, never by relative path across a package boundary:

```ts
// ✅ correct
import { Button } from 'bp-ui';
import { useSessionCtx, Order } from 'bp-core';

// ❌ wrong — cannot reach across package boundaries anyway, but never try to fake it
import { Button } from '../../../packages/bp-ui/src/components/Button';
```

## Page structure

Each complex page (with its own business logic) follows this structure:

```
pages/<Page>/
  domain/
    rules.ts           # pure business functions (no React, no Supabase)
    types/             # types derived from business rules (see "types/ folder pattern")
      interfaces.ts
      index.ts
    index.ts           # barrel: export * from './rules'; export * from './types';
  validators/
    schema.ts          # Zod schemas + inferred types (z.infer)
    index.ts           # barrel: export * from './schema';
  hooks/
    use<Page>.ts       # orchestrates data (contexts/Supabase) + calls domain/rules
    index.ts
  styles/
    <Page>.ts          # styled-components for the page
    index.ts           # barrel: export * from './<Page>';
  types/
    enums.ts           # UI-only state types (see "types/ folder pattern")
    index.ts
  components/          # page-specific subcomponents, if any
    index.ts
  index.tsx            # composition/JSX only — no business logic, no styled-components
```

Only create folders that have content — if the page has no pure business rules, skip `domain/`. If there's no form, skip `validators/`.

### Every folder has its own `index.ts` as the entry point

`domain/`, `validators/`, `types/`, `styles/`, `hooks/`, `components/` — always imported by **folder path**, never by the internal file:

```ts
// ✅ correct
import { groupTicketsByDish } from './domain';
import { cashierSchema } from './validators';

// ❌ wrong — leaks internal implementation detail
import { groupTicketsByDish } from './domain/rules';
import { cashierSchema } from './validators/schema';
```

This applies even when the folder currently has only one file (`rules.ts`, `schema.ts`, `enums.ts`, `<Page>.ts`, etc.) — the `index.ts` exists from the start so you never need to refactor imports as the folder grows.

If `styles/<Page>.ts` gets too large, split it by responsibility (e.g. `Card.ts`, `Tabs.ts`) and keep `index.ts` re-exporting everything — same logic as `types/`.

### `validators/`: what goes in

- Zod schemas that define the shape and validation of forms.
- Types inferred from those schemas (`z.infer<typeof schema>`).
- Nothing else — no business functions, no UI constants.

```ts
// validators/schema.ts
export const cashierSchema = z.object({ ... });
export type CashierFormValues = z.infer<typeof cashierSchema>;
```

### `domain/` vs `validators/` vs `types/`: which one to use?

**Test for `domain/`**: *"Would this function/type still make sense if this feature became an API or script, with no UI at all?"*

- **Yes** → `domain/` (it's a business concept)
- **No, but it's form validation** → `validators/`
- **No, it exists only because of the UI** → `types/` at the page root

| Example | Where | Why |
|---|---|---|
| `groupTicketsByDish(order)` | `domain/rules.ts` | Pure business rule. Would make sense in a report or API with no UI. |
| `GroupedItem` (grouping format) | `domain/types/interfaces.ts` | Return type of a business rule. |
| `cashierSchema` / `CashierFormValues` | `validators/schema.ts` | Form validation — exists because of the `<form>`, not the business. |
| `KitchenTab` (`Pending` \| `Delivered`) | `types/enums.ts` | Local navigation state, exists only because of the screen tabs. |

Practical rule: **start in `types/`**. Promote to `domain/types/` when a non-React layer (hook, rule, test) also needs it. Use `validators/` when it comes from a Zod schema.

### `types/` folder pattern

Every `types/` folder in the project (whether at the page root, `domain/types/`, or `src/types/`) follows the same split by responsibility — **never a single file mixing everything**:

```
types/
  enums.ts       # enums only
  interfaces.ts  # interfaces only
  types.ts       # type aliases only (union types, utility types, etc.)
  index.ts       # barrel
```

Create **only the files that have content**. Do not create empty files "just in case".

Always import by folder path (`from './types'`), never from the specific file (`from './types/enums'`) outside the folder itself.

### `domain/rules.ts`: what goes in

- Pure functions: receive data, return data. No `useState`, no `supabase`, no JSX.
- Testable in isolation without mocking React/Supabase.
- Examples: grouping/sorting/filtering data, calculating totals, validating business rules.

### `hooks/use<Page>.ts`: what goes in

- Data access (via contexts like `useSessionCtx`, or direct Supabase calls).
- Orchestration: fetches raw data → calls `domain/rules` → returns it ready for the UI.
- Does not duplicate business logic that already exists in `domain/`.

### `index.tsx`: what goes in

- JSX and component composition only.
- No `styled.div` declarations (those go in `styles/`).
- No business rule declarations (those go in `domain/`).
- No Zod schema declarations (those go in `validators/`).
- No loose domain enums/interfaces (those go in `domain/types/` or `types/`).

## Global utilities (`packages/bp-ui/src/utils/`)

Pure, UI-facing functions reused by more than one page/app live in `packages/bp-ui/src/utils/`. Do not duplicate them in each page's `domain/rules.ts`.

Existing examples: `maskPhone`, `maskCurrencyInput`, `formatCurrency`, `parseCurrency`, `parsePhone`.

Domain-facing shared utilities (that need domain types) live in `packages/bp-core/src/utils/` instead — e.g. `ORDER_STATUS_LABEL`, `PAYMENT_METHOD_LABEL`.

`helpers/` does not exist in this project — do not create it. All shared utilities go in `bp-ui/src/utils/` or `bp-core/src/utils/`.

## Global types (`packages/bp-core/src/types/`)

`packages/bp-core/src/types/` holds only shared domain concepts — types used by more than one app or layer:

```
packages/bp-core/src/types/
  enums.ts       # domain enums: PaymentMethod, OrderStatus, SessionStatus
  interfaces.ts  # domain entities: Session, Order, Dish, Addon, User, TicketItem
  index.ts       # barrel
```

**What does NOT go in `bp-core/src/types/`:**

- **UI-only enums** (e.g. tab state, local toggles) — go in the page's own `types/enums.ts`
- **Component props** (e.g. `ButtonProps`, `DishSelectorProps`) — go inside the component file itself and are exported from there if needed

When a concept is used by more than one page/app (e.g. `Order`, `Dish`, `Session`), it does **not** go into any single page's `domain/`. It stays in `bp-core` (shared) until there is a real need for a more formal shared domain layer — do not create this structure preemptively.

## Product domains (future)

The project may grow to cover products beyond the cafeteria (e.g. course bookings, book sales). When that happens, do **not** create a global `domain/` that mixes concepts from different products. Each product should have its own grouping (e.g. `domains/courses/`, `domains/bookstore/`), avoiding collisions where "Order" means different things in different contexts. Do not create these folders ahead of time — only when the domain actually exists.

## Global components (`packages/bp-ui/src/components/`)

A component moves out of a page and into `packages/bp-ui` only when it is **reused by more than one page/app and is purely visual** (e.g. `Button`, `IconButton`, `Tabs`, `Toast`, `BottomSheet`). Components used in a single page stay in `pages/<Page>/components/`. Components reused across apps but admin-only (e.g. `Layout`) stay inside that app's own `src/components/` instead of `bp-ui`, since they are not shared by both apps.

### Global component structure

Each global component follows the same folder layout:

```
components/<Component>/
  styles/
    <Component>.ts    # all styled-components for this component
    index.ts          # barrel: export * from './<Component>';
  hooks/              # only when the component has its own logic (useToast, useLayout)
    use<Component>.ts
    index.ts
  index.tsx           # JSX only — imports from ./styles and ./hooks, no styled.div here
```

Rules:
- `index.tsx` contains **only JSX** — no `styled.div`, no `keyframes`, no `css` helper.
- `styles/<Component>.ts` contains **all styled-components** for that component.
- `hooks/` is created **only when needed** — when the component has non-trivial state or side-effects worth isolating (e.g. `useToast` manages timers, `useLayout` manages auth state and dropdown). Don't create it for simple `useState` inside the JSX.
- Pure-style components with no JSX function (e.g. `Chip`, `Tabs`) use `index.tsx` as a re-export barrel: `export { ... } from './styles';`.
- Styled components that are also part of the public API (e.g. `ModalTitle`, `ModalActions`, `StatusBadge`) are re-exported from `index.tsx` via `export { ... } from './styles';`.
- Always import by folder path, never by internal file:

```ts
// ✅ correct
import { useToast } from '../Toast';
import { ModalTitle, ModalActions } from '../Modal';

// ❌ wrong — leaks internal structure
import { useToast } from '../Toast/hooks/useToast';
import { ModalTitle } from '../Modal/styles/Modal';
```

## Pages already structured in this pattern

- `apps/bp-cantina/src/pages/Kitchen/`
- `apps/bp-cantina/src/pages/Login/`
- `apps/bp-cantina/src/pages/Cashier/`
- `apps/bp-reserva/src/pages/Reservation/`
- `apps/bp-reserva/src/pages/ReservationSuccess/`
