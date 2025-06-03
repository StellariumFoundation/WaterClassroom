# Technical.md  
Water Classroom – Technical Implementation Guide  
Version 1.0 · 28 May 2025  

---

## 1 · Overview  
Water Classroom is a multi-platform, AI-powered learning ecosystem. The current codebase ships a React + TypeScript SPA that demonstrates core flows (auth, curriculum, tutoring). This document captures the reference implementation and the forward-looking blueprint defined in the “Foundational Engineering Documentation Suite”.

---

## 2 · System Architecture  

### 2.1 High-Level View  
Client → API Gateway → Go Micro-services → Databases & Object Storage with an AI Services mesh bordering the micro-services tier.

```
[ Client Apps ]
   └── HTTPS/WebSocket
        └── API-Gateway / Load-Balancer
              ├─ Auth-svc (REST/gRPC)
              ├─ User-svc
              ├─ Curriculum-svc
              ├─ Progress-svc
              ├─ Assessment-svc
              ├─ Tutor-orchestrator-svc
              └─ Notification-svc
        ↘  AI Services (ContentGen, Tutor, Proctor, Grader)
             ↘  Vector DB / LLM endpoints
        ↘  Data tier (PostgreSQL, Redis, S3)
```

### 2.2 Technology Stack  
| Layer | Current POC | Target @ Scale |
|-------|-------------|----------------|
| Web | React 19 + Tailwind | Flutter Web / React w/ Module Federation |
| Mobile | — | Flutter iOS/Android |
| Desktop | — | Flutter (Windows/macOS/Linux) |
| API | — (mocked) | Go (Gin/Echo) micro-services, gRPC internal |
| AI | Google Gemini (client-side) | Managed AI layer (self-hosted or third-party) exposed via internal APIs |
| DB | LocalStorage mocks | PostgreSQL, ClickHouse/TimeScaleDB, Redis |
| Infra | — | Docker + Kubernetes (EKS/GKE) |

---

## 3 · Front-End Implementation  

### 3.1 Repository Layout (React)  
```
components/    # UI atoms & molecules  
contexts/      # React Context (Auth, Toast)  
pages/         # Route-level views  
services/      # API & AI helpers (geminiService.ts)  
constants.ts   # Routes, mock datasets  
```

### 3.2 State & Routing  
• React Router v7 with hash routing.  
• AuthContext maintains user session; will migrate to JWT persisted in `localStorage` then to secure HTTP-only cookies when backend lands.  
• Planned switch to Riverpod/BLoC when Flutter migration begins.

### 3.3 UX Guidelines  
• Tailwind custom theme (`index.html`) aligns with brand colors.  
• Ensure WCAG 2.1 AA: semantic HTML, keyboard paths, aria-labels.  
• All strings extracted to `i18n/en.json` (todo).

### 3.4 Offline Mode Roadmap  
Service-Worker + IndexedDB cache of lesson JSON; background sync to Progress-svc.

---

## 4 · Backend Services (Go)  

| Service | Responsibilities | Key Endpoints |
|---------|------------------|---------------|
| **Auth-svc** | Register, login, JWT issuance, OAuth | `/auth/*` |
| **User-svc** | Profiles, avatar, settings | `/users/*` |
| **Curriculum-svc** | CRUD curricula, courses, lessons, media links | `/curricula/*` |
| **Progress-svc** | Lecture completion, streaks, badges, analytics | `/progress/*` |
| **Assessment-svc** | Homework, exams, proctor orchestration, grading | `/assessments/*` |
| **Tutor-orchestrator-svc** | Chat session mgmt, context injection, rate-limit | `/tutor/chat` |
| **Notification-svc** | Email/WebPush via MQ | internal |

Patterns:  
* REST for external, gRPC for inter-service.  
* Shared protobuf contracts generate Go & Dart/TS clients.  
* Observability via OpenTelemetry → Grafana/Loki.

---

## 5 · AI Integration  

| Capability | Current | Production Plan |
|------------|---------|-----------------|
| Content Generation | `generateLectureContent()` using Gemini | ContentGen service (RAG + LLM) |
| Tutoring | `getTutorResponseStream()` | Tutor-svc proxying to fine-tuned LLM with student context |
| Assessment Grading | Client-side (objective only) | GradingAI (subjective) via Assessment-svc |
| Proctoring | Not implemented | ProctoringAI VLM ‑ WebRTC stream from client to svc |

Security: Never expose raw API keys to clients; front-end will call backend which carries credentials server-side.

---

## 6 · Data & Storage  

PostgreSQL schemas follow Document 3 ER outline (User, StudentProfile, Curriculum, Course, Lesson, Module, Progress, Exam, etc.).  
* Foreign-keys & indices on `user_id`, `lesson_id`.  
* JSONB for flexible `content_data`, `flags_detected`.  
Object storage buckets:  
* `lesson-media` (public via signed-CDN URLs)  
* `exam-media` (private, server-side encryption, lifecycle policy → Glacier)

---

## 7 · Security & Compliance  

* BCrypt/Argon2 password hashing.
* JWT (RS256) + refresh tokens.
* Rate-limiting (Redis token bucket).
* GDPR / COPPA data retention tags in user records.
* Proctoring media encryption at rest, signed URL access, auto-purge after retention window.

---

## 8 · Deployment & DevOps  

1. **Local Dev**  
   ```bash
   # prerequisites: Node 18+, Go 1.22+, Docker
   git clone …
   cd waterclassroom
   npm i && npm run dev            # frontend  
   cd backend/auth-svc && go run . # example service
   ```

2. **CI/CD**  
   * GitHub Actions: lint → test → build → container push.  
   * Helm charts per micro-service.  
   * Argo CD for GitOps promotion (dev → staging → prod).

3. **Cloud**  
   * AWS EKS, RDS (PostgreSQL), S3, CloudFront.  
   * Horizontal Pod Autoscaler; Spot fleets for AI GPU nodes.  

4. **Secrets & Config**  
   * External Secrets Operator maps AWS Secrets Manager → K8s secrets.  
   * `.env.example` documents required vars: `POSTGRES_URI`, `JWT_PUBLIC_KEY`, `GEMINI_API_KEY`, etc.

---

## 9 · Running the POC Today  

1. Add your Gemini key to `.env.local`:  
   ```
   GEMINI_API_KEY=sk-xxxx
   ```  
2. `npm run dev` → open http://localhost:5173  
3. Log in with any email/name (local storage).  
4. Explore curriculum, open AI Tutor chat.  

---

## 10 · Roadmap & Contribution  

| Milestone | Target |
|-----------|--------|
| M1 | Backend Auth-svc + real DB |
| M2 | Curriculum-svc + admin panel |
| M3 | Progress tracking & badge engine |
| M4 | Assessment-svc with auto-grading |
| M5 | Proctoring MVP |
| M6 | Flutter clients GA |

Contributions welcome via pull requests; see `CONTRIBUTING.md` (todo).

---  
© 2025 Stellarium Foundation – All rights reserved.
