# Water Classroom - Kanban Features List

This document outlines the features and tasks to be implemented for the Water Classroom project, compiled from various project documents. It is intended for use in a Kanban board or similar task management system.

## Epics / Major Feature Areas

(Note: Tasks below are not yet fully sorted into these epics, but are listed by their original source or milestone. Further refinement can be done when importing to a Kanban tool.)

### Core Platform & User Experience
(Includes Authentication, User Profiles, Basic UI/UX, Frontend Setup)

### Curriculum & Content Management
(Includes Curriculum CRUD, Lesson Structure, Content Delivery, Admin Panels for Content - all as modules within the monolith)

### Learning & Engagement Features
(Includes Interactive Lessons, Single & Multiplayer Games, Gamification elements like Badges, Streaks - features interacting with various monolith modules)

### AI & Tutoring System
(Includes AI Tutor Integration, LLM Orchestration, Prompt Engineering, AI Model Pipelines - primarily via the `tutor_orchestrator` module)

### Assessment, Progress & Credentials
(Includes Quizzes, Auto-Grading, Progress Tracking, Secure Proctoring, Credential Issuance - via `assessment`, `progress`, and other monolith modules)

### Creator & Community Ecosystem
(Includes Creator Marketplace, Tokenization, Community Forums, Collaborative Tools - future features interacting with the monolith's API and modules)

### Platform Infrastructure & Operations
(Includes IaC, CI/CD, Observability, Scaling, Security infrastructure for the **monolith application**, Database Management)

### Cross-Cutting Concerns
(Includes QA Strategy, Overall Security Policies, Performance Benchmarking, Documentation for the monolith)

---

## Core Platform & User Experience
- [M1] Complete JWT flows (within `auth` module)
- [M1] Implement Google OAuth (within `auth` module)
- [M1] Create email templates for verification, password reset, etc. (used by `auth` and `notification` modules)
- [M1] Ensure Register/login flow is under 300 ms p95 (API performance of monolith)
- [M6] Achieve mobile Flutter parity with web features
- Ongoing: Prioritize hardening core **modules** (`auth`, `curriculum`, `progress`) through security reviews, performance tuning, and refactoring as needed. (From: Technical Implementation Priorities)
- [M1] Deliver Design System v1 (Tailwind tokens)
- [M1-M2] Setup initial Flutter project for Web and one Mobile OS (e.g., Android) to support MVP features.
- [M2-M3] Implement user authentication (login/registration) and basic curriculum browsing in the initial Flutter application (interacting with monolith API).
- [M2-M3] Define and implement structure for delivering interactive lesson content (text, images, simple embedded quizzes) based on the outcome of the M2 investigation task. (Related to MVP interactive lessons, content served by monolith)
- [M4] Implement responsive overhaul for mobile PWA
- [M6] Auto-generate Flutter Design Tokens from Figma
- Track UX KPIs: Task-success >90%; SUS score >80; bounce rate <15% (From: UX/UI)
- Set up Tauri development environment. (Source: Water Classroom.md - Phase 2)
- Adapt web frontend (Svelte) for Tauri build. (Source: Water Classroom.md - Phase 2)
- Implement desktop-specific features (e.g., enhanced offline capabilities, notifications). (Source: Water Classroom.md - Phase 2)
- Package and test desktop applications for Windows, macOS, and Linux. (Source: Water Classroom.md - Phase 2)
- [M4-M5] Design mechanism for caching lesson content and essential data on client devices. (Source: Water Classroom.md)
- [M4-M5] Implement service workers (for PWA/web) for offline content access. (Source: Water Classroom.md)
- [M4-M5] Develop synchronization logic for progress made offline (syncing with monolith's `progress` module).

## Curriculum & Content Management
- [M2] Implement REST endpoints for curriculum **module**
- [M2] Develop React admin UI for teachers (manage curriculum via monolith API)
- [M2] Implement S3 signed-URL uploads for media content (logic within relevant monolith module)
- [M2] Ensure Create/Publish lesson flow is under 1 min
- [M2] Achieve 95% test coverage in curriculum **module**
- [EPIC - Creator Tools] Develop In-App Content Editors: (Source: PRODUCT_OVERVIEW.md)
    - [Phase 1 - Lessons] Specify requirements and design for in-app lesson editor (e.g., text, image, simple quiz integration).
    - [Phase 1 - Lessons] Develop basic lesson editor UI components based on design.
    - [Phase 1 - Lessons] Implement content saving/loading mechanisms for the lesson editor (via monolith API to `curriculum` module).
    - [Phase 2 - Mini-games] Specify requirements and design for in-app mini-game editor/template system.
    - [Phase 2 - Mini-games] Develop basic mini-game editor UI components.
    - [Phase 2 - Mini-games] Implement saving/loading for mini-game configurations.
- [Post-M6 / Creator Marketplace MVP] Define content guidelines and moderation policies for marketplace submissions. (Source: PRODUCT_OVERVIEW.md)
- [M2] Investigate and decide on the format and storage mechanism for interactive lesson content (e.g., considering HTML files in repo synced to DB, JSON structures, or other headless CMS approaches - data managed by `curriculum` module). (Source: Todo File #14)

## Learning & Engagement Features
- [M3] Develop Badge rule DSL (Domain Specific Language) (logic within `progress` or a new `gamification` module)
- [M3] Create FE streak widgets for user dashboard
- [M3] Ensure badge is granted within 5 seconds of trigger event
- [M5] Develop Realtime hub using Go and Redis pub/sub (as part of the monolith or a closely integrated component)
- [M5] Create Matchmaking API for multiplayer games (on monolith)
- [M5] Develop Game #1: Fraction Frenzy
- [M5] Implement toxicity filter for chat/communication
- [M5] Ensure 100 concurrent sessions with <250 ms Round Trip Time (RTT)
- [M5] Ensure zero crashes in 2-hour soak test
- [M3] Develop Gamification Components (XP bar, leaderboards)
- [Post-M6 / Phase 2-3] Design and implement Gamified 'Innovation Labs': (Source: Water Classroom.md)
    - Define overall concept, learning objectives, and core mechanics for 'Innovation Labs'.
    - Develop [N] specific lab scenarios/challenges for initial rollout (e.g., Water Cycle Lab, Pollution Control Lab).
    - Implement UI/UX for accessing and interacting with Innovation Labs.
    - Integrate Innovation Labs with progress tracking (`progress` module) and potential reward systems.

## AI & Tutoring System
- [M4] Implement tutor chat context injection (within `tutor_orchestrator` module)
- [M6] Develop VLM model inference pipeline for proctoring (interfacing with `assessment` module)
- [M1-M2] [Tech Strategy] Design internal AI abstraction layer within the `tutor_orchestrator` module for AI service calls.
- [M1-M2] [Implementation] Implement proxy/abstraction layer for AI service calls (initial provider: Gemini) within `tutor_orchestrator` module.
- [M1-M2] [Implementation] Develop basic health checks and provider switching logic for AI abstraction layer (manual switch initially).
- [M3] Capture data using ClickHouse events and S3 lesson logs
- [M4] Develop Feature Store using Feast on Postgres
- [M4 – M6] Set up Training infrastructure using Vertex AI / Ollama GPU nodes
- [M4] Deploy models using Triton Inference Server (GPU) (accessed by `tutor_orchestrator` module)
- [Ongoing from M4] Implement nightly model drift reports using Evidently AI (From: AI/ML)
- [M4] Implement prompt guardrails (within `tutor_orchestrator` module)
- [M4] Reduce Tutor LLM call cost to <$0.002 / message (caching in `tutor_orchestrator` module)
- Integrate AI translation capabilities for content and tutoring for new languages. (Source: Water Classroom.md - Phase 3, affects `curriculum` and `tutor_orchestrator` modules)
- Integrate Speech-to-Text (STT) services for user input. (Source: Water Classroom.md - Phase 2, affects `tutor_orchestrator` module)
- Integrate Text-to-Speech (TTS) services for AI tutor responses. (Source: Water Classroom.md - Phase 2, affects `tutor_orchestrator` module)
- Adapt `tutor_orchestrator` module to handle voice interactions. (Source: Water Classroom.md - Phase 2)

## Assessment, Progress & Credentials
- [M1] Achieve 100% unit test pass rate for `auth` module
- [M1] Achieve 100% integration test pass rate for `auth` module interactions
- [M3] Implement event ingestion into ClickHouse for progress tracking (from `progress` module)
- [M3] Ensure analytics query p99 is less than 500 ms
- [M4] Define Quiz schema for assessments (in `assessment` module)
- [M4] Develop auto-grading logic within `assessment` module
- [M4] Ensure grade is returned in <3 s for Multiple Choice Questions
- [M4] Achieve >90% grading parity with rubric for auto-grading
- [M4] Implement basic proctor stub (in `assessment` module)
- [M6] Implement credential issuance using W3C Verifiable Credentials (likely a new `credential` module or part of `assessment`)
- [M6] Achieve 95% cheat detection recall in test set for proctoring
- [Ongoing M1-M3] Review and extend database schemas for all **modules** beyond initial auth/curriculum (e.g., progress, assessment, payment, user, notification, tutor-orchestrator). (Source: Todo File)

## Creator & Community Ecosystem
- [Post-M6 / Creator Marketplace MVP] [Design] Define tokenomics, reward rules, and earning mechanisms for creator contributions. (Source: PRODUCT_OVERVIEW.md, Replaces: Design and implement token-based rewards system for creators)
- [Post-M6 / Creator Marketplace MVP] [Implementation] Develop backend logic (within relevant monolith modules) for tracking creator contributions eligible for rewards.
- [Post-M6 / Creator Marketplace MVP] [Implementation] Develop ledger system or integration for managing and distributing token rewards.
- [Post-M6 / Creator Marketplace MVP] [Implementation] Develop UI for creators to view their contributions, earned rewards, and potential payouts.
- [Post-M6 / Creator Marketplace MVP] [Legal/Ops] Establish payout pipeline and legal framework for creator earnings.
- [Post-M6 / Creator Marketplace MVP] Implement 70/30 rev-share model for marketplace (Source: PRODUCT_OVERVIEW.md)
- [Post-M6 / Creator Marketplace MVP] Create token wallet for creators (Source: PRODUCT_OVERVIEW.md)
- [Post-M6 / Creator Marketplace MVP] Develop payout pipeline for creator earnings (Source: PRODUCT_OVERVIEW.md)

## Platform Infrastructure & Operations
- Automate infra provisioning (Terraform) to identical dev/stage/prod for the **monolith application**. (From: Technical Implementation Priorities)
- Develop Terraform modules for VPC, EKS (for monolith), RDS, S3, CloudFront (using Terragrunt) (From: Infrastructure)
- Set up Helm install for Prometheus, Loki, Jaeger, Grafana (From: Infrastructure)
- [M1] Create dashboards for **monolith application** (with module-level detail where possible) for observability
- Configure Kubecost to alert if daily burn > budget ×1.1 (From: Infrastructure)
- Configure GitHub Actions for Lint→Test→Build→SBOM→Container push (for the monolith application) (From: DevOps)
- Set up Argo CD with Helm chart for **monolith deployment** (From: DevOps)
- Implement blue/green deployments using Argo CD (for the monolith) (From: DevOps)
- Map AWS Secrets Manager to Kubernetes using External-Secrets Operator (From: DevOps)
- [M6] Reduce infra cost / active learner to <$0.45 / month
- Implement infrastructure as code security scanning (Tfsec) (From: Security)

## Cross-Cutting Concerns
- Establish observability stack early to quantify performance of the monolith. (From: Technical Implementation Priorities)
- Maintain backwards-compatible APIs for the monolith's external interface; use contract tests. (From: Technical Implementation Priorities)
- Implement unit tests (≥ 90% critical paths) using Go `testing` (for modules) and Vitest (From: QA)
- Implement contract tests using Dredd for REST (for monolith's public API) (From: QA)
- Implement integration tests using Docker-Compose (monolith + DB) and Postman collections (From: QA)
- Implement E2E tests using Playwright cloud to simulate learner journey (against monolith) (From: QA)
- [M5] Implement load tests using k6 (target 2k RPS for monolith's API w/ p95 <300 ms by M5)
- Implement security tests using OWASP ZAP scan nightly (against monolith) (From: QA)
- Integrate GoSec & npm audit in CI pipeline (From: QA)
- [M1] Perform Threat model (STRIDE) for auth flows (within `auth` module)
- [M2] Add rate-limit middleware to the monolith's public API endpoints
- [M3] Create DPA & GDPR record, implement parental consent flow
- [M4] Conduct VAPT external pen-test (against monolith and cloud infra)
- [M5] Perform SOC 2 gap analysis & define policies
- [M6] Prepare for SOC 2 Type I audit
- Enforce TLS 1.3 (From: Security)
- Implement JWT RS256 rotation (From: Security)
- [M5] Conduct accessibility sweep (WCAG 2.1 AA) - continuous with formal audit M5
- [M3] Achieve monolith API 95p latency <200 ms @ 1k RPS
- [M5] Scale WebSocket Realtime functionality (within monolith) to 10k concurrent users / monolith node
- Commit load-test scripts under `load/` (From: Performance)
- Wire alerts to PagerDuty (From: Performance)
- [M6] Ensure mobile DAU / web DAU is >= 0.4

## Future/Backlog
- Develop algorithms for more sophisticated adaptation based on detailed analytics from game interactions and learning progress. (Source: Water Classroom.md - Phase 3, affects `progress` and `tutor_orchestrator` modules)
- Design and implement a system for tracking detailed analytics from game interactions. (Source: Water Classroom.md - Phase 3)
- Plan and implement UI localization for new languages. (Source: Water Classroom.md - Phase 3)
- Design and implement Project-Based Learning Modules framework. (Source: Water Classroom.md)
- Define structure for PBL modules. (Source: Water Classroom.md)
- Create authoring tools for PBL modules. (Source: Water Classroom.md)
- Develop tracking and assessment mechanisms for PBL. (Source: Water Classroom.md)
- Develop enhanced tools for curriculum customization by educators/creators. (Source: Water Classroom.md - Phase 3)
- Implement features for user-generated curriculum creation and sharing. (Source: Water Classroom.md - Phase 3)
- Develop optional tools for curriculum augmentation by educators. (Source: Water Classroom.md) (Later Phase)
- Create classroom management tools for educators. (Source: Water Classroom.md) (Later Phase)
- Implement student enrollment features for institutional packages. (Source: Water Classroom.md) (Later Phase)
- Develop forums for student interaction. (Source: Water Classroom.md - Phase 3)
- Implement student showcases for projects. (Source: Water Classroom.md - Phase 3)
- Create features for collaborative projects. (Source: Water Classroom.md - Phase 3)

[end of docs/KANBAN_FEATURES.md]
