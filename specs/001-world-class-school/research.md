# Research: Water School Platform

**Feature**: specs/001-world-class-school/spec.md
**Date**: 2026-06-21

<!--
  Format per Phase 0:
  Decision: what was chosen
  Rationale: why chosen
  Alternatives considered: what else evaluated
-->

---

## 1. Country-Adaptive Curriculum Delivery

**Decision**: Curriculum tracks are stored as ordered lists in Turso (JSON column on `curriculum_tracks`), keyed by `(country_code, grade_level, track_type)`. A `country_code` → canonical name mapping is maintained in a client-side `COUNTRY_CATALOG.ts` file seeded at onboarding.

**Rationale**: Turso/libSQL supports JSON columns. Storing lesson order as JSON avoids a separate join-heavy `track_lessons` linking table for the initial scope. Country codes (ISO 3166-1 alpha-2) are stable identifiers. A client-side catalog allows offline-first onboarding flows before the first server round-trip.

**Alternatives considered**:
- Separate `track_lessons` join table: Rejected — adds schema complexity without benefit at current scale; JSON column is simpler and allows non-destructive reordering without migration.
- Server-only catalog via API: Rejected — onboarding must feel fast (sub-90-second target); client-side primary lookup with server fallback is faster.

---

## 2. Proctored Exam with AI Camera Monitoring

**Decision**: Client-side `getUserMedia` captures video at 320×240 at 1 fps. Each frame is sent to the backend at most once per 60 seconds (stub VLM analysis in Phase 1, replaceable with a real server-side VLM endpoint). Proctoring events are logged server-side into `exam_attempts.proctor_flags` (JSON array). Exams are NOT auto-blocked — failures are flagged and queued for human review.

**Rationale**: Real-time VLM inference at 320×240 is computationally feasible on-device using WebLLM but adds build complexity. Sending a frame every 60 s is enough to establish identity continuity without impacting bandwidth. The flag-not-block behavior is a deliberate UX/policy choice to avoid false positives harming students.

**Alternatives considered**:
- Full server-side VLM pipeline (e.g., Replicate/Cloudflare Workers AI): Deferred to Phase 2 — not required for MVP constitution compliance (FR-007 says "flag, not block").
- Auto-grade on identity failure: Rejected — too high a false-positive risk for live learners; human review required.

---

## 3. Streak Counting

**Decision**: Streak is a computed value from `student_progress.lastActiveDate`. The server stores the local date string (YYYY-MM-DD) of last activity, captured at the point the user touches the platform. The client recalculates the streak on login: if today's date minus lastActiveDate is 1 day, streak continues; if 0 (already active today), streak unchanged; if > 1 day (accounting for 30-minute grace at midnight), streak resets to 1.

**Rationale**: Keeping streak logic client-side-verified against a server-stored anchor avoids timezone ambiguity while honoring the "student's local time zone" rule (server stores UTC date; client converts). The 30-minute grace is a client-only tolerance.

**Alternatives considered**:
- UTC-only streak: Rejected — breaks streaks for students in negative UTC offsets whose "day" starts early UTC-wise.
- Server-side cron to reset streaks: Rejected — adds infrastructure complexity; client-side computation is sufficient.

---

## 4. AI Tutor Context Window

**Decision**: The AI tutor API endpoint (`/api/gemini/tutoring`) already accepts `selectedLessonContext` in the request body. New pages simply need to populate this field with `{ lessonTitle, lessonSubject, gradeLevel }` before calling the endpoint. No server-side changes required.

**Rationale**: The tutor is already scoped to the current lesson via a frontend-trusted context string. Subject-area awareness is a prompt-engineering win, not a schema change.

**Alternatives considered**:
- Wide context window storing full conversation history per student: Deferred — not required for the current spec; can be introduced later as a curriculum-layer enhancement.

---

## 5. Institution Curriculum Override Propagation

**Decision**: Institution overrides are stored as a separate `institution_curriculum_overrides` table with `institution_id`, `grade_level`, `subject`, `ordered_lesson_ids` (JSON). When a student's feed loads, the server checks for an override matching their institution + grade + subject; if found, those lesson IDs replace the canonical order. Propagation is immediate on next feed load (within the standard round-trip, well under the 10-minute SC-008 target).

**Rationale**: JSON column for override order avoids renumbering rows. The 10-minute target is massively conservative; the actual latency is the next API call, typically < 1 second.

---

## 6. Existing Codebase Architecture (Critical Context)

**Decision**: All new work is additive to the existing `server.ts` and `src/lib/store.svelte.ts`. These files are working, tested-in-production code (T3). New Hono route handlers are appended in clearly delimited blocks with `// ─── MODULE NAME ───` comments. New store properties are appended at the end of the `appState` object. No existing lines are changed.

**Rationale**: Treats the existing files as stable modules per T1. New state slices and API routes can each be removed independently if needed. No introduction of a new routing framework or state manager.

---

## 7. K–12 Curriculum Component Architecture

**Decision**: Each lesson is a standalone Svelte component under `lessons/components/`, named by hash of `{title}-{subject}-{lessonName}` to guarantee uniqueness and avoid filesystem naming conflicts. The server exposes a `GET /api/lessons/component/:hash` route that returns the component source for lazy-loading by the Academy page. Curriculum JSON files in `lessons/curriculums/` define the ordered list of lesson hashes per grade and subject.

**Rationale**:
- Component-per-lesson allows schools/institutions to override individual lessons without forking entire curriculum files.
- Hashing prevents naming collisions (e.g., "Introduction" appears in Math, Science, and History).
- JSON curriculum files are human-readable and version-controllable.
- Lazy-loading components keeps initial bundle size small.

**Alternatives considered**:
- Single monolithic curriculum JSON with embedded HTML: Rejected — impossible to maintain, no component reuse, violates T1.
- Database-stored lesson content: Rejected — Turso row limits and edit workflow overhead; files are easier for curriculum writers to review in PRs.

---

## 8. Interactive Games in Lessons — Phaser.js (Resolved)

**Decision**: Phaser 3 is installed via `bun add phaser` and imported as a module inside lesson components. This is now ratified in constitution v2.0.0 (T5 named exception + T6 amendment). No CDN loading, no npm.

**Rationale**: User explicitly requested Phaser-backed interactive games (Flappy Bird-style, etc.). Bun's built-in package manager satisfies the "no npm" rule while giving full module access. Phaser is wrapped in Svelte components so surrounding UI still uses Svelte Animations + Tailwind per T5.

**Alternatives considered**:
- CDN script injection: Rejected — violates no-npm/yarn/pnpm spirit and makes dependency versioning harder.
- Svelte-native canvas games: Rejected — feasible but 3–5× effort and reduced fidelity for platformer/physics games.
- Full reimplementation without Phaser: Deferred — not necessary now that constitution permits `bun add phaser`.

**Mitigation for T5 (Design-First)**:
- Every lesson component wraps the Phaser `<canvas>` in a Svelte transition container.
- Game-over, level-complete, and menu overlays use `transition:fly`, `transition:scale`, and Tailwind.
- No CSS `@keyframes` from Phaser leak into the Svelte DOM layer.

---

## 9. Lesson Naming Convention

**Decision**: Component filenames use the pattern `{subject}-{grade}-{slug}-{hash}.svelte`, where `hash` is a short SHA-1 of the lesson title + subject (e.g., `math-g1-numbers-3a7f.svelte`). The hash is stored in the curriculum JSON so Academy can request the exact component path at runtime.

**Rationale**: Human-readable prefix for debugging; hash for collision avoidance and stable references across curriculum edits.

---
