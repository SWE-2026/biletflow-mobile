@AGENTS.md

## Architecture: strict Feature-Sliced Design (FSD)

All code under `src/` follows [Feature-Sliced Design](https://feature-sliced.design/docs/reference) strictly. Docs index for LLMs: https://feature-sliced.design/llms.txt — check it rather than relying on memory.

### Layers (top → bottom)

```
src/
├── app/        Expo Router routes + app-wide wiring (FSD "app" layer)
├── pages/      one slice per screen
├── widgets/    large self-contained UI blocks composed from features/entities
├── features/   user actions that bring business value (sign in, scan ticket, undo check-in)
├── entities/   business entities (session, event, ticket, attendee, check-in)
└── shared/     domain-agnostic code: ui, api, lib, config (no slices, only segments)
```

`processes/` is deprecated — do not create it.

### Import rules (no exceptions)

- A module may import **only from layers strictly below it**. `shared` imports nothing from other layers; `app` may import from all.
- Slices on the **same layer must not import each other** (e.g. `features/scan-ticket` cannot import `features/check-in-attendee`). Compose them in a higher layer instead. The only exception is entity cross-references via the `@x` notation (`entities/ticket/@x/attendee.ts`), used sparingly for types.
- Every slice exposes a **public API** through `index.ts`. Import from the slice root only (`@/entities/ticket`), never from its internals (`@/entities/ticket/model/types`). Inside a slice, use relative imports.
- `shared` segments each have their own public API (`@/shared/ui`, `@/shared/api`, `@/shared/lib`, `@/shared/config`).
- Always use the `@/` alias (maps to `src/`) for cross-slice imports.

### Segments

Inside a slice, group code by purpose, not by file type: `ui/`, `model/` (state, types, hooks, business logic), `api/` (requests, DTO mapping), `lib/` (slice-local helpers), `config/`. Never use `components/`, `hooks/`, `types/`, or `utils/` as segment names.

### Expo Router and the `app` layer

- `src/app/` is both the Expo Router root and the FSD `app` layer. Every file in it is a route, so put **only** route files and `_layout.tsx` files there.
- Route files are thin: they re-export a page and contain no UI or logic.
  ```tsx
  // src/app/(app)/events/[eventId]/scan.tsx
  export { ScanPage as default } from '@/pages/scan';
  ```
- `_layout.tsx` files may configure navigators (`Stack`, `Tabs`, `Stack.Protected`), screen options, and compose app-wide providers. Provider implementations live in the slice that owns them (e.g. `SessionProvider` in `entities/session`, theme in `shared`).
- Pages read route params with `useLocalSearchParams` and pass them down as props. Widgets, features, and entities should not depend on route structure.

### Naming

- Slice and file names: `kebab-case` (`check-in-attendee`, `ticket-card.tsx`).
- Name slices by domain meaning, not by UI (`features/undo-check-in`, not `features/undo-button`).

### Expected slices for the scanner app

- **pages:** `sign-in`, `forgot-password`, `events`, `profile`, `event-overview`, `scan`, `scan-result`, `attendees`, `ticket`, `check-ins`
- **widgets:** `qr-scanner`, `check-in-stats`, `attendee-list`, `check-in-log`
- **features:** `auth-by-email`, `reset-password`, `sign-out`, `scan-ticket`, `check-in-attendee`, `undo-check-in`, `search-attendees`
- **entities:** `session`, `event`, `ticket`, `attendee`, `check-in`
- **shared:** `ui` (themed primitives), `api` (HTTP client), `config` (env, theme tokens), `lib`

Add new slices when a requirement doesn't fit these; don't grow an existing slice past its domain.
