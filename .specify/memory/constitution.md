<!--
Sync Impact Report
Version change: 1.0.0 → 2.0.0 (MAJOR)
Modified principles:
  - T5 — Design-First Execution (added Phaser as permitted exception — Bun-native import, not CDN)
  - T6 — Locked Tech Stack (added Phaser 3 as permitted, installed via `bun add phaser`; no-npm rule stands)
  - T8 — NEW — Lesson Component Architecture
Added sections:
  - Lesson Component Architecture (T8)
Removed sections: none
Templates requiring updates:
  ✅ plan.md (updated Constitution Check + Structure sections)
  ⚠ spec-template.md (not yet updated — verify lesson-component terms align)
  ⚠ tasks-template.md (not yet updated — add lesson-component task patterns)
  ⚠ command files under .specify/templates/commands/ (verify no CLAUDE-only references)
Follow-up TODOS:
  - Verify bundle includes Phaser from Bun install
  - Add <!-- SPECKIT START/END --> markers to .kilocode/rules/specify-rules.md if not present
-->

# Water Classroom Constitution v2.0.0

## Core Principles

### T1 — Modular Architecture
The codebase MUST be organized into independent, single-responsibility modules. Each feature MUST map to its own store slice in `src/lib/store.svelte.ts`, its own API route section in `server.ts`, and its own page or component file. Modules MUST NOT create circular dependencies. Every module MUST be independently loadable and testable without requiring the rest of the application to be present.

The `lessons/` directory IS a module: curriculum JSON files are data-only, lesson components are single-file Svelte islands, and no lesson component may import from another lesson component.

### T2 — Incremental Delivery
Work MUST be delivered in small, independently testable increments — one user story at a time. Each increment MUST have a clear independent test that can be executed without depending on incomplete sibling work. Implementation ordering MUST follow the dependency graph documented in `tasks.md`; integration tasks MUST NOT precede their foundational prerequisites without an explicit dependency note.

### T3 — Existing Code is Sacred
Existing files MUST NOT be rewritten. New functionality MUST be added by appending new route handlers, new store fields, new component files, or new sections within existing files. Existing lines MUST NOT be removed unless explicitly required to fix a defect. Any exception MUST be documented in the implementation notes with rationale.

### T4 — Thoughtful Planning Before Implementation
No implementation work MAY begin until `spec.md`, `plan.md`, and `tasks.md` are all present and consistent. The architect MUST resolve all conflicts, ambiguities, and missing coverage in those documents before task execution begins. Tasks MUST be organized by user story and phase, with clear dependency ordering and parallel-opportunity annotations.

### T5 — Design-First Execution with Tailwind-only CSS and Svelte Animations
All new UI MUST be designed before implementation. Styling MUST use Tailwind utility classes exclusively — no `<style>` blocks, no inline `style=` attribute bindings, and no custom CSS files for new components. All motion and transitions MUST use Svelte Animations (`transition:`, `animate:`, `in:`, `out:`) exclusively — no CSS `@keyframes`, no JavaScript animation libraries.

