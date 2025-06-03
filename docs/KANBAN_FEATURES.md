# Water Classroom - Kanban Features List

This document outlines the features and tasks to be implemented for the Water Classroom project, compiled from various project documents. It is intended for use in a Kanban board or similar task management system.

## Epics / Major Feature Areas

(Note: Tasks below are not yet fully sorted into these epics, but are listed by their original source or milestone. Further refinement can be done when importing to a Kanban tool.)

### Core Platform & User Experience
(Includes Authentication, User Profiles, Basic UI/UX, Frontend Setup)

### Curriculum & Content Management
(Includes Curriculum CRUD, Lesson Structure, Content Delivery, Admin Panels for Content)

### Learning & Engagement Features
(Includes Interactive Lessons, Single & Multiplayer Games, Gamification elements like Badges, Streaks)

### AI & Tutoring System
(Includes AI Tutor Integration, LLM Orchestration, Prompt Engineering, AI Model Pipelines)

### Assessment, Progress & Credentials
(Includes Quizzes, Auto-Grading, Progress Tracking, Secure Proctoring, Credential Issuance)

### Creator & Community Ecosystem
(Includes Creator Marketplace, Tokenization, Community Forums, Collaborative Tools)

### Platform Infrastructure & Operations
(Includes IaC, CI/CD, Observability, Scaling, Security infrastructure, Database Management)

### Cross-Cutting Concerns
(Includes QA Strategy, Overall Security Policies, Performance Benchmarking, Documentation)

---

## M1: Auth & Profile
- Complete JWT flows
- Implement Google OAuth
- Create email templates for verification, password reset, etc.
- Ensure Register/login flow is under 300 ms p95
- Achieve 100% unit test pass rate for auth service
- Achieve 100% integration test pass rate for auth service

## M2: Curriculum CRUD
- Implement gRPC & REST endpoints for curriculum service
- Develop React admin UI for teachers (manage curriculum)
- Implement S3 signed-URL uploads for media content
- Ensure Create/Publish lesson flow is under 1 min
- Achieve 95% test coverage in curriculum service

## M3: Progress & Badges
- Implement event ingestion into ClickHouse for progress tracking
- Develop Badge rule DSL (Domain Specific Language)
- Create FE streak widgets for user dashboard
- Ensure badge is granted within 5 seconds of trigger event
- Ensure analytics query p99 is less than 500 ms

## M4: Assessments
- Define Quiz schema for assessments
- Develop auto-grading service for quizzes
- Implement tutor chat context injection
- Ensure grade is returned in <3 s for Multiple Choice Questions
- Achieve >90% grading parity with rubric for auto-grading
- Implement basic proctor stub

## M5: Multiplayer
- Develop Realtime hub using Go and Redis pub/sub
- Create Matchmaking API for multiplayer games
- Develop Game #1: Fraction Frenzy
- Implement toxicity filter for chat/communication
- Ensure 100 concurrent sessions with <250 ms Round Trip Time (RTT)
- Ensure zero crashes in 2-hour soak test

## M6: Proctor & Credentials
- Develop VLM model inference pipeline for proctoring
- Implement credential issuance using W3C Verifiable Credentials
- Achieve mobile Flutter parity with web features
- Achieve 95% cheat detection recall in test set for proctoring
- Ensure mobile DAU / web DAU is >= 0.4
- Prepare for SOC 2 Type I audit

# Technical Implementation Priorities
- Harden core services: `auth`, `curriculum`, `progress` before feature breadth.
- Establish observability stack early to quantify performance.
- Build internal AI mesh behind gRPC to swap providers cheaply.
- Maintain backwards-compatible APIs; use contract tests.
- Automate infra provisioning (Terraform) to identical dev/stage/prod.

# Infrastructure
- Develop Terraform modules for VPC, EKS, RDS, S3, CloudFront (using Terragrunt)
- Set up Helm install for Prometheus, Loki, Jaeger, Grafana
- Create dashboards per service for observability by M1
- Configure Kubecost to alert if daily burn > budget ×1.1

# DevOps
- Configure GitHub Actions for Lint→Test→Build→SBOM→Container push
- Set up Argo CD with Helm umbrella chart per environment
- Implement blue/green deployments using Argo CD
- Map AWS Secrets Manager to Kubernetes using External-Secrets Operator

# AI/ML
- Capture data using ClickHouse events and S3 lesson logs (M3)
- Develop Feature Store using Feast on Postgres (M4)
- Set up Training infrastructure using Vertex AI / Ollama GPU nodes (M4 – M6)
- Deploy models using Triton Inference Server (GPU) (M4)
- Implement nightly model drift reports using Evidently AI
- Implement prompt guardrails for tutor-orc (M4)

