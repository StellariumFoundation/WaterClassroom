# Water Classroom - Consolidated Task List

This document outlines the features and tasks to be implemented for the Water Classroom project, compiled and refined from various project documents including `docs/KANBAN_FEATURES.MD`, `docs/IMPLEMENTATION_ROADMAP.MD`, `docs/PRODUCT_OVERVIEW.MD`, `docs/Water Classroom.md`, and the `Todo` list. It is intended for use in a Kanban board or similar task management system.

## Epics / Major Feature Areas

### Core Platform & User Experience
(Includes Authentication, User Profiles, Basic UI/UX, Frontend Setup)

- [M1] Complete JWT flows (Source: IMPLEMENTATION_ROADMAP.MD - M1 Auth & Profile; Success criteria: Register→login under 300 ms p95; 100 % unit & integration test pass. Related: Implement JWT RS256 rotation)
- [M1] Create email templates for verification, password reset, etc. (Source: IMPLEMENTATION_ROADMAP.MD - M1 Auth & Profile; Dependency: SendGrid. Note: Clarify scope: full templates vs. basic confirmation page for MVP, per docs/Technical.md MVP PRD)
- [M1] Ensure Register/login flow is under 300 ms p95 (Source: IMPLEMENTATION_ROADMAP.MD - M1 Auth & Profile success criteria)
- [M6] Achieve mobile Flutter parity with web features (Source: IMPLEMENTATION_ROADMAP.MD - M6 Proctor & Credentials; Success: mobile DAU / web DAU ≥0.4)
- Ongoing: Prioritize hardening core services (auth, curriculum, progress) through security reviews, performance tuning, and refactoring as needed. (Source: IMPLEMENTATION_ROADMAP.MD - Technical Implementation Priorities)
- [M1] Deliver Design System v1 (Tailwind tokens) (Source: IMPLEMENTATION_ROADMAP.MD - UX/Design Evolution)
- [M1-M2] Setup initial Flutter *mobile* project (one OS) for MVP features (Source: Water Classroom.md - Phase 1 MVP. Original Kanban item adjusted)
- [M2-M3] Implement user authentication (login/registration) and basic curriculum browsing in the initial Flutter application. (Source: Water Classroom.md - Phase 1 MVP features for Flutter mobile)
- [M4] Implement responsive overhaul for mobile PWA (Source: IMPLEMENTATION_ROADMAP.MD - UX/Design Evolution M4)
- [M6] Auto-generate Flutter Design Tokens from Figma (Source: IMPLEMENTATION_ROADMAP.MD - UX/Design Evolution M6)
- Track UX KPIs: Task-success >90%; SUS score >80; bounce rate <15% (Source: IMPLEMENTATION_ROADMAP.MD - UX/UI KPIs)
- [M4-M5] Design mechanism for caching lesson content and essential data on client devices. (Source: Water Classroom.md - Offline Access; PRODUCT_OVERVIEW.MD - Mobile Beta Q1-26 offline lesson cache)
- [M4-M5] Implement service workers (for PWA/web) for offline content access. (Source: Water Classroom.md - Offline Access; Technical.md (root) - Offline Mode Roadmap)
- [M4-M5] Develop synchronization logic for progress made offline. (Source: Water Classroom.md - Offline Access; Technical.md (root) - Offline Mode Roadmap)

### Curriculum & Content Management
(Includes Curriculum CRUD, Lesson Structure, Content Delivery, Admin Panels for Content)

