# Water Classroom – Implementation Roadmap  
Version 1.0 · 30 May 2025  
Audience: Engineering, Product, Project Leads  

---

## 0 · Roadmap Philosophy  
Deliver value in **6-week increments** (“Milestones”) with demo-able outcomes, strict CI/CD automation, and data-driven iteration. Each milestone closes with:  
* ✅ All acceptance tests green (unit, integration, e2e)  
* 📊 Metrics reviewed vs. success criteria  
* 📦 Docker images tagged `vX.Y.Z` and deployed to **staging**  

---

## 1 · Milestones & Timeline (Gantt-style summary)

| Milestone | Calendar | Core Outcomes |
|-----------|----------|---------------|
| **M0** – Bootstrap | Jun – Jul 2025 | CI pipeline live, coding standards, service skeletons (#done) |
| **M1** – Auth MVP + FE Login | Aug 2025 | `auth-svc` prod-ready (register/login/email verify), React login flow, RDS in cloud |
| **M2** – Curriculum CRUD & Admin | Sep – Oct 2025 | `curriculum-svc`, admin panel, lesson JSON schema v1, S3 media upload |
| **M3** – Progress & Badges | Nov – Dec 2025 | `progress-svc`, badge engine, ClickHouse analytics, FE dashboard |
| **M4** – Assessments & Auto-Grading | Jan – Mar 2026 | `assessment-svc` with quizzes, auto-grading, tutor-orc rate-limit, basic proctor stub |
| **M5** – Multiplayer Games & Realtime Hub | Apr – Jun 2026 | `realtime-hub`, WS infra, first collaborative game, scaling tests |
| **M6** – Secure Proctoring & Flutter Beta | Jul – Sep 2026 | VLM proctoring, credential issuance, Flutter mobile beta, SOC 2 Type I audit prep |

---

## 2 · Technical Implementation Priorities  

1. Harden **core services** (`auth`, `curriculum`, `progress`) before feature breadth.  
2. Establish **observability stack** early to quantify performance.  
3. Build **internal AI mesh** behind gRPC to swap providers cheaply.  
4. Maintain **backwards-compatible APIs**; use contract tests.  
5. Automate **infra provisioning** (Terraform) to identical dev/stage/prod.

---

## 3 · Feature Development Roadmap  

| Milestone | Feature | Key Tasks | Dependencies | Success Criteria |
|-----------|---------|-----------|--------------|------------------|
| M1 | Auth & Profile | • Complete JWT flows • Google OAuth • Email templates | Postgres, SendGrid | Register→login under 300 ms p95; 100 % unit & integration test pass |
| M2 | Curriculum CRUD | • gRPC & REST endpoints • React admin UI (role=teacher) • S3 signed-URL uploads | Auth RBAC | Create/Publish lesson in <1 min; 95 % test coverage in svc |
| M3 | Progress & Badges | • Event ingestion ClickHouse • Badge rule DSL • FE streak widgets | Curriculum events | Badge granted within 5 s of trigger; analytics query 99p <500 ms |
| M4 | Assessments | • Quiz schema • Auto-grading service • Tutor chat context injection | Tutor-orc, Progress | Grade returned in <3 s for MCQ; >90 % grading parity with rubric |
| M5 | Multiplayer | • Realtime hub (Go, Redis pub/sub) • Matchmaking API • Game #1 (Fraction Frenzy) • Toxicity filter | Auth WS tokens | 100 concurrent sessions <250 ms RTT; zero crash in soak test 2 h |
| M6 | Proctor & Credentials | • VLM model inference pipeline • Credential issuance W3C VC • Mobile Flutter parity | Assessment, Tutor | 95 % cheat detection recall in test set; mobile DAU / web DAU ≥0.4 |

---

## 4 · Infrastructure & DevOps Plan  

| Layer | Tool | Action Items |
|-------|------|--------------|
| IaC | Terraform + Terragrunt | Modules for VPC, EKS, RDS, S3, CloudFront |
| CI | GitHub Actions | Lint→Test→Build→SBOM→Container push |
| CD | Argo CD | Helm umbrella chart per env, blue/green deployments |
| Secrets | External-Secrets Operator | Map AWS Secrets Mgr ➜ K8s |
| Observability | Prometheus + Loki + Jaeger + Grafana | Helm install, dashboards per svc by M1 |
| Cost | Kubecost | Alert if daily burn > budget ×1.1 |

---

## 5 · AI / ML Development Pipeline  

| Stage | Tech | Timeline |
|-------|------|----------|
| Data Capture | ClickHouse events, S3 lesson logs | M3 |
| Feature Store | Feast on Postgres | M4 |
| Training | Vertex AI / Ollama GPU nodes | M4 – M6 |
| Deployment | Triton Inference Server (GPU) | M4 |
| Evaluation | Evidently AI drift reports | Nightly |
| Safety | Prompt guardrails (tutor-orc) | M4 |

---

## 6 · Quality Assurance & Testing Strategy  

* **Unit tests** (≥ 90 % critical paths) – Go `testing`, Vitest.  
* **Contract tests** – buf build gRPC + Dredd for REST.  
* **Integration tests** – Docker-Compose bring-up, run Postman collection.  
* **E2E** – Playwright cloud, simulate learner journey.  
* **Load tests** – k6; target 2 k RPS API-gateway w/ p95 <300 ms by M5.  
* **Security tests** – OWASP ZAP scan nightly; GoSec & npm audit in CI.

---

## 7 · Security & Compliance Implementation  

| Milestone | Task | Owner |
|-----------|------|-------|
| M1 | Threat model (STRIDE) for auth flows | Security Guild |
| M2 | Add rate-limit middleware to API-gateway | Platform |
| M3 | DPA & GDPR record, parental consent flow | Legal + Backend |
| M4 | VAPT external pen-test | Third-party |
| M5 | SOC 2 gap analysis & policies | SecOps |
| M6 | SOC 2 Type I audit | SecOps |

Keys: TLS 1.3 enforcement, JWT RS256 rotation, infrastructure as code security scanning (Tfsec).

---

## 8 · User Experience & Design Evolution  

1. **Design System v1** (Tailwind tokens) – delivered M1.  
2. **Gamification Components** (XP bar, leaderboards) – M3.  
3. **Responsive overhaul** for mobile PWA – M4.  
4. **Accessibility sweep** (WCAG 2.1 AA) – continuous with formal audit M5.  
5. **Flutter Design Tokens** auto-generated from Figma – M6.

UX KPIs: Task-success >90 %; SUS score >80; bounce rate <15 %.

---

## 9 · Performance & Scalability Milestones  

| Metric | Target | Due |
|--------|--------|-----|
| API-gateway 95p latency | <200 ms @ 1 k RPS | M3 |
| Tutor LLM call cost | <\$0.002 / message (caching) | M4 |
| WS Realtime hub | 10 k concurrent users / node | M5 |
| Infra cost / active learner | <\$0.45 / month | M6 |

Load-test scripts committed under `load/`. Alerts wired to PagerDuty.

---

## 10 · Team Structure & Resources  

| Squad | Roles | Scope | FTE (start→M6) |
|-------|-------|-------|---------------|
| Platform | 1 EM, 3 Go devs, 1 SRE | Core micro-services, infra, CI/CD | 5 → 6 |
| Front-end | 1 EM, 4 React devs, 2 Flutter devs (add M5) | Web/PWA, mobile, design system | 4 → 7 |
| AI/ML | 1 Lead, 2 ML Eng, 1 Data Eng | Tutor, content gen, analytics models | 0 → 4 |
| Product & Design | 1 PM, 1 UX, 1 Visual Designer | Roadmap & UX | 3 → 3 |
| Security & Compliance | 1 SecOps, 0.5 legal liaison | Policies, audits, pen-tests | 0 → 1.5 |
| QA / Automation | 1 SDET | Test frameworks & coverage | 0 → 1 |

Hiring plan coordinated with finance; contractors may back-fill spikes.

---

## 11 · Dependencies & Risk Log (excerpt)

| Dependency | Risk | Mitigation |
|------------|------|-----------|
| LLM provider pricing | Cost spikes | Multi-provider mesh, usage cache |
| GPU supply | Delays inference rollout | Cloud Spot GPU, queue system |
| School pilot data privacy | Legal blockers | Early DPA templates, EU data residency |

---

## 12 · Glossary  

* **LLM** – Large Language Model  
* **VLM** – Vision-Language Model  
* **HPA** – Horizontal Pod Autoscaler  
* **SLO** – Service Level Objective  

---

*Living document – update via PR after each milestone retrospective.*  
© 2025 Stellarium Foundation  
