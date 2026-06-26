# Quickstart Validation Guide — Academy Lesson Grid

**Feature**: specs/002-academy-lesson-grid/spec.md
**Prerequisites**: Bun 1.3+, Existing Water Classroom platform running

---

## Setup

```bash
# Start dev server
bun run dev    # → http://localhost:5173
bun run server.ts  # → http://localhost:3000
```

---

## Validation Scenarios

### VS-1: Academy Recents Section (P1)

1. Log in as a student who has completed at least 2 lessons
2. Navigate to Academy page
3. **Expected**: Horizontal scrollable section at top shows thumbnails of recently played lessons
4. **Expected**: Each recents item shows lesson title and completion badge

### VS-2: Subject Grid with Progress (P1)

1. View Academy page
2. **Expected**: Grid below recents shows subjects (Mathematics, Science, etc.)
3. **Expected**: Each subject card shows progress bar or percentage
4. **Expected**: Visual distinction between subjects with different progress levels

### VS-3: Subject Lesson List (P1)

1. Click on "Mathematics" in subject grid
2. **Expected**: Lessons list appears filtered to Mathematics
3. **Expected**: Completed lessons show faded styling with checkmark
4. **Expected**: Incomplete lessons show bright "Continue" button
5. **Expected**: "Continue" button takes user to next incomplete lesson

---

## Acceptance Commands

```bash
# Build verification
bun run build    # Should pass with zero errors

# Type check
bunx svelte-check --workspace .  # Should pass with zero errors
```