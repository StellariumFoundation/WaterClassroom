# Water Classroom 🌊🎓  
AI-Powered Learning Ecosystem

A flagship Stellarium Foundation project bringing **personalised, accessible, and engaging education** to learners everywhere.  
This repository hosts the **full-stack reference implementation**:

* React + TypeScript web client (current POC) – will evolve into Flutter multi-platform apps.
* Go micro-services backend – Auth, Curriculum, Progress, Assessment, Tutor, etc.
* AI integration layer – Gemini for content / tutoring (POC) plus service mesh for future fine-tuned models.

---

## 1. Quick Links
| Resource | Path |
|----------|------|
| Foundational Engineering Docs | `Technical.md` |
| Contributing Guide | `CONTRIBUTING.md` |
| Code of Conduct | `CODE_OF_CONDUCT.md` _(coming)_ |
| Backend Makefile cheatsheet | `backend/Makefile` |

---

## 2. Repository Structure

```
.
├── components/            # React UI atoms & molecules
├── pages/                 # Route-level views (Landing, Dashboard…)
├── services/              # Frontend API / AI helpers
├── backend/               # All Go micro-services & infra
│   ├── auth-svc/          # Example service (registration, login, JWT)
│   ├── ...                # user-svc, curriculum-svc, etc.
│   ├── deployments/       # docker-compose & helm charts
│   ├── proto/             # protobuf contracts
│   └── Makefile           # dev shortcuts (build, test, migrate…)
├── i18n/                  # Localisation files
├── hooks/, contexts/      # React hooks & context providers
├── Technical.md           # Architecture & specs
└── README.md
```

---

## 3. Architecture (High-Level)

```
Client (Web / Mobile / Desktop)
        ↓ HTTPS / WebSocket
API-Gateway (REST)  ── gRPC ──► Go Micro-Services
        ↓                                 ↓
    Caching (Redis)                AI Service Mesh (LLMs, VLMs)
        ↓                                 ↓
      PostgreSQL/ClickHouse (state)   Object Storage (media, exam footage)
```

Detailed design, data models and sequence diagrams live in **Technical.md**.

---

## 4. Running Locally

### 4.1 Prerequisites
| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| Go | ≥ 1.22 |
| Docker & Docker-Compose | latest |
| make | ≥ 4 |

### 4.2 Clone & Bootstrap
```bash
git clone https://github.com/StellariumFoundation/WaterClassroom.git
cd WaterClassroom
```

### 4.3 Frontend (React P💧C)
```bash
npm install
# add your key
echo "GEMINI_API_KEY=<your_google_gemini_key>" > .env.local
npm run dev                # http://localhost:5173
```

### 4.4 Backend (all services via Docker-Compose)
```bash
cd backend
make dev-up                # builds & starts Postgres, Redis, RabbitMQ, Jaeger, micro-services
make logs                  # follow aggregated logs
```

Endpoints after startup:

| Service | URL |
|---------|-----|
| API Gateway (REST) | http://localhost:8081 |
| Auth Service (REST) | http://localhost:8080 |
| Jaeger UI | http://localhost:16686 |
| RabbitMQ UI | http://localhost:15672 (guest/guest) |
| MailHog (SMTP sandbox) | http://localhost:8025 |

_To stop everything_: `make dev-down`

### 4.5 Building for Production
```bash
# Web
npm run build   # output in dist/

# Backend example
cd backend/auth-svc
go build -o bin/auth ./cmd
```

Container images are produced via **GitHub Actions** and deployed with **Argo CD** to EKS (see `deployments/helm/`).

---

## 5. Development Workflow

* **Branch naming** – `feat/<scope>`, `fix/<scope>`  
* **Conventional Commits** – enforced by CI  
* **Lint / Test** – `npm run lint && npm test` (frontend) • `make test` (backend)  
* **PR** – one approving review + green CI required before merge to `main`.

Detailed guidelines: **CONTRIBUTING.md**

---

## 6. Technology Stack

| Layer | Tech |
|-------|------|
| Web POC | React 19, Vite 6, TailwindCSS |
| Planned Client | Flutter (Web / iOS / Android / Desktop) |
| API | Go 1.22 (Gin/Echo) • gRPC internal |
| DB | PostgreSQL (relational), ClickHouse/TimeScaleDB (analytics) |
| Cache | Redis |
| MQ | RabbitMQ |
| AI | Google Gemini (POC), internal LLMs (future) |
| Observability | OpenTelemetry → Jaeger, Grafana/Loki |

---

## 7. Contributing 🤝

We welcome PRs for:

* UI/UX polish and a11y fixes  
* Backend service implementation (handlers, gRPC, sqlc)  
* Unit / integration tests  
* Curriculum data & localisation files  
* AI prompt engineering, evaluation harness

Please read **CONTRIBUTING.md** before you start – it covers environment setup, code style, commit conventions, and the CLA/bot process.

Good first issues are labelled **`good-first-issue`**.

---

## 8. License

```
Apache License 2.0
Copyright © 2025 Stellarium Foundation
```

See [`LICENSE`](LICENSE) for the full text.

---

## 9. Community & Support

* GitHub Discussions – feature proposals, Q&A  
* Discord – `#water-classroom` channel for realtime chat  
* Email – hello@stellarium.foundation  

Together we can build an **ocean of knowledge** accessible to every learner. 🌍✨
