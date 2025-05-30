# IMPLEMENTATION_TASKS_REVISED.md  
_Comprehensive Task List – Water Classroom (Practical AI Tutoring Platform)_  
_Last updated: 01 Jun 2025_

Legend  
• **Effort** – XS ≤½ d · S ≤2 d · M ≤1 w · L ≤2 w · XL >2 w  
• **Priority** – **P0** (blocker) · **P1** (high) · P2 (medium) · P3 (low)  
• **Deps** – IDs of prerequisite tasks or infrastructure  

---

## 0 · Current-State Audit  

| ID | Task | Acceptance Criteria | Effort | Pri |
|----|------|--------------------|--------|-----|
| AUD-1 | Code-base cleanup | Dead/placeholder code removed; `go vet` & ESLint pass clean | S | P1 |
| AUD-2 | Service diagram update | Updated diagram committed to `docs/TECHNICAL_ARCHITECTURE.md` | XS | P2 |

---

## 1 · Core React + Go Micro-services Platform  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| BE-1 | **Auth GA** – register/login/refresh | All `/auth/*` endpoints return 2xx; 90 % unit coverage | L | AUD-1 | **P0** |
| BE-2 | User-svc CRUD | Create/Retrieve/Update profile endpoints pass Postman tests | M | BE-1 | P1 |
| BE-3 | Curriculum-svc CRUD | Courses, subjects, lessons CRUD; S3 media upload via signed URL | L | BE-1 | P1 |
| BE-4 | Progress-svc event pipeline | `LessonCompleted` events → ClickHouse in <3 s | M | BE-3 | P1 |
| FE-1 | React protected-route w/ JWT | Auth flow persists refresh tokens; auto-logout on expiry | S | BE-1 | **P0** |
| FE-2 | Curriculum UI consumes API | Curriculum page lists data from BE-3; loading & error states | S | BE-3 | P1 |
| INF-1 | Helm umbrella chart | `helm install wc-dev` spins up all services; healthchecks green | M | BE-1 | P1 |
| INF-2 | GitOps pipeline (Argo CD) | Merge to `development` auto-syncs dev cluster; manifests healthy | L | INF-1 | P2 |

---

## 2 · AI Tutoring (Text + Voice)  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| AI-1 | Tutor-orchestrator text chat | Endpoint `/tutor/chat` streams tokens <500 ms (95p) | L | BE-1 | **P0** |
| AI-2 | Voice TTS/STT gateway | Whisper STT + ElevenLabs TTS via `speech-svc`; latency <1 s | M | AI-1 | P1 |
| AI-3 | Prompt library & tests | 5 reusable prompt templates with unit tests hitting mock LLM | S | AI-1 | P1 |
| FE-3 | Chat UI w/ voice toggle | Users can talk & hear tutor; fallback to text if no mic | M | AI-2 | P1 |
| AI-4 | Cost cache layer | Redis caching yields ≥25 % token reuse in load test | S | AI-1 | P2 |

---

## 3 · Gamification (Badges & Progress)  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| GAM-1 | Badge rule engine | YAML rule file; badges awarded and persisted via Progress-svc | M | BE-4 | P1 |
| GAM-2 | FE badge & XP bar | Badge toast and XP progress update instantly after lesson | S | GAM-1 | P1 |
| GAM-3 | Leaderboard service | Top-10 streak leaderboard endpoint returns sorted data | M | GAM-1 | P2 |

---

## 4 · Secure Assessment & Proctoring  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| ASM-1 | Quiz schema & auto-grading | MCQ/short answer graded server-side; score returned <2 s | L | BE-3 | P1 |
| ASM-2 | Essay AI grading MVP | LLM rubric scoring; 0.8 Pearson correlation vs. human | L | ASM-1 | P2 |
| ASM-3 | Webcam proctor stub | Captures video, flags absence/face count; 90 % detection in test | L | ASM-1 | P2 |
| CERT-1 | PDF certificate generator | Completed course → PDF with name, QR verify link | S | ASM-1 | P1 |

---

## 5 · Analytics & Learning Insights  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| ANA-1 | ClickHouse dashboards | Lesson completion funnel & badge metrics in Grafana | M | BE-4 | P1 |
| ANA-2 | Skill-gap predictor v1 | Logistic regression flags risk; precision ≥0.75 | M | ANA-1 | P2 |
| ANA-3 | Parent/teacher reports | Weekly email summarising time-on-task & mastery delta | S | ANA-1 | P2 |

---

## 6 · Mobile App (Flutter)  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| MOB-1 | Flutter skeleton | Login → dashboard flow; runs on iOS & Android simulators | M | FE-1 | P1 |
| MOB-2 | Offline lesson cache | Download lesson JSON; read offline; sync progress later | L | BE-3 | P2 |
| MOB-3 | Push notifications | Tutor reminder push delivered via FCM/APNs; tap opens app | S | MOB-1 | P2 |

---

## 7 · LMS Integrations & Educator Tools  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| LMS-1 | LTI 1.3 provider | Launch from Canvas; grade pass-back works | L | BE-1 | P1 |
| EDU-1 | Educator dashboard | View class progress heatmap; assign lesson to roster | M | BE-4 | P1 |
| EDU-2 | Curriculum editor v1 | Form to create lesson JSON; saves via Curriculum-svc | L | EDU-1 | P2 |

---

## 8 · Security, QA & Compliance  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| SEC-1 | Rate-limit middleware | IP >100 req/min → 429; tested with k6 script | S | BE-1 | P1 |
| QA-1 | Test coverage 75 % BE | `go test ./...` coverage ≥75 %; Vitest FE ≥70 % | L | All | P1 |
| QA-2 | Playwright e2e | Login → complete lesson → badge flow green in CI | M | FE-2 | P1 |
| COM-1 | FERPA & GDPR review | Data map documented; DPA templates uploaded | M | SEC-1 | P2 |

---

## 9 · Infrastructure & Performance  

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
| INF-3 | ClickHouse cluster prod | Dual-replica, multi-AZ; failover <30 s | L | INF-1 | P2 |
| INF-4 | HPA tuning | API-gateway p95 <200 ms at 1 k RPS in k6 | M | INF-1 | P2 |
| INF-5 | Cost monitoring | Kubecost alerts if daily burn > budget×1.1 | S | INF-1 | P2 |

---

### Cross-Dependency Highlights  

* **Auth GA (BE-1, FE-1)** unlocks all protected flows.  
* **Curriculum CRUD (BE-3)** feeds tutoring, gamification, and mobile offline tasks.  
* **Progress events (BE-4)** are prerequisites for analytics and badges.  
* **Infrastructure (INF-1)** must precede GitOps, scaling, and ClickHouse prod readiness.

---

_End of file – keep updated during each sprint review._  
