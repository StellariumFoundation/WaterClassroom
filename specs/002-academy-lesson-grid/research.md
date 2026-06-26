# Research: Academy Lesson Grid

**Feature**: specs/002-academy-lesson-grid/spec.md
**Date**: 2026-06-21

## Technical Decisions

All decisions determined by existing project patterns (T3: existing code is sacred).

### 1. Horizontal Recents Section

**Decision**: Use existing `appState.progress.completedLessons` to determine which lessons to show, display as horizontal scrollable container with Tailwind `flex` and `overflow-x-auto`.

**Rationale**: Reuses existing progress tracking, no new state needed.

### 2. Subject Progress Calculation

**Decision**: Calculate progress client-side from `appState.trackLessons` filtered by subject, using `appState.progress.completedLessons` as completed set.

**Rationale**: No additional API calls needed; progress data already loaded.

### 3. Visual Distinction for Completed Lessons

**Decision**: Use Tailwind styling: completed lessons get `opacity-60` and checkmark icon; incomplete lessons show bright "Continue" button.

**Rationale**: Follows existing styling patterns in the project.

### 4. Continue Button Logic

**Decision**: Find next incomplete lesson in sequence, use `loadLessonComponent(hash)` to navigate. If all complete, show "All Done!" text.

**Rationale**: Reuses existing lesson loading infrastructure.