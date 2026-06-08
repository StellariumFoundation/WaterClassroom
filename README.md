<div align="center">
  <img width="1200" height="475" alt="Water Classroom Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

<h1 align="center">🌊 Water Classroom</h1>

<p align="center">
  <strong>A complete AI-powered school — interactive content, games, AI tutoring, and verified exams for K–12 and beyond.</strong>
</p>

<p align="center">
  <a href="#-mission--vision">Mission</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-routes">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

<br/>

---

## 🌍 Mission & Vision

The **Water Classroom** is the cornerstone project of the **"Water" suite** — a movement to democratize education by providing a world-class, personalized, AI-driven learning experience to **anyone, anywhere**.

> *"The Elevation to Eden rests not only on automating labor but on unlocking human potential. True prosperity requires a foundation of knowledge."*

**Our Mission:** Eliminate barriers to education — cost, geography, and one-size-fits-all curricula — by providing an equitable, engaging, and holistic learning platform.

**Our Vision:** Become the global standard for AI-enhanced education, nurturing a generation of curious, skilled, and adaptable learners prepared to tackle tomorrow's challenges.

### Impact
| For Students | For Educators | For Society |
|---|---|---|
| Personalized, engaging education adapted to unique needs | Tools to enhance teaching efficiency and student outcomes | A scalable solution to reduce educational inequality |

---

## 🎯 Key Features

### 1. 🧠 AI-Tailored Curriculum
Dynamic lessons aligned with national and international standards (U.S. Common Core, UK GCSE, IB, regional variants). Interactive multimedia, games, and adaptive pacing for every learning style.

### 2. 🤖 24/7 AI Tutoring & Homework Help
Always-on AI tutors offering step-by-step teaching, real-time feedback, and automated grading. Powered by **Google Gemini** for deeply contextual, Socratic-style guidance.

### 3. 🎮 Gamified Motivation System
- **Achievement Badges** and points for completing lectures, homework, and exams
- **Learning Streaks** and optional leaderboards for consistent engagement
- Inspired by Duolingo — designed to make learning addictive

### 4. 📊 Progress Analytics Dashboard
Track academic performance, engagement, and skill development. Customizable reports for teachers, parents, and self-directed students.

### 5. 🤝 Collaborative Learning Ecosystem
- Virtual classrooms
- Peer discussion forums
- Educator tools for seamless curriculum management
- Institutional onboarding with classroom codes

### 6. ✅ Verified Exams & Assessments
Camera-based proctoring (facial recognition, screen monitoring) ensures exam integrity. Automated grading with instant, detailed feedback.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | [Bun](https://bun.sh) — fast JavaScript runtime & package manager |
| **Server** | [Hono](https://hono.dev) — lightweight, ultra-fast web framework |
| **Frontend** | [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com) |
| **AI** | [Google Gemini](https://ai.google.dev) — real-time tutoring & content generation |
| **Database** | [Turso (libSQL)](https://turso.tech) — edge-ready SQLite |
| **Payments** | [Stripe](https://stripe.com) — subscription & checkout |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Animation** | [Motion](https://motion.dev) |
| **Bundler** | [Bun Bundler](https://bun.sh/docs/bundler) (built-in) |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0 (install: `curl -fsSL https://bun.sh/install | bash`)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- (Optional) A [Turso database](https://turso.tech) for persistent storage
- (Optional) A [Stripe account](https://stripe.com) for payment processing

### Installation

```bash
# Clone the repository
git clone https://github.com/StellariumFoundation/WaterClassroom.git
cd WaterClassroom

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
```

### Configure Environment

Edit `.env.local` with your keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Turso for persistent database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token

# Optional: Stripe for payments
STRIPE_SECRET_KEY=sk_test_...

APP_URL=http://localhost:3000
```

### Run the Development Server

```bash
bun run dev
```

The app will be available at **http://localhost:3000**.

### Build for Production

```bash
bun run build
bun run start
```

---

## 📁 Project Structure

```
WaterClassroom/
├── public/                  # Static assets (manifest, service worker, fonts)
│   ├── manifest.json
│   ├── sw.js
│   └── neue_frutiger_world_regular.ttf
├── src/                     # React frontend
│   ├── App.tsx              # Root component with tab navigation
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind CSS imports
│   ├── types.ts             # TypeScript type definitions
│   ├── lessonsData.ts       # Curriculum lesson data
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginRegister.tsx   # Authentication UI
│   │   └── tabs/
│   │       ├── HomepageTab.tsx     # Landing / overview
│   │       ├── AcademyTab.tsx      # Curriculum & lessons
│   │       ├── AITutorTab.tsx      # AI tutoring interface
│   │       ├── DashboardTab.tsx    # Progress analytics
│   │       ├── TasksTab.tsx        # Board of tasks
│   │       └── ForumsTab.tsx       # Discussion forums
├── build.ts                 # Bun-native build script
├── server.ts                # Hono server (API routes + static serving)
├── index.html               # HTML entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🌐 API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/register` | Register a new student or institution |
| `POST` | `/api/login` | Authenticate user by email + passcode |
| `GET` | `/api/records` | List all registered records (Turso) |
| `POST` | `/api/create-checkout-session` | Create a Stripe checkout session |
| `GET` | `/api/progress` | Get user progress (points, streak, badges) |
| `POST` | `/api/progress` | Update user progress |
| `GET` | `/api/tasks` | List board of tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update a task (assignee, status, etc.) |
| `POST` | `/api/gemini/tutoring` | Send a message to the AI tutor |

---

## 📚 Curriculum Tracks

Water Classroom supports multiple curricula with AI-adapted delivery:

- **US Common Core** & US Learner Track
- **International Baccalaureate (IB)** Syllabus
- **UK GCSE / A-Level**
- **Swiss Maturité** Curriculum
- **Universal First-Principles Track** (custom Water Classroom track)
- Regional and national variants

Students select their curriculum during onboarding; the AI tailors all content, lectures, and assessments accordingly.

---

## 💳 Subscription Model

| Plan | Price | Features |
|---|---|---|
| **Individual (Monthly)** | $19 / month | Full curriculum access, unlimited AI tutoring |
| **Individual (Yearly)** | $149 / year | Full curriculum access, unlimited AI tutoring, 2 months free |
| **Institution (Monthly)** | From $12/student | Bulk discounts, admin dashboard, custom curricula |
| **Institution (Yearly)** | From $115/student/year | All features + discounted annual rate |

Volume discounts apply automatically (e.g., >100 students: 10% off, >300 students: 20% off).

---

## 🧪 Scripts Reference

| Command | Description |
|---|---|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build for production (CSS + JS bundling) |
| `bun run start` | Start production server |
| `bun run lint` | Type-check the codebase |
| `bun run clean` | Remove build artifacts |

---

## 🤝 Contributing

We welcome contributions! Please see our guidelines:

1. Fork the repository
2. Create a feature branch (`feat/your-feature`)
3. Commit using conventional commits
4. Open a Pull Request

---

## 📄 License

Apache 2.0 © 2025 [Stellarium Foundation](https://github.com/StellariumFoundation)

---

<p align="center">
  <strong>Water Classroom is not just a product — it's a movement to redefine education in the AI era.</strong><br/>
  <em>Together we can build an ocean of knowledge accessible to every learner 🌍✨</em>
</p>
