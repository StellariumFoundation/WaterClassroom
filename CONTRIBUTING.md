# Contributing to **Water Classroom**

🎉 Thanks for your interest in improving Water Classroom!  
This document explains how to get a local environment running, our coding & style conventions, the pull-request (PR) workflow, and community norms.

---

## Table of Contents
1. Getting Help
2. Project Overview
3. Development Environment
4. Coding Standards
5. Commit & Branch Strategy
6. Pull-Request Process
7. Testing & CI
8. Issue Reporting
9. Community Code of Conduct
10. License & Contributor License Agreement (CLA)

---

## 1. Getting Help

* **Discussion Board** – Use GitHub Discussions for questions & proposals.  
* **Chat** – Join the `#water-classroom` channel on our Discord.  
* **Bugs** – Open an issue with a **minimal, reproducible example**.

---

## 2. Project Overview

Water Classroom is a multi-platform, AI-powered learning ecosystem.

Current repo contains the **Web POC** (React + TypeScript + Vite).  
Road-map targets a Go micro-services backend & Flutter clients (see `Technical.md`).

---

## 3. Development Environment

### 3.1 Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm / pnpm | ≥ 9 (_npm is used in scripts_) |
| Go _(backend services)_ | ≥ 1.22 |
| Docker | Latest |
| Git | ≥ 2.40 |

### 3.2 Clone & Install

```bash
git clone https://github.com/StellariumFoundation/WaterClassroom.git
cd WaterClassroom
npm install         # installs frontend deps
```

### 3.3 Environment Variables

Create `.env.local` (not committed) :

```
# Front-end
GEMINI_API_KEY=<your_google_gemini_key>

# Backend examples
POSTGRES_URI=postgresql://...
JWT_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
```

### 3.4 Run Front-End

```bash
npm run dev           # http://localhost:5173
```

### 3.5 Run Example Backend Service

```bash
cd backend/auth-svc
go run .
```

---

## 4. Coding Standards

### 4.1 JavaScript / TypeScript

* **TypeScript strict** (`"strict": true` in `tsconfig.json`)
* React **functional components** + hooks
* **TailwindCSS** for styling – _no inline colours outside palette_
* Linting: **ESLint** (`npm run lint`)
* Formatting: **Prettier** (`npm run format:write`)

### 4.2 Go

* Follow **Go 1.22** idioms.
* `gofmt` / `goimports` must pass (`go vet ./...` in CI).
* REST handlers in **Gin** / **Echo**, service interfaces in `internal/`.

### 4.3 Conventional File Layout

```
components/   reusable UI
pages/        route-level views
services/     API & AI helpers
backend/      Go micro-services (each in its folder)
```

### 4.4 Documentation

* Every exported TypeScript/Go function **must** have JSDoc / Godoc.
* Update `Technical.md` if architecture changes.

---

## 5. Commit & Branch Strategy

### 5.1 Branch Names

```
feat/<scope>-<short-description>
fix/<scope>-<short-description>
chore/<desc>
```

### 5.2 Conventional Commits

```
feat: curriculum selector redesign
fix(auth): handle expired JWT refresh
docs: add assessment API spec
```

Use `npm run commit` (powered by **commitizen**) to help.

### 5.3 Syncing With Main

1. `git fetch origin`
2. `git rebase origin/main` (preferred)  
3. Resolve conflicts, run tests, force-push.

---

## 6. Pull-Request Process

1. **Fork** or create feature branch on upstream repo.
2. Write code & **unit / component tests**.
3. Run `npm run lint && npm test && npm run build`.
4. Push and open PR against `main`.
5. PR Template checklist must be complete:
   * Linked Issue #
   * Description / screenshots
   * Checklist (tests, docs, self-review)
6. At least **one approving review** and **CI green** required.
7. Squash-merge by maintainer; commit message auto-generated from PR title.

---

## 7. Testing & CI

| Layer | Tool |
|-------|------|
| React unit | **Vitest** |
| React E2E | **Playwright** (headless) |
| Go unit | `go test ./...` |

GitHub Actions runs:

1. **lint** (ESLint + go vet)
2. **test** (Vitest & Go)
3. **build** (vite build & `go build ./...`)

Add/modify tests adjacent to code (`*.test.tsx`, `_test.go`).

---

## 8. Issue Reporting

Before filing:

1. Search existing issues/PRs.
2. Verify with latest `main`.

Include:

* **Steps to Reproduce**
* **Expected vs Actual Outcome**
* **Screenshots / logs**
* Environment (OS, browser, Node version)

Label appropriately (`bug`, `feature`, `good-first-issue`).

---

## 9. Community Code of Conduct

We follow the [Contributor Covenant v2.1](CODE_OF_CONDUCT.md).  
Be respectful, assume good intent, and keep discussions constructive.

---

## 10. License & CLA

Water Classroom is licensed under **Apache 2.0**.  
By contributing you agree to license your work under the same terms and to sign the **Stellarium Individual Contributor License Agreement (CLA)** when prompted by the CLA-bot.

---

Happy coding! 🚀  
_– Water Classroom Engineering Team_
