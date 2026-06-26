# API Contracts — Water School Hono Routes

**Feature**: specs/001-world-class-school/spec.md
**Server**: `server.ts` (Hono app at `/api/*`)
**Format**: Hono route signature — Request → Response

All new routes are appended to the existing `server.ts` Hono app. Existing routes are NOT modified.

---

## New Auth Middleware

```
middleware: requireSession(c) → { userId: string } | Response 401
```
Extracts `session` cookie, validates against `sessions` table. Injects `c.set('userId', id)`.
Applied to all student/institution routes below.

---

## `GET /api/curriculum/track`

**Description**: Returns the ordered list of lesson IDs for a student's current track.

**Query params**: `user_id` (from session) — resolved from cookie automatically.

**Response 200**:
```json
{
  "track_id": "track-US-5-commoncore",
  "display_name": "US Common Core — Grade 5",
  "grade_level": "5",
  "country_code": "US",
  "lessons": [
    { "id": "lesson-01", "title": "...", "lesson_type": "content|game|assessment", "estimated_minutes": 5 }
  ]
}
```

**Logic**: Joins `turso_records` → `institutions` (if school student) → `institution_curriculum_overrides` → `curriculum_tracks` → resolves ordered `lesson_ids` → looks up each in `lessons` table. Institution override wins over canonical track.

---

## `GET /api/curriculum/lessons`

**Description**: Full lesson detail for a given lesson ID.

**Query params**: `lesson_id`

**Response 200**:
```json
{
  "id": "lesson-01",
  "title": "...",
  "description": "...",
  "subject": "Mathematics",
  "grade_level": "5",
  "lesson_type": "content",
  "estimated_minutes": 5,
  "content_ref": "math-fractions-01",
  "quiz_ref": "quiz-math-01"
}
```

**404**: Lesson not found.

---

## `POST /api/exam/start`

**Description**: Initiates a proctored exam session. Activates camera expectation.

**Auth**: student only

**Request body**:
```json
{ "exam_id": "exam-01" }
```

**Response 200**:
```json
{
  "exam_id": "exam-01",
  "duration_seconds": 600,
  "questions": [
    { "id": "q1", "text": "...", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 0 }
  ],
  "attempt_id": "attempt-<timestamp>"
}
```

**Logic**: Creates `exam_attempts` row with `status = 'in_progress'`, returns questions from `lessons.quiz_ref`.

---

## `POST /api/exam/:attemptId/submit`

**Description**: Submits an exam attempt for scoring.

**Auth**: student only

**Request body**:
```json
{ "answers": [0, 2, 1, ...] }
```

**Response 200**:
```json
{
  "attempt_id": "attempt-<timestamp>",
  "score": 0.85,
  "passed": true,
  "verified": true,
  "proctor_flags": [],
  "status": "verified"
}
```

**Logic**: Scores answers against correctAnswerIndex. Writes to `student_progress.completedLessons`. Awards badges if criteria met.

---

## `GET /api/institution/roster`

**Description**: Returns all students linked to the admin's institution.

**Auth**: institution only (`landingAuthRole === 'institution'`)

**Response 200**:
```json
{
  "institution_id": "turso-1",
  "students": [
    {
      "id": "turso-99",
      "name": "...",
      "email": "...",
      "grade_level": "5",
      "enrollment_type": "school-student",
      "points": 1200,
      "streak_days": 5,
      "level": 3,
      "last_active": "2026-06-20"
    }
  ]
}
```

---

## `POST /api/institution/roster/invite`

**Description**: Admin invites a new student to their institution.

**Auth**: institution only

**Request body**:
```json
{ "name": "...", "email": "...", "grade_level": "5", "enrollment_type": "school-student" }
```

**Response 201**: Created student record with institution code as affiliate code.

---

## `POST /api/institution/tutors/assign`

**Description**: Assigns a real tutor to a specific student.

**Auth**: institution only

**Request body**:
```json
{ "tutor_id": "tutor-01", "student_id": "turso-99" }
```

**Response 200**:
```json
{ "success": true, "tutor": { "id": "tutor-01", "name": "Ms. Rivera", "email": "..." } }
```

**Logic**: Writes `student.tutor_id` (add column to `turso_records`) or maintains mapping table. For MVP, adding `assigned_tutor_id` column to `turso_records` is acceptable (T3: adds column, does not modify existing data).

---

## `PUT /api/institution/curriculum/override`

**Description**: Institution admin sets a custom lesson order for a grade-level + subject.

**Auth**: institution only

**Request body**:
```json
{ "grade_level": "5", "subject": "Science", "ordered_lesson_ids": ["lesson-11", "lesson-03", "lesson-07"] }
```

**Response 200**:
```json
{ "success": true, "override_id": "override-<timestamp>" }
```

**Logic**: Creates or updates `institution_curriculum_overrides` row. Frontend polls this endpoint or uses it at feed load time.

---

## `GET /api/community/topics`

**Description**: Lists available community topic structures.

**Auth**: any authenticated user

**Response 200**:
```json
{
  "topics": [
    { "id": "grade-5", "label": "Grade 5", "subtopics": ["All", "Mathematics", "Science", "English"] },
    { "id": "grade-6", "label": "Grade 6", ... }
  ]
}
```

---

## `GET /api/community/posts`

**Description**: Fetches community posts for a given topic.

**Query params**: `topic_id` (e.g. `grade-5`), `subject` (optional), `limit` (default 20), `offset` (default 0)

**Response 200**:
```json
{
  "posts": [
    { "id": "post-1", "author_name": "...", "author_level": 3, "title": "...", "content": "...", "likes": 12, "replies": 4, "category": "Mathematics", "created_at": "..." }
  ]
}
```

---

## `POST /api/community/posts`

**Description**: Student creates a new community post.

**Auth**: student only

**Request body**:
```json
{ "title": "...", "content": "...", "category": "Science", "grade_level": "5" }
```

**Response 201**:
```json
{ "id": "post-<timestamp>", "status": "approved|pending_moderation" }
```

**Logic**: Posts from students with `gradeLevel` equivalent to K–3 are `pending_moderation` by default (FR-012 edge case). Others are auto-approved.

---

## `POST /api/community/posts/:id/like`

**Description**: Student upvotes a community post.

**Auth**: student only

**Response 200**:
```json
{ "id": "post-1", "likes": 13 }
```

---

## Existing Routes — Unchanged

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/records | List all institution records |
| POST | /api/register | New user registration |
| POST | /api/login | Login |
| POST | /api/logout | Logout |
| GET | /api/session | Current session |
| GET | /api/progress | Student progress |
| POST | /api/progress | Update student progress |
| GET | /api/tasks | List tasks |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/:id | Update task |
| POST | /api/update-user | Update user fields |
| POST | /api/activate-user | Activate user after payment |
| POST | /api/create-checkout-session | Stripe checkout |
| POST | /api/gemini/tutoring | AI tutor proxy |
