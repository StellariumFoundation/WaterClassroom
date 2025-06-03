# Water Classroom 🌊🎓  
AI-Powered Learning Ecosystem  

A flagship Stellarium Foundation project bringing **personalised, accessible, and engaging education** to learners everywhere.  
This repository hosts the **backend services** for the Water Classroom project:

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
├── backend/               # Go micro-services & infra
│   ├── auth-svc/          # Example service
│   ├── …                  # user-svc, curriculum-svc, …
│   ├── deployments/       # docker-compose & helm
│   └── Makefile           # service utility targets
├── docs/                  # Documentation files (like this one, Technical.md)
├── Makefile               # root targets (build / run / test backend)
└── README.md
```

---

## 3 · High-Level Architecture
```
External Clients (Web / Mobile / Desktop)
        ↓ HTTPS / WS
API-Gateway (REST) ── gRPC ──► Go Micro-Services (This Repository)
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
| Go | ≥ 1.22 |
| Docker & Docker-Compose | latest |
| make | ≥ 4 |

### 4.2 Clone & Bootstrap
```bash
git clone https://github.com/StellariumFoundation/WaterClassroom.git
cd WaterClassroom
```
The root `make install` target is a no-op. Backend dependencies are managed within each service's `go.mod` file or via `make -C backend install`.

### 4.3 Backend (via Makefile)
| Task | Command |
|------|---------|
| Start all services | `make run-backend-dev` |
| View logs          | `make logs-backend-dev` |
| Stop services      | `make stop-backend-dev` |

During image build each service runs `go mod tidy` if `go.sum` is missing.  
Generate and commit `go.sum` locally for reproducibility (`go mod tidy && git add go.sum`).

### 4.4 Building Production Backend Images
```
make build
```
This target:
1. Builds production images for key backend services, e.g. `wc-auth-svc:latest`.

Individual image builds:
```
make build-auth-svc-prod-image
```

### 4.5 Running Tests
| Scope | Command |
|-------|---------|
| All Backend   | `make test` (runs `make test-backend`) |
| Specific Backend Service | `make -C backend/auth-svc test` (example) |
| All Backend Services | `make test-backend` |

### 4.6 Frontend (via npm/vite)
To run the frontend development server:
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   This will typically start the server on `http://localhost:5173`.

---

## 5 · Cloud Deployment (Render Example)

Dockerfiles now tolerate missing `go.sum` files by generating them at build-time, so Render can **build straight from Git**, or you can push images built via `make build`.

### 5.1 Pre-build & Push (recommended for faster deploys)
```bash
# Build images locally
make build
# Tag & push to registry, e.g. ghcr.io/your-org/wc-auth-svc:prod
docker tag wc-auth-svc:latest ghcr.io/your-org/wc-auth-svc:prod # Example for auth-svc
docker push ghcr.io/your-org/wc-auth-svc:prod
# repeat for other backend services as needed
```

### 5.2 Render Setup Cheat-sheet
1. **Database** → Create Postgres on Render (or external).
2. **Environment Group** → add shared secrets (`POSTGRES_URI`, `JWT_*`, `GEMINI_API_KEY`, …).
3. **Services**  
   | Name | Type | Source |
   |------|------|--------|
   | auth-svc | Web Service | Dockerfile `backend/auth-svc/Dockerfile` |
   | user-svc | Web Service | Dockerfile `backend/user-svc/Dockerfile` |
   | … (add other backend services as needed) |
4. **Assign Env Group** to each service.
5. **Deploy** – Render will build and run the images. Client applications will connect to these backend services.

---

## 6 · Development Workflow
* **Branches** `feat/*`, `fix/*`
* **Conventional Commits** enforced by CI
* **Lint / Test** → `make test` (for backend services)
* **PRs** → 1 approval + green CI to merge to `main`

---

## 7 · Tech Stack
| Layer | Tech |
|-------|------|
| API | Go 1.22 (Gin/Echo), gRPC |
| DB | PostgreSQL, ClickHouse |
| Cache | Redis |
| MQ | RabbitMQ |
| AI | Google Gemini (POC) |
| Observability | OpenTelemetry → Jaeger |

---

## 8 · Contributing 🤝
PRs welcome for backend services, tests, and documentation.  
See **CONTRIBUTING.md** for setup, style, commit rules and CLA.

---

## 9 · License
Apache 2.0 © 2025 Stellarium Foundation  

Together we can build an **ocean of knowledge** accessible to every learner 🌍✨
