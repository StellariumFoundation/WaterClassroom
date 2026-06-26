# Feature Specification: Academy Lesson Grid

**Feature Branch**: `002-academy-lesson-grid`

**Created**: 2026-06-21

**Status**: Draft

**Input**: User description: "on the academy acreen it should appear, the games the user has already played in a horizontal section on top and below a grid of all of the subjects of the chosen track lets say it is commom more it it has math enhlish literature with the progress of the user on each subjects, then when ypu click on these subjects it should appears all of the classes in a list, a continue button on top with the current class, and the not completedclasses are marked diferent the completed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Student Views Academy Dashboard with Played Games (Priority: P1)

A student opens the Academy page and sees a horizontal scrollable section at the top showing games/lessons they have already played, followed by a grid of subjects for their curriculum track (e.g., Math, English, Literature) with visual progress indicators, and when clicking a subject, they see lessons in a list with clear distinction between completed and incomplete items.

**Why this priority**: This improves navigation and engagement by showing progress at a glance and making it easy to continue learning.

**Independent Test**: Student logs in, navigates to Academy, sees recent lessons at top, scrolls horizontally to view played games, views subject grid with progress bars, clicks a subject, sees filtered lessons list with completed/incomplete styling.

**Acceptance Scenarios**:

1. **Given** a student is on the Academy page, **When** they look at the top section, **Then** they see a horizontal scrollable list of lessons they have played (completed or in-progress).
2. **Given** a student views the subject grid, **When** they see each subject card, **Then** each card shows the subject name and a visual progress indicator (percentage or bar).
3. **Given** a student clicks on a subject like "Mathematics", **When** the lessons list appears, **Then** completed lessons have a distinct visual style (e.g., faded, checkmark badge) and incomplete lessons show a "Continue" or "Start" button.
4. **Given** a student has a current lesson in progress, **When** they look at the top of the subject view, **Then** they see a "Continue" button that takes them to the next lesson in sequence.

---

### User Story 2 — Student Interacts with Subject Progress (Priority: P2)

A student can track their progress per subject and understand which lessons remain to complete the track.

**Why this priority**: Progress visualization motivates continued engagement.

**Independent Test**: Student views Academy, sees subject percentages, identifies incomplete lessons, clicks Continue on a subject to resume learning.

**Acceptance Scenarios**:

1. **Given** a student views a subject card, **When** they see the progress indicator, **Then** they can tell how many lessons they have completed versus total in that subject.
2. **Given** a student has completed all lessons in a subject, **When** they view that subject card, **Then** it shows 100% completion and may display a completion badge.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Academy page MUST display a horizontal section at the top showing recently played lessons.
- **FR-002**: The Academy page MUST display a grid of subjects for the student's curriculum track.
- **FR-003**: Each subject card MUST show a visual progress indicator.
- **FR-004**: Clicking a subject MUST display a list of lessons filtered to that subject.
- **FR-005**: Completed lessons MUST have distinct visual styling different from incomplete lessons.
- **FR-006**: The current lesson in progress MUST have a visible "Continue" button.

### Key Entities

- **AcademyLesson**: Summary view of a lesson (id, title, completed status, last played date, subject)
- **SubjectProgress**: Progress data for a subject (subject name, completed count, total count, percentage)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can identify their progress in any subject within 3 seconds of loading Academy.
- **SC-002**: Students can resume a lesson from the Continue button in under 2 clicks.
- **SC-003**: Completed lessons are visually distinguishable from incomplete lessons with 95% accuracy in user testing.

## Assumptions

- Progress data is already available in `appState.subjectProgress` and `appState.trackLessons`.
- The existing lesson component architecture supports the horizontal recents section.
- Visual styling follows existing Tailwind patterns in the project.