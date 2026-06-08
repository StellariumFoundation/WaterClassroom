import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@libsql/client";
import Stripe from "stripe";

dotenv.config();

const app = new Hono();
const PORT = 3000;

// In-memory / Mock Persistence database
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const PROGRESS_FILE = path.join(DATA_DIR, "progress.json");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");
const TURSO_FILE = path.join(DATA_DIR, "turso_db.json");

const SEED_TURSO_RECORDS = [
  {
    id: "turso-1",
    type: "Institution",
    name: "Sovereign Florida Homeschool",
    representative: "Teacher Harrison",
    academicTrack: "US Common Core & US Learner Track",
    studentVolume: 25,
    kindOfSchool: "Homeschool Co-Op",
    billingCycle: "Monthly",
    calculatedPrice: "$300 / Month",
    registeredAt: "2026-06-01T10:00:00.000Z",
    dbStatus: "COMMITTED TO TURSO"
  },
  {
    id: "turso-2",
    type: "Individual Student",
    name: "Alice Vance",
    representative: "Parent Sophia Vance",
    academicTrack: "International Baccalaureate (IB) Syllabus",
    studentVolume: 1,
    kindOfSchool: "Homeschool Individual",
    billingCycle: "Monthly",
    calculatedPrice: "$19 / Month",
    registeredAt: "2026-06-03T14:30:00.000Z",
    dbStatus: "COMMITTED TO TURSO"
  },
  {
    id: "turso-3",
    type: "Institution",
    name: "Zurich First-Principles Lyceum",
    representative: "Admin Swiss Dr. Muller",
    academicTrack: "Swiss Maturité Curriculum",
    studentVolume: 150,
    kindOfSchool: "Undergraduate until College",
    billingCycle: "Yearly",
    calculatedPrice: "$21,600 / Year",
    registeredAt: "2026-06-05T09:15:00.000Z",
    dbStatus: "COMMITTED TO TURSO"
  }
];

function getTursoRecords() {
  if (fs.existsSync(TURSO_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(TURSO_FILE, "utf-8"));
    } catch {
      // ignore
    }
  }
  return SEED_TURSO_RECORDS;
}

function saveTursoRecords(data: any) {
  fs.writeFileSync(TURSO_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Default tasks for the Board of Tasks
const DEFAULT_TASKS = [
  {
    id: "task-1",
    title: "Drafting AI Guidelines for Public Administration",
    description: "Formulate code-level rules preventing bureaucratic corruption using automated accounting ledgers.",
    category: "Policy",
    rewardPoints: 1500,
    status: "Open",
    assignee: null,
    createdBy: "Water Classroom Admin",
    backersCount: 14
  },
  {
    id: "task-2",
    title: "Water Robotics Simulator Prototype",
    description: "Assemble a lightweight WebGL renderer to test remote bipedal robot motion simulation in construction projects.",
    category: "Tech",
    rewardPoints: 2000,
    status: "Open",
    assignee: null,
    createdBy: "Water Robotics Division",
    backersCount: 22
  },
  {
    id: "task-3",
    title: "Food Affordability Outreach",
    description: "Lobby regional agricultural companies to pledge surplus crop outputs for free packaging with advertising.",
    category: "Philanthropy",
    rewardPoints: 1200,
    status: "In Progress",
    assignee: "Sovereign Builder",
    createdBy: "Water Philanthropy Circle",
    backersCount: 8
  }
];

// Load progress
function getProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    } catch {
      // ignore
    }
  }
  return {
    points: 0,
    streakDays: 3,
    level: 1,
    completedLessons: [],
    unlockedBadges: [],
    lastActiveDate: new Date().toISOString().split("T")[0]
  };
}

// Load tasks
function getTasks() {
  if (fs.existsSync(TASKS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(TASKS_FILE, "utf-8"));
    } catch {
      // ignore
    }
  }
  return DEFAULT_TASKS;
}

// Save helpers
function saveProgress(data: any) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function saveTasks(data: any) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Lazy Initialize GenAI connection
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return aiClient;
}

// Lazy Initialize Turso Client
let tursoClient: ReturnType<typeof createClient> | null = null;
let tursoInitialized = false;

