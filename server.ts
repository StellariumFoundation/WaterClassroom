import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@libsql/client";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import crypto from "crypto";

type K12CurriculumLesson = {
  hash: string;
  title: string;
  grade: string;
  subject: string;
  interactiveType: "phaser-game" | "quiz" | "scenario";
  estimatedMinutes: number;
  storyHook?: string;
};

type K12CurriculumFile = {
  subject: string;
  description: string;
  lessons: K12CurriculumLesson[];
};

const CURRICULUM_ROOT = path.join(process.cwd(), "lessons", "curriculums");
const CURRICULUM_FILES = [
  "k12-mathematics.json",
  "k12-science.json",
  "k12-history.json",
  "k12-geography.json",
  "k12-leadership.json",
];

function loadK12CurriculumFiles(): K12CurriculumFile[] {
  return CURRICULUM_FILES
    .map(fileName => {
      const filePath = path.join(CURRICULUM_ROOT, fileName);
      if (!fs.existsSync(filePath)) return null;
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as K12CurriculumFile;
      return parsed;
    })
    .filter((file): file is K12CurriculumFile => Boolean(file));
}

async function seedK12CurriculumMetadata() {
  const db = getDb();
  const curriculumFiles = loadK12CurriculumFiles();
  const now = new Date().toISOString();
  for (const curriculum of curriculumFiles) {
    const subjectKey = curriculum.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const byGrade = new Map<string, K12CurriculumLesson[]>();
    for (const lesson of curriculum.lessons) {
      await db.execute({
        sql: `INSERT INTO lessons (id, external_id, title, description, subject, grade_level, lesson_type, estimated_minutes, content_ref, quiz_ref, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, subject=excluded.subject, grade_level=excluded.grade_level, lesson_type=excluded.lesson_type, estimated_minutes=excluded.estimated_minutes, content_ref=excluded.content_ref, quiz_ref=excluded.quiz_ref`,
        args: [
          lesson.hash,
          lesson.hash,
          lesson.title,
          lesson.storyHook || curriculum.description,
          lesson.subject,
          lesson.grade,
          "game",
          lesson.estimatedMinutes,
          lesson.hash,
          "",
          now,
        ],
      });
      const gradeLessons = byGrade.get(lesson.grade) || [];
      gradeLessons.push(lesson);
      byGrade.set(lesson.grade, gradeLessons);
    }
    for (const [gradeLevel, lessons] of byGrade.entries()) {
      const lessonIds = lessons.map(lesson => lesson.hash);
      await db.execute({
        sql: `INSERT INTO curriculum_tracks (id, country_code, country_name, grade_level, track_type, display_name, lesson_ids, is_default, created_at)
          VALUES (?, 'US', 'United States', ?, 'country_standard', ?, ?, 1, ?)
          ON CONFLICT(id) DO UPDATE SET country_code=excluded.country_code, country_name=excluded.country_name, grade_level=excluded.grade_level, track_type=excluded.track_type, display_name=excluded.display_name, lesson_ids=excluded.lesson_ids, is_default=excluded.is_default`,
        args: [
          `track-US-${gradeLevel}-${subjectKey}`,
          gradeLevel,
          `US K-12 ${curriculum.subject} — Grade ${gradeLevel}`,
          JSON.stringify(lessonIds),
          now,
        ],
      });
    }
  }
}

const app = new Hono();
const PORT = 3000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Turso Client (lazy init) ───
let client: ReturnType<typeof createClient> | null = null;

function getDb() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
      throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set as environment variables");
    }
    client = createClient({ url, authToken });
  }
  return client;
}

