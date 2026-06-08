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

// Font size multiplier for bigger graphics (1.0 = original, 1.3 = 30% bigger)
export const SCALE = 1.35;

export const DURATION = {
  SCENE_HERO: 180,     // 6s — Brand intro with logo animation
  SCENE_STATS: 210,    // 7s — Impressive platform metrics
  SCENE_PROBLEM: 270,  // 9s — Education barriers detailed
  SCENE_FEATURES: 390, // 13s — 6 key feature highlights
  SCENE_LABS: 300,     // 10s — Innovation labs showcase
  SCENE_EXAMS: 210,    // 7s — Verified exam system
  SCENE_PRICING: 120,  // 4s — Pricing cards
  SCENE_CTA: 60,       // 2s — Call to action
  SCENE_OUTRO: 60,     // 2s — Logo + URL
};

export const TOTAL_DURATION = Object.values(DURATION).reduce((a, b) => a + b, 0); // 1800 frames = 60s at 30fps

export const FPS = 30;
