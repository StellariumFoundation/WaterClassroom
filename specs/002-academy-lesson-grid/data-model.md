# Data Model: Academy Lesson Grid

**Feature**: specs/002-academy-lesson-grid/spec.md
**Basis**: Reuses existing data from `specs/001-world-class-school/data-model.md`

## Entities Used (No New Tables)

This enhancement uses existing entities from the parent feature:

| Entity | Source | Usage |
|--------|--------|-------|
| `trackLessons` | `curriculum_tracks.lesson_ids` | List of all lessons in student's track |
| `completedLessons` | `student_progress.completedLessons` | JSON array of completed lesson IDs |
| `subjectProgress` | `appState.subjectProgress` | Calculated client-side per subject |

## Derived Data

### Recent Lessons
Calculated from `completedLessons` — most recent 3-5 lessons shown in horizontal recents.

### Subject Progress Percentage
```
Math Progress = (Math lessons completed) / (Total Math lessons in track) * 100
```