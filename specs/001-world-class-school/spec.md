# Feature Specification: Water School — World-Class Online Learning Platform

**Feature Branch**: `001-world-class-school`

**Created**: 2026-06-21

**Status**: Draft

**Input**: User description: "i am building an online school and also a school companion, i needd the curricullum that depends if the user is homeschooled and their country. they could be on the water School a world class school, it has all the perks plus a community and proctored exams. all the leaning content is mean to be world class to teach students easily just like they watch tiktok, with games and interactivity. a water school student has proctored exams, with an ai camera that checks the user really is make the exam and not creating proctored. it is for students from kindergarden to graduates as we add more offereing. there is a smart ai tutor that teaches students the consepts and act as teachers. the whole interface should be prety and gamified like duolingo with badges and stereaks, and such things. we need to set a profile and dashboard for students and a dashboard for insitutions to manage the students and schoolmand real tutors, and such thinks also manages the curriculum, they may make changes in the curriculum they see fit. it is the World CLass online school for the real world, meant to create smart problem solvers, and artists, and leaders."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Student Discovers Personalized Curriculum (Priority: P1)

A student (kindergarten through graduate level) registers, creates a profile
selecting whether they are homeschooled or enrolled in a traditional school, and
chooses or is assigned their country. The platform then presents a curriculum
aligned to that country's educational standards — or a homeschool-compatible
track — with lessons delivered in short, TikTok-style bursts of content at the
student's own pace.

**Why this priority**: Without personalized content delivery, the platform has
no core value. This is the foundation everything else builds on.

**Independent Test**: A new student signs up, completes onboarding, and arrives
at a personalized lesson feed within 90 seconds of registration. The lessons
display correctly for their grade level and country track.

**Acceptance Scenarios**:

1. **Given** a student has never visited the platform, **When** they sign up and
   complete onboarding selecting grade, homeschool status, and country, **Then**
   they see a lesson feed tailored to those choices within 90 seconds.
2. **Given** a student is in the middle of a lesson, **When** they complete it,
   **Then** the next lesson loads automatically in the same short-form style.
3. **Given** a student's curriculum is based on their country's standards, **When**
   they travel or their home country changes, **Then** they can switch curriculum
   tracks without losing progress.

---

### User Story 2 — Student Learns with AI Tutor & Reinforces Through Games (Priority: P1)

A student is inside a lesson when an AI tutor icon appears. They tap it, and a
conversational AI teacher explains the concept step by step. Between lessons,
they play short, interactive games that reinforce what they just learned, earning
points, badges, and streaks displayed on their dashboard — similar to Duolingo.

**Why this priority**: Engagement and comprehension are what distinguish a
world-class school from a content library. This feature justifies the "AI
tutoring" and "gamified" claims central to the product pitch.

**Independent Test**: A student on any grade level taps the AI tutor during a
science lesson, receives a concept explanation, answers a reinforcement question
correctly, gains a streak day and a badge, and sees both reflected in their
dashboard.

**Acceptance Scenarios**:

1. **Given** a student is viewing a lesson, **When** they tap the AI tutor
   button, **Then** a conversational interface opens with context-relevant
   explanation of the current concept.
2. **Given** a student completes a reinforcement game, **When** they score above
   the passing threshold, **Then** they earn points toward their streak and a
   badge is added to their collection.
3. **Given** a student misses a day of activity, **When** they return the next
   day, **Then** their streak counter shows the correct total (break rules
   documented in Assumptions).

---

### User Story 3 — Student Takes a Proctored Exam with AI Identity Verification (Priority: P2)

A student enrolled in a graded course or formal assessment opens a scheduled
exam. Before the exam begins, the platform activates the device camera, captures
a baseline image, and continues monitoring throughout the session. If the system
detects that a different person is taking the exam, it flags the event. Upon
completion, the exam is scored and recorded.

**Why this priority**: Proctored credential exams are the bridge between
casual learning and accredited outcomes. This feature enables certification and
is a strong differentiator against free learning platforms.

**Independent Test**: A student enrolls in a proctored math assessment, grants
camera access, is prompted for an initial identity scan, takes the 30-minute
exam, and receives a verified score on their transcript within 5 minutes of
submitting.

**Acceptance Scenarios**:

1. **Given** a student is enrolled in a proctored course, **When** they open the
   exam, **Then** they are prompted to enable their camera and verify their
   identity before questions appear.
2. **Given** an exam is in progress, **When** the AI camera system detects a
   identity mismatch, **Then** the exam continues and the attempt is flagged for
   human review.
