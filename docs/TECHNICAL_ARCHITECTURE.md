# Water Classroom – Technical Architecture  
Version 1.0 · 30 May 2025  
Author: Platform Engineering @ Stellarium Foundation  

---

## 0 · Reading Map  
1. System Architecture Overview  
2. Micro-services Design & Service Breakdown  
3. AI Integration Layer & ML Pipelines  
4. Data Architecture & Storage Strategy  
5. Front-end & Multi-Platform Architecture  
6. Security & Compliance Framework  
7. Scalability & Performance Engineering  
8. DevOps & Deployment Strategy  
9. API Design & Integration Points  
10. Monitoring & Observability  

---

## 1 · System Architecture Overview  

```
+───────────── Client Tier ─────────────┐
│  Web SPA (React)     Flutter (Roadmap)│
│  • HTTPS REST/WS                      │
└───────────────┬───────────────────────┘
                │
         +──────▼───────────────────────────────────────────────+
         │               API-GATEWAY  (REST)                   │
         │  • Rate-limit  • JWT auth  • GraphQL (roadmap)      │
         +───┬──────────────────┬───────────────────┬──────────+
             │gRPC internal     │Events (RabbitMQ)  │
┌────────────▼──────────┐  ┌────▼─────────┐   ┌─────▼─────────┐
│ Auth-svc              │  │ Tutor-orc-svc│   │ Notification │
│ User / OAuth / JWT    │  │ LLM proxy    │   │ Email & Push │
└──────┬───────────┬────┘  └────┬─────────┘   └─────┬─────────┘
       │           │           │                   │
┌──────▼────┐ ┌────▼─────┐ ┌───▼────────┐   ┌─────▼─────────┐
│ Curriculum│ │ Progress │ │ Assessment │   │ Real-time Hub │
│  CRUD     │ │ badges   │ │ Exams/proc │   │ WS presence   │
└────┬──────┘ └────┬─────┘ └────┬───────┘   └───────────────┘
     │             │            │
     ▼             ▼            ▼
 Postgres   ClickHouse   Object-Storage(S3) + Redis + VectorDB
```

Key patterns  

* **Edge**: API-Gateway centralises cross-cutting concerns.  
* **Services**: Each bounded context owns its DB schema (Database-per-Service).  
* **Async Events**: RabbitMQ event bus decouples long-running workflows (e.g., exam grading Saga).  
* **AI Mesh**: Internal AI services abstract underlying LLM/VLM endpoints.

---

## 2 · Micro-services Design & Breakdown  

| Service | Purpose | External API | DB | Notes |
|---------|---------|-------------|----|-------|
| `auth-svc` | Register/Login, JWT, OAuth2 (Google, Apple) | REST `/auth/*` + gRPC | PostgreSQL `users`, Redis (sessions) | Issues RS256 tokens. |
| `user-svc` | Profile, avatars, preferences | REST `/users/*` | PostgreSQL `profiles` | Consumes auth events. |
| `curriculum-svc` | Curricula, courses, lessons CRUD & search | REST `/curricula/*` | PostgreSQL `curriculum` | Emits `LessonPublished` event. |
| `progress-svc` | Lecture completion, streaks, badges | REST `/progress/*` | ClickHouse `events` | Consumer of `LessonCompleted`. |
| `assessment-svc` | Homework, exams; orchestrates Proctoring & Grading | REST `/assessments/*` | PostgreSQL `assessments`, S3 media | Saga pattern; publishes `ExamGraded`. |
| `tutor-orc-svc` | Manages tutor chat sessions, context gather, RAG | gRPC `TutorService` | Vector DB (pgvector) | Rate-limits LLM calls. |
| `notification-svc` | Email/SMS/WebPush | RabbitMQ consumer | — | Uses templated SendGrid. |
| `realtime-hub` | Multiplayer games, chat, presence | WebSocket `/ws/*` | Redis pub/sub | Horizontal scaling via sticky sessions. |

### Common Go Patterns  

```go
// internal/event/broker.go
type Broker interface {
  Publish(ctx context.Context, topic string, msg any) error
  Subscribe(ctx context.Context, topic string, h Handler) error
}
```

Each service wires `Broker` to RabbitMQ implementation; allows NATS swap-in later.

Services generated from `*.proto` definitions share models with the web client via Buf build → TS & Dart stubs.

---

## 3 · AI Integration Layer  

### 3.1 Component Map  

```
Tutor-orc-svc ──► ContentGen-svc ──► LLM Provider Pool
                 ▲                            │
 Assessment-svc ─┘                            │Gemini, open-weights, fine-tunes
```

| Component | Responsibility | Tech |
|-----------|----------------|------|
| **ContentGen-svc** | Generates & stores lesson JSON, quiz items, hints. | Streaming Gemini API + RAG |
| **Tutor-orc-svc** | Maintains chat context, student profile, vector search. | Go + pgvector |
| **Proctor-AI** *(M4 roadmap)* | Frame diff, head-pose, object detection for cheating. | VLM (YOLOv8) + WebRTC ingest |

#### Prompt-Pipeline Example (Go)

```go
tpl := `You are an enthusiastic tutor...`
resp := gemini.Stream(ctx, tpl, chatHistory, docSnippets)
```

### 3.2 ML Lifecycle  

1. **Data Capture** – lecture clickstreams, tutor Q&A stored in ClickHouse.  
2. **Feature Pipelines** – dbt + Airflow build embeddings nightly.  
3. **Fine-tuning** – Scheduled Vertex AI / Ollama custom models.  
4. **Serving** – Triton inference in GPU node pool; monitored via Prometheus GPU exporter.

---