- [M2] Implement gRPC & REST endpoints for curriculum service (Source: IMPLEMENTATION_ROADMAP.MD - M2 Curriculum CRUD; Dependencies: Auth RBAC; Success: Create/Publish lesson <1min, 95% test coverage)
- [M2] Develop React admin UI for teachers (manage curriculum - likely internal facing for M2) (Source: IMPLEMENTATION_ROADMAP.MD - M2 Curriculum CRUD)
- [M2] Implement S3 signed-URL uploads for media content (Source: IMPLEMENTATION_ROADMAP.MD - M2 Curriculum CRUD)
- [M2] Ensure Create/Publish lesson flow is under 1 min (Source: IMPLEMENTATION_ROADMAP.MD - M2 Curriculum CRUD success criteria)
- [M2] Achieve 95% test coverage in curriculum service (Source: IMPLEMENTATION_ROADMAP.MD - M2 Curriculum CRUD success criteria)
- [M2] Investigate and decide on the format and storage mechanism for interactive lesson content (e.g., HTML files, JSON structures, headless CMS). (Source: Todo File #14; Relates to IMPLEMENTATION_ROADMAP.MD - M2 lesson JSON schema v1)
- [M2-M3] Implement chosen format and system for interactive lesson content storage and delivery (based on M2 investigation outcome, relates to Todo #14). (New task based on analysis)

### Learning & Engagement Features
(Includes Interactive Lessons, Single & Multiplayer Games, Gamification elements like Badges, Streaks)

- [M3] Develop Badge rule DSL (Domain Specific Language) (Source: IMPLEMENTATION_ROADMAP.MD - M3 Progress & Badges; Success: Badge granted <5s)
- [M3] Create FE streak widgets for user dashboard (Source: IMPLEMENTATION_ROADMAP.MD - M3 Progress & Badges)
- [M3] Ensure badge is granted within 5 seconds of trigger event (Source: IMPLEMENTATION_ROADMAP.MD - M3 Progress & Badges NFR)
- [M5] Develop Realtime hub using Go and Redis pub/sub (Source: IMPLEMENTATION_ROADMAP.MD - M5 Multiplayer; Success: 100 concurrent sessions <250ms RTT)
- [M5] Create Matchmaking API for multiplayer games (Source: IMPLEMENTATION_ROADMAP.MD - M5 Multiplayer)
- [M5] Develop Game #1: Fraction Frenzy (Multiplayer) (Source: IMPLEMENTATION_ROADMAP.MD - M5 Multiplayer)
- [M5] Implement toxicity filter for chat/communication (Source: IMPLEMENTATION_ROADMAP.MD - M5 Multiplayer)
- [M5] Ensure 100 concurrent sessions with <250 ms Round Trip Time (RTT) (Source: IMPLEMENTATION_ROADMAP.MD - M5 Multiplayer NFR)
- [M5] Ensure zero crashes in 2-hour soak test (Source: IMPLEMENTATION_ROADMAP.MD - M5 Multiplayer NFR)
- [M3] Develop Gamification Components (XP bar, leaderboards) (Source: IMPLEMENTATION_ROADMAP.MD - UX/Design Evolution M3; PRODUCT_OVERVIEW.MD - Q4-25 Gamification Upgrade)
- [M3] Design and implement 'Social Study Rooms' v1 (text-chat based). (New task based on PRODUCT_OVERVIEW.MD Q4-25 Social Study Rooms & analysis)

### MVP Educational Games (Single Player)
(New Epic based on MVP requirements from Water Classroom.md & docs/Technical.md MVP PRD)

- [M1-M2] Define scope, learning objectives, and design for 3-5 MVP single-player educational games (aligned with initial curriculum). (New task)
- [M2] Develop/Integrate framework/engine for single-player educational games. (New task)
- [M2-M3] Develop MVP Single-Player Game 1: [Specify Name/Concept e.g., 'Fraction Fling SP'] (New task)
- [M2-M3] Develop MVP Single-Player Game 2: [Specify Name/Concept] (New task)
- [M3] Develop MVP Single-Player Game 3: [Specify Name/Concept] (New task)

### AI & Tutoring System
(Includes AI Tutor Integration, LLM Orchestration, Prompt Engineering, AI Model Pipelines)

- [M4] Implement tutor chat context injection (Source: IMPLEMENTATION_ROADMAP.MD - M4 Assessments; Dependencies: Tutor-orc, Progress)
- [M6] Develop VLM model inference pipeline for proctoring (Source: IMPLEMENTATION_ROADMAP.MD - M6 Proctor & Credentials)
- [M1-M2] [Tech Strategy] Design internal AI mesh gRPC interface and abstraction layer for AI service calls. (Source: IMPLEMENTATION_ROADMAP.MD - Technical Priority)
- [M1-M2] [Implementation] Implement proxy/abstraction layer for AI service calls (initial provider: Gemini). (Source: Water Classroom.md - MVP AI; Technical Priority)
- [M1-M2] [Implementation] Develop basic health checks and provider switching logic for AI mesh (manual switch initially). (Derived from AI Mesh strategy)
- [M3] Capture data using ClickHouse events and S3 lesson logs (Source: IMPLEMENTATION_ROADMAP.MD - AI/ML Dev Pipeline M3)
- [M4] Develop Feature Store using Feast on Postgres (Source: IMPLEMENTATION_ROADMAP.MD - AI/ML Dev Pipeline M4)
- [M4–M6] Set up Training infrastructure using Vertex AI / Ollama GPU nodes (Source: IMPLEMENTATION_ROADMAP.MD - AI/ML Dev Pipeline M4-M6)
- [M4] Deploy models using Triton Inference Server (GPU) (Source: IMPLEMENTATION_ROADMAP.MD - AI/ML Dev Pipeline M4)
- [Ongoing from M4] Implement nightly model drift reports using Evidently AI (Source: IMPLEMENTATION_ROADMAP.MD - AI/ML Dev Pipeline)
- [M4] Implement prompt guardrails for tutor-orc (Source: IMPLEMENTATION_ROADMAP.MD - AI/ML Dev Pipeline M4)
- [M4] Reduce Tutor LLM call cost to <$0.002 / message (caching) (Source: IMPLEMENTATION_ROADMAP.MD - Performance Milestone M4)

### Assessment, Progress & Credentials
(Includes Quizzes, Auto-Grading, Progress Tracking, Secure Proctoring, Credential Issuance)

- [M1] Achieve 100% unit test pass rate for auth service (Source: IMPLEMENTATION_ROADMAP.MD - M1 Auth & Profile success criteria)
- [M1] Achieve 100% integration test pass rate for auth service (Source: IMPLEMENTATION_ROADMAP.MD - M1 Auth & Profile success criteria)
- [M3] Implement event ingestion into ClickHouse for progress tracking (Source: IMPLEMENTATION_ROADMAP.MD - M3 Progress & Badges)
- [M3] Ensure analytics query p99 is less than 500 ms (Source: IMPLEMENTATION_ROADMAP.MD - M3 Progress & Badges NFR)
- [M4] Define Quiz schema for assessments (Source: IMPLEMENTATION_ROADMAP.MD - M4 Assessments)
- [M4] Develop auto-grading service for quizzes (MCQ focused for M4) (Source: IMPLEMENTATION_ROADMAP.MD - M4 Assessments; Success: Grade <3s for MCQ, >90% rubric parity)
- [M4] Ensure grade is returned in <3 s for Multiple Choice Questions (Source: IMPLEMENTATION_ROADMAP.MD - M4 NFR)
- [M4] Achieve >90% grading parity with rubric for auto-grading (Source: IMPLEMENTATION_ROADMAP.MD - M4 NFR)
- [M4] Implement basic proctor stub (Source: IMPLEMENTATION_ROADMAP.MD - M4 Assessments)
- [M6] Implement credential issuance using W3C Verifiable Credentials (Source: IMPLEMENTATION_ROADMAP.MD - M6 Proctor & Credentials)
- [M6] Achieve 95% cheat detection recall in test set for proctoring (Source: IMPLEMENTATION_ROADMAP.MD - M6 NFR)
- [Ongoing M1-M4] Define/Extend database schemas for upcoming services (User, Progress, Assessment, Tutor-Orchestrator, Notification) based on their respective milestone requirements and Todo items #10 & #13. (Refined task)

### Platform Infrastructure & Operations
(Includes IaC, CI/CD, Observability, Scaling, Security infrastructure, Database Management)

- Automate infra provisioning (Terraform) to identical dev/stage/prod. (Source: IMPLEMENTATION_ROADMAP.MD - Technical Priority; Likely M0-M1)
- [M0-M1] Develop Terraform modules for VPC, EKS, RDS, S3, CloudFront (using Terragrunt) (Source: IMPLEMENTATION_ROADMAP.MD - Infrastructure Plan)
- [M1] Set up Helm install for Prometheus, Loki, Jaeger, Grafana (Source: IMPLEMENTATION_ROADMAP.MD - Observability Plan M1)
- [M1] Create dashboards per service for observability (Source: IMPLEMENTATION_ROADMAP.MD - Observability Plan M1)
- [M1-M2] Configure Kubecost to alert if daily burn > budget ×1.1 (Source: IMPLEMENTATION_ROADMAP.MD - Cost Control Plan)
- [M0-M1] Configure GitHub Actions for Lint→Test→Build→SBOM→Container push (Source: IMPLEMENTATION_ROADMAP.MD - CI Plan; M0 CI pipeline live)
- [M1] Set up Argo CD with Helm umbrella chart per environment (Source: IMPLEMENTATION_ROADMAP.MD - CD Plan)
- [M2-M3] Implement blue/green deployments using Argo CD (Source: IMPLEMENTATION_ROADMAP.MD - CD Plan)
- [M1] Map AWS Secrets Manager to Kubernetes using External-Secrets Operator (Source: IMPLEMENTATION_ROADMAP.MD - Secrets Plan)
- [M6] Reduce infra cost / active learner to <$0.45 / month (Source: IMPLEMENTATION_ROADMAP.MD - Performance Milestone M6)
- [M0-M1] Implement infrastructure as code security scanning (Tfsec) (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan)

### Cross-Cutting Concerns
(Includes QA Strategy, Overall Security Policies, Performance Benchmarking, Documentation)

- Establish observability stack early to quantify performance. (Source: IMPLEMENTATION_ROADMAP.MD - Technical Priority; Covered by specific M1 tasks)
- Maintain backwards-compatible APIs; use contract tests. (Source: IMPLEMENTATION_ROADMAP.MD - Technical Priority)
- Implement unit tests (≥ 90% critical paths) using Go `testing` and Vitest (Source: IMPLEMENTATION_ROADMAP.MD - QA Strategy; Ongoing)
- [M1-M2] Implement contract tests using buf build gRPC and Dredd for REST (Source: IMPLEMENTATION_ROADMAP.MD - QA Strategy)
- Implement integration tests using Docker-Compose and Postman collections (Source: IMPLEMENTATION_ROADMAP.MD - QA Strategy; Ongoing, e.g. M1 Auth)
- [M2-M3] Implement E2E tests using Playwright cloud to simulate learner journey (Source: IMPLEMENTATION_ROADMAP.MD - QA Strategy)
- [M5] Implement load tests using k6 (target 2k RPS API-gateway w/ p95 <300 ms by M5) (Source: IMPLEMENTATION_ROADMAP.MD - QA Strategy)
- [M1-M2] Implement security tests using OWASP ZAP scan nightly (Source: IMPLEMENTATION_ROADMAP.MD - QA Strategy)
- [M0-M1] Integrate GoSec & npm audit in CI pipeline (Source: IMPLEMENTATION_ROADMAP.MD - QA Strategy)
- [M1] Perform Threat model (STRIDE) for auth flows (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan M1)
- [M2] Add rate-limit middleware to API-gateway (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan M2)
- [M3] Create DPA & GDPR record, implement parental consent flow (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan M3)
- [M4] Conduct VAPT external pen-test (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan M4)
- [M5] Perform SOC 2 gap analysis & define policies (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan M5)
- [M6] Prepare for SOC 2 Type I audit (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan M6)
- [M1] Enforce TLS 1.3 (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan)
- [M1] Implement JWT RS256 rotation (Source: IMPLEMENTATION_ROADMAP.MD - Security Plan; Relates to M1 JWT flows)
- [M5] Conduct accessibility sweep (WCAG 2.1 AA) - continuous with formal audit M5 (Source: IMPLEMENTATION_ROADMAP.MD - UX/Design Evolution M5)
- [M3] Achieve API-gateway 95p latency <200 ms @ 1k RPS (Source: IMPLEMENTATION_ROADMAP.MD - Performance Milestone M3)
- [M5] Scale WS Realtime hub to 10k concurrent users / node (Source: IMPLEMENTATION_ROADMAP.MD - Performance Milestone M5)
- [M5] Commit load-test scripts under `load/` (Source: IMPLEMENTATION_ROADMAP.MD - Performance Plan)
- [M1-M2] Wire alerts to PagerDuty (Source: IMPLEMENTATION_ROADMAP.MD - Performance Plan)
- [M6] Ensure mobile DAU / web DAU is >= 0.4 (Source: IMPLEMENTATION_ROADMAP.MD - M6 KPI)

---
## Future/Backlog
(Tasks designated as Post-M6, Phase 2, Phase 3, or lower priority for initial M1-M6 delivery. Note: PRODUCT_OVERVIEW.MD Q2-26 Creator Marketplace date needs reconciliation with M1-M6 roadmap if these are prioritized sooner.)

### Desktop Application (Tauri - Phase 2)
- Set up Tauri development environment. (Source: Water Classroom.md - Phase 2)
- Adapt web frontend (Svelte/React) for Tauri build. (Source: Water Classroom.md - Phase 2)
- Implement desktop-specific features (e.g., enhanced offline capabilities, notifications). (Source: Water Classroom.md - Phase 2)
- Package and test desktop applications for Windows, macOS, and Linux. (Source: Water Classroom.md - Phase 2)

### Creator Tools & Marketplace (Post-M6 / Discrepancy with Product Overview Q2-26 Timeline)
- [EPIC] Develop In-App Content Editors (Source: PRODUCT_OVERVIEW.MD - Creator Marketplace)
    - [Phase 1 - Lessons] Specify requirements and design for in-app lesson editor (e.g., text, image, simple quiz integration).
    - [Phase 1 - Lessons] Develop basic lesson editor UI components based on design.
    - [Phase 1 - Lessons] Implement content saving/loading mechanisms for the lesson editor.
    - [Phase 2 - Mini-games] Specify requirements and design for in-app mini-game editor/template system.
    - [Phase 2 - Mini-games] Develop basic mini-game editor UI components.
    - [Phase 2 - Mini-games] Implement saving/loading for mini-game configurations.
- Define content guidelines and moderation policies for marketplace submissions. (Source: PRODUCT_OVERVIEW.MD)
- [Design] Define tokenomics, reward rules, and earning mechanisms for creator contributions. (Source: PRODUCT_OVERVIEW.MD)
- [Implementation] Develop backend logic for tracking creator contributions eligible for rewards.
- [Implementation] Develop ledger system or integration for managing and distributing token rewards.
- [Implementation] Develop UI for creators to view their contributions, earned rewards, and potential payouts.
- [Legal/Ops] Establish payout pipeline and legal framework for creator earnings.
- Implement 70/30 rev-share model for marketplace (Source: PRODUCT_OVERVIEW.MD)
- Create token wallet for creators (Source: PRODUCT_OVERVIEW.MD - Q2-26?)
- Develop payout pipeline for creator earnings (Source: PRODUCT_OVERVIEW.MD - Q2-26?)

### Gamified 'Innovation Labs' (Post-M6 / Phase 2-3)
- (Source: Water Classroom.md - Phase 2-3)
- Define overall concept, learning objectives, and core mechanics for 'Innovation Labs'.
- Develop [N] specific lab scenarios/challenges for initial rollout (e.g., Water Cycle Lab, Pollution Control Lab).
- Implement UI/UX for accessing and interacting with Innovation Labs.
- Integrate Innovation Labs with progress tracking and potential reward systems.

### Advanced AI Capabilities (Phase 2-3)
- Integrate AI translation capabilities for content and tutoring for new languages. (Source: Water Classroom.md - Phase 3)
- Integrate Speech-to-Text (STT) services for user input for Voice Tutoring. (Source: Water Classroom.md - Phase 2)
- Integrate Text-to-Speech (TTS) services for AI tutor responses for Voice Tutoring. (Source: Water Classroom.md - Phase 2)
- Adapt AI Tutor Orchestration service to handle voice interactions. (Source: Water Classroom.md - Phase 2)
- Develop algorithms for more sophisticated adaptation based on detailed analytics from game interactions and learning progress. (Source: Water Classroom.md - Phase 3)
- Design and implement a system for tracking detailed analytics from game interactions (beyond M3 basics). (Source: Water Classroom.md - Phase 3)

### Extended Curriculum & Community Features (Phase 3 / Later Phase)
- Plan and implement UI localization for new languages. (Source: Water Classroom.md - Phase 3)
- Design and implement Project-Based Learning Modules framework. (Source: Water Classroom.md - Phase 2+)
    - Define structure for PBL modules.
    - Create authoring tools for PBL modules.
    - Develop tracking and assessment mechanisms for PBL.
- Develop enhanced tools for curriculum customization by educators/creators. (Source: Water Classroom.md - Phase 3)
- Implement features for user-generated curriculum creation and sharing. (Source: Water Classroom.md - Phase 3)
- Develop optional tools for curriculum augmentation by educators. (Source: Water Classroom.md - Later Phase)
- Create classroom management tools for educators. (Source: Water Classroom.md - Later Phase)
- Implement student enrollment features for institutional packages. (Source: Water Classroom.md - Later Phase)
- Develop forums for student interaction. (Source: Water Classroom.md - Phase 3)
- Implement student showcases for projects. (Source: Water Classroom.md - Phase 3)
- Create features for collaborative projects. (Source: Water Classroom.md - Phase 3)

*(Note: The Google OAuth task under 'Core Platform & User Experience' was provisionally removed based on Todo list item #2 stating 'google signup. (done)'. If this is not fully complete, it should be re-added or clarified.)*