async function getTursoClient() {
  if (!tursoClient) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
      throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required.");
    }
    tursoClient = createClient({ url, authToken });
  }
  
  if (!tursoInitialized) {
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS turso_records (
        id TEXT PRIMARY KEY,
        type TEXT,
        name TEXT,
        email TEXT,
        representative TEXT,
        academicTrack TEXT,
        studentVolume INTEGER,
        kindOfSchool TEXT,
        billingCycle TEXT,
        calculatedPrice TEXT,
        registeredAt TEXT,
        dbStatus TEXT,
        passcode TEXT,
        affiliatedCode TEXT
      )
    `);
    tursoInitialized = true;
    
    // Seed initial records if empty
    const { rows } = await tursoClient.execute("SELECT COUNT(*) as count FROM turso_records");
    if (rows[0] && rows[0].count === 0) {
      for (const record of SEED_TURSO_RECORDS) {
        await tursoClient.execute({
          sql: `INSERT INTO turso_records (id, type, name, email, representative, academicTrack, studentVolume, kindOfSchool, billingCycle, calculatedPrice, registeredAt, dbStatus, passcode, affiliatedCode)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            record.id, record.type, record.name, (record as any).email || "", record.representative, record.academicTrack, record.studentVolume,
            record.kindOfSchool, record.billingCycle, record.calculatedPrice, record.registeredAt, record.dbStatus, (record as any).passcode || "", (record as any).affiliatedCode || ""
          ]
        });
      }
    }
  }
  return tursoClient;
}

// API Routes
app.get("/api/records", async (c) => {
  try {
    const client = await getTursoClient();
    const result = await client.execute("SELECT * FROM turso_records ORDER BY registeredAt DESC");
    return c.json(result.rows);
  } catch (err: any) {
    if (err.message && err.message.includes("TURSO_DATABASE_URL")) {
      console.warn("Turso not configured in .env, falling back to local memory records.");
    } else {
      console.error("Turso error:", err);
    }
    // fallback to memory if Turso isn't configured
    return c.json(getTursoRecords());
  }
});