3. **Given** a student submits their exam, **When** scoring completes, **Then**
   their verified score appears on their academic record within 5 minutes.

---

### User Story 4 — Student Manages Profile and Views Gamified Dashboard (Priority: P1)

A student logs in and lands on a personally branded dashboard showing their
current streak, earned badges, subject progress bars, upcoming live sessions or
exam dates, and messages from their AI tutor or community. They can update their
profile photo, display name, grade level, and notification preferences.

**Why this priority**: The dashboard is the emotional center of the product. A
well-designed dashboard drives daily engagement and makes the gamification
tangible.

**Independent Test**: A returning student logs in and sees an updated dashboard
with their current streak, at least one badge they earned the previous session,
a progress bar showing 15% completion in Mathematics, and a notification about
an upcoming proctored exam. They can navigate to their profile and change their
display name.

**Acceptance Scenarios**:

1. **Given** a student has earned badges and maintains a 12-day streak, **When**
   they log in, **Then** their dashboard prominently shows both stats within
   3 seconds of page load.
2. **Given** a student is on their profile page, **When** they change their
   display name and save, **Then** their new name is reflected everywhere on the
   dashboard immediately.
3. **Given** a student's Mathematics progress is at 15%, **When** they complete
   another lesson, **Then** the progress bar reflects the new percentage on next
   login.

---

### User Story 5 — Institution Admin Manages Students, Tutors, and Curriculum (Priority: P2)

An institution administrator (school, homeschool co-op, or district) logs in
via their own dashboard. They can see a list of enrolled students, assign
real human tutors to specific students or groups, view performance data per
student, and customize the curriculum content for the learners in their
institution — adding, removing, or reordering lessons and assessment items.

**Why this priority**: The institution view is the primary commercial B2B/guild
layer. Without it, the platform cannot be sold to or adopted by schools and
homeschool networks.

**Independent Test**: An institution admin creates a new student account, assigns
a named tutor, modifies the lesson order for a grade level, and confirms those
changes appear correctly when the student views their personalized feed.

**Acceptance Scenarios**:

1. **Given** an institution admin has set up their school workspace, **When**
   they invite a new student by email, **Then** that student receives a welcome
   email and a profile is created under the institution's roster.
2. **Given** a student is on the institution's roster, **When** the admin assigns
   a real tutor to that student, **Then** the tutor receives a notification and
   appears on the student's mentor list.
3. **Given** an institution admin has curriculum edit permissions, **When** they
   reorder lessons for Grade 5 Science, **Then** students in that track see the
   new order on their next visit.

---

### User Story 6 — Student Engages in Community (Priority: P3)

A student can visit a community space — organized by grade level, subject, or
interest — to ask questions, share project work, and see posts from other
students and tutors. Moderated content keeps the space safe and age-appropriate.

**Why this priority**: Community depth of engagement is meaningful once core
learning functionality is stable. It is prioritized after the core learning
loop to avoid scope creep before the platform's learning quality is proven.

**Independent test**: A Grade 3 student posts a question in the Science topic,
receives a reply from a peer and a tutor within 24 hours, and can upvote helpful
answers.

**Acceptance Scenarios**:

1. **Given** a student is logged in, **When** they navigate to Community and
   select their grade-level Science topic, **Then** they see existing posts and
   a form to submit their own question.
2. **Given** a question is posted, **When** another student or tutor replies,
   **Then** the original poster receives a notification in their dashboard.

---

### Edge Cases

- What happens when a student's homeschool/country combination does not yet have
  a mapped curriculum? (fallback to International English track documented in
  Assumptions)
- How does the AI camera proctoring system handle poor lighting, device tilt,
  or a student who needs to leave the room briefly? Identity mismatches and
  low-severity interruptions are flagged without pausing the exam unless a
  separate high-severity rule is explicitly defined later.
- What happens when an institution has no tutor assigned to a student who needs
  human help?
- How does streak counting work when a student uses the platform across time
  zones with different date boundaries?
- What age-appropriate content limits apply for kindergarten-age students in
  community spaces?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The platform MUST allow students to create accounts and complete
  an onboarding flow that captures grade level, homeschool status, country, and
  core learning interests.
- **FR-002**: Onboarding MUST result in a personalized curriculum track matched
  to the student's country standards or a homeschool-compatible default track.
- **FR-003**: All primary learning content MUST be delivered in short,
  interactive formats (video clips, slides, mini-games) designed to sustain
  attention in brief engagement windows.
- **FR-004**: An AI tutor MUST be accessible from within any lesson and MUST be
  capable of explaining the current concept at the student's grade level.
