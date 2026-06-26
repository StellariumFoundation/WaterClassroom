# Water Classroom

**A complete AI-powered school for everyone.**

Water Classroom is a full-stack virtual school platform that delivers personalized K-12 education through AI tutoring, gamified learning, proctored exams, and collaborative tools — accessible from any device with a browser.

---

## What is this?

Water Classroom is not just an LMS or a course viewer. It's a **complete school** that adapts to each student's country, grade level, and learning pace. Whether you're a homeschool family seeking accredited credentials, a self-directed learner, or an institution managing thousands of students — this platform covers the entire journey from enrollment to verified certification.

It's part of the broader **Water suite** by the Stellarium Foundation — alongside Water AI, Water Robotics, and Water Gov — aimed at automating labor and unlocking human potential through accessible technology.

---

## The Idea

Traditional education is gated by cost, geography, and rigidity. Water Classroom dismantles these barriers by combining:

- **AI that teaches, not just answers.** A 24/7 Socratic tutor powered by Google Gemini that guides students through problems step-by-step, aligned to their specific curriculum track.
- **Curricula that adapt.** 75+ programs across 28 countries — US Common Core, UK GCSE, IB, Swiss Maturité, and more — automatically matched during onboarding.
- **Exams that mean something.** Camera-proctored, VLM-verified exams produce tamper-proof certificate hashes, giving homeschool families the credentials they need.
- **Learning that's addictive.** XP, streaks, achievement badges, and community leaderboards turn studying into a game you actually want to play.

---

## How it Works

A student signs up, selects their country and grade level, and the system automatically builds a personalized curriculum track. They can then:

1. **Learn** — Interactive lessons, quizzes, and educational games in the Academy
2. **Get help** — Chat with the AI Tutor anytime for real-time Socratic guidance
3. **Collaborate** — Post and work on projects via the Board of Tasks
4. **Discuss** — Join community forums organized by subject and grade
5. **Prove it** — Take camera-proctored exams that produce verified credentials
6. **Track progress** — XP, levels, streaks, and badge unlocks visible on the dashboard

Institutions get an admin layer: roster management, tutor assignment, curriculum overrides, and a bulk cost calculator.

---

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Runtime | [Bun](https://bun.sh) | Fast JS runtime with built-in bundler |
| Server | [Hono](https://hono.dev) | Lightweight, edge-ready web framework |
| Frontend | [Svelte 5](https://svelte.dev) + [Tailwind CSS 4](https://tailwindcss.com) | Reactive UI with utility-first styling |
| AI | [Google Gemini](https://ai.google.dev) | Real-time tutoring and content generation |
| Database | [Turso / libSQL](https://turso.tech) | Edge-distributed SQLite |
| Payments | [Stripe](https://stripe.com) | Subscriptions and invoicing |
| Icons | [Lucide](https://lucide.dev) | Consistent icon set |

---

## Running Locally

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys (TURSO_DATABASE_URL, GEMINI_API_KEY, STRIPE_SECRET_KEY)

# Start dev server
bun run dev
```

The app runs at `http://localhost:3000`.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `TURSO_DATABASE_URL` | Turso database connection URL |
| `TURSO_AUTH_TOKEN` | Turso authentication token |
| `GEMINI_API_KEY` | Google Gemini API key for AI tutoring |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments |
| `APP_URL` | Base URL for payment redirects |

---

## Project Structure

```
src/
  App.svelte              # Root component with routing and nav
  pages/                  # Top-level page views
    LandingPage.svelte    # Public landing with auth
    DashboardPage.svelte  # Student progress dashboard
    AcademyPage.svelte    # Curriculum and lessons
    AITutorPage.svelte    # AI tutoring chat
    ExamsPage.svelte      # Proctored exam system
    TasksPage.svelte      # Board of Tasks
    ForumsPage.svelte     # Community forums
    ProfilePage.svelte    # User profile
  components/             # Shared UI components
    exams/                # Exam proctoring components
    games/                # Interactive learning games
    layout/               # Header, onboarding, layout
    modals/               # Modal dialogs
  school/                 # Institution admin views
  lib/                    # Stores, utilities, constants
server.ts                 # Hono server with all API routes
```

---

## License

Stellarium Foundation, Inc. All rights reserved.