app.post("/api/create-checkout-session", async (c) => {
  try {
    const { email } = await c.req.json();
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey === "MY_STRIPE_SECRET_KEY") {
      return c.json({ error: "Stripe not configured" }, 500);
    }
    
    const stripeClient = new Stripe(stripeKey);
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Water Classroom Activation' },
            unit_amount: 1900,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}?payment_success=true&email=${encodeURIComponent(email)}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}?payment_cancel=true`,
    });
    return c.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    return c.json({ error: "Checkout creation failed", details: err.message }, 500);
  }
});

app.post("/api/register", async (c) => {
  try {
    const body = await c.req.json();
    const { type, name, email, representative, academicTrack, studentVolume, kindOfSchool, billingCycle, passcode, affiliatedCode } = body;
    
    if (!type || !email || !passcode || !name) {
       return c.json({ error: "Type, email, password, and name are required." }, 400);   
    }

    if (passcode.length < 6) {
       return c.json({ error: "Password must be at least 6 characters." }, 400);   
    }

    if (type === "Institution" && !representative) {
      return c.json({ error: "Name and representative are required field parameters" }, 400);
    }
    
    // Check if email already exists
    try {
      const client = await getTursoClient();
      const existing = await client.execute({
        sql: "SELECT id FROM turso_records WHERE email = ?",
        args: [email]
      });
      if (existing.rows.length > 0) {
        return c.json({ error: "Email already registered" }, 409);
      }
    } catch (err: any) {
      // Fallback for memory check
      const records = getTursoRecords();
      if (records.some(r => (r as any).email === email)) {
         return c.json({ error: "Email already registered" }, 409);
      }
    }
    
    const records = getTursoRecords();
    
    // Server-side database price calculation
    let calculatedPriceStr = "";
    let totalCents = 1900;
    if (type === "Institution") {
      const vol = Math.max(1, parseInt(studentVolume) || 1);
      const baseRate = 12; // $12 per student per month
      let multiplier = 1.0;
      if (vol > 300) multiplier = 0.8;
      else if (vol > 100) multiplier = 0.9;
      
      if (billingCycle === "Yearly") {
        const annualPerStudent = baseRate * 12 * multiplier; // $144 * multiplier
        const total = Math.floor(vol * annualPerStudent);
        calculatedPriceStr = `$${total.toLocaleString()} / Year`;
        totalCents = total * 100;
      } else {
        const monthlyPerStudent = baseRate * multiplier; // $12 * multiplier
        const total = Math.floor(vol * monthlyPerStudent);
        calculatedPriceStr = `$${total.toLocaleString()} / Month`;
        totalCents = total * 100;
      }
    } else {
      // Individual student
      if (billingCycle === "Yearly") {
        calculatedPriceStr = "$149 / Year";
        totalCents = 14900;
      } else {
        calculatedPriceStr = "$19 / Month";
        totalCents = 1900;
      }
    }
    
    // Check for Stripe
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    let checkoutUrl = null;
    let fallbackOrigin = process.env.APP_URL || c.req.header('origin') || 'http://localhost:3000';

    if (stripeKey && stripeKey !== "MY_STRIPE_SECRET_KEY") {
      try {
        const stripeClient = new Stripe(stripeKey);
        const session = await stripeClient.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `${type} Registration (${billingCycle})`,
                  description: `${type === "Institution" ? studentVolume : 1} student(s) at ${kindOfSchool || ''}`,
                },
                unit_amount: totalCents,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${fallbackOrigin}?payment_success=true&email=${encodeURIComponent(email)}`,
          cancel_url: `${fallbackOrigin}?payment_cancel=true`,
        });
        checkoutUrl = session.url;
      } catch (err: any) {
        console.error("Stripe error:", err);
      }
    }
    
    const newRecord = {
      id: `turso-${Date.now()}`,
      type,
      email: email || "",
      name,
      representative: representative || name,
      academicTrack: academicTrack || "Universal First-Principles Track",
      studentVolume: type === "Institution" ? Math.max(1, parseInt(studentVolume) || 1) : 1,
      kindOfSchool: kindOfSchool || (type === "Institution" ? "Homeschool Co-Op" : "Homeschool Individual"),
      billingCycle: billingCycle || "Monthly",
      calculatedPrice: calculatedPriceStr,
      registeredAt: new Date().toISOString(),
      passcode: passcode || "",
      affiliatedCode: affiliatedCode || "",
      isActivated: false
    };
    
    try {
      const client = await getTursoClient();
      await client.execute({
        sql: `INSERT INTO turso_records (id, type, name, email, representative, academicTrack, studentVolume, kindOfSchool, billingCycle, calculatedPrice, registeredAt, passcode, affiliatedCode, isActivated)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          newRecord.id, newRecord.type, newRecord.name, newRecord.email, newRecord.representative, newRecord.academicTrack, newRecord.studentVolume,
          newRecord.kindOfSchool, newRecord.billingCycle, newRecord.calculatedPrice, newRecord.registeredAt, newRecord.passcode, newRecord.affiliatedCode, 0
        ]
      });
    } catch (err: any) {
      if (err.message && err.message.includes("TURSO_DATABASE_URL")) {
        console.warn("Turso not configured in .env, falling back to local memory records.");
      } else {
        console.error("Turso insert error:", err);
      }
      // fallback to memory if Turso isn't configured
      records.unshift(newRecord);
      saveTursoRecords(records);
    }
    
    return c.json({ ...newRecord, checkoutUrl });
  } catch (err: any) {
    return c.json({ error: "Invalid registration payload", details: err.message }, 400);
  }
});

app.post("/api/login", async (c) => {
  try {
    const { email, passcode } = await c.req.json();
    if (!email || !passcode) {
      return c.json({ error: "Email and password are required" }, 400);
    }
    if (typeof email !== 'string' || typeof passcode !== 'string') {
      return c.json({ error: "Invalid input types" }, 400);
    }
    
    try {
      const client = await getTursoClient();
      const result = await client.execute({
        sql: "SELECT * FROM turso_records WHERE email = ? AND passcode = ?",
        args: [email, passcode]
      });
      if (result.rows.length > 0) {
        const user = { ...result.rows[0] };
        (user as any).isActivated = !!(user as any).isActivated;
        return c.json({ success: true, user });
      } else {
        return c.json({ error: "Invalid credentials" }, 401);
      }
    } catch(err: any) {
      if (err.message && err.message.includes("TURSO_DATABASE_URL")) {
        console.warn("Turso not configured in .env, falling back to local memory records.");
      }
      // fallback to memory
      const records = getTursoRecords();
      const user = records.find(r => (r as any).email === email && (r as any).passcode === passcode);
      if (user) {
        return c.json({ success: true, user });
      } else {
        return c.json({ error: "Invalid credentials" }, 401);
      }
    }
  } catch (err: any) {
    return c.json({ error: "Invalid login payload" }, 400);
  }
});

app.get("/api/progress", (c) => {
  return c.json(getProgress());
});

app.post("/api/progress", async (c) => {
  try {
    const body = await c.req.json();
    const current = getProgress();
    const updated = { ...current, ...body };
    saveProgress(updated);
    return c.json(updated);
  } catch (err: any) {
    return c.json({ error: "Invalid payload" }, 400);
  }
});

app.get("/api/tasks", (c) => {
  return c.json(getTasks());
});

app.post("/api/tasks", async (c) => {
  try {
    const body = await c.req.json();
    const tasks = getTasks();
    const newTask = {
      id: `task-${Date.now()}`,
      title: body.title,
      description: body.description,
      category: body.category || "Community",
      rewardPoints: body.rewardPoints || 1000,
      status: "Open",
      assignee: null,
      createdBy: body.createdBy || "Student Builder",
      backersCount: 1
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return c.json(newTask);
  } catch (err) {
    return c.json({ error: "Invalid payload" }, 400);
  }
});

app.patch("/api/tasks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const tasks = getTasks();
    const idx = tasks.findIndex((t: any) => t.id === id);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...body };
      saveTasks(tasks);
      return c.json(tasks[idx]);
    } else {
      return c.json({ error: "Task not found" }, 404);
    }
  } catch (err) {
    return c.json({ error: "Invalid payload" }, 400);
  }
});

// Tutor API endpoint
app.post("/api/gemini/tutoring", async (c) => {
  try {
    const body = await c.req.json();
    const { messages, selectedLessonContext } = body;
    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: "Messages payload is required" }, 400);
    }

    const promptText = messages[messages.length - 1].text;
    const historyText = messages
      .slice(0, messages.length - 1)
      .map((m: any) => `${m.sender === "student" ? "Student" : "Tutor"}: ${m.text}`)
      .join("\n");

    const systemInstruction = `
You are the authorized "Water Classroom" 24/7 AI tutor, an advanced educational model designed for the Water Classroom global school system.
Your goal is to guide students on home-school curricula following first-principles philosophical and technical criteria, specifically:
1. Individual Sovereignty and personal choice.
2. Wealth Creation: "Do Good, Make Money, Have Fun" (The Trinity Test - any action must fulfill all three).
3. Universal Standard of Morality (Prohibitions against killing, stealing, bearing false witness, and the mandate to love your neighbor as yourself).
4. Structural Incentive Engineering (Designing reward mechanisms so actors optimize for collective prosperity through self-interest).
5. Post-Scarcity Automation: Deploying the "Water Suite" (Water AI, Water Classroom, Water Robotics, and Water Gov) to replace mundane manual labor and elevate human genius.

When answering, adopt a friendly, highly intelligent, engaging, and professional Swiss/Modern academic tone. Align your advice with the curriculum selection the student is currently studying:
${selectedLessonContext || "General Curriculum Track"}.

Keep your responses structured in clean, beautiful Markdown. If the student has doubts, provide a step-by-step Socratic inquiry to guide them to the correct conclusion rather than simply leaking answers.
`;

    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\nStudent Chat History:\n${historyText}\n\nLatest student query:\n${promptText}`
              }
            ]
          }
        ]
      });

      const reply = response.text || "I apologize, let's explore this again.";
      return c.json({ text: reply });
    } else {
      // Fallback generator
      const simulatedResponses = [
        `### Water Classroom AI Tutor Report 🌟\n\nExcellent inquiry! In our study of first-principles, we examine how **incentives** shape human systems. \n\nRemember the core dictum:\n> **Make Money, Have Fun, Do Good.**\n\nTo align your efforts with collective prosperity, you must apply the **Trinity Test**. If any of these three elements is missing, the venture is not aligned and must be redesigned.\n\n*Note: To query the live adaptive Gemini AI, configure your API key in AI Studio Secrets!*`,
        `### Understanding Structural Incentive Engineering ⚙️\n\nYour question touches the core axis of **Systems Design**! As studied in *Mastering Businesses*:\n\n1. **Quantification**: Every role's performance should be clearly quantifiable.\n2. **Incentive Alignment**: Link executive and employee compensation direct to systemic metrics (like affordability or productivity), rather than arbitrary stock manipulation metrics.\n\nHow do you see this applied to your current study project?\n\n*Note: To unlock live adaptive tutoring dialogs, enable your Gemini API key in the secrets panel!*`,
        `### Elevating to Eden through Automation 🤖\n\nUnder the **Water Suite** architecture, we deploy **Water Robotics** and **Water AI** to automate labor-intensive digital and physical chores.\n\nThis liberates humanity to pursue creative quests, masterclass learning, and deep relational community in a post-scarcity society.\n\nWhat curriculum track do you plan to master next?\n\n*Note: Inject your Gemini API key in the secrets panel to active the live tutor stream.*`
      ];

      const replyIdx = Math.abs(promptText.length) % simulatedResponses.length;
      return c.json({ text: simulatedResponses[replyIdx] });
    }
  } catch (error: any) {
    console.error("Gemini tutoring API Error:", error);
    return c.json({ error: "Gemini server experienced an issue.", details: error.message }, 500);
  }
});

// Serve index.html for React client SPA routes (e.g., /tutor, /leaderboard)
app.get("*", async (c, next) => {
  const pathVal = c.req.path;
  if (pathVal.startsWith("/api") || pathVal.includes(".")) {
    return next();
  }
  try {
    const html = fs.readFileSync(path.join(process.cwd(), "dist", "index.html"), "utf-8");
    return c.html(html);
  } catch {
    return c.text("Building site... please refresh in a few seconds.", 503);
  }
});

// Serve static assets out of the bundled dist folder
app.use("/*", serveStatic({ root: "./dist" }));

console.log(`Starting Hono server on port ${PORT}...`);
serve({
  fetch: app.fetch,
  port: PORT
});
