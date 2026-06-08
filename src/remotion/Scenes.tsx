import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { COLORS, FONTS, SCALE } from "./theme";
import React from "react";

// ─── Utilities ───

const GradientText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span
    style={{
      background: "linear-gradient(135deg, #60a5fa, #a5b4fc, #f0abfc)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      ...style,
    }}
  >
    {children}
  </span>
);

const fadeIn = (frame: number, delay: number = 0, duration: number = 20): number =>
  interpolate(frame - delay, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const slideUp = (frame: number, delay: number = 0): number =>
  spring({ frame: frame - delay, fps: 30, config: { damping: 12, mass: 0.5 } });

// Helper to scale font sizes
const sz = (base: number, p: boolean = false) => p ? Math.round(base * SCALE * 0.85) : Math.round(base * SCALE);

// ─── Background ───

export const Bg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse at 50% 0%, #0f2b5e 0%, #0a1628 70%)",
    }}
  />
);

// ─── Particle Overlay ───

const particles = Array.from({ length: 40 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  speed: Math.random() * 0.5 + 0.2,
  delay: Math.random() * 100,
}));

export const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const yPos = ((frame * p.speed + p.delay * 10) % 120) - 10;
        const opacity = interpolate(yPos, [-10, 20, 80, 110], [0, 0.4, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", left: `${p.x}%`, top: `${yPos}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: COLORS.blueLight, opacity, boxShadow: `0 0 6px ${COLORS.blueLight}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Tag Badge (reusable) ───
const Badge: React.FC<{ text: string; color: string; bg: string; border: string }> = ({ text, color, bg, border }) => (
  <span style={{
    display: "inline-block", padding: "8px 20px", borderRadius: 9999,
    background: bg, border: `1px solid ${border}`, color,
    fontSize: 14, fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase" as const, fontFamily: FONTS.mono, marginBottom: 16,
  }}>
    {text}
  </span>
);

// ═══════════════════════════════════════
// SCENE 1 — HERO
// ═══════════════════════════════════════
export const SceneHero: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const titleScale = slideUp(frame, 5);
  const subOpacity = fadeIn(frame, 25);
  const badgeOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 40px" : "0 100px" }}>
      <div style={{ opacity: badgeOpacity, marginBottom: p ? 24 : 36, textAlign: "center" }}>
        <Badge text="✦ Stellarium Foundation" color={COLORS.blueLight} bg="rgba(29,78,216,0.3)" border="rgba(59,130,246,0.3)" />
      </div>

      <div style={{ transform: `scale(${titleScale})`, textAlign: "center" }}>
        {/* Bigger W Logo */}
        <div style={{
          width: p ? 110 : 140, height: p ? 110 : 140, borderRadius: 28,
          background: "linear-gradient(135deg, #1e3a5f, #0a162f)",
          border: "3px solid rgba(59, 130, 246, 0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px", fontSize: p ? 48 : 64, fontWeight: 900,
          color: COLORS.blueLight, boxShadow: "0 0 40px rgba(59,130,246,0.2)",
        }}>
          W
        </div>

        <h1 style={{
          fontSize: p ? 68 : 96, fontWeight: 900, lineHeight: 1.05,
          letterSpacing: "-0.03em", textTransform: "uppercase" as const,
          color: "#fff", margin: 0, fontFamily: FONTS.display,
        }}>
          Water{" "}<GradientText>Classroom</GradientText>
        </h1>
      </div>

      <p style={{
        opacity: subOpacity, fontSize: p ? 20 : 28, color: COLORS.textDim,
        fontWeight: 400, maxWidth: p ? 600 : 850, textAlign: "center",
        lineHeight: 1.6, marginTop: p ? 24 : 32, fontFamily: FONTS.display,
      }}>
        A Complete AI-Powered School — Interactive Content, Games, AI Tutoring &amp; Verified Exams for K–12 and Beyond
      </p>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 2 — STATS
// ═══════════════════════════════════════
const statsData = [
  { num: "500K+", label: "Concurrent Students" },
  { num: "99.9%", label: "Platform Uptime" },
  { num: "75+", label: "Programs" },
  { num: "28", label: "Countries" },
  { num: "6s", label: "AI Response" },
  { num: "24/7", label: "AI Tutor" },
];

export const SceneStats: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 30px" : "0 80px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: p ? 28 : 36 }}>
        <Badge text="📊 By the Numbers" color="#67e8f9" bg="rgba(6,182,212,0.2)" border="rgba(6,182,212,0.3)" />
        <h2 style={{ fontSize: p ? 40 : 52, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.15, fontFamily: FONTS.display }}>
          Platform Scale &amp; Reach
        </h2>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: p ? "1fr 1fr" : "1fr 1fr 1fr",
        gap: p ? 16 : 24, width: "100%", maxWidth: p ? 500 : 900,
      }}>
        {statsData.map((s, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 12);
          const cardScale = spring({ frame: frame - 10 - i * 12, fps: 30, config: { damping: 14, mass: 0.4 } });
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `scale(${cardScale})`,
              background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 18, padding: p ? "24px 16px" : "32px 24px", textAlign: "center",
            }}>
              <div style={{
                fontSize: p ? 36 : 48, fontWeight: 900, fontFamily: FONTS.mono,
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {s.num}
              </div>
              <div style={{
                fontSize: p ? 13 : 16, color: COLORS.textDim, marginTop: 6,
                textTransform: "uppercase" as const, letterSpacing: "0.08em",
                fontFamily: FONTS.display, fontWeight: 600,
              }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 3 — PROBLEM
// ═══════════════════════════════════════
const problems = [
  { icon: "💰", title: "Cost", desc: "Private schooling is prohibitively expensive for most families" },
  { icon: "🌍", title: "Geography", desc: "Quality education is concentrated in wealthy urban areas" },
  { icon: "📐", title: "One-Size-Fits-All", desc: "Standardized curricula fail to adapt to individual learners" },
];

export const SceneProblem: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const titleOpacity = fadeIn(frame, 0);
  const titleY = slideUp(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 30px" : "0 80px" }}>
      <div style={{ opacity: titleOpacity, transform: `translateY(${(1 - titleY) * 30}px)`, textAlign: "center", marginBottom: p ? 20 : 28 }}>
        <Badge text="💡 The Problem" color={COLORS.amber} bg="rgba(245,158,11,0.2)" border="rgba(245,158,11,0.3)" />
        <h2 style={{ fontSize: p ? 40 : 52, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.15, fontFamily: FONTS.display }}>
          Education Is Broken
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: p ? "column" : "row", gap: p ? 16 : 24, width: "100%", maxWidth: p ? 550 : 950 }}>
        {problems.map((prob, i) => {
          const cardOpacity = fadeIn(frame, 15 + i * 18);
          const cardY = slideUp(frame, 15 + i * 18);
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardY) * 30}px)`,
              flex: 1, background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 20, padding: p ? "24px 20px" : "32px 28px", textAlign: "center",
            }}>
              <div style={{ fontSize: p ? 42 : 52, marginBottom: 12 }}>{prob.icon}</div>
              <h3 style={{ fontSize: p ? 20 : 26, fontWeight: 700, color: "#fff", margin: "0 0 6px 0", fontFamily: FONTS.display }}>{prob.title}</h3>
              <p style={{ fontSize: p ? 14 : 18, color: COLORS.textDim, margin: 0, lineHeight: 1.5, fontFamily: FONTS.display }}>{prob.desc}</p>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: p ? 20 : 28, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 14, padding: "14px 24px", textAlign: "center" }}>
        <p style={{ fontSize: p ? 16 : 20, fontWeight: 600, color: "#fcd34d", fontFamily: FONTS.display }}>
          Result: <span style={{ color: "#f8fafc" }}>Millions lack access to personalized, credential-validated education.</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 4 — FEATURES
// ═══════════════════════════════════════
const features = [
  { icon: "🧠", title: "AI-Tailored Curriculum", desc: "75+ programs across 28 countries" },
  { icon: "🤖", title: "24/7 AI Tutoring", desc: "Google Gemini Socratic companion" },
  { icon: "✅", title: "Verified Exams", desc: "Camera-based VLM proctoring" },
  { icon: "🎮", title: "Gamified Learning", desc: "Badges, streaks, XP levels" },
];

export const SceneFeatures: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 30px" : "0 80px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: p ? 24 : 32 }}>
        <Badge text="🚀 Key Features" color={COLORS.blueLight} bg="rgba(29,78,216,0.3)" border="rgba(59,130,246,0.3)" />
        <h2 style={{ fontSize: p ? 40 : 52, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.15, fontFamily: FONTS.display }}>
          Everything a Student Needs
        </h2>
      </div>

      <div style={{
        width: "100%", maxWidth: p ? 550 : 850,
        display: p ? "flex" : "grid", flexDirection: p ? "column" as const : undefined,
        gridTemplateColumns: p ? undefined : "1fr 1fr", gap: p ? 14 : 22,
      }}>
        {features.map((f, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 12);
          const cardY = slideUp(frame, 10 + i * 12);
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardY) * 20}px)`,
              background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 18, padding: p ? "20px 22px" : "28px 30px",
              display: "flex", alignItems: "center", gap: p ? 18 : 24,
            }}>
              <div style={{
                width: p ? 56 : 68, height: p ? 56 : 68, borderRadius: 14,
                background: "rgba(30, 58, 95, 0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: p ? 28 : 34, flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: p ? 18 : 22, fontWeight: 700, color: "#fff", margin: 0, fontFamily: FONTS.display }}>{f.title}</h3>
                <p style={{ fontSize: p ? 13 : 16, color: COLORS.textDim, margin: "3px 0 0 0", fontFamily: FONTS.display }}>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 5 — INNOVATION LABS
// ═══════════════════════════════════════
const labs = [
  { icon: "⚙️", title: "Robotics Simulator", desc: "Calibrate & balance humanoid robots with real physics" },
  { icon: "📊", title: "Incentive Economics", desc: "Model real-world business incentives & reward structures" },
  { icon: "🏆", title: "Trinity Game", desc: "Balance Do Good, Make Money, Have Fun" },
];

export const SceneLabs: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 30px" : "0 80px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: p ? 24 : 32 }}>
        <Badge text="🎯 Innovation Labs" color={COLORS.emeraldLight} bg="rgba(16,185,129,0.2)" border="rgba(16,185,129,0.3)" />
        <h2 style={{ fontSize: p ? 40 : 52, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.15, fontFamily: FONTS.display }}>
          Learn by Doing
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: p ? "column" : "row", gap: p ? 16 : 24, width: "100%", maxWidth: p ? 500 : 900 }}>
        {labs.map((l, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 18);
          const cardY = slideUp(frame, 10 + i * 18);
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardY) * 25}px)`,
              flex: 1, background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 20, padding: p ? "24px 20px" : "36px 28px", textAlign: "center",
            }}>
              <div style={{ fontSize: p ? 48 : 60, marginBottom: 12 }}>{l.icon}</div>
              <h3 style={{ fontSize: p ? 18 : 24, fontWeight: 700, color: "#fff", margin: "0 0 6px 0", fontFamily: FONTS.display }}>{l.title}</h3>
              <p style={{ fontSize: p ? 13 : 16, color: COLORS.textDim, margin: 0, fontFamily: FONTS.display }}>{l.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 6 — VERIFIED EXAMS
// ═══════════════════════════════════════
const examFeatures = [
  { icon: "🛡️", title: "Camera Proctoring", desc: "VLM facial recognition & eye tracking processed locally for privacy" },
  { icon: "🔐", title: "SHA-256 Ledger", desc: "Every certificate cryptographically hashed for tamper-proof verification" },
  { icon: "📜", title: "Verifiable Transcripts", desc: "Share immutable credentials with any institution worldwide" },
];

export const SceneExams: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 30px" : "0 80px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: p ? 20 : 28 }}>
        <Badge text="🎓 Verified Credentialing" color={COLORS.purpleLight} bg="rgba(99,102,241,0.2)" border="rgba(99,102,241,0.3)" />
        <h2 style={{ fontSize: p ? 36 : 48, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.15, fontFamily: FONTS.display }}>
          Exams You Can Trust
        </h2>
        <p style={{ fontSize: p ? 16 : 20, color: COLORS.textDim, maxWidth: p ? 450 : 650, margin: "10px auto 0", lineHeight: 1.5, fontWeight: 400, fontFamily: FONTS.display }}>
          Browser-based proctored exams with camera verification and blockchain-backed certificates
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: p ? "column" : "row", gap: p ? 14 : 20, width: "100%", maxWidth: p ? 500 : 850 }}>
        {examFeatures.map((e, i) => {
          const cardOpacity = fadeIn(frame, 15 + i * 20);
          const cardY = slideUp(frame, 15 + i * 20);
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardY) * 25}px)`,
              flex: 1, background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 18, padding: p ? "22px 18px" : "30px 28px", textAlign: "center",
            }}>
              <div style={{ fontSize: p ? 44 : 56, marginBottom: 10 }}>{e.icon}</div>
              <h3 style={{ fontSize: p ? 17 : 22, fontWeight: 700, color: "#fff", margin: "0 0 6px 0", fontFamily: FONTS.display }}>{e.title}</h3>
              <p style={{ fontSize: p ? 12 : 15, color: COLORS.textDim, margin: 0, lineHeight: 1.5, fontFamily: FONTS.display }}>{e.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 7 — PRICING
// ═══════════════════════════════════════
export const ScenePricing: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 30px" : "0 80px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center" }}>
        <Badge text="💰 Simple Pricing" color={COLORS.purpleLight} bg="rgba(99,102,241,0.2)" border="rgba(99,102,241,0.3)" />
      </div>

      <div style={{
        display: "flex", flexDirection: p ? "column" : "row",
        gap: p ? 20 : 28, width: "100%", maxWidth: p ? 500 : 800,
        marginTop: p ? 8 : 16,
      }}>
        {[
          { tier: "Water Student", price: "$19", period: "/mo", color: COLORS.blueLight, accent: "rgba(59,130,246,0.5)", featured: true },
          { tier: "Institution", price: "$12", period: "/stud/mo", color: COLORS.purpleLight, accent: "rgba(99,102,241,0.3)", featured: false },
        ].map((pCard, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 20);
          const cardY = slideUp(frame, 10 + i * 20);
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardY) * 25}px)`,
              flex: 1,
              background: pCard.featured
                ? "linear-gradient(135deg, rgba(30,58,95,0.4), rgba(10,22,47,0.4))"
                : "linear-gradient(135deg, rgba(30,58,95,0.2), rgba(10,22,47,0.2))",
              border: pCard.featured ? `2px solid ${pCard.accent}` : `1px solid ${pCard.accent}`,
              borderRadius: 22, padding: p ? "28px 24px" : "36px 32px", textAlign: "center",
            }}>
              <div style={{
                fontSize: p ? 14 : 16, fontWeight: 700, textTransform: "uppercase" as const,
                letterSpacing: "0.12em", color: pCard.color, marginBottom: 12, fontFamily: FONTS.display,
              }}>
                {pCard.tier}
              </div>
              <div style={{
                fontSize: p ? 52 : 64, fontWeight: 900, color: "#fff",
                fontFamily: FONTS.mono, marginBottom: 4,
              }}>
                {pCard.price}
                <span style={{ fontSize: p ? 16 : 20, color: COLORS.textMuted, fontWeight: 400 }}>{pCard.period}</span>
              </div>
              {pCard.featured && (
                <div style={{
                  marginTop: 12, fontSize: p ? 12 : 14, color: COLORS.textDim,
                  fontFamily: FONTS.display, fontStyle: "italic",
                }}>
                  Also available: $190/year
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 8 — CTA
// ═══════════════════════════════════════
export const SceneCTA: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const opacity = fadeIn(frame, 5);
  const scale = spring({ frame: frame - 5, fps: 30, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 40px" : "0 100px" }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <h2 style={{
          fontSize: p ? 52 : 72, fontWeight: 900, color: "#fff",
          margin: "0 0 20px 0", lineHeight: 1.1, fontFamily: FONTS.display,
        }}>
          Ready to Transform<br />Education?
        </h2>
        <p style={{
          fontSize: p ? 20 : 26, color: COLORS.textDim, maxWidth: p ? 450 : 650,
          margin: "0 auto 28px", lineHeight: 1.6, fontFamily: FONTS.display, fontWeight: 400,
        }}>
          Join the global movement to democratize learning.
          Water Classroom is open for students, educators, and institutions worldwide.
        </p>
        {/* Animated CTA button visual */}
        <div style={{
          display: "inline-block", padding: "16px 40px", borderRadius: 16,
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          color: "#fff", fontWeight: 700, fontSize: p ? 16 : 20,
          letterSpacing: "0.08em", textTransform: "uppercase" as const,
          fontFamily: FONTS.display, boxShadow: "0 0 40px rgba(96,165,250,0.3)",
        }}>
          Enter the Classroom →
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 9 — OUTRO / LOGO
// ═══════════════════════════════════════
export const SceneOutro: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;
  const opacity = fadeIn(frame, 5);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 40px" : "0 100px" }}>
      <div style={{ opacity, textAlign: "center" }}>
        {/* Bigger outro logo */}
        <div style={{
          width: p ? 100 : 130, height: p ? 100 : 130, borderRadius: 28,
          background: "linear-gradient(135deg, #1e3a5f, #0a162f)",
          border: "3px solid rgba(59, 130, 246, 0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", fontSize: p ? 42 : 56, fontWeight: 900,
          color: COLORS.blueLight, boxShadow: "0 0 30px rgba(59,130,246,0.2)",
        }}>
          W
        </div>
        <h3 style={{
          fontSize: p ? 26 : 34, fontWeight: 700, color: "#fff",
          margin: 0, fontFamily: FONTS.display,
        }}>
          Water <GradientText>Classroom</GradientText>
        </h3>
        <p style={{
          fontSize: p ? 14 : 18, color: COLORS.textMuted, marginTop: 12,
          fontFamily: FONTS.mono, fontWeight: 500,
        }}>
          waterclassroom.onrender.com
        </p>
      </div>
    </AbsoluteFill>
  );
};
