# Tasks: Academy Lesson Grid

**Input**: Design documents from `specs/002-academy-lesson-grid/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are OPTIONAL - not requested for this feature

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization

- [X] T001 Review existing AcademyPage.svelte structure for integration points

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must be complete before user story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Verify `appState.trackLessons` and `appState.subjectProgress` contain necessary data for subject grid

---

## Phase 3: User Story 1 - Academy Recents Section (Priority: P1) 🎯 MVP

**Goal**: Display horizontal section of recently played lessons at top of Academy page

**Independent Test**: Student views Academy page, sees horizontal scrollable list of completed/in-progress lessons

### Implementation for User Story 1

- [X] T003 [P] [US1] Add `recentlyPlayedLessons` derived state in AcademyPage.svelte from `appState.progress.completedLessons`
- [X] T004 [US1] Create horizontal recents container in AcademyPage.svelte with Tailwind `flex overflow-x-auto`
- [X] T005 [US1] Style recents lesson cards with thumbnail, title, and completion badge using Tailwind
- [X] T006 [US1] Add click handler to recents items to load lesson via `loadLessonComponent()`

---

## Phase 4: User Story 1 Continued - Subject Grid with Progress (Priority: P1)

**Goal**: Display grid of subjects with progress indicators

### Implementation for User Story 1

- [X] T007 [US1] Extract unique subjects from `appState.trackLessons` into `availableSubjects` array
- [X] T008 [US1] Create subject grid component in AcademyPage.svelte using `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- [X] T009 [US1] Calculate and display subject progress percentage per subject
- [X] T010 [US1] Add click handler to subject cards to filter lessons by subject and show subject view
- [X] T011 [US1] Style subject cards with progress bar/indicator using Tailwind

---

## Phase 5: User Story 1 Continued - Subject Lesson List (Priority: P1)

**Goal**: Show filtered lessons list with completed/incomplete visual distinction and Continue button

### Implementation for User Story 1

- [X] T012 [US1] Add `selectedSubject` state to track active subject filter
- [X] T013 [US1] Show "Continue" button at top of lesson list if student has in-progress lesson in subject
- [X] T014 [US1] Style completed lessons with `opacity-60` and checkmark icon, incomplete lessons with bright "Continue" button
- [X] T015 [US1] Add `filteredLessons` derived from `appState.trackLessons` filtered by selected subject
- [X] T016 [US1] Add back button to return to subject grid view

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T017 [P] Add horizontal scroll snap behavior to recents section
- [X] T018 [P] Add `transition:fly` animations for subject grid item entry
- [X] T019 [P] Add `transition:fade` for subject view enter/exit
- [X] T020 Run build and type check to verify zero errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS user story work
- **User Story 1 (Phase 3-5)**: Depends on Foundational phase - can be implemented together

### Parallel Opportunities

- Tasks T003, T004, T005 can run in parallel (different sections of AcademyPage)
- Tasks T007-T011 can run in parallel (subject grid implementation)
- Tasks T017-T019 can run in parallel (polish)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phases 3-5: User Story 1 (all Academy grid enhancements)
4. **STOP and VALIDATE**: Student can see recents, subject grid, filtered lessons with visual distinction

---

## Notes

- All tasks use existing state from `appState` (T3 compliance)
- No new database tables or API endpoints required
- Tailwind-only CSS (T5 compliance)
- Lesson components in `lessons/components/` reused (T8 compliance)