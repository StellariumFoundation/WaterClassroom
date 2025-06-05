# Water Classroom – Implementation Roadmap  
Version 1.1 · October 28, 2023 (Monolith Update)
Audience: Engineering, Product, Project Leads  

---

## 0 · Roadmap Philosophy  
Deliver value in **6-week increments** (“Milestones”) with demo-able outcomes, strict CI/CD automation, and data-driven iteration. Each milestone closes with:  
* ✅ All acceptance tests green (unit, integration, e2e)  
* 📊 Metrics reviewed vs. success criteria  
* 📦 Docker image tagged `vX.Y.Z` and deployed to **staging**

---

## 1 · Milestones & Timeline (Gantt-style summary)

| Milestone | Calendar | Core Outcomes |
|-----------|----------|---------------|
| **M0** – Bootstrap | Jun – Jul 2025 | CI pipeline live, coding standards, **monolith module skeletons** (#done) |
| **M1** – Auth MVP + FE Login | Aug 2025 | **Auth module (within monolith)** prod-ready (register/login/email verify), React login flow, RDS in cloud |
| **M2** – Curriculum CRUD & Admin | Sep – Oct 2025 | **Curriculum module (within monolith)**, admin panel, lesson JSON schema v1, S3 media upload |
| **M3** – Progress & Badges | Nov – Dec 2025 | **Progress module (within monolith)**, badge engine, ClickHouse analytics, FE dashboard |
| **M4** – Assessments & Auto-Grading | Jan – Mar 2026 | **Assessment module (within monolith)** with quizzes, auto-grading, **Tutor Orchestration module** rate-limit, basic proctor stub |
| **M5** – Multiplayer Games & Realtime Hub | Apr – Jun 2026 | **Realtime module/functionality (within monolith)**, WebSocket infra, first collaborative game, scaling tests |
| **M6** – Secure Proctoring & Flutter Beta | Jul – Sep 2026 | VLM proctoring, credential issuance, Flutter mobile beta, SOC 2 Type I audit prep |

---

## 2 · Technical Implementation Priorities  

1. Harden **core modules** (`auth`, `curriculum`, `progress`) within the monolith.
2. Establish **observability stack** early to quantify performance of the monolith and its key modules.
3. Build **internal AI abstraction layer** within the `tutor_orchestrator` module to swap providers cheaply.
4. Maintain **backwards-compatible APIs** for the monolith's external interface; use contract tests for this API. Unit and integration tests cover internal module interactions.
5. Automate **infra provisioning** (Terraform) for the monolith and its dependencies (DB, cache, etc.) to ensure identical dev/stage/prod environments.

---

## 3 · Feature Development Roadmap  

| Milestone | Feature | Key Tasks | Dependencies | Success Criteria |
|-----------|---------|-----------|--------------|------------------|
| M1 | Auth & Profile | • Complete JWT flows • Google OAuth • Email templates | Postgres, SendGrid | Register→login under 300 ms p95; 100 % unit & integration test pass for `auth` module |
| M2 | Curriculum CRUD | • REST endpoints • React admin UI (role=teacher) • S3 signed-URL uploads | `auth` module RBAC | Create/Publish lesson in <1 min; 95 % test coverage in `curriculum` module |
| M3 | Progress & Badges | • Event ingestion ClickHouse • Badge rule DSL • FE streak widgets | `curriculum` module events | Badge granted within 5 s of trigger; analytics query 99p <500 ms |
| M4 | Assessments | • Quiz schema • Auto-grading logic within `assessment` module • Tutor chat context injection (from `tutor_orchestrator` module) | `tutor_orchestrator` module, `progress` module | Grade returned in <3 s for MCQ; >90 % grading parity with rubric |
| M5 | Multiplayer | • Realtime hub (Go, Redis pub/sub, WebSockets integrated into monolith) • Matchmaking API • Game #1 (Fraction Frenzy) • Toxicity filter | `auth` module for WS tokens | 100 concurrent sessions <250 ms RTT; zero crash in soak test 2 h |
| M6 | Proctor & Credentials | • VLM model inference pipeline • Credential issuance W3C VC • Mobile Flutter parity | `assessment` module, `tutor_orchestrator` module | 95 % cheat detection recall in test set; mobile DAU / web DAU ≥0.4 |

---

## 4 · Infrastructure & DevOps Plan  

| Layer | Tool | Action Items |
|-------|------|--------------|
| IaC | Terraform + Terragrunt | Modules for VPC, EKS (for monolith), RDS, S3, CloudFront |
| CI | GitHub Actions | Lint→Test→Build→SBOM→Container push (for monolith application) |
| CD | Argo CD | Helm chart for monolith deployment, blue/green deployments for the monolith |
| Secrets | External-Secrets Operator | Map AWS Secrets Mgr ➜ K8s secrets for the monolith |
| Observability | Prometheus + Loki + Jaeger + Grafana | Helm install, dashboards for the monolith (with module-level detail where possible) by M1 |
| Cost | Kubecost | Alert if daily burn for monolith resources > budget ×1.1 |

---

## 5 · AI / ML Development Pipeline  

| Stage | Tech | Timeline |
|-------|------|----------|
| Data Capture | ClickHouse events, S3 lesson logs | M3 |
| Feature Store | Feast on Postgres | M4 |
| Training | Vertex AI / Ollama GPU nodes | M4 – M6 |
| Deployment | Triton Inference Server (GPU) - accessed by `tutor_orchestrator` module | M4 |
| Evaluation | Evidently AI drift reports | Nightly |
| Safety | Prompt guardrails (within `tutor_orchestrator` module) | M4 |

---

## 6 · Quality Assurance & Testing Strategy  

* **Unit tests** (≥ 90 % critical paths) – Go `testing` for modules, Vitest for frontend.
* **Contract tests** – Dredd for the monolith's public REST API.
* **Integration tests** – Docker-Compose for monolith + DB, run Postman collection.
* **E2E** – Playwright cloud, simulate learner journey against the monolith.
* **Load tests** – k6; target 2 k RPS for monolith's API w/ p95 <300 ms by M5.
* **Security tests** – OWASP ZAP scan nightly against monolith; GoSec & npm audit in CI.

---

## 7 · Security & Compliance Implementation  

| Milestone | Task | Owner |
|-----------|------|-------|
| M1 | Threat model (STRIDE) for auth flows within `auth` module | Security Guild |
| M2 | Add rate-limit middleware to the monolith's public API endpoints | Platform |
| M3 | DPA & GDPR record, parental consent flow (leveraging `auth` and `user` data) | Legal + Backend |
| M4 | VAPT external pen-test (against monolith and cloud infra) | Third-party |
| M5 | SOC 2 gap analysis & policies | SecOps |
| M6 | SOC 2 Type I audit | SecOps |

Keys: TLS 1.3 enforcement, JWT RS256 rotation, infrastructure as code security scanning (Tfsec).

---

## 8 · User Experience & Design Evolution  

1. **Design System v1** (Tailwind tokens) – delivered M1.  
2. **Gamification Components** (XP bar, leaderboards) – M3 (data from `progress` module).
3. **Responsive overhaul** for mobile PWA – M4.  
4. **Accessibility sweep** (WCAG 2.1 AA) – continuous with formal audit M5.  
5. **Flutter Design Tokens** auto-generated from Figma – M6.

UX KPIs: Task-success >90 %; SUS score >80; bounce rate <15 %.

---

## 9 · Performance & Scalability Milestones  

| Metric | Target | Due |
|--------|--------|-----|
| Monolith API 95p latency | <200 ms @ 1 k RPS | M3 |
| Tutor LLM call cost | <\$0.002 / message (caching within `tutor_orchestrator` module) | M4 |
| WebSocket Realtime (within monolith) | 10 k concurrent users / monolith node (target, may require dedicated nodes later) | M5 |
| Infra cost / active learner | <\$0.45 / month | M6 |

Load-test scripts committed under `load/`. Alerts wired to PagerDuty.

---

## 10 · Team Structure & Resources  

| Squad | Roles | Scope | FTE (start→M6) |
|-------|-------|-------|---------------|
| Platform | 1 EM, 3 Go devs, 1 SRE | Core monolith modules, infra, CI/CD | 5 → 6 |
| Front-end | 1 EM, 4 React devs, 2 Flutter devs (add M5) | Web/PWA, mobile, design system | 4 → 7 |
| AI/ML | 1 Lead, 2 ML Eng, 1 Data Eng | Tutor logic (in `tutor_orchestrator`), content gen, analytics models | 0 → 4 |
| Product & Design | 1 PM, 1 UX, 1 Visual Designer | Roadmap & UX | 3 → 3 |
| Security & Compliance | 1 SecOps, 0.5 legal liaison | Policies, audits, pen-tests | 0 → 1.5 |
| QA / Automation | 1 SDET | Test frameworks & coverage | 0 → 1 |

Hiring plan coordinated with finance; contractors may back-fill spikes.

---

## 11 · Dependencies & Risk Log (excerpt)

| Dependency | Risk | Mitigation |
|------------|------|-----------|
| LLM provider pricing | Cost spikes | Multi-provider abstraction in `tutor_orchestrator` module, usage cache |
| GPU supply | Delays inference rollout | Cloud Spot GPU, queue system for AI tasks |
| School pilot data privacy | Legal blockers | Early DPA templates, EU data residency |

---

## 12 · Glossary  

* **LLM** – Large Language Model  
* **VLM** – Vision-Language Model  
* **HPA** – Horizontal Pod Autoscaler (for monolith instances)
* **SLO** – Service Level Objective  

---

*Living document – update via PR after each milestone retrospective.*  
© 2025 Stellarium Foundation