async function initDB() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS turso_records (
      id TEXT PRIMARY KEY,
      type TEXT,
      name TEXT,
      representative TEXT,
      academicTrack TEXT,
      studentVolume INTEGER,
      kindOfSchool TEXT,
      billingCycle TEXT,
      calculatedPrice TEXT,
      registeredAt TEXT,
      dbStatus TEXT,
      passcode TEXT,
      affiliatedCode TEXT,
      isActivated INTEGER DEFAULT 0
    )
  `);
  // Add missing columns if table existed without them
  try {
    const cols = await db.execute("PRAGMA table_info(turso_records)");
    const colNames = cols.rows.map((r: any) => r.name);
    if (!colNames.includes("email")) await db.execute("ALTER TABLE turso_records ADD COLUMN email TEXT");
    if (!colNames.includes("passcode")) await db.execute("ALTER TABLE turso_records ADD COLUMN passcode TEXT");
    if (!colNames.includes("affiliatedCode")) await db.execute("ALTER TABLE turso_records ADD COLUMN affiliatedCode TEXT");
    if (!colNames.includes("isActivated")) await db.execute("ALTER TABLE turso_records ADD COLUMN isActivated INTEGER DEFAULT 0");
    if (!colNames.includes("country")) await db.execute("ALTER TABLE turso_records ADD COLUMN country TEXT DEFAULT ''");
    if (!colNames.includes("gradeLevel")) await db.execute("ALTER TABLE turso_records ADD COLUMN gradeLevel TEXT DEFAULT ''");
    if (!colNames.includes("enrollmentType")) await db.execute("ALTER TABLE turso_records ADD COLUMN enrollmentType TEXT DEFAULT ''");
    if (!colNames.includes("isOnboarded")) await db.execute("ALTER TABLE turso_records ADD COLUMN isOnboarded INTEGER DEFAULT 0");
  } catch (e) {
    console.warn("Schema migration note:", e);
  }
  await db.execute(`
    CREATE TABLE IF NOT EXISTS student_progress (
      id TEXT PRIMARY KEY DEFAULT 'default',
      points INTEGER DEFAULT 0,
      streakDays INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      completedLessons TEXT DEFAULT '[]',
      unlockedBadges TEXT DEFAULT '[]',
      lastActiveDate TEXT
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      category TEXT,
      rewardPoints INTEGER,
      status TEXT,
      assignee TEXT,
      createdBy TEXT,
      backersCount INTEGER DEFAULT 1
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      email TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      expiresAt INTEGER NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      representative_name TEXT NOT NULL,
      country TEXT DEFAULT '',
      grade_range TEXT DEFAULT 'K-12',
      billing_cycle TEXT DEFAULT 'Monthly',
      student_volume INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tutors (
      id TEXT PRIMARY KEY,
      institution_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subjects TEXT DEFAULT '[]',
      grade_levels TEXT DEFAULT '[]',
      created_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS institution_admins (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      institution_id TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS curriculum_tracks (
      id TEXT PRIMARY KEY,
      country_code TEXT NOT NULL,
      country_name TEXT NOT NULL,
      grade_level TEXT NOT NULL,
      track_type TEXT NOT NULL,
      display_name TEXT NOT NULL,
      lesson_ids TEXT DEFAULT '[]',
      is_default INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      external_id TEXT UNIQUE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      subject TEXT NOT NULL,
      grade_level TEXT NOT NULL,
      lesson_type TEXT DEFAULT 'content',
      estimated_minutes INTEGER DEFAULT 5,
      content_ref TEXT DEFAULT '',
      quiz_ref TEXT DEFAULT '',
      created_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      track_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      is_proctored INTEGER DEFAULT 0,
      duration_seconds INTEGER DEFAULT 600,
      passing_score REAL DEFAULT 0.7,
      is_verified INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS exam_attempts (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      score REAL,
      max_score REAL DEFAULT 1.0,
      proctor_flags TEXT DEFAULT '[]',
      camera_authorized INTEGER DEFAULT 0,
      identity_scan_ref TEXT DEFAULT '',
      status TEXT DEFAULT 'completed',
      started_at TEXT,
      completed_at TEXT
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS institution_curriculum_overrides (
      id TEXT PRIMARY KEY,
      institution_id TEXT NOT NULL,
      grade_level TEXT NOT NULL,
      subject TEXT NOT NULL,
      ordered_lesson_ids TEXT NOT NULL,
      created_by TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_level INTEGER DEFAULT 1,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      replies INTEGER DEFAULT 0,
      category TEXT DEFAULT 'General',
      grade_level TEXT DEFAULT 'all',
      moderation_status TEXT DEFAULT 'approved',
      created_at TEXT NOT NULL
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      criteria_type TEXT NOT NULL,
      criteria_value TEXT DEFAULT '',
      icon TEXT DEFAULT 'award',
      color TEXT DEFAULT 'text-yellow-400'
    )
  `);
  // Migrate missing columns on existing tables
  try {
    const cols = await db.execute("PRAGMA table_info(turso_records)");
    const colNames = cols.rows.map((r: any) => r.name);
    const missingTurso = [];
    if (!colNames.includes("email")) missingTurso.push("email TEXT");
    if (!colNames.includes("passcode")) missingTurso.push("passcode TEXT");
    if (!colNames.includes("affiliatedCode")) missingTurso.push("affiliatedCode TEXT");
    if (!colNames.includes("isActivated")) missingTurso.push("isActivated INTEGER DEFAULT 0");
    if (!colNames.includes("country")) missingTurso.push("country TEXT DEFAULT ''");
    if (!colNames.includes("gradeLevel")) missingTurso.push("gradeLevel TEXT DEFAULT ''");
    if (!colNames.includes("enrollmentType")) missingTurso.push("enrollmentType TEXT DEFAULT ''");
    if (!colNames.includes("isOnboarded")) missingTurso.push("isOnboarded INTEGER DEFAULT 0");
    if (!colNames.includes("assignedTutorId")) missingTurso.push("assignedTutorId TEXT DEFAULT ''");
    for (const col of missingTurso) {
      await db.execute(`ALTER TABLE turso_records ADD COLUMN ${col}`);
    }
  } catch (e) {
    console.warn("Schema migration note:", e);
  }
  // Seed data removed — production database must be populated via admin tools or migrations.
  await seedK12CurriculumMetadata();
  console.log("✅ Database tables initialized");
}

// ─── Session Management ───
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

async function createSession(userId: string, email: string): Promise<string> {
  const token = generateSessionToken();
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_MS;
  await getDb().execute({
    sql: "INSERT INTO sessions (token, userId, email, createdAt, expiresAt) VALUES (?, ?, ?, ?, ?)",
    args: [token, userId, email, now, expiresAt],
  });
  return token;
}

async function validateSession(token: string): Promise<{ userId: string; email: string } | null> {
  if (!token) return null;
  try {
    const result = await getDb().execute({
      sql: "SELECT * FROM sessions WHERE token = ? AND expiresAt > ?",
      args: [token, Date.now()],
    });
    if (result.rows.length > 0) {
      return { userId: result.rows[0].userId as string, email: result.rows[0].email as string };
    }
  } catch {}
  return null;
}

async function deleteSession(token: string) {
  try {
    await getDb().execute({ sql: "DELETE FROM sessions WHERE token = ?", args: [token] });
  } catch {}
}

function setSessionCookie(c: any, token: string) {
  c.header("Set-Cookie", `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION_MS / 1000}`);
}

function clearSessionCookie(c: any) {
  c.header("Set-Cookie", "session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0");
}

function getSessionToken(c: any): string {
  const cookie = c.req.header("cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  return match ? match[1] : "";
}

// ─── GenAI ───
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey: key, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
    }
  }
  return aiClient;
}

// ═══════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════

app.get("/api/records", async (c) => {
  const result = await getDb().execute("SELECT * FROM turso_records ORDER BY registeredAt DESC");
  return c.json(result.rows);
});

app.post("/api/register", async (c) => {
  try {
    const body = await c.req.json();
    const { type, name, email, representative, academicTrack, studentVolume, kindOfSchool, billingCycle, passcode, affiliatedCode } = body;

    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedPasscode = typeof passcode === 'string' ? passcode : '';
    const trimmedRep = typeof representative === 'string' ? representative.trim() : '';
    const trimmedType = typeof type === 'string' ? type.trim() : '';

    if (!trimmedType || !trimmedEmail || !trimmedPasscode || !trimmedName) {
      const missing = [];
      if (!trimmedType) missing.push('type');
      if (!trimmedEmail) missing.push('email');
      if (!trimmedPasscode) missing.push('password');
      if (!trimmedName) missing.push('name');
      return c.json({ error: `Missing required fields: ${missing.join(', ')}.` }, 400);
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return c.json({ error: 'Invalid email format.' }, 400);
    }
    if (trimmedPasscode.length < 6 || trimmedPasscode.length > 128) {
      return c.json({ error: 'Password must be between 6 and 128 characters.' }, 400);
    }
    if (trimmedType === "Institution" && !trimmedRep) {
      return c.json({ error: 'Representative name is required for institutions.' }, 400);
    }
    const VALID_TYPES = ['Water Student', 'Independent Student', 'School Student', 'Institution'];
    if (!VALID_TYPES.includes(trimmedType)) {
      return c.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}.` }, 400);
    }

    const existing = await getDb().execute({ sql: "SELECT id FROM turso_records WHERE email = ?", args: [trimmedEmail] });
    if (existing.rows.length > 0) {
      return c.json({ error: 'Email already registered. Please sign in.' }, 409);
    }

    let calculatedPriceStr = "";
    let totalCents = 1900;
    if (trimmedType === "Institution") {
      const vol = Math.max(1, parseInt(typeof studentVolume === 'string' ? studentVolume : String(studentVolume)) || 1);
      const billingStr = typeof billingCycle === 'string' ? billingCycle.trim() : '';
      const multiplier = vol > 300 ? 0.8 : vol > 100 ? 0.9 : 1.0;
      if (billingStr === "Yearly") {
        const total = Math.floor(vol * 12 * 12 * multiplier);
        calculatedPriceStr = `$${total.toLocaleString()} / Year`;
        totalCents = total * 100;
      } else {
        const total = Math.floor(vol * 12 * multiplier);
        calculatedPriceStr = `$${total.toLocaleString()} / Month`;
        totalCents = total * 100;
      }
    } else if (trimmedType === "Water Student") { calculatedPriceStr = "$19 / Month"; totalCents = 1900; }
    else if (trimmedType === "Independent Student") { calculatedPriceStr = "$15 / Month"; totalCents = 1500; }
    else if (trimmedType === "School Student") { calculatedPriceStr = "$12 / Month"; totalCents = 1200; }

    const newId = `turso-${Date.now()}`;
    const now = new Date().toISOString();
    const hashedPasscode = await bcrypt.hash(trimmedPasscode, 12);
    await getDb().execute({
      sql: `INSERT INTO turso_records (id, type, name, email, representative, academicTrack, studentVolume, kindOfSchool, billingCycle, calculatedPrice, registeredAt, passcode, affiliatedCode, isActivated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        args: [newId, trimmedType, trimmedName, trimmedEmail, trimmedRep || trimmedName, (typeof academicTrack === 'string' ? academicTrack.trim() : '') || "",
        type === "Institution" ? Math.max(1, parseInt(studentVolume) || 1) : 1,
        (typeof kindOfSchool === 'string' ? kindOfSchool.trim() : '') || (trimmedType === "Institution" ? "Homeschool Co-Op" : "Homeschool Individual"),
        (typeof billingCycle === 'string' ? billingCycle.trim() : '') || "Monthly",
        calculatedPriceStr, now, hashedPasscode, (typeof affiliatedCode === 'string' ? affiliatedCode.trim() : '') || ""],
    });

    return c.json({ id: newId, type: trimmedType, name: trimmedName, email: trimmedEmail, representative: trimmedRep || trimmedName, academicTrack: "", studentVolume: type === "Institution" ? Math.max(1, parseInt(studentVolume) || 1) : 1, kindOfSchool: (typeof kindOfSchool === 'string' ? kindOfSchool.trim() : '') || (trimmedType === "Institution" ? "Homeschool Co-Op" : "Homeschool Individual"), billingCycle: (typeof billingCycle === 'string' ? billingCycle.trim() : '') || "Monthly", calculatedPrice: calculatedPriceStr, registeredAt: now, passcode: trimmedPasscode, affiliatedCode: (typeof affiliatedCode === 'string' ? affiliatedCode.trim() : '') || "", isActivated: false, checkoutUrl: null });
  } catch (err: any) {
    return c.json({ error: "Registration failed", details: err.message }, 400);
  }
});

app.post("/api/login", async (c) => {
  try {
    const body = await c.req.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const passcode = typeof body.passcode === 'string' ? body.passcode : '';

    if (!email || !passcode) return c.json({ error: "Email and password required." }, 400);
    if (!EMAIL_REGEX.test(email)) return c.json({ error: 'Invalid email format.' }, 400);

    const result = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE email = ?", args: [email] });
    if (result.rows.length > 0) {
      const user = { ...result.rows[0] } as any;
      const passwordMatch = await bcrypt.compare(passcode, user.passcode || "");
      if (!passwordMatch) {
        return c.json({ error: "Invalid email or password." }, 401);
      }
      user.isActivated = !!result.rows[0].isActivated;
      delete user.passcode;
      const token = await createSession(user.id, email);
      setSessionCookie(c, token);
      return c.json({ success: true, user });
    }
    return c.json({ error: "Invalid email or password." }, 401);
  } catch (err: any) {
    return c.json({ error: "Login failed", details: err.message }, 400);
  }
});

app.post("/api/logout", async (c) => {
  const token = getSessionToken(c);
  if (token) await deleteSession(token);
  clearSessionCookie(c);
  return c.json({ success: true });
});

app.get("/api/session", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ authenticated: false });
  try {
    const result = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE id = ?", args: [session.userId] });
    if (result.rows.length > 0) {
      const user = { ...result.rows[0] } as any;
      user.isActivated = !!result.rows[0].isActivated;
      delete user.passcode;
      return c.json({ authenticated: true, user });
    }
  } catch {}
  return c.json({ authenticated: false });
});

app.get("/api/curriculum/track", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const userRes = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE id = ?", args: [session.userId] });
    if (userRes.rows.length === 0) return c.json({ error: "User not found" }, 404);
    const user = userRes.rows[0] as any;
    const country = (user.country || "US") as string;
    const gradeLevel = (user.gradeLevel || "5") as string;
    const enrollmentType = (user.enrollmentType || "independent") as string;
    const affiliatedCode = (user.affiliatedCode || "") as string;
    let trackId = "";
    let trackDisplayName = "";
    let lessonIds: string[] = [];
    if (affiliatedCode && enrollmentType === "school-student") {
      const instRes = await getDb().execute({ sql: "SELECT id FROM turso_records WHERE affiliatedCode = ? AND type = 'Institution' LIMIT 1", args: [affiliatedCode] });
      if (instRes.rows.length > 0) {
        const instId = (instRes.rows[0] as any).id;
        const overrideRes = await getDb().execute({ sql: "SELECT ordered_lesson_ids, grade_level, subject FROM institution_curriculum_overrides WHERE institution_id = ? AND grade_level = ? LIMIT 1", args: [instId, gradeLevel] });
        if (overrideRes.rows.length > 0) {
          lessonIds = JSON.parse((overrideRes.rows[0] as any).ordered_lesson_ids || '[]');
          trackId = `override-${instId}-${gradeLevel}`;
          trackDisplayName = `Institution Override — Grade ${gradeLevel}`;
        }
      }
    }
    if (!trackId) {
      const trackRes = await getDb().execute({ sql: "SELECT * FROM curriculum_tracks WHERE country_code = ? AND grade_level = ? AND (track_type = 'country_standard' OR is_default = 1) LIMIT 1", args: [country, gradeLevel] });
      if (trackRes.rows.length > 0) {
        const track = trackRes.rows[0] as any;
        trackId = track.id;
        trackDisplayName = track.display_name;
        lessonIds = JSON.parse(track.lesson_ids || '[]');
      } else {
        const fbRes = await getDb().execute({ sql: "SELECT * FROM curriculum_tracks WHERE is_default = 1 LIMIT 1" });
        if (fbRes.rows.length > 0) {
          const fb = fbRes.rows[0] as any;
          trackId = fb.id;
          trackDisplayName = fb.display_name;
          lessonIds = JSON.parse(fb.lesson_ids || '[]');
        }
      }
    }
    const lessons: any[] = [];
    for (const lid of lessonIds) {
      const lRes = await getDb().execute({ sql: "SELECT * FROM lessons WHERE id = ?", args: [lid] });
      if (lRes.rows.length > 0) {
        const l = lRes.rows[0] as any;
        lessons.push({ id: l.id, title: l.title, lesson_type: l.lesson_type, estimated_minutes: l.estimated_minutes, subject: l.subject, grade_level: l.grade_level, content_ref: l.content_ref });
      }
    }
    return c.json({ track_id: trackId, display_name: trackDisplayName, grade_level: gradeLevel, country_code: country, lessons });
  } catch (err: any) {
    return c.json({ error: "Failed to load curriculum track", details: err.message }, 500);
  }
});

app.get("/api/curriculum/lessons", async (c) => {
  const lessonId = c.req.query("lesson_id");
  if (!lessonId) return c.json({ error: "lesson_id required" }, 400);
  try {
    const result = await getDb().execute({ sql: "SELECT * FROM lessons WHERE id = ?", args: [lessonId] });
    if (result.rows.length === 0) return c.json({ error: "Lesson not found" }, 404);
    const l = result.rows[0] as any;
    return c.json({ id: l.id, title: l.title, description: l.description, subject: l.subject, grade_level: l.grade_level, lesson_type: l.lesson_type, estimated_minutes: l.estimated_minutes, content_ref: l.content_ref, quiz_ref: l.quiz_ref });
  } catch (err: any) {
    return c.json({ error: "Failed to load lesson", details: err.message }, 500);
  }
});

app.get("/api/lessons/component/:hash", async (c) => {
  const hash = c.req.param("hash");
  if (!hash) return c.json({ error: "hash required" }, 400);
  try {
    const result = await getDb().execute({ sql: "SELECT * FROM lessons WHERE content_ref = ?", args: [hash] });
    if (result.rows.length === 0) return c.json({ error: "Lesson component not found" }, 404);
    const l = result.rows[0] as any;
    return c.json({ id: l.id, title: l.title, subject: l.subject, grade_level: l.grade_level, lesson_type: l.lesson_type, content_ref: l.content_ref });
  } catch (err: any) {
    return c.json({ error: "Failed to load lesson component", details: err.message }, 500);
  }
});

app.get("/api/progress", async (c) => {
  const { rows } = await getDb().execute("SELECT * FROM student_progress WHERE id = 'default'");
  if (rows.length > 0) {
    const row = rows[0] as any;
    return c.json({ points: row.points, streakDays: row.streakDays, level: row.level, completedLessons: JSON.parse(row.completedLessons || '[]'), unlockedBadges: JSON.parse(row.unlockedBadges || '[]'), lastActiveDate: row.lastActiveDate });
  }
  return c.json({ points: 0, streakDays: 0, level: 1, completedLessons: [], unlockedBadges: [], lastActiveDate: new Date().toISOString().split("T")[0] });
});

app.post("/api/progress", async (c) => {
  try {
    const body = await c.req.json();
    await getDb().execute({
      sql: `INSERT INTO student_progress (id, points, streakDays, level, completedLessons, unlockedBadges, lastActiveDate) VALUES ('default', ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET points=excluded.points, streakDays=excluded.streakDays, level=excluded.level, completedLessons=excluded.completedLessons, unlockedBadges=excluded.unlockedBadges, lastActiveDate=excluded.lastActiveDate`,
        args: [body.points || 0, body.streakDays || 0, body.level || 1, JSON.stringify(body.completedLessons || []), JSON.stringify(body.unlockedBadges || []), body.lastActiveDate || new Date().toISOString().split("T")[0]],
    });
    return c.json(body);
  } catch (err: any) {
    return c.json({ error: "Failed to save progress" }, 400);
  }
});

app.get("/api/tasks", async (c) => {
  const { rows } = await getDb().execute("SELECT * FROM tasks ORDER BY id DESC");
  return c.json(rows);
});

app.post("/api/tasks", async (c) => {
  try {
    const body = await c.req.json();
    const id = `task-${Date.now()}`;
    await getDb().execute({
      sql: `INSERT INTO tasks (id, title, description, category, rewardPoints, status, assignee, createdBy, backersCount) VALUES (?, ?, ?, ?, ?, 'Open', NULL, ?, 1)`,
      args: [id, body.title, body.description, body.category || "Community", body.rewardPoints || 1000, body.createdBy || "Student Builder"],
    });
    return c.json({ id, title: body.title, description: body.description, category: body.category || "Community", rewardPoints: body.rewardPoints || 1000, status: "Open", assignee: null, createdBy: body.createdBy || "Student Builder", backersCount: 1 });
  } catch (err) {
    return c.json({ error: "Failed to create task" }, 400);
  }
});

app.patch("/api/tasks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const sets: string[] = [];
    const args: any[] = [];
    for (const [k, v] of Object.entries(body)) {
      sets.push(`${k} = ?`);
      args.push(v);
    }
    args.push(id);
    await getDb().execute({ sql: `UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`, args });
    const { rows } = await getDb().execute({ sql: "SELECT * FROM tasks WHERE id = ?", args: [id] });
    return rows.length > 0 ? c.json(rows[0]) : c.json({ error: "Task not found" }, 404);
  } catch (err) {
    return c.json({ error: "Failed to update task" }, 400);
  }
});

app.post("/api/update-user", async (c) => {
  try {
    const body = await c.req.json();
    const { email, type, kindOfSchool, academicTrack, billingCycle, country, gradeLevel, enrollmentType, isOnboarded } = body;
    if (!email) return c.json({ error: "Email is required" }, 400);
    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    await getDb().execute({
      sql: `UPDATE turso_records SET
        type = COALESCE(?, type),
        kindOfSchool = COALESCE(?, kindOfSchool),
        academicTrack = COALESCE(?, academicTrack),
        billingCycle = COALESCE(?, billingCycle),
        country = COALESCE(?, country),
        gradeLevel = COALESCE(?, gradeLevel),
        enrollmentType = COALESCE(?, enrollmentType),
        isOnboarded = COALESCE(?, isOnboarded)
        WHERE email = ?`,
      args: [type || null, kindOfSchool || null, academicTrack || null, billingCycle || null, country || null, gradeLevel || null, enrollmentType || null, isOnboarded != null ? (isOnboarded ? 1 : 0) : null, trimmedEmail],
    });
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: "Update failed", details: err.message }, 400);
  }
});

app.post("/api/activate-user", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;
    if (!email) return c.json({ error: "Email is required" }, 400);
    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    await getDb().execute({ sql: `UPDATE turso_records SET isActivated = 1 WHERE email = ?`, args: [trimmedEmail] });
    return c.json({ success: true, activated: true });
  } catch (err: any) {
    return c.json({ error: "Activation failed", details: err.message }, 400);
  }
});

app.post("/api/create-checkout-session", async (c) => {
  try {
    const { email, type, billingCycle } = await c.req.json();
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey === "MY_STRIPE_SECRET_KEY") {
      return c.json({ error: "Stripe not configured" }, 500);
    }
    const isYearly = billingCycle === "yearly";
    let unitAmount = 1900;
    let productName = 'Water Classroom Activation';
    if (type === "independent-student" || type === "Independent Student") { unitAmount = isYearly ? 15000 : 1500; productName = isYearly ? 'Water Classroom — Independent (Yearly)' : 'Water Classroom — Independent'; }
    else if (type === "school-student" || type === "School Student") { unitAmount = isYearly ? 12000 : 1200; productName = isYearly ? 'Water Classroom — School Student (Yearly)' : 'Water Classroom — School Student'; }
    else if (type === "water-student" || type === "Water Student") { unitAmount = isYearly ? 19000 : 1900; productName = isYearly ? 'Water Classroom — Water Student (Yearly)' : 'Water Classroom — Water Student'; }
    const stripeClient = new Stripe(stripeKey);
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'usd', product_data: { name: productName }, unit_amount: unitAmount }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}?payment_success=true&email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}?payment_cancel=true`,
    });
    return c.json({ url: session.url });
  } catch (err: any) {
    return c.json({ error: "Checkout creation failed", details: err.message }, 500);
  }
});