## 4 · Data Architecture  

| Store | Workload | Rationale |
|-------|----------|-----------|
| PostgreSQL | relational (users, curriculum) | ACID, rich joins |
| ClickHouse | analytics events, progress | columnar, blazing fast aggregation |
| Redis | cache, WS presence, rate-limit | <1 ms ops |
| RabbitMQ | async workflows | routing, retries, dead-letter |
| S3-compatible | media, exam artefacts | cheap, lifecycle policies |
| pgvector / Weaviate | embeddings | semantic search |

Data lineage catalogued in OpenMetadata; PII encryption at field level (`pgcrypto`).

---

## 5 · Frontend & Multi-Platform Strategy  

### 5.1 React SPA (today)  
* **Vite 6 + React 19** with Tailwind theme.  
* Route split by domain: `pages/CurriculumPage`, `LecturePage`, `TutorPage`.  
* State-Mgmt: Context API → Roadmap to Zustand for concurrency features.  
* Service-worker caches lesson JSON for offline use; background sync to `progress-svc`.

### 5.2 Real-time Engine  
* `realtime-hub` exposes WS; client wraps in React Hook `useRealtimeChannel`.  
* JSON messages: `{type:"GAME_ACTION", payload:{…}}`.

### 5.3 Flutter Roadmap  
* Single codebase for iOS/Android/Desktop; gRPC-generated stubs; reuse GraphQL queries.  
* Shared design tokens via Figma → FlutterGen.

---

## 6 · Security & Compliance  

| Layer | Control |
|-------|---------|
| Transport | HTTPS/TLS 1.3, HSTS, WSS |
| AuthN | OAuth2 + email/pass, JWT RS256, refresh tokens |
| AuthZ | Oso policy engine, RBAC + ABAC (student/teacher/admin) |
| Data | AES-256 at rest (RDS, S3 SSE-KMS), Column-level PII encryption |
| Rate-limit | Redis token bucket (100 req/min default) |
| Secure Coding | GoSec, Snyk scans, Dependabot |
| Exams | Proctor-AI VLM, on-device processing, minimal retention (auto-purge 30 days) |
| Compliance | GDPR, COPPA – parental consent flow; SOC 2 Type I target Q4 2025 |

---

## 7 · Scalability & Performance  

* **Kubernetes (EKS/GKE)** – each svc horizontal pod auto-scales on CPU & latency.  
* **HPA + Karpenter Spot** for cost-efficiency; GPU node pool for AI.  
* **API-Gateway** (Envoy) rate-limits & request-coalesces “tutor” endpoints.  
* **Read optimisation** – CQRS: assessments write DB, progress reads ClickHouse.  
* **Caching** – Redis `GET /curricula/:id` TTL 5 m ⇒ 80 % hit ratio.  
* **Game WS** – sharded by student ID % N; Redis cluster pub/sub fan-out.

---

## 8 · DevOps & Delivery  

| Stage | Tooling |
|-------|---------|
| CI | GitHub Actions workflow `.github/workflows/ci.yml` – lint+test+build |
| Build | Multi-arch Docker buildx; sbom attach |
| CD | Argo CD GitOps – `backend/deployments/helm` umbrella chart |
| IaC | Terraform modules – VPC, RDS, EKS, S3, CloudFront |
| Secrets | External-Secrets Operator → AWS Secrets Manager |
| Release | Semantic-release; tags push Helm chart + container images |
| Canary | Argo Rollouts 10/20/30; metric guardrails (99p latency <250 ms) |

---

## 9 · API Design & Integration  

### 9.1 REST Guidelines  
* Versioned path `/api/v1/...` – auth header `Bearer <token>`.  
* JSON:API conventions, snake_case keys.

### 9.2 gRPC Contracts (internal)  

```proto
service TutorService {
  rpc Chat(stream TutorMessage) returns (stream TutorMessage) {}
}
```

### 9.3 GraphQL Gateway (roadmap)  
* Read-optimised aggregations for client; persisted queries only.

### 9.4 External Integrations  
* LTI 1.3 Provider endpoint `/lti/launch` (edu LMS).  
* Webhooks: `assessment.graded`, `badge.awarded`.  
* Payment: Stripe Checkout webhook → `billing-svc` (future).  

---

## 10 · Monitoring & Observability  

| Signal | Stack |
|--------|-------|
| Metrics | Prometheus → Grafana dashboards (`api-gateway`, `tutor-latency`) |
| Logs | Loki w/ correlated traceID |
| Traces | OpenTelemetry SDK (Go & JS) → Jaeger |
| Alerts | Alertmanager → PagerDuty; SLO: 99.9 % availability / 28-day |
| RUM | Sentry browser SDK, performance spans |
| Chaos | LitmusChaos quarterly game-day on staging |

Example Prometheus alert:

```
ALERT HighTutorLatency
  IF histogram_quantile(0.95, rate(tutor_latency_seconds_bucket[5m])) > 3
  FOR 2m
  LABELS { severity="critical" }
  ANNOTATIONS {
    summary = "Tutor 95p latency >3s for 5 min",
    runbook = "https://runbooks.stellarium.tech/tutor-latency"
  }
```

---

## 11 · Roadmap Snapshot  

| Milestone | Infra | Feature |
|-----------|-------|---------|
| **M3** | ClickHouse live | Badge engine, leaderboards |
| **M4** | Proctor-AI VLM | Secure webcam exams |
| **M5** | Flutter beta | Offline PWA full sync |
| **M6** | Multi-tenant SaaS | Marketplace & revenue share |

---

*This document is a living artefact; contributions via PR welcome.*  
© 2025 Stellarium Foundation
