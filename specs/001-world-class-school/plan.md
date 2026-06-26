# Implementation Plan: Water School — World-Class Online Learning Platform

**Branch**: `001-world-class-school` | **Date**: 2026-06-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-world-class-school/spec.md`, expanded by user request: full K–12 curriculum with component-based lessons, interactive game mechanics (famous-game remakes with learning objectives), and a new `lessons/` folder structure.

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The Water Classroom platform already ships a working Bun + Hono + Turso backend, Svelte 5 frontend, and SPA with pages for Academy, AI Tutor, Tasks, Forums, and Student Dashboard. This plan extends that foundation with a full K–12 curriculum system where every lesson is an isolated Svelte component, each containing embedded interactive mechanics or mini-games that teach core concepts through play (Flappy Bird-style aerodynamics, platformer physics, quiz-rpg hybrids). Content spans history, geography, STEM, and leadership/problem-solving themes.

A new root-level `lessons/` directory holds the curriculum JSON definitions and reusable Phaser-backed game components. The server resolves lesson components by hashed identifier and serves them through the existing Academy page shell.

## Technical Context

**Language/Version**: TypeScript 5.8 / Bun 1.3

**Primary Dependencies**: Svelte 5 (runes mode), Hono 4, @libsql/client (Turso), @google/genai (Gemini), Stripe, lucide-svelte, @tailwindcss/cli, tailwindcss, phaser (Bun dependency — installed via `bun add phaser`, imported as module in lesson components)

**Storage**: Turso (libSQL, SQLite-compatible). Tables: `turso_records`, `student_progress`, `tasks`, `sessions`. Existing tables: `curriculum_tracks`, `lessons`, `exams`, `exam_attempts`, `badges`, `tutors`, `institutions`, `institution_admins`, `community_posts`.

**New File Layout**:
```text
lessons/
├── curriculums/
│   ├── k12-mathematics.json
│   ├── k12-science.json
│   ├── k12-history.json
│   ├── k12-geography.json
│   └── k12-leadership.json
└── components/
    ├── math-grade1-numbers-phaser.svelte
    ├── science-grade3-plants-phaser.svelte
    └── ...one component per lesson...
```

**Testing**: Manual / Browser-based. Integration validation via `quickstart.md` scenarios.

**Target Platform**: Web (desktop + mobile responsive). Phaser games target desktop/tablet for best interaction fidelity.

**Project Type**: Full-stack web application (single-server SPA)

**Performance Goals**: Dashboard load < 3 s; lesson component lazy-load < 1 s; game initial render < 2 s.

**Constraints**: No Vite, no npm/yarn/pnpm; Tailwind-only CSS; all motion via Svelte Animations; Bun runtime for scripts and server; do not modify existing stable modules (T3). Phaser is a permitted Bun dependency for interactive lesson games (see Constitution Check / T5 exception).

**Scale/Scope**: Full K–12 + undergraduate; multi-country curricula; institution-management layer for school networks.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| T1 — Modular Architecture | ✅ PASS | Each lesson is its own component; curriculum JSON is data-only; API routes module-scoped. |
| T2 — Incremental Delivery | ✅ PASS | Stories ordered by subject/grade band; each lesson independently testable. |
| T3 — Existing Code is Sacred | ✅ PASS | Existing files untouched. New `lessons/` tree is additive only. |
| T4 — Thoughtful Planning Before Implementation | ✅ PASS | Spec, plan, and tasks are present and consistent. |
| T5 — Design-First Execution | ✅ PASS | Phaser 3 is the named exception (Bun dependency). DOM UI still uses Svelte Animations + Tailwind. Documented in constitution v2.0.0. |
| T6 — Locked Tech Stack | ✅ PASS | Phaser 3 permitted via `bun add phaser`. Constitution updated to v2.0.0 with T5/T6 amendments + new T8 (Lesson Component Architecture). |
| T8 — Lesson Component Architecture | ✅ PASS | `lessons/components/` + `lessons/curriculums/` structure defined; component naming convention established. |

**Post-Phase 1 re-check**: All gates pass. T5/T6 amendments ratified in constitution v2.0.0. No unresolved violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-world-class-school/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── api-contracts.md # Hono route signature contracts
│   └── store-contracts.md # Svelte store slice contracts
└── tasks.md             # Phase 2 output (speckit.tasks)
```

### Source Code (repository root)

```text
server.ts                # Hono app — new route sections appended per module
src/
├── App.svelte           # Existing — no modification
├── index.ts             # Existing entry — no modification
├── index.css            # Existing — no modification
├── lib/
│   ├── store.svelte.ts  # Extended with new state slices (no existing lines changed)
│   ├── types.ts         # Extended with new type definitions
│   └── lessonsData.ts   # Existing — not modified
├── pages/
│   ├── AcademyPage.svelte         # Existing — extended for curriculum tracks
│   ├── AITutorPage.svelte         # Existing — extended for scene context
│   ├── DashboardPage.svelte       # Existing — extended for gamification widgets
│   ├── ForumsPage.svelte          # Existing — extended for moderation
│   ├── ProfilePage.svelte         # Existing — extended for grade/country
│   ├── TasksPage.svelte           # Existing — not modified
│   ├── LandingPage.svelte         # Existing — not modified
│   ├── ExamsPage.svelte          # NEW — proctored exam flow
│   └── InstitutionDashboard.svelte # NEW — admin/institution view
├── components/
│   ├── layout/
│   │   ├── Header.svelte          # Existing — extended for institution nav
│   │   └── OnboardingDialog.svelte # Existing — extended for country/grade
│   ├── gamification/
│   │   ├── BadgeDisplay.svelte    # NEW
│   │   ├── StreakCounter.svelte   # NEW
│   │   └── ProgressBar.svelte     # NEW
│   ├── exams/
│   │   ├── ProctorCamera.svelte   # NEW
│   │   └── ExamPlayer.svelte      # NEW
│   ├── games/                    # Existing — not modified
│   ├── modals/                   # Existing — not modified
│   └── ErrorBoundary.svelte       # Existing — not modified
└── school/
    └── SchoolDashboardPage.svelte # Existing — not modified

lessons/                          # NEW — entire curriculum tree
├── curriculums/
│   ├── k12-mathematics.json
│   ├── k12-science.json
│   ├── k12-history.json
│   ├── k12-geography.json
│   └── k12-leadership.json
└── components/
    ├── math-grade1-numbers-flappy.svelte
    ├── science-grade3-plants-quiz.svelte
    └── ...one component per lesson...
```

**Structure Decision**: Single-server SPA. Existing `server.ts` and `src/` tree are unchanged. Curriculum JSON and lesson components live in the new `lessons/` directory. Academy page dynamically imports lesson components by hashed ID. This maximizes modularity (T1) and avoids rewriting working code (T3).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

All constitution gates pass as of v2.0.0. No complexity entries required.
