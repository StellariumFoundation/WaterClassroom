# Water Classroom – Developer Guide  
Version 1.0 · 30 May 2025  
Audience: Contributors & Internal Engineers  

---

## 1 · Development Environment Setup  

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 18.x | tested on 18.20 |
| Go | ≥ 1.22 | install via `asdf` or official pkg |
| Docker / Docker-compose | latest | compose v2 CLI |
| make | ≥ 4 | root `Makefile` shortcuts |
| buf | ≥ 1.31 | protobuf toolchain (optional) |
| pgcli / psql | latest | DB poking |
| Redis-CLI | latest | caching & rate-limit debug |

```bash
# clone & bootstrap
git clone https://github.com/StellariumFoundation/WaterClassroom.git
cd WaterClassroom
make install          # installs FE deps
make run-backend-dev  # docker-compose up for all Go services + deps
make run-frontend-dev # vite dev server http://localhost:5173
```

Environment variables live in `.env.local` (frontend) and `backend/**/configs/.env.example`.  
Copy, fill secrets, **never commit real keys**.

---

## 2 · Project Structure & Code Organisation  

```
.
├── components/          # React UI atoms/molecules
├── pages/               # Route-level views
├── services/            # FE helpers (API, Gemini)
├── backend/             # Go micro-services monorepo
│   ├── auth-svc/
│   ├── curriculum-svc/
│   ├── progress-svc/
│   └── ...              # assessment, tutor-orchestrator
├── i18n/                # locale JSON
├── Makefile             # root convenience targets
└── docs/                # product & tech docs (this file)
```

Backend services are **self-contained**: each folder has `cmd/main.go`, `configs/`, `migrations/`, `Dockerfile.dev`.  
Shared protobuf definitions will move to `proto/` (roadmap).

---

## 3 · Backend Development (Go Micro-services)  

### 3.1 Running a Single Service Locally  

```bash
cd backend/auth-svc
cp configs/.env.example .env
go run ./cmd        # default 0.0.0.0:8080
```

### 3.2 Coding Standards  

* `go vet ./...` and `golangci-lint run` must pass.  
* Project uses **zap** for structured logging, **Gin** for HTTP, **grpc** for internal RPC.  
* Keep handlers thin, push business logic to `internal/` packages:

```
auth-svc/
  internal/
    token/
    store/
    service/   # use-case layer
```

### 3.3 Adding a New Endpoint  

1. Define request/response structs in `api/http/`.
2. Add route in `initRouter()`.
3. Unit-test handler with `httptest`.
4. Update OpenAPI (`docs/openapi.yaml`) – run `make gen-api`.

### 3.4 gRPC  

Place `.proto` files in `proto/`; run:

```bash
make gen-proto   # buf generate Go + TypeScript stubs
```

---

## 4 · Frontend Development (React + TypeScript)  

### 4.1 Dev Server  

```bash
make run-frontend-dev      # vite with HMR
```

Hot-reload pages under `pages/`; components under `components/`.

### 4.2 State & Routing  

* React 19 hooks.  
* Router v7 (hash history).  
* Contexts: `AuthContext`, `I18nContext`.  
* Coming soon: Zustand for multiplayer state.

### 4.3 Coding Conventions  

* ESLint + Prettier enforced by CI (`npm run lint`).  
* Tailwind CSS design tokens start with `bg-brand-*`.  
* Use **Lucide React** icons, tree-shake with explicit imports.

### 4.4 Consuming APIs  

```ts
import { api } from './services/apiService';

const res = await api.post('/auth/login', { email, password });
setUser(res.data);
```

`services/geminiService.ts` streams tutor answers:

```ts
for await (const chunk of streamGemini(prompt, ctx)) {
  setMessages((m) => [...m, chunk]);
}
```

---

## 5 · AI Integration and Services  

* `tutor-orchestrator-svc` proxies all LLM calls – **do not call provider keys from FE**.  
* Configure via env: `GEMINI_API_KEY`, `AI_PROVIDER=gemini`.  
* Embeddings stored in `pgvector`; query helper:

```go
db.Exec(`SELECT id, content
         FROM lessons
         ORDER BY embedding <-> $1 LIMIT 5`, vec)
```

* Content generation pipeline script lives in `scripts/generate_content.go`.

---

## 6 · Database Schema & Migrations  

PostgreSQL per service. Migrations via **golang-migrate**:

```bash
migrate -path backend/auth-svc/migrations \
        -database "${POSTGRES_URI}" up
```

Sample `001_initial_schema.sql`:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

ClickHouse used by `progress-svc` for event analytics – see `backend/progress-svc/migrations/`.

---

## 7 · Testing & Quality Assurance  

| Layer | Tool | Command |
|-------|------|---------|
| FE unit + integration | Vitest | `make test-frontend` |
| BE unit | `go test` | `make test-backend` |
| E2E | Playwright | `make e2e` (*todo*) |
| Load | k6 scripts | `make load` |
| Lint | ESLint / golangci | `make lint` |

CI (`.github/workflows/ci.yml`) blocks merge unless all jobs green.

---

## 8 · Deployment & DevOps  

### 8.1 Local Docker Compose  

```bash
make run-backend-dev   # postgres, redis, rabbitmq + all svcs
```

### 8.2 Kubernetes (EKS/GKE)  

Helm charts under `backend/deployments/helm/`. Deploy to a dev cluster:

```bash
helm repo add wc charts/umbrella
helm upgrade --install wc-dev wc/umbrella -n water-dev
```

Argo CD watches `main`; promotion via PR to `env/staging`.

### 8.3 Secrets  

External-Secrets Operator pulls from AWS Secrets Manager keys prefixed `WC_*`.

---

## 9 · Contributing Guidelines  

1. Fork ➜ feature branch `feat/<slug>` or `fix/<slug>`.  
2. Follow **Conventional Commits** (`feat(auth): add MFA`).  
3. Ensure `make test lint` passes.  
4. Open PR; template will ask for screenshots/tests.  
5. At least **one approval** + green CI to merge.  

Style Guides:  
* Go – Effective Go, `goimports`, 120 cols.  
* TypeScript – Airbnb, optional chaining.  
* Docs – Markdown, no trailing spaces.

CLA required for external contributors (sign on first PR).

---

## 10 · Troubleshooting & FAQ  

| Issue | Fix |
|-------|-----|
| **Frontend 404 on refresh** | SPA uses hash router; ensure correct URL `#/route`. |
| **`go run` cannot find module** | run `go mod tidy`, commit `go.sum`. |
| **`pq: password authentication failed`** | verify `POSTGRES_URI` matches `docker-compose.yml`. |
| **CORS errors** | add origin to `CORS_ALLOWED_ORIGINS` env in target service. |
| **Gemini 429 rate-limit** | tutor-orc caches responses; ensure `REDIS_ADDR` reachable. |
| **`make run-backend-dev` stuck** | previous compose not cleaned: `docker compose ls`, `docker compose rm -f`. |

*Need help?* Ping `#water-classroom-dev` Slack or open a GitHub Discussion.

---

Happy coding! 🌊🎓  
© 2025 Stellarium Foundation  
