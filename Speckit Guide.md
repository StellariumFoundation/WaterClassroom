# The Complete Guide to GitHub Spec Kit

## What is Spec Kit?

**Spec Kit** is an open-source toolkit from GitHub that enables **Spec-Driven Development (SDD)**. Instead of writing code first, you write **executable specifications** that AI agents then use to generate working implementations.

The core philosophy is simple: **Spec → Plan → Tasks → Implement**. You define *what* to build before building it, making AI-assisted development predictable, repeatable, and maintainable.

Spec Kit works with **30+ AI coding agents** including GitHub Copilot, Claude Code, Cursor, and Gemini CLI.

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Installation](#2-installation)
3. [Project Initialization](#3-project-initialization)
4. [Understanding the Two Command Types](#4-understanding-the-two-command-types)
5. [The Core Workflow (Step by Step)](#5-the-core-workflow-step-by-step)
6. [Optional Quality Gates](#6-optional-quality-gates)
7. [Working with Existing Projects](#7-working-with-existing-projects)
8. [Managing the CLI](#8-managing-the-cli)
9. [Best Practices](#9-best-practices)
10. [Troubleshooting Common Issues](#10-troubleshooting-common-issues)

## 1. Prerequisites

Before you start, you need:

- **Python 3.11+** installed on your system
- **[uv](https://docs.astral.sh/uv/)** - the fast Python package installer
- An AI coding assistant (GitHub Copilot, Cursor, Claude Code, etc.)

## 2. Installation

### Option A: Install via uv (Recommended)

This is the official installation method:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

For a specific stable version (recommended to avoid bugs):

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.0.22
```

### Option B: One-time Usage (No Installation)

Run Spec Kit directly without installing it permanently:

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
```

### Option C: Install via npm (Community Fork)

If you prefer the `speckit` command name:

```bash
npm install -g @letuscode/spec-kit
```

> ⚠️ **Note**: The npm package `@letuscode/spec-kit` is deprecated. The official CLI is named `specify`, not `speckit`.

### Verify Installation

```bash
specify --version
```

Or check if everything is working properly:

```bash
specify check
```

## 3. Project Initialization

### For a New Project

Create a new project directory with the Spec Kit structure:

```bash
specify init my-project
```

This creates the following structure:

```
my-project/
├── .github/
│   ├── agents/
│   └── prompts/
├── .specify/
│   ├── memory/
│   │   └── constitution.md
│   ├── scripts/
│   │   ├── bash/          (Linux/macOS)
│   │   └── powershell/    (Windows)
│   └── templates/
├── specs/
│   └── (feature directories will go here)
```

### For an Existing Project (In-Place Initialization)

If you already have a project and want to add Spec Kit to it:

```bash
cd your-existing-project
specify init --here
```

### Specify Your AI Assistant

During initialization, you'll be prompted to select your AI coding assistant. You can also specify it directly:

```bash
specify init my-project --integration copilot
specify init my-project --integration claude
specify init my-project --integration cursor
specify init my-project --integration gemini
```

## 4. Understanding the Two Command Types

Spec Kit provides **two distinct types of commands**:

| Type                  | Where to Run                | Examples                                    | Purpose                          |
| --------------------- | --------------------------- | ------------------------------------------- | -------------------------------- |
| **Terminal Commands** | Your shell/terminal         | `specify init`, `specify check`             | Project setup and CLI management |
| **Slash Commands**    | AI assistant chat interface | `/speckit.constitution`, `/speckit.specify` | The actual development workflow  |

> **Important**: Most AI agents expose Spec Kit as `/speckit.*` slash commands. Codex CLI in skills mode uses `$speckit-*` instead, and GitHub Copilot CLI uses `/agents` to select the agent.

## 5. The Core Workflow (Step by Step)

The development workflow follows a specific sequence, with each command building on the output of the previous one:

```
specify init → /speckit.constitution → /speckit.specify → /speckit.plan → /speckit.tasks → /speckit.implement
```

### Phase 1: Establish the Constitution (`/speckit.constitution`)

**Purpose**: Define your project's governing principles, constraints, and non-negotiable requirements.

**Time estimate**: 5-10 minutes

**What to type in your AI chat**:

```
/speckit.constitution This is a React + TypeScript project with Tailwind CSS. We follow functional programming patterns. All components must be tested. We use Firebase for authentication and Firestore for the database. Never rewrite working code without explicit permission.
```

**What gets created**: `.specify/memory/constitution.md`

**What a typical constitution includes**:

- Technical standards (languages, frameworks, services)
- Security requirements (authentication, authorization, data protection)
- Performance expectations (response time targets, scalability needs)
- Programming conventions (naming patterns, architecture patterns, testing requirements)
- Compliance requirements (regulatory or organizational policies)

> 💡 **Pro tip**: For existing projects, the AI can analyze your codebase and suggest coding conventions. Review the constitution carefully—the AI uses this document to generate all plans and code.

---

### Phase 2: Create the Specification (`/speckit.specify`)

**Purpose**: Describe **what** you want to build and **why**. Focus on user stories, acceptance criteria, and requirements—**not** the technology stack.

**Time estimate**: 20-40 minutes

**What to type in your AI chat**:

```
/speckit.specify Build a Classroom Management module for WaterClassroom.

Teachers should be able to:
- Create new classrooms with a name and description
- Invite students via email
- Post announcements to the classroom
- View a list of all their classrooms

Students should be able to:
- Join classrooms using an invite link
- View announcements
- See all their enrolled classrooms

The module must integrate with the existing authentication system. Teachers are existing users with a "teacher" role. Students are existing users with a "student" role.
```

**What gets created**: `specs/###-feature-name/spec.md`

**Key principles**:

- Focus on the **what** and **why**, not the tech stack
- Be specific about user roles and actions
- Define acceptance criteria clearly
- Mention integrations with existing systems

---

### Phase 3: Create a Technical Plan (`/speckit.plan`)

**Purpose**: Define your tech stack, architecture, and implementation approach.

**Time estimate**: 30-60 minutes

**What to type in your AI chat**:

```
/speckit.plan The application uses React 18 with TypeScript. Tailwind CSS for styling. Firebase Authentication for user management. Firestore for the database. The classroom module should be built as a feature folder with:
- components/ (UI components)
- hooks/ (custom React hooks for Firebase interactions)
- types/ (TypeScript interfaces)
- utils/ (helper functions)

Follow the existing project structure and naming conventions.
```

**What gets created**: `specs/###-feature-name/plan.md`

The plan turns the specification into a technical architecture and implementation approach.

---

### Phase 4: Break Down into Tasks (`/speckit.tasks`)

**Purpose**: Generate an actionable, step-by-step task list from your implementation plan.

**What to type in your AI chat**:

```
/speckit.tasks
```

**What gets created**: `specs/###-feature-name/tasks.md`

> 💡 **Pro tip**: Review the task list before implementing! Cross out any tasks that say "Initialize project" or "Setup React" if you already have those. Re-order tasks if a different sequence makes more sense for your existing structure.

---

### Phase 5: Implement (`/speckit.implement`)

**Purpose**: Execute all tasks and build the feature according to the specification and plan.

**What to type in your AI chat**:

```
/speckit.implement
```

**What gets created**: Actual source code files

The implementation command executes the plan by working through all tasks defined in `tasks.md`. Spec Kit focuses on supporting the planning phase, so the implementation is the culmination of all the previous work.

## 6. Optional Quality Gates

For production features or complex projects, you can insert these commands between the main steps:

| Command              | When to Use                                         | Purpose                                         |
| -------------------- | --------------------------------------------------- | ----------------------------------------------- |
| `/speckit.clarify`   | After `/speckit.specify`, before `/speckit.plan`    | Reduce requirement ambiguity                    |
| `/speckit.checklist` | After `/speckit.specify`, before `/speckit.plan`    | Validate requirements quality                   |
| `/speckit.analyze`   | After `/speckit.tasks`, before `/speckit.implement` | Check consistency between spec, plan, and tasks |

### Example Usage

```
/speckit.specify [your specification]
/speckit.clarify
/speckit.checklist
/speckit.plan [your plan]
/speckit.tasks
/speckit.analyze
/speckit.implement
```

## 7. Working with Existing Projects

If you're adding Spec Kit to an existing codebase, here's the recommended approach:

### Step 1: Initialize In-Place

```bash
cd your-existing-project
specify init --here
```

### Step 2: Set the Constitution with Context

```
/speckit.constitution This is an existing project called WaterClassroom. We use React, TypeScript, Tailwind CSS, and Firebase. We NEVER rewrite working code without explicit permission. We add features incrementally. Follow existing project patterns and naming conventions.
```

### Step 3: Document What's Already Built

When writing the specification, tell the AI about your existing code:

```
/speckit.specify Our project currently has:
- Working authentication (login/signup with Firebase)
- A dashboard showing user stats
- A profile edit page

NOW we are building a Classroom Management feature where teachers can create classrooms and invite students. This must integrate with our existing Firebase auth system.
```

### Step 4: Review Tasks Carefully

After `/speckit.tasks`, review the list and **remove any setup tasks** that are already done.

### Step 5: Commit First!

**Always commit your current work before starting**: If the AI tries to overwrite something, you can easily revert with `git checkout`.

## 8. Managing the CLI

### Check for Updates

```bash
specify self check
```

This reports the installed CLI version and verifies update availability against GitHub releases.

### Upgrade the CLI

```bash
specify self upgrade
```

This upgrades to the latest stable release.

### Preview an Upgrade (Dry Run)

```bash
specify self upgrade --dry-run
```

### Pin to a Specific Version

```bash
specify self upgrade --tag v0.0.22
```

For `uv tool` installs, this runs `uv tool install specify-cli --force --from <git ref>` under the hood.

## 9. Best Practices

### 1. Start with Why

Always begin by documenting the purpose and goals of your project or feature.

### 2. Keep Specs Living

Update specifications as requirements evolve. The spec isn't a one-time document—it's a living artifact.

### 3. Be Overly Descriptive in the Spec

The AI can't read your mind. In `/speckit.specify`, don't just say "build a classroom module." Say:

- What it does
- What it **doesn't** do (to prevent scope creep)
- How it connects to existing systems
- Edge cases

### 4. Add a "Scope Guard"

Add a line at the end of your spec: *"Scope is strictly limited to [Feature X]. Do not add extra features."* This prevents the AI from adding unnecessary "nice-to-have" features.

### 5. Review Before Implementing

Take 5 minutes to read the task list generated by `/speckit.tasks` before running `/speckit.implement`. Cross out unnecessary tasks and re-order as needed.

### 6. Use Git Branches

Spec Kit automatically links your specs to your **Git branch**. Create a branch for each feature:

```bash
git checkout -b 002-classroom-management
```

This keeps features isolated and organized.

### 7. Don't Fear the Revert

Iteration is expected. If the AI breaks something, `git checkout` that specific file, fix the prompt, and run `/speckit.implement` again.

### 8. For Existing Projects: Explicitly Protect Working Code

In your `/speckit.constitution`, explicitly say: *"NEVER overwrite existing files without asking. Only create new files or append specific sections."*

## 10. Troubleshooting Common Issues

### Issue: `'specify' is not recognized`

**Solution**: Make sure `uv` is installed and the `specify` CLI is properly installed. Try:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

### Issue: `ModuleNotFoundError: No module named 'specify_cli.bundler.lib'` (Windows)

**Solution**: Install a stable version instead of the latest (broken) main branch:

```bash
uv tool uninstall specify-cli
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.0.22
```

### Issue: The AI overwrites my existing files

**Solution**: In your `/speckit.constitution`, add: *"NEVER overwrite existing files without asking. Only create new files or append specific sections."* Also, **commit your code before running `/speckit.implement`**.

### Issue: Slash commands not showing up in my AI assistant

**Solution**: 

- Make sure you're in the project directory where `specify init` was run
- Some agents require you to select the agent first (GitHub Copilot CLI uses `/agents`)
- Check that the `.specify/` folder exists in your project root

### Issue: The AI adds features I didn't ask for

**Solution**: Add a "scope guard" to your specification: *"Scope is strictly limited to [Feature X]. Do not add extra features."*

### Issue: `specify init` fails in an existing project

**Solution**: If there are files that would be overwritten, the `init` command will fail. Use the `--here` flag and make sure you're in the project root:

```bash
specify init --here
```

## Quick Reference Card

| Step     | Command                  | Where    | Output                 |
| -------- | ------------------------ | -------- | ---------------------- |
| 1        | `specify init <PROJECT>` | Terminal | Project structure      |
| 2        | `/speckit.constitution`  | AI Chat  | `constitution.md`      |
| 3        | `/speckit.specify`       | AI Chat  | `spec.md`              |
| 4        | `/speckit.plan`          | AI Chat  | `plan.md`              |
| 5        | `/speckit.tasks`         | AI Chat  | `tasks.md`             |
| 6        | `/speckit.implement`     | AI Chat  | Source code            |
| Optional | `/speckit.clarify`       | AI Chat  | Clarified requirements |
| Optional | `/speckit.checklist`     | AI Chat  | Quality checklist      |
| Optional | `/speckit.analyze`       | AI Chat  | Consistency report     |

---

## Additional Resources

- [GitHub Spec Kit Repository](https://github.com/github/spec-kit)
- [Spec Kit Documentation](https://github.com/github/spec-kit/tree/main/docs)
- [Microsoft Learn: Spec Kit Training](https://learn.microsoft.com/training/modules/spec-driven-development-github-spec-kit-greenfield-intro/)
- [Installation Guide](https://github.com/github/spec-kit/blob/main/docs/installation.md)
- [Upgrade Guide](https://github.com/github/spec-kit/blob/main/docs/upgrade.md)