# Data Model: Water School Platform

**Feature**: specs/001-world-class-school/spec.md
**Database**: Turso (libSQL / SQLite-compatible)
**Generated from**: Key Entities in spec.md § Key Entities

---

## Entity Relationship Overview

```text
Institution
  ├── InstitutionAdmin (1:N)
  ├── Student (many, via enrollment code)
  ├── Tutor (1:N)
  └── InstitutionCurriculumOverride (1:N)

Student
  ├── StudentProgress (1:1, shared id)
  ├── ExamAttempt (1:N)
  ├── Badge (1:N through unlockedBadges JSON)
  └── CommunityPost (1:N as author)

CurriculumTrack
  ├── Lesson (1:N, ordered)
  └── Exam (1:N, optional per track)

Lesson
  └── (tags: subject, grade, estimatedMinutes, lessonType)

Exam
  └── ExamAttempt (1:N)

Tutor
  └── Student (1:N assignment)
```

---

## Table Definitions

### `institutions`

Extends the concept currently encoded in `turso_records.type = 'Institution'`. New table to hold institution-specific metadata.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | FK to `turso_records.id` |
| `name` | TEXT | NOT NULL | Display name |
| `representative_name` | TEXT | NOT NULL | Contact admin name |
| `country` | TEXT | DEFAULT '' | Institution HQ country |
| `grade_range` | TEXT | DEFAULT 'K-12' | e.g. 'K-5', 'K-12', 'K-Grad' |
| `billing_cycle` | TEXT | DEFAULT 'Monthly' | Monthly or Yearly |
| `student_volume` | INTEGER | DEFAULT 1 | Licensed seats |
| `created_at` | TEXT | NOT NULL | ISO 8601 |

```sql
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  representative_name TEXT NOT NULL,
  country TEXT DEFAULT '',
  grade_range TEXT DEFAULT 'K-12',
  billing_cycle TEXT DEFAULT 'Monthly',
  student_volume INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);
```

---

### `tutors`

Real human tutors assigned by an institution admin.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | |
| `institution_id` | TEXT | NOT NULL | FK → institutions.id |
| `name` | TEXT | NOT NULL | Display name |
| `email` | TEXT | NOT NULL | Login / contact email |
| `subjects` | TEXT | DEFAULT '[]' | JSON array of subjects |
| `grade_levels` | TEXT | DEFAULT '[]' | JSON array of grades |
| `created_at` | TEXT | NOT NULL | ISO 8601 |

```sql
CREATE TABLE IF NOT EXISTS tutors (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subjects TEXT DEFAULT '[]',
  grade_levels TEXT DEFAULT '[]',
  created_at TEXT NOT NULL
);
```

---

### `institution_admins`

Maps users to institution admin role. Uses `turso_records.id` as the user identifier.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | Auto UUID (idempotent) |
| `user_id` | TEXT | NOT NULL UNIQUE | FK → turso_records.id |
| `institution_id` | TEXT | NOT NULL | FK → institutions.id |
| `role` | TEXT | DEFAULT 'admin' | admin / super_admin |
| `created_at` | TEXT | NOT NULL | |

```sql
CREATE TABLE IF NOT EXISTS institution_admins (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  institution_id TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TEXT NOT NULL
);
```

---

### `curriculum_tracks`

Master catalog of curriculum tracks per country, grade, and track type.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | e.g. `track-US-5-commoncore` |
| `country_code` | TEXT | NOT NULL | ISO 3166-1 alpha-2 |
| `country_name` | TEXT | NOT NULL | e.g. 'United States' |
| `grade_level` | TEXT | NOT NULL | e.g. 'K', '1', ..., '12', 'UG' |
| `track_type` | TEXT | NOT NULL | 'country_standard' or 'homeschool_fallback' |
| `display_name` | TEXT | NOT NULL | e.g. 'US Common Core — Grade 5' |
| `lesson_ids` | TEXT | DEFAULT '[]' | JSON array, ordered |
| `is_default` | INTEGER | DEFAULT 0 | 1 = fallback when no match |
| `created_at` | TEXT | NOT NULL | |

```sql
CREATE TABLE IF NOT EXISTS curriculum_tracks (
  id TEXT PRIMARY KEY,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  track_type TEXT NOT NULL,
  display_name TEXT NOT NULL,
  lesson_ids TEXT DEFAULT '[]',
  is_default INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
```

---

### `lessons`

Individual learning units. Currently lesson data lives in `src/lib/lessonsData.ts`. This table references those via `external_id`.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | |
| `external_id` | TEXT | UNIQUE | Links to `lessonsData.ts` entry |
| `title` | TEXT | NOT NULL | |
| `description` | TEXT | DEFAULT '' | Short description |
| `subject` | TEXT | NOT NULL | Math, Science, English, etc. |
| `grade_level` | TEXT | NOT NULL | |
| `lesson_type` | TEXT | DEFAULT 'content' | content / game / assessment |
| `estimated_minutes` | INTEGER | DEFAULT 5 | |
| `content_ref` | TEXT | DEFAULT '' | Relative path or key for content |
| `quiz_ref` | TEXT | DEFAULT '' | FK to `QUIZZES` array key |
| `created_at` | TEXT | NOT NULL | |

```sql
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  external_id TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  lesson_type TEXT DEFAULT 'content',
  estimated_minutes INTEGER DEFAULT 5,
  content_ref TEXT DEFAULT '',
  quiz_ref TEXT DEFAULT '',
  created_at TEXT NOT NULL
);
```

