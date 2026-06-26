# Quickstart Validation Guide — Water School Platform

**Feature**: specs/001-world-class-school/spec.md
**Prerequisites**: Bun 1.3+, Node 18+ (for @hono/node-server), Turso account with `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` configured as environment variables, Gemini API key in `GEMINI_API_KEY` (for AI tutor).

---

## Setup

```bash
# From the repository root
bun install

# Start dev server
bun run dev     # → http://localhost:5173 (SvelteKit dev via bun-plugin-svelte)

# In another terminal, start API server
bun run server.ts  # → http://localhost:3000
```

> Note: If `bun run dev` starts both, consult `dev.ts`. If a separate server start is needed, run `bun run server.ts` in a second terminal.

Run database migrations (init is automatic on server start):
```bash
bun run server.ts   # initDB() creates all tables including new ones
```

---

## Validation Scenarios

Each scenario maps to a user story in the spec. Verify in a browser or with curl.

### VS-1: Onboarding → Personalized Curriculum Feed (P1 / US1)

1. Open `http://localhost:5173` → click **Register** → choose **Water Student**
2. Fill name, email, password → submit
3. Complete onboarding steps: Country = "United States", Grade = "5", Homeschool status = "No"
4. After onboarding completes, navigate to **Academy**
5. **Expected**: Academy page shows a list of Grade 5 US Common Core lessons. Each item displays title + subject tag + estimated minutes.

**Automated check**:
```bash
curl -s http://localhost:3000/api/curriculum/track \
  -H "Cookie: session=<your_session_token>" | jq '.grade_level'
# Expected: "5"
```

---

### VS-2: AI Tutor + Gamification (P1 / US2 + US4)

1. While logged in as a Grade 5 student, open **AI Tutor** tab
2. Type "Explain fractions" (or any grade-appropriate question)
3. **Expected**: Tutor responds with markdown, age-appropriate explanation, references current curriculum track if open from a lesson
4. Navigate to **Dashboard**
5. **Expected**: Shows numeric streak (count), at least one badge icon, and a subject progress bar
6. Complete any available quiz in Academy with a perfect score
7. **Expected**: A new badge appears in `appState.progress.unlockedBadges` and the progress bar advances

**Automated check**:
```bash
curl -s http://localhost:3000/api/progress \
  -H "Cookie: session=<token>" | jq '{streak: .streakDays, badges: (.unlockedBadges | length)}'
# Expected: points > 0, badges >= 1
```

---

### VS-3: Proctored Exam with Camera (P2 / US3)

1. Navigate to **Academy** → open a lesson tagged `is_proctored = true` (seed exams if needed)
2. Click **Start Exam**
3. **Expected**: Browser prompts for camera permission. Exam timer starts counting down. Proctor log panel shows periodic status messages.
4. Submit answers before timer expires
5. **Expected**: Score page shows verified score. `exam_proctor_status` = `verified` in `exam_attempts` table (or `flagged` if triggers hit on test device)

**Automated check**:
```sql
SELECT id, status, score FROM exam_attempts ORDER BY started_at DESC LIMIT 1;
-- Expected: status = 'verified' or 'flagged', score is a number
```

---

### VS-4: Institution Admin — Roster + Curriculum Override (P2 / US5)

1. Log in as an institution admin (use seeded Institution record or create one via Register → Institution)
2. Open **School** tab (institution dashboard)
3. **Expected**: Roster table shows at least 0 students. "Invite Student" form visible.
4. Click **Invite Student** → fill form → submit
5. **Expected**: New student appears in roster list
6. Navigate to **Curriculum Override** section
7. Select Grade 5, Subject "Science", reorder lessons → Save
8. As a student assigned to that institution, open Academy
9. **Expected**: Lessons appear in the admin-specified order

---

### VS-5: Community Space (P3 / US6)

1. As a student in Grade 5, open **Forums** tab
2. Select topic "Grade 5" / subject "Science"
3. Click **New Post** → submit title + content
4. **Expected**: Post appears in the feed immediately (or as "pending" for K-3 students)
5. Click **Upvote** on another post
6. **Expected**: Like count increments

**Automated check**:
```bash
curl -s "http://localhost:3000/api/community/posts?topic_id=grade-5" | jq '.posts | length'
# Expected: >= 1
```

---

## Schema Verification

After running `bun run server.ts` (which calls `initDB()`), verify all tables exist:

```sql
SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
-- Expected: turso_records, student_progress, tasks, sessions,
--           institutions, tutors, institution_admins,
--           curriculum_tracks, lessons, exams, exam_attempts,
--           institution_curriculum_overrides, community_posts
```

---

## Known Limits in Phase 1

- Proctoring camera analysis is a stub (frame captured but no server-side VLM inference yet)
- Curriculum catalog is seeded only for US Common Core + homeschool fallback; other country tracks require manual seed data
- Community moderation is manual-admin review (no auto-moderation pipeline)
- Badges are client-verified on quiz complete; server-side anti-cheat is not implemented