- **FR-005**: The platform MUST track and display at minimum: daily streaks,
  earned badges, and subject-level completion progress on the student dashboard.
- **FR-006**: A proctored exam MUST activate the student's device camera,
  perform an identity scan before the exam begins, and continue monitoring
  throughout the session.
- **FR-007**: The proctoring system MUST flag — but not necessarily block — an
  attempt when identity verification fails; flagged attempts continue unless a
  later high-severity rule is defined, and are recorded for human review.
- **FR-008**: Students in kindergarten through graduate levels MUST see content
  and UI scaled and adapted to their grade level.
- **FR-009**: An authenticated institution admin MUST be able to view a roster
  of students in their school workspace, assign human tutors, and view per-student
  performance summaries.
- **FR-010**: An institution admin with curriculum edit permission MUST be able
  to reorder, add, remove, or replace lessons and assessment items within their
  authorized grade tracks.
- **FR-011**: Students MUST be able to update their profile details including
  display name, profile photo, grade level, and notification preferences.
- **FR-012**: A community space MUST be available per grade or subject topic,
  allowing students to post questions and replies with basic moderation.
- **FR-013**: Proctored exam results MUST be recorded as verified scores on the
  student's academic record.

### Key Entities

- **Student**: Core learner account with grade level, country, homeschool status,
  streak count, badge collection, progress records, and completed assessment
  history.
- **CurriculumTrack**: A country-standard or homeschool-grade-level ordered
  sequence of lessons, games, and assessments. Institution-specific overrides
  are possible per track.
- **Lesson**: An individual learning unit — short-form content or interactive
  exercise — belonging to a curriculum track and tagged with subject, grade,
  and estimated completion time.
- **Exam**: A timed, scored assessment that may be flagged as proctored; linked
  to a curriculum track and carrying a verification status.
- **ExamAttempt**: A single sitting of an exam by a student, with identity
  check images, proctoring flags, score, and completion timestamp.
- **Badge**: A gamification achievement earned by completing specific activities
  or reaching milestones; displayed on the student dashboard.
- **Tutor**: Can be AI-driven or a real human tutor assigned by an institution;
  linked to students and able to view student progress.
- **Institution**: A school, homeschool network, or district; owns a roster of
  students, tutors, and customizable curriculum versions.
- **InstitutionAdmin**: An authenticated user with management rights over one or
  more institutions and their curriculum, roster, and tutor assignments.
- **CommunityPost**: A student- or tutor-authored question or reply in a
  grade/subject-scoped community topic, with vote and moderation metadata.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new student completes onboarding and reaches their first
  personalized lesson in under 90 seconds on first visit.
- **SC-002**: Students who engage with the AI tutor during a session complete
  the associated lesson 20% more often than students who do not.
- **SC-003**: 80% of proctored exam attempts receive a verified score within
  5 minutes of submission.
- **SC-004**: Student dashboards display current streak, badges, and curriculum
  progress within 3 seconds of page load on a standard broadband connection.
- **SC-005**: Institution admins can assign a tutor to a new student and have
  the change reflected for both parties in under 2 minutes.
- **SC-006**: At least 60% of weekly active students visit the community space
  at least once per week within the first 3 months of launch.
- **SC-007**: 90% of kindergarten through Grade 3 students complete their first
  lesson without requiring assistance from a parent or tutor.
- **SC-008**: Institution curriculum overrides (lesson reorder, add, remove)
  propagate to all enrolled students in that track within 10 minutes.

---

## Assumptions

- A teacher-curated fallback "International English" curriculum exists for grade
  levels where a specific country track is not yet built, ensuring every student
  can start learning immediately.
- Proctoring identity checks are performed via real-time camera analysis;
  identity mismatches and brief interruptions are flagged without pausing the
  exam, with evidence retained for human review unless a later high-severity
  rule explicitly requires interruption.
- Streak counting resets at midnight in the student's local time zone; a grace
  window of 30 minutes past midnight is allowed before a streak breaks.
- Community posts by students under 13 are restricted to pre-selected topics and
  require tutor approval before becoming visible to other students.
- AI tutor responses are generated client-first with API fallback; an internet
  connection is required for full AI tutoring functionality.
- Institution curriculum change permissions are scoped to grade range and subject
  area — admins cannot inadvertently modify tracks they do not own.
- The platform uses standard session-based or token-based authentication; the
  specific mechanism is left to implementation planning and does not affect this
  specification.

---

## Clarifications
### Session 2026-06-21

- Q: Proctored exam identity mismatch behavior → A: B.
- Q: AI tutor conversation history storage → A: Persist server-side (stored in database, resumable across sessions).