**Named exception — Phaser.js (Bun-native)**:
Phaser 3 is the sole permitted exception for interactive lesson game content. It MUST be installed via `bun add phaser` (Bun's built-in package manager — NOT npm, yarn, or pnpm) and imported as a module in lesson components. Phaser MUST be wrapped inside a Svelte component so that all DOM UI (menus, buttons, overlays, game-over screens) continues to use Svelte Animations + Tailwind. The Phaser canvas is the only allowed exception to the "no third-party JS animation libraries" rule. All game logic, scene management, and point-scoring lives inside the lesson component.

### T6 — Locked Tech Stack
The project tech stack is locked and MUST NOT be changed without an explicit constitution amendment.

Permitted tools and libraries:
- Runtime: Bun 1.3+
- Backend framework: Hono 4 (`server.ts`)
- Database: Turso (libSQL / SQLite-compatible), accessed via `@libsql/client`
- AI: `@google/genai` (Gemini)
- Frontend framework: Svelte 5 (runes mode)
- Styling: Tailwind CSS v4 (`@tailwindcss/cli`, `tailwindcss`)
- Icons: `lucide-svelte`
- Payments: Stripe
- Game engine: Phaser 3 (installed via `bun add phaser` only, see T5 exception)

**Hard constraints**:
- `npm`, `yarn`, and `pnpm` are forbidden. All dependencies MUST be managed by Bun's built-in toolchain (`bun add`, `bun install`).
- Vite and Vite-based plugins are expressly forbidden.
- Phaser MUST be installed and managed through `bun add phaser`. No CDN loading, no manual script injection for Phaser itself.

### T7 — Always Test with Build and Lint
Every implementation task MUST be verified by running `bun run build` and `bunx svelte-check --no-tsconfig --output human --threshold error` before being marked complete. A task is only considered done when both commands pass with zero errors. Tasks MUST NOT be batched across multiple files before running verification — each logical increment MUST be tested before proceeding.

### T8 — Lesson Component Architecture
Every learning unit MUST be a standalone Svelte component stored under `lessons/components/`. Component filenames MUST follow the pattern:

```
{subject}-{grade}-{slug}-{hash}.svelte
```

Where `hash` is a stable short hash (SHA-1 truncated to 5 chars) of `{lessonTitle}-{subject}` to prevent filesystem naming collisions.

**Rules**:
- Each lesson component MUST be independently importable and renderable without depending on sibling lesson components.
- Each lesson component MUST contain at least one interactive element (Phaser game canvas, Svelte-animated quiz, clickable scenario, or point-awarding prompt).
- Every interaction awards points regardless of answer correctness — the goal is engagement and reflection, not gatekeeping. Wrong answers still award participation points; correct answers award bonus points.
- Lesson themes MUST imbue leadership, problem-solving, and independent thinking. Story context is mandatory; every lesson opens with a narrative scenario.
- Curriculum JSON files in `lessons/curriculums/` define the ordered list of lesson component hashes per program (e.g., `k12-mathematics.json`, `k12-history.json`). Academy resolves the current lesson's component by hash and lazy-loads it.

**Directory layout**:
```text
lessons/
├── curriculums/
│   ├── k12-mathematics.json
│   ├── k12-science.json
│   ├── k12-history.json
│   ├── k12-geography.json
│   └── k12-leadership.json
└── components/
    ├── math-g1-numbers-flappy-3a7f1.svelte
    ├── science-g3-photosynthesis-quiz-9b2e4.svelte
    └── ...one component per lesson...
```

## Tech Stack

The canonical stack for this project:

```
Runtime:        Bun 1.3+
Backend:        Hono 4  (server.ts)
Database:       Turso / libSQL  (@libsql/client)
AI:             @google/genai  (Gemini API)
Frontend:       Svelte 5 runes mode
Styling:        Tailwind CSS v4  (@tailwindcss/cli)
Icons:          lucide-svelte
Payments:       Stripe
Games:          Phaser 3  (Bun dependency via `bun add phaser`, imported as module)
```

Rules:
- All database access goes through the Hono server (`server.ts`) — no direct Turso calls from the browser.
- All state lives in `src/lib/store.svelte.ts` using Svelte 5 runes (`$state`, `$derived`, `$effect`).
- New pages go in `src/pages/`; shared components go in `src/components/` by domain.
- Lesson components live exclusively in `lessons/components/`; curriculum JSON lives in `lessons/curriculums/`.
- API routes MUST be appended to `server.ts` in the relevant section; existing routes MUST NOT be moved or renamed.
- Phaser MUST be imported as a module (e.g., `import Phaser from 'phaser'`) inside lesson components. No CDN script tags.

## Governance

This constitution supersedes all other development practices and informal conventions. Where this document and `spec.md` or `tasks.md` conflict, this constitution takes precedence.

- **Amendments**: Any principle change requires updating this file, incrementing the version below, and recording the change rationale inline. Amendments require explicit user approval.
- **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH). MAJOR for principle removal or redefinition; MINOR for new principle added; PATCH for wording clarifications.
- **Compliance Review**: A compliance review MUST be performed at the end of each user story phase (Phase 3, 4, 5, 6, 7, 8) and before Phase 9 (Polish). The review verifies T1–T8 and records findings in `tasks.md`.
- **Exception Process**: Any task that cannot satisfy a principle MUST be flagged explicitly in `tasks.md` with the principle identifier and a written exception rationale. Silent violations are not permitted.

**Version**: 2.0.0 | **Ratified**: 2026-06-21 | **Last Amended**: 2026-06-21
Changelog: v2.0.0 — Added T8 (Lesson Component Architecture); amended T5 (Phaser as Bun-native exception, not CDN) and T6 (Phaser 3 permitted via `bun add`); clarified no-npm boundary.