app.post("/api/gemini/tutoring", async (c) => {
  try {
    const body = await c.req.json();
    const { messages, selectedLessonContext } = body;
    if (!messages || !Array.isArray(messages)) return c.json({ error: "Messages required" }, 400);

    const promptText = messages[messages.length - 1].text;
    const historyText = messages.slice(0, -1).map((m: any) => `${m.sender === "student" ? "Student" : "Tutor"}: ${m.text}`).join("\n");

    const systemInstruction = `You are the authorized "Water Classroom" 24/7 AI tutor. Guide students on home-school curricula following first-principles: Individual Sovereignty, Wealth Creation (Do Good, Make Money, Have Fun), Universal Standard of Morality, Structural Incentive Engineering, and Post-Scarcity Automation. Adopt a friendly, professional Swiss/Modern academic tone. Use Socratic inquiry. Align with: ${selectedLessonContext || "General Curriculum Track"}. Respond in clean Markdown.`;

    const ai = getGenAI();
    if (!ai) {
      return c.json({ error: "GEMINI_API_KEY not configured. AI tutor is unavailable." }, 503);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nHistory:\n${historyText}\n\nLatest query:\n${promptText}` }] }],
    });
    return c.json({ text: response.text || "I apologize, let's explore this again." });
  } catch (error: any) {
    return c.json({ error: "Tutor error", details: error.message }, 500);
  }
});

app.post("/api/exam/start", async (c) => {
  try {
    const token = getSessionToken(c);
    const session = await validateSession(token);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const { exam_id } = await c.req.json();
    if (!exam_id) return c.json({ error: "exam_id required" }, 400);
    const examRes = await getDb().execute({ sql: "SELECT * FROM exams WHERE id = ?", args: [exam_id] });
    if (examRes.rows.length === 0) return c.json({ error: "Exam not found" }, 404);
    const exam = examRes.rows[0] as any;
    const lessonRes = await getDb().execute({ sql: "SELECT * FROM lessons WHERE id = ?", args: [exam.lesson_id] });
    if (lessonRes.rows.length === 0) return c.json({ error: "Lesson not found" }, 404);
    const lesson = lessonRes.rows[0] as any;
    const quizData = lesson.quiz_ref ? JSON.parse(lesson.quiz_ref || '{"questions":[]}') : { questions: [] };
    const attemptId = `attempt-${Date.now()}`;
    await getDb().execute({
      sql: `INSERT INTO exam_attempts (id, student_id, exam_id, score, max_score, proctor_flags, camera_authorized, status, started_at) VALUES (?, ?, ?, NULL, 1.0, '[]', 0, 'in_progress', ?)`,
      args: [attemptId, session.userId, exam_id, new Date().toISOString()],
    });
    return c.json({ exam_id: exam.id, duration_seconds: exam.duration_seconds, questions: quizData.questions || [], attempt_id: attemptId });
  } catch (err: any) {
    return c.json({ error: "Failed to start exam", details: err.message }, 500);
  }
});

app.post("/api/exam/:attemptId/submit", async (c) => {
  try {
    const token = getSessionToken(c);
    const session = await validateSession(token);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const attemptId = c.req.param("attemptId");
    const { answers } = await c.req.json();
    const attemptRes = await getDb().execute({ sql: "SELECT * FROM exam_attempts WHERE id = ? AND student_id = ?", args: [attemptId, session.userId] });
    if (attemptRes.rows.length === 0) return c.json({ error: "Attempt not found" }, 404);
    const attempt = attemptRes.rows[0] as any;
    const examRes = await getDb().execute({ sql: "SELECT * FROM exams WHERE id = ?", args: [attempt.exam_id] });
    const exam = examRes.rows[0] as any;
    const lessonRes = await getDb().execute({ sql: "SELECT quiz_ref FROM lessons WHERE id = ?", args: [exam.lesson_id] });
    const quizData = lessonRes.rows.length > 0 ? JSON.parse((lessonRes.rows[0] as any).quiz_ref || '{"questions":[]}') : { questions: [] };
    const questions = quizData.questions || [];
    let correct = 0;
    questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctAnswerIndex) correct++;
    });
    const score = questions.length > 0 ? correct / questions.length : 0;
    const passed = score >= (exam.passing_score || 0.7);
    const status = passed ? "verified" : "flagged";
    await getDb().execute({
      sql: `UPDATE exam_attempts SET score = ?, status = ?, completed_at = ? WHERE id = ?`,
      args: [score, status, new Date().toISOString(), attemptId],
    });
    if (passed) {
      const progressRes = await getDb().execute({ sql: "SELECT * FROM student_progress WHERE id = 'default'" });
      let progress: any = { points: 0, completedLessons: [], unlockedBadges: [] };
      if (progressRes.rows.length > 0) {
        progress = progressRes.rows[0] as any;
      }
      const completedLessons = JSON.parse(progress.completedLessons || '[]');
      if (!completedLessons.includes(exam.lesson_id)) completedLessons.push(exam.lesson_id);
      const newPoints = (progress.points || 0) + 100;
      const unlockedBadges = JSON.parse(progress.unlockedBadges || '[]');
      if (!unlockedBadges.includes("exam-master")) unlockedBadges.push("exam-master");
      await getDb().execute({
        sql: `INSERT INTO student_progress (id, points, streakDays, level, completedLessons, unlockedBadges, lastActiveDate) VALUES ('default', ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET points=excluded.points, completedLessons=excluded.completedLessons, unlockedBadges=excluded.unlockedBadges`,
        args: [newPoints, progress.streakDays || 0, Math.floor(newPoints / 1000) + 1, JSON.stringify(completedLessons), JSON.stringify(unlockedBadges), new Date().toISOString().split("T")[0]],
      });
    }
    return c.json({ attempt_id: attemptId, score, passed, verified: passed, proctor_flags: [], status });
  } catch (err: any) {
    return c.json({ error: "Failed to submit exam", details: err.message }, 500);
  }
});

app.get("/api/institution/roster", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const userRes = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE id = ?", args: [session.userId] });
    if (userRes.rows.length === 0) return c.json({ error: "User not found" }, 404);
    const user = userRes.rows[0] as any;
    if (user.type !== "Institution") return c.json({ error: "Forbidden" }, 403);
    const affiliatedCode = user.affiliatedCode || user.id;
    const studentsRes = await getDb().execute({ sql: "SELECT tr.*, sp.points, sp.streakDays, sp.level, sp.lastActiveDate FROM turso_records tr LEFT JOIN student_progress sp ON sp.id = tr.id WHERE tr.affiliatedCode = ? AND tr.type != 'Institution'", args: [affiliatedCode] });
    const students = studentsRes.rows.map((s: any) => ({
      id: s.id, name: s.name, email: s.email, grade_level: s.gradeLevel, enrollment_type: s.enrollmentType,
      points: s.points || 0, streak_days: s.streakDays || 0, level: s.level || 1, last_active: s.lastActiveDate || ""
    }));
    return c.json({ institution_id: user.id, institution_name: user.name, students });
  } catch (err: any) {
    return c.json({ error: "Failed to load roster", details: err.message }, 500);
  }
});

app.post("/api/institution/roster/invite", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const userRes = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE id = ?", args: [session.userId] });
    const user = userRes.rows[0] as any;
    if (user.type !== "Institution") return c.json({ error: "Forbidden" }, 403);
    const { name, email, grade_level, enrollment_type } = await c.req.json();
    if (!name || !email) return c.json({ error: "Name and email required" }, 400);
    const newId = `turso-${Date.now()}`;
    await getDb().execute({
      sql: `INSERT INTO turso_records (id, type, name, email, kindOfSchool, gradeLevel, enrollmentType, affiliatedCode, isActivated, passcode, country, academicTrack) VALUES (?, 'School Student', ?, ?, 'School-Enrolled Learner', ?, ?, ?, 1, '', COALESCE(?, ''), '')`,
      args: [newId, name, email, grade_level || "5", enrollment_type || "school-student", user.affiliatedCode || user.id, user.country || ""],
    });
    return c.json({ id: newId, name, email, grade_level, enrollment_type }, 201);
  } catch (err: any) {
    return c.json({ error: "Failed to invite student", details: err.message }, 500);
  }
});

app.get("/api/institution/tutors", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const userRes = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE id = ?", args: [session.userId] });
    const user = userRes.rows[0] as any;
    const instId = user.type === "Institution" ? user.id : user.affiliatedCode;
    const tutorsRes = await getDb().execute({ sql: "SELECT * FROM tutors WHERE institution_id = ?", args: [instId] });
    return c.json({ tutors: tutorsRes.rows });
  } catch (err: any) {
    return c.json({ error: "Failed to load tutors", details: err.message }, 500);
  }
});

app.post("/api/institution/tutors", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const userRes = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE id = ?", args: [session.userId] });
    const user = userRes.rows[0] as any;
    const instId = user.type === "Institution" ? user.id : user.affiliatedCode;
    const { name, email, subjects, grade_levels } = await c.req.json();
    if (!name || !email) return c.json({ error: "Name and email required" }, 400);
    const tutorId = `tutor-${Date.now()}`;
    await getDb().execute({
      sql: `INSERT INTO tutors (id, institution_id, name, email, subjects, grade_levels, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [tutorId, instId, name, email, JSON.stringify(subjects || []), JSON.stringify(grade_levels || []), new Date().toISOString()],
    });
    return c.json({ id: tutorId, name, email, subjects, grade_levels }, 201);
  } catch (err: any) {
    return c.json({ error: "Failed to create tutor", details: err.message }, 500);
  }
});

app.post("/api/institution/tutors/assign", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { tutor_id, student_id } = await c.req.json();
    if (!tutor_id || !student_id) return c.json({ error: "tutor_id and student_id required" }, 400);
    await getDb().execute({ sql: "UPDATE turso_records SET assignedTutorId = ? WHERE id = ?", args: [tutor_id, student_id] });
    const tutorRes = await getDb().execute({ sql: "SELECT * FROM tutors WHERE id = ?", args: [tutor_id] });
    const tutor = tutorRes.rows[0] as any;
    return c.json({ success: true, tutor: { id: tutor.id, name: tutor.name, email: tutor.email } });
  } catch (err: any) {
    return c.json({ error: "Failed to assign tutor", details: err.message }, 500);
  }
});

