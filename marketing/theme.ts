// ─── Water Classroom Brand Theme ───

export const COLORS = {
  // Dark space background
  bg: "#0a1628",
  bgLight: "#0f2b5e",
  
  // Blues
  blue: "#3b82f6",
  blueLight: "#60a5fa",
  blueDark: "#1d4ed8",
  blueGlow: "rgba(59, 130, 246, 0.4)",
  
  // Purple accent
  purple: "#818cf8",
  purpleLight: "#a5b4fc",
  
  // Emerald / success
  emerald: "#10b981",
  emeraldLight: "#6ee7b7",
  
  // Amber
  amber: "#f59e0b",
  
  // Text
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  
  // Cards
  cardBg: "rgba(15, 23, 42, 0.6)",
  cardBorder: "rgba(59, 130, 246, 0.15)",
} as const;

export const FONTS = {
  display: "'Neue Frutiger World', 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Font size multiplier for bigger graphics (2.5 = 150% bigger)
export const SCALE = 2.5;

// ═══ 7-Scene Narrative Arc (60s at 30fps = 1800 frames) ═══
// 1. HOOK: Emotional value proposition
// 2. PROBLEM: Why education is broken
// 3. SOLUTION: What Water Classroom is
// 4. HOW IT WORKS: 3 simple steps
// 5. EXPERIENCE: AI tutor, games, labs
// 6. TRUST & PRICING: Stats + affordable plans
// 7. CTA: Call to action

export const DURATION = {
  SCENE_HOOK: 210,        // 7s  — Emotional hook: "School that adapts to you"
  SCENE_PROBLEM: 210,     // 7s  — Why education is broken
  SCENE_SOLUTION: 360,    // 12s — What Water Classroom is
  SCENE_HOW_IT_WORKS: 360, // 12s — 3 simple steps
  SCENE_EXPERIENCE: 300,  // 10s — AI tutor, games, labs
  SCENE_TRUST: 210,       // 7s  — Stats + pricing
  SCENE_CTA: 150,         // 5s  — Call to action
};

export const TOTAL_DURATION = Object.values(DURATION).reduce((a, b) => a + b, 0); // 1800 frames = 60s at 30fps

export const FPS = 30;
