# Tasks: Water School — World-Class Online Learning Platform

**Input**: Design documents from `specs/001-world-class-school/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md, constitution v2.0.0

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project-wide dependencies, types, and directory structure shared by all user stories.

- [x] T001 Install Phaser 3 via Bun: run `bun add phaser` from repo root (constitution T5/T6 exception — game engine permitted as Bun dependency)
- [x] T002 [P] Create `lessons/` directory tree: `lessons/curriculums/` and `lessons/components/` at repository root
- [x] T003 [P] Update `src/lib/types.ts` to add `LessonComponent` interface: `{ hash: string; title: string; subject: string; grade: string; componentPath: string; estimatedMinutes: number; interactiveType: 'phaser-game' | 'quiz' | 'scenario' }`
- [x] T004 [P] Add `bun add phaser` to `package.json` dependencies list (verify `bun run build` still passes with Phaser bundle)

**Checkpoint**: Phaser installed, `lessons/` directories exist, types updated.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core curriculum data, lesson component loader, and store slices that MUST be complete before ANY user story can be independently tested.

**CRITICAL**: No user story work can begin until this phase is complete.

### Curriculum JSON Files (K–12)

- [x] T005 [P] Create `lessons/curriculums/k12-mathematics.json` — full K–12 Mathematics curriculum with ordered lesson hashes, each entry: `{ "hash": "...", "title": "...", "grade": "...", "subject": "Mathematics", "interactiveType": "phaser-game", "estimatedMinutes": 10 }`
- [x] T006 [P] Create `lessons/curriculums/k12-science.json` — full K–12 Science curriculum with ordered lesson hashes
- [x] T007 [P] Create `lessons/curriculums/k12-history.json` — full K–12 History curriculum with ordered lesson hashes
- [x] T008 [P] Create `lessons/curriculums/k12-geography.json` — full K–12 Geography curriculum with ordered lesson hashes
- [x] T009 [P] Create `lessons/curriculums/k12-leadership.json` — full K–12 Leadership & Problem-Solving curriculum with ordered lesson hashes

### Lesson Component Loader

- [x] T010 Add `GET /api/lessons/component/:hash` route in `server.ts` — resolves `.svelte` component file from `lessons/components/` by hash, returns component source or 404; caches by hash for performance
- [x] T011 Add `loadLessonComponent(hash: string)` function in `src/lib/store.svelte.ts` — calls `/api/lessons/component/:hash`, stores component source in `appState.currentLessonComponent`, sets `isLessonLoading` / `lessonError`

### Store Slices (continued)

- [x] T012 [P] Add lesson-component state slice to `appState` in `src/lib/store.svelte.ts`: `currentLessonComponent`, `currentLessonHash`, `isLessonLoading`, `lessonError`, plus corresponding setter exports
- [x] T013 Seed `lessons` table in `server.ts` `initDB()` with metadata rows matching all curriculum JSON entries (id, external_id, title, subject, grade_level, lesson_type, content_ref = component hash)

**Checkpoint**: Curriculum JSON files created, lesson loader API works, Academy can lazy-load a lesson component by hash.

---

## Phase 3: User Story 1 — Student Discovers Personalized Curriculum (Priority: P1) 🎯 MVP

**Goal**: Student registers, completes onboarding (grade, homeschool status, country), and sees a personalized lesson feed within 90 seconds. Lessons are now component-based with Phaser interactivity.

**Independent Test**: A new student signs up → completes onboarding → lands on Academy page showing lessons for their country+grade track → taps a lesson → Phaser game or interactive element loads and awards points.

### Implementation for User Story 1

- [x] T014 [P] [US1] Update `src/components/layout/OnboardingDialog.svelte` — add Country selection step using `COUNTRY_CATALOG`, grade-level picker, and homeschool-status toggle; store selections in `appState`
- [x] T015 [US1] Add `handleOnboardingCountrySelect`, `handleOnboardingGradeSelect`, `handleOnboardingComplete` handler functions in `src/lib/store.svelte.ts` to capture `studentCountry`, `studentGradeLevelId`, `studentTrackType`, `enrollmentType`
- [x] T016 [US1] Add `GET /api/curriculum/track` route in `server.ts` — resolves track from `turso_records` (country, gradeLevel, enrollmentType) → `institutions` → `institution_curriculum_overrides` → `curriculum_tracks`, returns ordered lesson hashes from JSON curriculum files
- [x] T017 [US1] Add `GET /api/curriculum/lessons` route in `server.ts` — returns full lesson detail by lesson_id from `lessons` table joined with curriculum JSON metadata
- [x] T018 [US1] Create `loadCurriculumForStudent()` function in `src/lib/store.svelte.ts` — calls `/api/curriculum/track` on login/onboarding complete, populates `trackLessons` and `availableTracks`
- [x] T019 [US1] Update `AcademyPage.svelte` to render lesson cards in a TikTok-style vertical/scrollable layout using lesson feed from `appState.trackLessons`, with Svelte Animations for card entry transitions; tapping a lesson calls `loadLessonComponent(hash)` and renders the component
- [x] T020 [US1] Wire curriculum load trigger in `src/lib/store.svelte.ts` `$effect` so curriculum loads when user transitions to Academy tab and `isOnboarded` is true
- [x] T021 [US1] Add curriculum error boundary and loading skeleton (Tailwind animated pulse) in `AcademyPage.svelte` for `isCurriculumLoading` state

**Checkpoint**: A student can complete onboarding and view a personalized, country-adaptive lesson feed. Tapping a lesson loads its interactive component. Story independently testable.

---

## Phase 4: User Story 2 — Student Learns with AI Tutor & Reinforces Through Games (Priority: P1)

**Goal**: AI tutor is accessible from any lesson context; lesson components contain Phaser-backed interactive games or quizzes; dashboard shows gamification stats (streaks, badges, subject progress).

**Independent Test**: Student opens a lesson → sees narrative story intro → plays Phaser game or answers interactive prompt → earns points → dashboard updates streak/badge/progress.

### Lesson Component Creation — Mathematics (Grade 1)

- [x] T022 [P] [US2] Create `lessons/components/math-g1-numbers-flappy-3a7f1.svelte` — Flappy Bird-style game where the bird is a number and pipes are math problems; correct answer = flap, wrong = fall; awards 10 participation points, 25 bonus for streak of 3 correct
- [x] T023 [P] [US2] Create `lessons/components/math-g1-counting-quiz-9b2e4.svelte` — Interactive counting quiz with Svelte-animated number tiles; student taps correct count; points awarded for any valid attempt
- [x] T024 [P] [US2] Create `lessons/components/math-g1-shapes-identify-4c1d8.svelte` — Shape identification game with clickable 2D/3D shapes; narrative: "You are a shape detective solving the Mystery of the Missing Geometry"

### Lesson Component Creation — Science (Grade 3)

- [x] T025 [P] [US2] Create `lessons/components/science-g3-plants-quiz-9b2e4.svelte` — Plant lifecycle quiz with animated growth stages; narrative: "You are a botanist exploring the Amazon to save endangered species"
- [x] T026 [P] [US2] Create `lessons/components/science-g3-solar-system-flappy-2e5f7.svelte` — Flappy Bird remake where obstacles are planets; student must "orbit" by answering planet-order questions; narrative: "You are a space pilot navigating the asteroid belt"

### Lesson Component Creation — History (Grade 5)

- [x] T027 [P] [US2] Create `lessons/components/history-g5-ancient-egypt-quest-1a2b3.svelte` — Platformer-style game where student collects hieroglyphs; each glyph unlocks a history fact; narrative: "You are an archaeologist exploring a newly discovered tomb"
- [x] T028 [P] [US2] Create `lessons/components/history-g5-american-revolution-choices-4c5d6.svelte` — Interactive scenario: student makes decisions as a colonist; points awarded for any reasoned choice; narrative: "You are a printer in Boston, 1773. The British are coming..."

### Lesson Component Creation — Geography (Grade 4)

- [x] T029 [P] [US2] Create `lessons/components/geography-g4-capitals-flappy-7e8f9.svelte` — Flappy Bird where each pipe is a country; correct capital-city answer = flap; narrative: "You are a globe-trotting reporter filing stories from each capital"
- [x] T030 [P] [US2] Create `lessons/components/geography-g4-continents-quiz-3a4b5.svelte` — Drag-and-drop continent map; points for any valid placement; narrative: "You are a cartographer redrawing the world map after a mysterious sea-level rise"

### Lesson Component Creation — Leadership (Grade 6)

- [x] T031 [P] [US2] Create `lessons/components/leadership-g6-teamwork-scenario-5c6d7.svelte` — Interactive scenario: student leads a team through a crisis; multiple-choice responses; points awarded for any valid answer; narrative: "You are the captain of a research vessel caught in a storm"
- [x] [P] [US2] Create `lessons/components/leadership-g6-problem-solving-escape-8f9g0.svelte` — "Escape room" style Phaser game; puzzles require logic; narrative: "You are a inventor trapped in your own laboratory; solve puzzles to escape"

### Dashboard & Integration

- [x] T032 [US2] Update `handleQuizSubmit()` in `src/lib/store.svelte.ts` to award participation points (10 pts) and bonus points (25 pts) for any lesson interaction, regardless of correctness; update `subjectProgress` and call `updateProgressOnServer`
- [x] T033 [US2] Add badge award logic in `src/lib/store.svelte.ts` `$effect`: streak-7 at 7 days, streak-30 at 30 days; exam-master awarded server-side on verified exam pass
- [x] T034 [US2] Update `DashboardPage.svelte` to compose `StreakCounter`, `BadgeDisplay`, `ProgressBar` using responsive Tailwind grid; each card animates in with `transition:fade` + staggered delay
- [x] T035 [US2] Update `AITutorPage.svelte` to read `appState.currentLessonComponent` and pass `selectedLessonContext` (`lessonTitle + subject + gradeLevel`) to `/api/gemini/tutoring` in every message send

**Checkpoint**: AI tutor is lesson-context-aware, lesson components contain Phaser games or interactive prompts, quizzes award points for engagement, dashboard shows live gamification data. Story independently testable.

---

## Phase 5: User Story 3 — Student Takes a Proctored Exam with AI Identity Verification (Priority: P2)

**Goal**: Student opens a proctored exam, grants camera access, completes the exam, and receives a verified score recorded server-side.

**Independent Test**: Student opens proctored exam → camera activates → exam runs with timer → score recorded as verified or flagged in `exam_attempts` within 5 minutes of submission.

### Implementation for User Story 3

- [x] T036 [P] [US3] Create `src/components/exams/ProctorCamera.svelte` — wraps `<video>` element, calls `navigator.mediaDevices.getUserMedia` at 320×240, exposes `streamRef` and `cameraPermissionGranted` to parent, styled with Tailwind
- [x] T037 [P] [US3] Create `src/components/exams/ExamPlayer.svelte` — renders question card, answer options, timer countdown, proctor log panel; emits `submit` event with answers; uses Svelte Animations for question transitions
- [x] T038 [US3] Add `GET /api/exam/start` route in `server.ts` — validates student enrolled in exam's track, creates `exam_attempts` row with `status = 'in_progress'`, returns questions from `lessons.quiz_ref` and `attempt_id`
- [x] T039 [US3] Add `POST /api/exam/:attemptId/submit` route in `server.ts` — scores answers, updates `exam_attempts` with `score`, `status` (verified or flagged based on `proctor_flags`), awards exam badges if criteria met, updates `student_progress.completedLessons`
- [x] T040 [US3] Add `handleStartExam(examId: string)` and `handleSubmitExam(answers: number[])` functions in `src/lib/store.svelte.ts` — call new API routes, manage proctoring timer interval, stop camera stream on completion via `stopVerifiedProctorExam`
- [x] T041 [US3] Create `src/pages/ExamsPage.svelte` — lists available exams from `trackLessons` filtered by `lesson_type === 'assessment'`, launches `ExamPlayer` + `ProctorCamera` entry flow
- [x] T042 [US3] Wire `ProctorCamera` into `startVerifiedProctorExam()` in `store.svelte.ts` instead of inline `getUserMedia` — extract existing camera logic into a shared callable by both store and component
- [x] T043 [US3] Add `verifiedExamsList` rendering widget in `DashboardPage.svelte` showing scored attempts with verification status badge using Tailwind + Svelte Animations

**Checkpoint**: Proctored exam end-to-end: start → camera → answer → submit → verified score. Story independently testable.

---

## Phase 6: User Story 4 — Student Manages Profile and Views Gamified Dashboard (Priority: P1)

**Goal**: Student sees dashboard with streak, badges, progress; can update profile (name, photo placeholder, grade, notification prefs).

**Independent Test**: Student logs in → dashboard loads within 3 seconds with streak/badges/progress; navigates to Profile → updates display name → change reflected everywhere.

### Implementation for User Story 4

- [x] T044 [P] [US4] Add profile form fields in `src/pages/ProfilePage.svelte`: display name input, grade level selector, country selector (read-only or editable), notification preference toggles — all using Tailwind form styles
- [x] T045 [US4] Add `handleUpdateProfile()` function in `src/lib/store.svelte.ts` — calls `POST /api/update-user` with `email`, `gradeLevel`, `country`, `enrollmentType`; on success, updates local `appState.studentName`, `studentGradeLevelId`, `studentCountry`
- [x] T046 [US4] Update `DashboardPage.svelte` to compose `StreakCounter`, `BadgeDisplay`, `ProgressBar` using responsive Tailwind grid layout with Svelte Animations for page entry
- [x] T047 [US4] Add Svelte Animations for dashboard card load: each badge and progress bar animates in with staggered delay using `transition:fade` and `transition:scale`
- [x] T048 [US4] Wire `DashboardPage` to load progress from `GET /api/progress` on tab activation (verify existing `$effect` populates `streakDisplay`, `badgeCollection`, `subjectProgress` derived fields)
- [x] T049 [US4] Add "upcoming exam date" widget card to `DashboardPage.svelte` pulling from `verifiedExamsList` + `trackLessons` filtered for `is_proctored`

**Checkpoint**: Dashboard loads with gamification data; profile editing works end-to-end. Story independently testable.

---

## Phase 7: User Story 5 — Institution Admin Manages Students, Tutors, and Curriculum (Priority: P2)

**Goal**: Institution admin sees student roster, assigns tutors, and overrides curriculum order per grade/subject.

**Independent Test**: Admin invites student → student appears in roster; admin assigns tutor → tutor appears on student's mentor list; admin reorders lessons → students see new order on next Academy visit.

### Implementation for User Story 5

- [x] T050 [P] [US5] Create `src/school/SchoolDashboardPage.svelte` — top-level institution admin page with tabs: Overview, Roster, Tutors, Analytics, Settings; conditionally rendered when `landingAuthRole === 'institution'`
- [x] T051 [P] [US5] Add `GET /api/institution/roster` route in `server.ts` — queries `turso_records` filtered by `affiliatedCode` or `institution_id` join; returns student list with progress joins from `student_progress`
- [x] T052 [P] [US5] Add `POST /api/institution/roster/invite` route in `server.ts` — creates new `turso_records` entry with `affiliatedCode` set to inviting institution's code
- [x] T053 [US5] Add `POST /api/institution/tutors/assign` route in `server.ts` — links tutor to student via `institution_admins` relationship
- [x] T054 [US5] Add tutor management UI in `src/school/SchoolDashboardPage.svelte` — list tutors, invite new tutor form (name, email, subjects, grade_levels), call `POST /api/institution/tutors`
- [x] T055 [US5] Add `POST /api/institution/tutors` route in `server.ts` — inserts new tutor row bound to `institution_id` from session
- [x] T056 [US5] Add `PUT /api/institution/curriculum/override` route in `server.ts` — upserts `institution_curriculum_overrides` with `ordered_lesson_ids` (JSON array of lesson hashes); validates hashes against `lessons` table
- [x] T057 [US5] Add curriculum override UI in `src/school/SchoolDashboardPage.svelte` — grade/subject picker, ordered list of lesson titles (resolved from hashes), reorder controls (up/down or drag), calls override PUT route
- [x] T058 [US5] Update `loadCurriculumForStudent()` in `store.svelte.ts` to also fetch institution overrides (query `institution_curriculum_overrides` for student's institution + grade + subject) and merge into `trackLessons` before rendering
- [x] T059 [US5] Add institution nav tab entry in `App.svelte` `navTabs` institution branch: `{ key: 'dashboard', label: 'School', icon: Building }` — routes to `SchoolDashboardPage`

**Checkpoint**: Institution admin can manage roster, assign tutors, override curriculum. Changes visible to students on next Academy visit. Story independently testable (requires two user accounts).

---

## Phase 8: User Story 6 — Student Engages in Community (Priority: P3)

**Goal**: Students can browse grade/subject communities, post questions/replies, and upvote content with age-appropriate moderation.

**Independent Test**: Grade 5 student posts question in Science topic → appears in feed; another student upvotes → count increments; K-3 student post is `pending_moderation`.

### Implementation for User Story 6

- [x] T060 [P] [US6] Add `GET /api/community/topics` route in `server.ts` — returns structured topic tree (grade levels → subjects) derived from `curriculum_tracks` or a static mapping
- [x] T061 [P] [US6] Add `GET /api/community/posts` route in `server.ts` — fetches `community_posts` filtered by `grade_level` + `category`, sorted by `created_at DESC`, paginated
- [x] T062 [P] [US6] Add `POST /api/community/posts` route in `server.ts` — inserts post; auto-sets `moderation_status = 'pending_moderation'` if author grade is K–3, else `approved`; returns new post object
- [x] T063 [P] [US6] Add `POST /api/community/posts/:id/like` route in `server.ts` — increments `likes` counter; validates student hasn't already liked (add `post_likes` table if idempotency needed, or use simple increment for MVP)
- [x] T064 [US6] Add community state loader in `src/lib/store.svelte.ts` — `loadCommunityPosts(topicId, subject)` function calling `GET /api/community/posts`
- [x] T065 [US6] Update `src/pages/ForumsPage.svelte` to render topic selector sidebar (grade/subject) and post feed; new-post form at top; upvote button on each post card — all with Svelte Animations + Tailwind
- [x] T066 [US6] Add moderation indicator in `ForumsPage.svelte` for pending posts ("awaiting tutor review") and tutor badge for approved tutors' replies
- [x] T067 [US6] Add Svelte Animations for post list entry (staggered fade-in), like button (scale pulse on click), and new-post form expand/collapse

**Checkpoint**: Community space is functional with topic browsing, posting, and upvoting. Story independently testable.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and enforce design consistency.

- [x] T068 [P] Audit all new Svelte components for Tailwind-only styling — verify no `<style>` blocks or inline `style=` attributes exist in lesson components, AcademyPage, DashboardPage, SchoolDashboardPage, ForumsPage, and all `src/components/**/*.svelte`
- [x] T069 [P] Audit all new components for Svelte Animations usage — ensure `transition:`, `animate:`, `in:`, `out:` directives are applied to interactive elements (card entries, tab switches, button presses, lesson entry transitions)
- [x] T070 [P] Add Svelte Animations for tab navigation in `App.svelte` bottom nav — active tab indicator slide, page content fade transition on `{#if}` switch
- [x] T071 [P] Add loading skeleton states for all new API calls (curriculum load, roster load, community posts, exam start, lesson component load) using Tailwind animated pulse backgrounds
- [x] T072 [P] Add error states and retry buttons for all new API routes (curriculum fetch failure, exam submission failure, community post failure, lesson component load failure)
- [x] T073 Verify custom font loading (branding requirement) is working across all new pages — check Google Fonts or custom `@font-face` in `src/index.css` does not conflict with Tailwind
- [x] T074 Run `quickstart.md` validation scenarios and confirm each passes against the implemented feature
- [x] T075 Verify constitution compliance: T1 (no circular deps), T2 (incremental — each story is independently testable), T5 (Tailwind-only CSS + Svelte Animations applied throughout new UI), T8 (lesson components in `lessons/components/` with Phaser interactivity)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user story phases
- **US1 (Phase 3)**: Depends on Foundational — no dependency on other stories
- **US2 (Phase 4)**: Depends on Foundational — no dependency on US1 (lesson components can be built independently of the feed)
- **US4 (Phase 6)**: Depends on Foundational — no dependency on US1 or US2
- **US3 (Phase 5)**: Depends on Foundational + Lesson/Exam schema seeded in Phase 2 — run in parallel with US1/US2/US4
- **US5 (Phase 7)**: Depends on Foundational + institution tables seeded — run in parallel with student stories
- **US6 (Phase 8)**: Depends on Foundational + community schema seeded — run last (P3, lowest priority)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependency Graph

```
Phase 2 (Foundational)
  ├── Phase 3: US1 — Curriculum Feed (P1) ────┐
  ├── Phase 4: US2 — AI Tutor + Games (P1) ──┤
  ├── Phase 6: US4 — Profile + Dashboard (P1)┤
  ├── Phase 5: US3 — Proctored Exams (P2) ──┤
  ├── Phase 7: US5 — Institution Admin (P2) │
  └── Phase 8: US6 — Community (P3) ───────┘
                 │
            Phase 9: Polish
```

### Within Each User Story

- Database routes and store state come before page components
- Components before page integration
- Core implementation before animation polish
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 can run in parallel (different files)
- **Phase 2**: T005–T009 (curriculum JSON files) can run in parallel; T010–T013 can run in parallel after JSON files exist
- **Phase 3 (US1)**: T014, T016, T017 in parallel; T018/T019/T020/T021 run sequentially
- **Phase 4 (US2)**: T022–T031 (lesson components) can run in parallel (different files); T032–T035 sequential
- **Phase 5 (US3)**: T036, T037 in parallel; T038–T043 sequential
- **Phase 6 (US4)**: T044, T047 in parallel; T045, T046, T048, T049 sequential
- **Phase 7 (US5)**: T050, T051, T052, T054, T056 in parallel; T053, T055, T057, T058, T059 sequential
- **Phase 8 (US6)**: T060, T061, T062, T063 in parallel; T064–T067 sequential
- **Phase 9**: T068, T069, T070, T071, T072 can all run in parallel

### Parallel Example: Phase 2 Foundational

```bash
# Launch all curriculum JSON files in parallel:
Task: "Create lessons/curriculums/k12-mathematics.json"
Task: "Create lessons/curriculums/k12-science.json"
Task: "Create lessons/curriculums/k12-history.json"
Task: "Create lessons/curriculums/k12-geography.json"
Task: "Create lessons/curriculums/k12-leadership.json"

# Launch all lesson components for a grade in parallel:
Task: "Create lessons/components/math-g1-numbers-flappy-3a7f1.svelte"
Task: "Create lessons/components/math-g1-counting-quiz-9b2e4.svelte"
```

---

## Implementation Strategy

### MVP First (User Stories US1 + US2 + US4 Only — P1)

1. Complete Phase 1: Setup (Phaser install, `lessons/` dir, types)
2. Complete Phase 2: Foundational (CRITICAL — curriculum JSON + lesson loader)
3. Complete Phase 3: US1 (Curriculum Feed)
4. **STOP and VALIDATE**: A new student can register, complete onboarding, and see a personalized lesson feed with interactive lesson components
5. Complete Phase 4: US2 (AI Tutor + Games)
6. **STOP and VALIDATE**: AI tutor responds in lesson context; Phaser games load and award points; dashboard reflects updated streak and badge
7. Complete Phase 6: US4 (Profile + Dashboard)
8. **STOP and VALIDATE**: Dashboard loads with gamification stats within 3 seconds; profile editing works
9. Deploy/demo P1 MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Test independently → Deploy/Demo (core value live)
3. Add US2 + US4 → Test independently → Deploy/Demo (P1 complete)
4. Add US3 (Proctored Exams) → Test independently → Deploy/Demo (P2 credential layer)
5. Add US5 (Institution Admin) → Test independently → Deploy/Demo (B2B layer)
6. Add US6 (Community) → Test independently → Deploy/Demo (P3 engagement)
7. Polish (T068–T075) → Final visual/audit pass

### Full Delivery

- 75 tasks across 9 phases
- 50+ explicitly parallelizable tasks marked [P]
- Max critical path (sequential) length: ~15 tasks
- Curriculum scope: 5 K–12 subject tracks, each with multiple interactive lesson components (Flappy Bird remakes, quizzes, scenarios)
- Every lesson awards points for engagement (correctness bonus optional)

---

## Notes

- Tests are OPTIONAL per user input (none specified); no test tasks included unless requested
- All file paths are relative to repository root
- Constitution compliance references: T1 (modular slices + lesson components), T2 (incremental story phases), T3 (no existing files rewritten), T5 (Tailwind-only + Svelte Animations; Phaser is the named exception), T6 (Phaser 3 permitted via `bun add phaser`), T8 (lesson component architecture)
- Existing `server.ts` and `src/lib/store.svelte.ts` are appended only — existing lines are never removed (T3)
- Phaser MUST be imported as a module inside lesson components: `import Phaser from 'phaser'` (Bun-native, not CDN)