app.put("/api/institution/curriculum/override", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const userRes = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE id = ?", args: [session.userId] });
    const user = userRes.rows[0] as any;
    const instId = user.type === "Institution" ? user.id : user.affiliatedCode;
    const { grade_level, subject, ordered_lesson_ids } = await c.req.json();
    if (!grade_level || !subject || !ordered_lesson_ids) return c.json({ error: "grade_level, subject, and ordered_lesson_ids required" }, 400);
    const overrideId = `override-${instId}-${grade_level}-${subject}`;
    const now = new Date().toISOString();
    await getDb().execute({
      sql: `INSERT INTO institution_curriculum_overrides (id, institution_id, grade_level, subject, ordered_lesson_ids, created_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET ordered_lesson_ids = excluded.ordered_lesson_ids, updated_at = excluded.updated_at`,
      args: [overrideId, instId, grade_level, subject, JSON.stringify(ordered_lesson_ids), session.userId, now],
    });
    return c.json({ success: true, override_id: overrideId });
  } catch (err: any) {
    return c.json({ error: "Failed to set curriculum override", details: err.message }, 500);
  }
});

app.get("/api/community/topics", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const tracksRes = await getDb().execute({ sql: "SELECT DISTINCT grade_level FROM curriculum_tracks ORDER BY grade_level" });
    const topics = tracksRes.rows.map((t: any) => ({
      id: `grade-${t.grade_level}`,
      label: `Grade ${t.grade_level}`,
      subtopics: ["All", "General", "Mathematics", "Science", "English", "Visual Arts", "Robotics", "Creed", "Human Dynamics"]
    }));
    return c.json({ topics });
  } catch (err: any) {
    return c.json({ error: "Failed to load topics", details: err.message }, 500);
  }
});

