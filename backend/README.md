# Water Classroom – Backend Services

**Version:** 1.0  
**Last updated:** 28 May 2025

Welcome to the server-side of Water Classroom.  
This directory contains all Go micro-services, shared protobuf definitions, Helm charts and infrastructure scripts that bring the AI–powered learning platform to life.

---

## 1. Service Architecture

| Service | Responsibility | External Port | Internal (gRPC) |
|---------|----------------|---------------|-----------------|
| `auth-svc` | Registration, login, JWT & OAuth | `8080` | `50051` |
| `user-svc` | User profile & settings | — | `50052` |
| `curriculum-svc` | Curriculum / course / lesson metadata | `8082` | `50053` |
| `progress-svc` | Lecture progress, badges, analytics | — | `50054` |
| `assessment-svc` | Homework, exams, proctoring orchestration | `8084` | `50055` |
| `tutor-orchestrator-svc` | Chat sessions, context injection to LLM | `8085` | `50056` |
| `notification-svc` | E-mail & WebPush via MQ | — | `50057` |
| `api-gateway` | Single external REST façade, rate limiting, authz | `80/443` | n/a |

Communication pattern:

```
Client  →  API-Gateway (REST)  →  Individual services (gRPC)  →  PostgreSQL / Redis / MQ
                                                ↘            ↘  AI services mesh
```

*See `../../Technical.md` §4–6 for a deep dive.*

---

## 2. Repository Layout

```
backend/
 ├── auth-svc/              # Go (Gin) service
 ├── user-svc/
 ├── curriculum-svc/
 ├── progress-svc/
 ├── assessment-svc/
 ├── tutor-orchestrator-svc/
 ├── notification-svc/
 ├── proto/                # protobuf contracts (.proto) + buf.gen.yaml
 ├── deployments/
 │   ├── docker-compose/   # Local stack
 │   └── helm/             # Charts for each svc + umbrella
 ├── scripts/              # helper bash scripts
 └── Makefile              # one-stop dev targets
```

Each *-svc* folder is a self-contained Go module with this structure:

```
cmd/            # main.go
internal/       # business logic
    handler/    # HTTP handlers
    grpc/       # gRPC server & client
    repository/ # DB access (sqlc generated)
configs/        # config.yaml, .env.example
migrations/     # sql migrations (goose)
```

---

## 3. Prerequisites

| Tool | Version |
|------|---------|
| Go   | ≥ 1.22  |
| Docker & Docker-Compose | Latest |
| make | ≥ 4     |
| buf  | ≥ 1.23  | *(for protobuf)*

Node.js is **not** required on the backend side.

---

## 4. Quick Start (Local Stack)

```bash
cd backend

# spin up Postgres, Redis, RabbitMQ, Vector-DB and **all** services
make dev-up          # equivalent to docker compose up --build -d

# follow logs (Ctrl-C to exit)
make logs            # or docker compose logs -f

# tear down
make dev-down
```

The default endpoints after startup:

| URL | Description |
|-----|-------------|
| http://localhost:8080 | Auth service REST |
| http://localhost:8081 | API Gateway (aggregates docs) |
| http://localhost:5555 | RabbitMQ UI |
| http://localhost:5432 | PostgreSQL |

> Change ports in `deployments/docker-compose/docker-compose.yml` if they clash.

---

## 5. Running a Single Service with Hot-Reload

```bash
cd backend/auth-svc
cp configs/.env.example .env        # set DB credentials & JWT keys
go install github.com/cosmtrek/air@latest
air                                  # or make dev
```

* `air` watches for file changes and restarts the service.
* Unit tests: `go test ./...`
* Linting: `golangci-lint run`

---

## 6. API Documentation

* REST endpoints exposed by API-Gateway are documented via **OpenAPI**.
* Generate/update spec:

```bash
make docs   # aggregates swagger from services -> api-gateway/docs/openapi.yaml
```

Open Swagger UI at `http://localhost:8081/docs`.

---

## 7. Cloud Deployment Workflow

1. **CI:** GitHub Actions
   * `lint → test → build → docker push ghcr.io/stellarium/wc-<svc>:<sha>`
2. **CD:** Argo CD watches `deploy/helm/umbrella/values-staging.yaml`
3. **Kubernetes:** 
   * EKS (production) or k3d (local)
   * Horizontal Pod Autoscaler on CPU + custom metrics
4. **Secrets:** External Secrets Operator fetches from AWS Secrets Manager  
   (e.g. `POSTGRES_URI`, `JWT_PRIVATE_KEY`, `GEMINI_API_KEY`).

---

## 8. Environment Variables

Each service ships a `.env.example`. Common keys:

| Name | Description |
|------|-------------|
| `POSTGRES_URI` | `postgres://user:pass@db:5432/wc?sslmode=disable` |
| `REDIS_ADDR`   | `redis:6379` |
| `RABBITMQ_URI` | `amqp://guest:guest@mq:5672/` |
| `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` | RSA keys for Auth |
| `GEMINI_API_KEY` | server-side key for LLM calls |
| `AI_TUTOR_ENDPOINT` | URL of tutoring AI backend |

Load order: **flags → env vars → config.yaml defaults**.

---

## 9. Database Migrations

```bash
make migrate-up       # all services (runs goose in each migrations dir)
make migrate-down     # rollback latest
```

---

## 10. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `connection refused` to Postgres | Ensure `make dev-up` completed & port not taken |
| JWT invalid in API-Gateway | Sync `JWT_PUBLIC_KEY` secret across services |
| gRPC request timeout | Check `GRPC_MAX_MESSAGE_SIZE` env and service health |
| AI calls 403 | Verify `GEMINI_API_KEY` or internal AI service URL |

---

## 11. Further Reading

* `../Technical.md` – full system blueprint  
* `proto/README.md` – protobuf + gRPC style-guide  
* `deployments/helm/` – production Helm charts  
* `docs/` (coming soon) – ADRs, SLIs/SLOs, threat model

---

Happy hacking! 💧
