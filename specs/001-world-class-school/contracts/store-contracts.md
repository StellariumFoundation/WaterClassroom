# Store Contracts — Svelte 5 Runes State Slices

**Feature**: specs/001-world-class-school/spec.md
**File**: `src/lib/store.svelte.ts` — **appended only, no existing lines changed**

The global reactive state object `appState` is a `$state()` record. The sections below show the new property groups to be appended at the end of the existing object (after the `calcRewardMultiplier` and related fields).

---

## Curriculum State

Added within the existing `appState` object.

```typescript
// Curriculum
selectedLesson: null as Lesson | null,
activeQuiz: null as Quiz | null,
// ... (existing fields continue)
```

New fields (append after existing `selectedLesson` / `activeQuiz` block):

```typescript
// Curriculum tracks and lesson feed
currentTrackId: "" as string,
currentTrackDisplayName: "" as string,
trackLessons: [] as Array<{ id: string; title: string; lesson_type: string; estimated_minutes: number }>,
availableTracks: [] as Array<{ id: string; country_code: string; grade_level: string; display_name: string }>,
countryCatalog: [] as Array<{ code: string; name: string }>,
isCurriculumLoading: false,
curriculumError: "" as string,
```

**Setter functions to export**:
- `setCurrentTrackId(v: string)`
- `setTrackLessons(v: [...])`
- `setAvailableTracks(v: [...])`
- `setCountryCatalog(v: [...])`
- `setIsCurriculumLoading(v: boolean)`
- `setCurriculumError(v: string)`

**Load trigger**: On login / onboarding complete, call `GET /api/curriculum/track` → populate `currentTrackId`, `trackLessons`.

---

## Gamification State

```typescript
// Gamification
streakDisplay: 0,
currentLevel: 1,
totalPoints: 0,
badgeCollection: [] as string[],
recentBadges: [] as string[],
nextBadgeToEarn: "" as string,
nextBadgeProgress: 0,
subjectProgress: {} as Record<string, number>, // { "Mathematics": 0.15, "Science": 0.0 }
```

**Rationale**: Decoupled from the base `progress` object to allow the dashboard to reactively update without re-loading the full progress record. Synced to server via `updateProgressOnServer` whenever values change.

---

## Proctoring Exam State (extends existing)

Existing proctoring fields in `appState` (`isExamProctoring`, `cameraPermissionGranted`, `examTimer`, `proctorLogs`, `verifiedExamsList`) are kept and extended:

```typescript
// Current active exam attempt
activeExamAttemptId: "" as string,
currentExamQuestions: [] as Array<{ id: string; text: string; options: string[]; correctAnswerIndex: number }>,
examScore: null as number | null,
examPassed: false,
proctorExamStatus: "not_started" as "not_started" | "in_progress" | "flagged" | "verified" | "voided",
proctorFlagsSummary: [] as string[],
cameraStreamActive: false,
```

**Event flow**: `handleStartExam(examId)` → `POST /api/exam/start` → populate `currentExamQuestions`, set `isExamProctoring = true`, start `examTimer`. `handleSubmitExam(answers)` → `POST /api/exam/:attemptId/submit` → update `proctorExamStatus`.

---

## Institution Admin State

```typescript
// Institution admin
institutionId: "" as string,
institutionName: "" as string,
institutionGradeRange: "K-12",
institutionStudents: [] as Array<{ id: string; name: string; email: string; grade_level: string; points: number; streak_days: number; last_active: string }>,
institutionTutors: [] as Array<{ id: string; name: string; email: string; subjects: string[]; grade_levels: string[] }>,
isAdminLoading: false,
adminError: "" as string,
assignedTutorId: "" as string,
```

**Load trigger**: If `landingAuthRole === 'institution'` and session valid, call `GET /api/institution/roster` → populate `institutionStudents` + `institutionTutors`.

---

## Community State

```typescript
// Community
communityPosts: [] as Array<{ id: string; author_name: string; author_level: number; title: string; content: string; likes: number; replies: number; category: string; created_at: string }>,
activeCommunityTopic: "grade-all" as string,
activeCommunitySubject: "" as string,
communityTopics: [] as Array<{ id: string; label: string; subtopics: string[] }>,
isSubmittingPost: false,
postSubmitError: "" as string,
```

**Load trigger**: On Forums tab open, call `GET /api/community/posts?topic_id=...` → populate `communityPosts`.

---

## Onboarding State (extends existing)

No structural changes to existing onboarding fields. New field appended:

```typescript
countryCatalogLoaded: false,
```

**Flow**: Onboarding dialog Step 2 (Country pick) populates `availableTracks` for the chosen country before allowing grade selection.

---

## Dashboard Widgets

No additional state needed beyond `gamification` slice above. Dashboard widgets derive from existing `appState.progress` and new slices.

---

## Export Summary

All new setter functions and handler functions are appended to the existing exports in `store.svelte.ts`. No existing export is removed or renamed.
