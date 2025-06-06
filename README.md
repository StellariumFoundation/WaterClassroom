[![Docker Image CI](https://github.com/StellariumFoundation/WaterClassroom/actions/workflows/docker-image.yml/badge.svg?branch=Development)](https://github.com/StellariumFoundation/WaterClassroom/actions/workflows/docker-image.yml)

# Water Classroom 🌊🎓  
AI-Powered Learning Ecosystem  

A flagship Stellarium Foundation project bringing **personalised, accessible, and engaging education** to learners everywhere.  
This repository hosts the **full-stack reference implementation**:

* React + TypeScript web client (current POC) – will evolve into Flutter multi-platform apps
* Go micro-services backend – Auth, Curriculum, Progress, Assessment, Tutor, etc.
* AI integration layer – Google Gemini for content / tutoring (POC) plus service mesh for future fine-tuned models

---

## 1 · Quick Links
| Resource | Path |
|----------|------|
| Architecture & Specs | `Technical.md` |
| Contributing Guide   | `CONTRIBUTING.md` |
| CI / CD Pipeline     | `.github/workflows/ci.yml` |
| Backend Cheat-sheet  | `backend/Makefile` |

---

## 2 · Repository Structure
```
.
├── components/            # React UI atoms & molecules
├── pages/                 # Route-level views
├── services/              # Front-end API / AI helpers
├── backend/               # Go micro-services & infra
│   ├── auth-svc/          # Example service
│   ├── …                  # user-svc, curriculum-svc, …
│   ├── deployments/       # docker-compose & helm
│   └── Makefile           # service utility targets
├── i18n/                  # Localisation files
├── Makefile               # 🆕 root targets (build / run / test)
└── README.md
```

---

## 3 · High-Level Architecture
```
Client (Web / Mobile / Desktop)
        ↓ HTTPS / WS
API-Gateway (REST) ── gRPC ──► Go Micro-Services
        ↓                            ↓
      Redis                    AI Service Mesh
        ↓                            ↓
 Postgres / ClickHouse      Object Storage
```

---

## 4 · Running Locally

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

### 4.3 Frontend (via Makefile)
| Task | Command |
|------|---------|
| Install deps | `make install-frontend` (or `make install`) |
| Dev server   | `make run-frontend-dev` |
| Preview prod | `make preview-frontend` |

`make install` runs `npm install` which **generates `package-lock.json` when absent**.  
Commit this file (`git add package-lock.json`) for deterministic builds.

### 4.4 Backend (via Makefile)
| Task | Command |
|------|---------|
| Start all services | `make run-backend-dev` |
| View logs          | `make logs-backend-dev` |
| Stop services      | `make stop-backend-dev` |

During image build each service runs `go mod tidy` if `go.sum` is missing.  
Generate and commit `go.sum` locally for reproducibility (`go mod tidy && git add go.sum`).

### 4.5 Building Production Assets & Images
```
make build
```
This target:
1. Builds frontend static assets to `dist/`.
2. Creates the production frontend image: `water-classroom-frontend:latest`.
3. Builds production images for key backend services, e.g. `wc-auth-svc:latest`.

Individual image builds:
```
make build-frontend-prod-image
make build-auth-svc-prod-image
```

### 4.6 Running Tests
| Scope | Command |
|-------|---------|
| All   | `make test` |
| FE    | `make test-frontend` |
| BE    | `make test-backend` |

---

## 5 · Cloud Deployment (Render Example)

Dockerfiles now tolerate missing lock / sum files by generating them at build-time, so Render can **build straight from Git**, or you can push images built via `make build`.

### 5.1 Pre-build & Push (recommended for faster deploys)
```bash
# Build images locally
make build
# Tag & push to registry, e.g. ghcr.io/your-org/wc-frontend:prod
docker tag water-classroom-frontend:latest ghcr.io/your-org/wc-frontend:prod
docker push ghcr.io/your-org/wc-frontend:prod
# repeat for wc-auth-svc:latest …
```

### 5.2 Render Setup Cheat-sheet
1. **Database** → Create Postgres on Render (or external).
2. **Environment Group** → add shared secrets (`POSTGRES_URI`, `JWT_*`, `GEMINI_API_KEY`, …).
3. **Services**  
   | Name | Type | Source |
   |------|------|--------|
   | Frontend | Web Service | Docker → image `ghcr.io/your-org/wc-frontend:prod` *or* repo root |
   | auth-svc | Web Service | Dockerfile `backend/auth-svc/Dockerfile` |
   | … |
4. **Assign Env Group** to each service.
5. **Deploy** – Render will run or build images; the frontend service URL becomes your app entry point.

---

## 6 · Development Workflow
* **Branches** `feat/*`, `fix/*`
* **Conventional Commits** enforced by CI
* **Lint / Test** → `make test`
* **PRs** → 1 approval + green CI to merge to `main`

---

## 7 · Tech Stack
| Layer | Tech |
|-------|------|
| Web | React 19, Vite 6, Tailwind |
| Planned Client | Flutter |
| API | Go 1.22 (Gin/Echo), gRPC |
| DB | PostgreSQL, ClickHouse |
| Cache | Redis |
| MQ | RabbitMQ |
| AI | Google Gemini (POC) |
| Observability | OpenTelemetry → Jaeger |

---

## 8 · Contributing 🤝
PRs welcome for UI, backend, tests, docs & localisation.  
See **CONTRIBUTING.md** for setup, style, commit rules and CLA.

---

## 9 · License
Apache 2.0 © 2025 Stellarium Foundation  

Together we can build an **ocean of knowledge** accessible to every learner 🌍✨