# QA
- Implement unit tests (≥ 90% critical paths) using Go `testing` and Vitest
- Implement contract tests using buf build gRPC and Dredd for REST
- Implement integration tests using Docker-Compose and Postman collections
- Implement E2E tests using Playwright cloud to simulate learner journey
- Implement load tests using k6 (target 2k RPS API-gateway w/ p95 <300 ms by M5)
- Implement security tests using OWASP ZAP scan nightly
- Integrate GoSec & npm audit in CI pipeline

# Security
- Perform Threat model (STRIDE) for auth flows (M1)
- Add rate-limit middleware to API-gateway (M2)
- Create DPA & GDPR record, implement parental consent flow (M3)
- Conduct VAPT external pen-test (M4)
- Perform SOC 2 gap analysis & define policies (M5)
- Undergo SOC 2 Type I audit (M6)
- Enforce TLS 1.3
- Implement JWT RS256 rotation
- Implement infrastructure as code security scanning (Tfsec)

# UX/UI
- Deliver Design System v1 (Tailwind tokens) (M1)
- Develop Gamification Components (XP bar, leaderboards) (M3)
- Implement responsive overhaul for mobile PWA (M4)
- Conduct accessibility sweep (WCAG 2.1 AA) - continuous with formal audit M5
- Auto-generate Flutter Design Tokens from Figma (M6)
- Track UX KPIs: Task-success >90%; SUS score >80; bounce rate <15%

# Performance
- Achieve API-gateway 95p latency <200 ms @ 1k RPS (M3)
- Reduce Tutor LLM call cost to <$0.002 / message (caching) (M4)
- Scale WS Realtime hub to 10k concurrent users / node (M5)
- Reduce infra cost / active learner to <$0.45 / month (M6)
- Commit load-test scripts under `load/`
- Wire alerts to PagerDuty

## Additional Features from Product Overview/Vision

### Creator Marketplace (PRODUCT_OVERVIEW.md, Water Classroom.md)
- Design and implement token-based rewards system for creators (PRODUCT_OVERVIEW.md)
- Develop in-app editor for lessons and mini-games (PRODUCT_OVERVIEW.md)
- Implement 70/30 rev-share model for marketplace (PRODUCT_OVERVIEW.md)
- Create token wallet for creators (PRODUCT_OVERVIEW.md)
- Develop payout pipeline for creator earnings (PRODUCT_OVERVIEW.md)
- Define content guidelines and moderation policies for marketplace submissions.

### Advanced Personalization (Water Classroom.md - Phase 3)
- Develop algorithms for more sophisticated adaptation based on detailed analytics from game interactions and learning progress.
- Design and implement a system for tracking detailed analytics from game interactions.

### Community Features (Water Classroom.md - Phase 3)
- Develop forums for student interaction.
- Implement student showcases for projects.
- Create features for collaborative projects.

### Deeper Curriculum Integration (Water Classroom.md - Phase 3)
- Develop enhanced tools for curriculum customization by educators/creators.
- Implement features for user-generated curriculum creation and sharing.

### Broader Language Support (Water Classroom.md - Phase 3)
- Plan and implement UI localization for new languages.
- Integrate AI translation capabilities for content and tutoring for new languages.

### Real-World Application & Creative Skill Development (Water Classroom.md)
- Design and implement Project-Based Learning Modules framework.
    - Define structure for PBL modules.
    - Crate authoring tools for PBL modules.
    - Develop tracking and assessment mechanisms for PBL.
- Design and implement Gamified 'Innovation Labs'.
    - Define concept and mechanics for Innovation Labs.
    - Develop specific lab scenarios or challenges.

### Educator & Institutional Integration (Water Classroom.md)
- Develop optional tools for curriculum augmentation by educators.
- Create classroom management tools for educators.
- Implement student enrollment features for institutional packages.

### Desktop App - Tauri (Water Classroom.md - Phase 2)
- Set up Tauri development environment.
- Adapt web frontend (Svelte) for Tauri build.
- Implement desktop-specific features (e.g., enhanced offline capabilities, notifications).
- Package and test desktop applications for Windows, macOS, and Linux.

### Voice Tutoring (Water Classroom.md - Phase 2)
- Integrate Speech-to-Text (STT) services for user input.
- Integrate Text-to-Speech (TTS) services for AI tutor responses.
- Adapt AI Tutor Orchestration service to handle voice interactions.

### Limited Offline Access (Water Classroom.md)
- Design mechanism for caching lesson content and essential data on client devices.
- Implement service workers (for PWA/web) for offline content access.
- Develop synchronization logic for progress made offline.

## Additional Features from Todo File
- Review and extend database schemas for all services beyond initial auth/curriculum (e.g., progress, assessment, payment, user, notification, tutor-orchestrator).
