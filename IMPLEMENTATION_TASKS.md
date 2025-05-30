# IMPLEMENTATION_TASKS.md  
Comprehensive Implementation Task List – Water Classroom  
_Last updated: 30 May 2025_

Legend  
• **Effort** – XS ≤½ d, S ≤2 d, M ≤1 w, L ≤2 w, XL >2 w  
• **Priority** – P0 (blocker), P1 (high), P2 (medium), P3 (low)  
• **Deps** – IDs of prerequisite tasks or external requirements  

---

## 0. Current State Assessment

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
CS-1 | Audit code for unused/placeholder files | List of dead/placeholder code merged into `docs/audit-report.md` | S | — | P1 |
CS-2 | Generate architecture diagram from current repo (structurizr) | `docs/arch/current-state.puml` renders without manual edits | S | — | P2 |
CS-3 | Collect baseline perf numbers (API-gateway, FE LCP) | Grafana snapshot stored; metrics table in README | M | Dev cluster | P1 |

---

## 1. Critical Path Items (Immediate)

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
CP-1 | **Complete Auth MVP** (register, login, refresh, BCrypt) | All `/auth/*` endpoints return 2xx; unit tests ≥90 % | L | CS-1 | **P0** |
CP-2 | Stand-up Postgres in dev/stage with migrations | `make run-backend-dev` starts DB, healthcheck green | S | — | **P0** |
CP-3 | Secure secrets management (dev .env, prod AWS SM) | No hard-coded keys in repo; CI secret scan passes | S | CP-2 | **P0** |
CP-4 | Frontend login & protected-route flow connected to real JWT | User can sign up & land on dashboard | M | CP-1 | **P0** |

---

## 2. Backend Implementation Tasks

### 2.1 Auth-svc

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
BE-AUTH-1 | Implement email verification token flow | Link marks `users.email_verified=true` | M | CP-1 | P1 |
BE-AUTH-2 | Add Google OAuth 2.0 | Successful login returns JWT; new/existing account merge | M | CP-1 | P1 |
BE-AUTH-3 | Rate-limit middleware (Redis-token-bucket) | >10 requests/sec from same IP → 429 | S | CP-1 | P1 |

### 2.2 User-svc

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
BE-USR-1 | Scaffold user-svc repo dir w/ proto & REST | `make run-user-svc` health OK | S | CP-2 | P1 |
BE-USR-2 | CRUD profile endpoints | Create/Update/Get passes integration tests | M | BE-USR-1 | P1 |

### 2.3 Curriculum-svc

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
BE-CUR-1 | Define lesson JSON schema v1 | JSONSchema file committed, validated in CI | S | CP-2 | P1 |
BE-CUR-2 | CRUD courses/lessons with S3 media signed URLs | POST returns URL, file uploads succeed | L | BE-CUR-1 | P1 |
BE-CUR-3 | List curricula endpoint for FE | FE dropdown populates from API | S | BE-CUR-2 | P1 |

### 2.4 Progress-svc

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
BE-PRO-1 | Event consumer for `LessonCompleted` → ClickHouse | Message processed & row in CH within 3 s | M | BE-CUR-2 | P1 |
BE-PRO-2 | Badge engine DSL (YAML rules) | At least 3 badge rules trigger in tests | L | BE-PRO-1 | P2 |

### 2.5 Assessment-svc

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
BE-ASM-1 | Quiz schema + auto-grading | 4 question types graded; 95 % parity w/ answer key | L | BE-CUR-2 | P1 |
BE-ASM-2 | Exam proctor stub endpoint | Receives webcam stream metadata; stores to S3 | L | INF-2 | P2 |

### 2.6 Tutor-orchestrator-svc

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
BE-TUT-1 | RAG context fetch from lessons into prompt | Tutor answer includes lesson refs | M | BE-CUR-2 | P1 |
BE-TUT-2 | Streaming gRPC & WS bridge | FE receives tokenised chunks <500 ms latency | L | INF-1 | P2 |

---

## 3. Frontend Implementation Tasks

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
FE-1 | Replace localStorage mock auth with real JWT | Refresh token auto-renew works | S | CP-4 | **P0** |
FE-2 | Curriculum selection page fetches from API | List renders real data; errors handled | S | BE-CUR-3 | P1 |
FE-3 | Lecture page renders markdown/video from lesson JSON | Displays at least 2 media types | M | BE-CUR-2 | P1 |
FE-4 | Tutor chat uses gRPC stream via WS | Typing indicator + streamed markdown | M | BE-TUT-2 | P1 |
FE-5 | Gamification UI components (XP bar, badges) | Progress bar updates; badge toast shows | S | BE-PRO-2 | P2 |
FE-6 | Convert to service-worker offline cache for lessons | Offline reload shows cached lesson | L | FE-3 | P2 |