---

### `exams`

Formal assessments, optionally flagged as proctored.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | |
| `track_id` | TEXT | NOT NULL | FK → curriculum_tracks.id |
| `lesson_id` | TEXT | NOT NULL | FK → lessons.id |
| `is_proctored` | INTEGER | DEFAULT 0 | 1 = requires camera |
| `duration_seconds` | INTEGER | DEFAULT 600 | |
| `passing_score` | REAL | DEFAULT 0.7 | 0.0 – 1.0 |
| `is_verified` | INTEGER | DEFAULT 1 | 1 = verified credential |
| `created_at` | TEXT | NOT NULL | |

```sql
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  is_proctored INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 600,
  passing_score REAL DEFAULT 0.7,
  is_verified INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);
```

---

### `exam_attempts`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | |
| `student_id` | TEXT | NOT NULL | FK → turso_records.id |
| `exam_id` | TEXT | NOT NULL | FK → exams.id |
| `score` | REAL | | 0.0 – 1.0 |
| `max_score` | REAL | DEFAULT 1.0 | |
| `proctor_flags` | TEXT | DEFAULT '[]' | JSON array of flag objects |
| `camera_authorized` | INTEGER | DEFAULT 0 | |
| `identity_scan_ref` | TEXT | DEFAULT '' | S3/temp URL or base64 thumbnail |
| `status` | TEXT | DEFAULT 'completed' | in_progress / flagged / verified / voided |
| `started_at` | TEXT | | ISO 8601 |
| `completed_at` | TEXT | | ISO 8601 |

```sql
CREATE TABLE IF NOT EXISTS exam_attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  exam_id TEXT NOT NULL,
  score REAL,
  max_score REAL DEFAULT 1.0,
  proctor_flags TEXT DEFAULT '[]',
  camera_authorized INTEGER DEFAULT 0,
  identity_scan_ref TEXT DEFAULT '',
  status TEXT DEFAULT 'completed',
  started_at TEXT,
  completed_at TEXT
);
```

---

### `badges`

Canonical badge definitions + per-student unlock records.

**Badge definitions** (server-authoritative catalog):

| id | name | description | criteria_type |
|----|------|-------------|---------------|
| `pioneer` | First Principles Pioneer | Completed a Creed track lesson | lesson_completed |
| `engineer` | Systems Engineer | Completed a Scitech quiz perfectly | quiz_perfect |
| `builder` | Value Builder | Completed a Business lesson | lesson_completed |
| `philosopher` | Natural Philosopher | Completed a Dynamics lesson | lesson_completed |
| `streak-7` | Weekly Warrior | 7-day streak maintained | streak_days |
| `streak-30` | Monthly Scholar | 30-day streak maintained | streak_days |
| `exam-master` | Verified Scholar | Passed a proctored exam | exam_passed |

Per-student unlock record is embedded in `student_progress.unlockedBadges` (JSON array of badge `id` strings) for fast lookups.

---

### `institution_curriculum_overrides`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | |
| `institution_id` | TEXT | NOT NULL | FK → institutions.id |
| `grade_level` | TEXT | NOT NULL | |
| `subject` | TEXT | NOT NULL | |
| `ordered_lesson_ids` | TEXT | NOT NULL | JSON array |
| `created_by` | TEXT | NOT NULL | admin user_id |
| `updated_at` | TEXT | NOT NULL | ISO 8601 |

```sql
CREATE TABLE IF NOT EXISTS institution_curriculum_overrides (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  ordered_lesson_ids TEXT NOT NULL,
  created_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

---

### `community_posts`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | |
| `author_id` | TEXT | NOT NULL | FK → turso_records.id |
| `author_name` | TEXT | NOT NULL | Denormalized for display |
| `author_level` | INTEGER | DEFAULT 1 | |
| `title` | TEXT | NOT NULL | |
| `content` | TEXT | NOT NULL | |
| `likes` | INTEGER | DEFAULT 0 | |
| `replies` | INTEGER | DEFAULT 0 | |
| `category` | TEXT | DEFAULT 'General' | Subject/topic tag |
| `grade_level` | TEXT | DEFAULT 'all' | Grade scope of post |
| `moderation_status` | TEXT | DEFAULT 'approved' | pending / approved / removed |
| `created_at` | TEXT | NOT NULL | ISO 8601 |

```sql
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_level INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  category TEXT DEFAULT 'General',
  grade_level TEXT DEFAULT 'all',
  moderation_status TEXT DEFAULT 'approved',
  created_at TEXT NOT NULL
);
```

---

## Existing Tables Unchanged

- `turso_records` — students and institutions (already stores `country`, `gradeLevel`, `enrollmentType`, `isOnboarded`)
- `student_progress` — points, streakDays, level, completedLessons, unlockedBadges, lastActiveDate
- `tasks` — existing task entity (not modified)
- `sessions` — session tokens (not modified)

---

## State Transitions

### Exam Attempt

```
not_started → in_progress → verified   (all checks pass)
                    → flagged      (identity/anomaly detected)
                    → voided       (manual human review decision)
```

### Institution Curriculum Override Lifecycle

```
created (by admin) → active → updated (new ordered_lesson_ids)
                   → deleted (admin removes override; canonical track used)
```
