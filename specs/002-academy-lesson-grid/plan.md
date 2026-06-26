# Implementation Plan: Academy Lesson Grid

**Branch**: `002-academy-lesson-grid` | **Date**: 2026-06-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-academy-lesson-grid/spec.md`

## Summary

Enhance the Academy page with a horizontal recents section at top, subject grid with progress indicators, and lesson list view with completed/incomplete visual distinction. Uses existing Svelte 5 runes state and Tailwind styling.

## Technical Context

**Language/Version**: TypeScript 5.8 / Bun 1.3

**Primary Dependencies**: Svelte 5 (runes mode), Tailwind CSS v4, lucide-svelte

**Storage**: Uses existing `appState.trackLessons`, `appState.subjectProgress`, `appState.progress.completedLessons`

**Testing**: Manual / Browser-based

**Target Platform**: Web (desktop + mobile responsive)

**Project Type**: Frontend enhancement (single-page application)

**Performance Goals**: Page load < 1s, smooth horizontal scroll, instant filter

**Constraints**: Tailwind-only CSS (T5), Svelte Animations for transitions (T5), existing store is sacred (T3)

## Constitution Check

All gates pass - this is a frontend-only enhancement using existing patterns.

## Project Structure

### Documentation (this feature)

```text
specs/002-academy-lesson-grid/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── AcademyPage.svelte    # Enhanced with recents + subject grid
└── components/
    └── lessons/
        └── LessonRecents.svelte  # New: horizontal recents component
```

**Structure Decision**: Single project enhancement - modify existing AcademyPage.svelte, add new component for recents section.