---

## 4. AI / ML Integration Tasks

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
AI-1 | Centralise Gemini API key on server only | No key appears in FE bundle | XS | CP-3 | **P0** |
AI-2 | Prompt library with unit tests (Go) | 5 prompts unit-tested for variables | S | BE-TUT-1 | P1 |
AI-3 | Caching layer for tutor responses (Redis) | 30 % cache hit in load test | S | BE-TUT-1 | P1 |
AI-4 | Collect tutor Q&A to ClickHouse for fine-tune | Table `tutor_interactions` populated | M | BE-TUT-1 | P2 |
AI-5 | Evaluate open-weights LLM PoC (Ollama) | Benchmarks documented; ≤3× cost vs Gemini | M | AI-4 | P3 |

---

## 5. Infrastructure & DevOps Tasks

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
INF-1 | Helm umbrella chart for all micro-services | `helm install water-dev` success | M | CP-2 | P1 |
INF-2 | S3 bucket terraform module with lifecycle policy | `terraform apply` creates bucket | S | CP-2 | P1 |
INF-3 | Add ClickHouse to docker-compose & Helm | `make run-backend-dev` chik | S | CP-2 | P1 |
INF-4 | Argo CD GitOps pipeline (dev→stg) | Merge triggers auto-deploy; sync status green | L | INF-1 | P2 |
INF-5 | External-Secrets Operator integration | Secrets pulled from AWS SM in pod env | S | CP-3 | P1 |

---

## 6. Testing & QA Tasks

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
QA-1 | Backend unit test coverage ≥70 % lines | `go test ./...` badge in CI | M | CP-1 | P1 |
QA-2 | Vitest FE suite for critical flows | Auth, curriculum, tutor pass in CI | M | FE-1 | P1 |
QA-3 | Playwright e2e pipeline on staging | Login→complete lesson journey green | M | FE-3 | P2 |
QA-4 | k6 load test script (1 k RPS, 10 min) | p95 <300 ms, <1 % errors | M | INF-1 | P2 |

---

## 7. Security & Compliance

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
SEC-1 | Implement OWASP headers in API-gateway | Verified by zap scan | XS | CP-1 | P1 |
SEC-2 | Add dependency scanning (Snyk) to CI | Fails build on high-severity vuln | XS | CP-3 | P1 |
SEC-3 | GDPR data-deletion endpoint (`/user/delete`) | User records anonymised within 24 h | M | BE-USR-2 | P2 |
SEC-4 | Threat model & STRIDE doc in `docs/security/` | Reviewed by SecOps | S | SEC-1 | P2 |

---

## 8. Performance & Scalability

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
PERF-1 | Enable HPA on API-gateway deployment | Pod count scales 1→5 under k6 load | S | INF-1 | P2 |
PERF-2 | Redis caching for curriculum endpoints | 80 % cache hit; latency cut 50 % | S | BE-CUR-3 | P2 |
PERF-3 | ClickHouse roll-up materialised views for analytics | Dashboard query <200 ms | M | BE-PRO-1 | P3 |

---

## 9. Documentation & Community

| ID | Task | Acceptance Criteria | Effort | Deps | Pri |
|----|------|--------------------|--------|------|-----|
DOC-1 | Update README quick-start (DB, migrations) | New dev can run app in <10 min | S | CP-2 | P1 |
DOC-2 | API reference with `swag` or `openapi-gen` published to GitHub Pages | Each endpoint documented | M | BE tasks | P2 |
DOC-3 | Contributing guide with commit msg rules | PR template links to guide | S | — | P1 |
COMM-1 | Set up GitHub Discussions & labels (good first issue) | Community sees categories | XS | — | P2 |

---

### Cross-Reference of Dependencies

Most P0/P1 tasks chain:  
`CP-2` → DB ready → `CP-1` Auth logic → `CP-4` FE login.  
Services follow: Auth → User → Curriculum → Progress → Tutor / Assessment.  
Infra (INF-1) enables staging deployments for QA-3 and PERF tasks.

---

_End of task list — keep this file updated in every sprint review._  