app.get("/api/community/posts", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const topicId = c.req.query("topic_id") || "grade-all";
    const subject = c.req.query("subject") || "";
    const limit = parseInt(c.req.query("limit") || "20");
    const offset = parseInt(c.req.query("offset") || "0");
    let sql = "SELECT * FROM community_posts WHERE moderation_status = 'approved'";
    const args: any[] = [];
    if (topicId.startsWith("grade-")) {
      const gradeLevel = topicId.replace("grade-", "");
      sql += " AND grade_level = ?";
      args.push(gradeLevel);
    }
    if (subject && subject !== "All") {
      sql += " AND category = ?";
      args.push(subject);
    }
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    args.push(limit, offset);
    const result = await getDb().execute({ sql, args });
    const posts = result.rows.map((p: any) => ({
      id: p.id, author_name: p.author_name, author_level: p.author_level, title: p.title, content: p.content,
      likes: p.likes, replies: p.replies, category: p.category, created_at: p.created_at
    }));
    return c.json({ posts });
  } catch (err: any) {
    return c.json({ error: "Failed to load posts", details: err.message }, 500);
  }
});

app.post("/api/community/posts", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { title, content, category, grade_level } = await c.req.json();
    if (!title || !content) return c.json({ error: "Title and content required" }, 400);
    const userRes = await getDb().execute({ sql: "SELECT * FROM turso_records WHERE id = ?", args: [session.userId] });
    const user = userRes.rows[0] as any;
    const gradeLvl = grade_level || user.gradeLevel || "all";
    const isYoung = ["K", "1", "2", "3"].includes(gradeLvl);
    const postId = `post-${Date.now()}`;
    const status = isYoung ? "pending" : "approved";
    await getDb().execute({
      sql: `INSERT INTO community_posts (id, author_id, author_name, author_level, title, content, category, grade_level, moderation_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [postId, session.userId, user.name || "Student", 1, title, content, category || "General", gradeLvl, status, new Date().toISOString()],
    });
    return c.json({ id: postId, status }, 201);
  } catch (err: any) {
    return c.json({ error: "Failed to create post", details: err.message }, 500);
  }
});

app.post("/api/community/posts/:id/like", async (c) => {
  const token = getSessionToken(c);
  const session = await validateSession(token);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  try {
    const postId = c.req.param("id");
    await getDb().execute({ sql: "UPDATE community_posts SET likes = likes + 1 WHERE id = ?", args: [postId] });
    const res = await getDb().execute({ sql: "SELECT likes FROM community_posts WHERE id = ?", args: [postId] });
    return c.json({ id: postId, likes: (res.rows[0] as any).likes });
  } catch (err: any) {
    return c.json({ error: "Failed to like post", details: err.message }, 500);
  }
});

// SPA fallback
app.get("*", async (c, next) => {
  const p = c.req.path;
  if (p.startsWith("/api") || p.includes(".")) return next();
  try {
    const html = fs.readFileSync(path.join(process.cwd(), "dist", "index.html"), "utf-8");
    return c.html(html);
  } catch {
    return c.text("Building... please refresh.", 503);
  }
});

app.use("/*", serveStatic({ root: "./dist" }));

// ─── Start ───
await initDB();
console.log(`🚀 Starting server on port ${PORT}...`);
serve({ fetch: app.fetch, port: PORT });
