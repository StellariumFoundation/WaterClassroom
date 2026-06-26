import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { COLORS, FONTS, SCALE } from "./theme";
import React from "react";

// ─── Scale Helper ───
// Applies the SCALE multiplier to every size value.
// Portrait (p) gets 85% of landscape size.
const sz = (base: number, p: boolean = false) => p ? Math.round(base * SCALE * 0.85) : Math.round(base * SCALE);

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

const pulse = (frame: number, delay: number = 0, speed: number = 0.03): number =>
  1 + 0.04 * Math.sin((frame - delay) * speed * Math.PI * 2);

// ─── Background ───

export const Bg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse at 50% 0%, #0f2b5e 0%, #0a1628 70%)",
    }}
  />
);

// ─── Particle Overlay ───

const particles = Array.from({ length: 35 }, () => ({
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
        const opacity = interpolate(yPos, [-10, 20, 80, 110], [0, 0.3, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
const Badge: React.FC<{ text: string; color: string; bg: string; border: string; p?: boolean }> = ({ text, color, bg, border, p = false }) => (
  <span style={{
    display: "inline-block", padding: `${sz(6, p)}px ${sz(14, p)}px`, borderRadius: 9999,
    background: bg, border: `1px solid ${border}`, color,
    fontSize: sz(9, p), fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase" as const, fontFamily: FONTS.mono, marginBottom: sz(8, p),
  }}>
    {text}
  </span>
);

// ─── Step Number Badge ───
const StepBadge: React.FC<{ num: string; p: boolean }> = ({ num, p }) => (
  <div style={{
    width: sz(24, p), height: sz(24, p), borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: sz(11, p), fontWeight: 900, color: "#fff",
    fontFamily: FONTS.mono, marginBottom: sz(6, p),
    boxShadow: "0 0 20px rgba(96,165,250,0.3)",
  }}>
    {num}
  </div>
);

// ═══════════════════════════════════════
// SCENE 1 — THE HOOK
// ═══════════════════════════════════════
export const SceneHook: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;

  const titleScale = slideUp(frame, 5);
  const glowPulse = pulse(frame, 0, 0.04);
  const subOpacity = fadeIn(frame, 30);
  const badgeOpacity = fadeIn(frame, 0);
  const ctaLineOpacity = fadeIn(frame, 100);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 16px" : "0 24px" }}>
      {/* Background glow accent */}
      <div style={{
        position: "absolute", width: sz(240, p), height: sz(240, p),
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        opacity: fadeIn(frame, 0, 30),
      }} />

      <div style={{ opacity: badgeOpacity, marginBottom: sz(12, p), textAlign: "center" }}>
        <Badge text="✦ Stellarium Foundation" color={COLORS.blueLight} bg="rgba(29,78,216,0.3)" border="rgba(59,130,246,0.3)" p={p} />
      </div>

      <div style={{ transform: `scale(${titleScale})`, textAlign: "center" }}>
        <h1 style={{
          fontSize: sz(52, p), fontWeight: 900, lineHeight: 1.1,
          letterSpacing: "-0.03em", color: "#fff", margin: "0 auto",
          fontFamily: FONTS.display, width: "100%",
        }}>
          The World's Best Education,{" "}
          <GradientText>Personalized to You</GradientText>
        </h1>
      </div>

      <p style={{
        opacity: subOpacity, fontSize: sz(16, p), color: COLORS.textDim,
        fontWeight: 400, width: "100%", textAlign: "center",
        lineHeight: 1.6, marginTop: sz(10, p), fontFamily: FONTS.display, maxWidth: "80%",
      }}>
        A complete AI-powered school with personalized curriculum, 24/7 tutoring,
        and verified credentials — for less than the cost of your monthly streaming subscription.
      </p>

      <div style={{
        opacity: ctaLineOpacity, marginTop: sz(14, p),
        display: "flex", alignItems: "center", gap: sz(6, p),
        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: sz(6, p), padding: `${sz(6, p)}px ${sz(12, p)}px`,
      }}>
        <span style={{ fontSize: sz(12, p) }}>🎯</span>
        <span style={{ fontSize: sz(10, p), color: "#6ee7b7", fontWeight: 700, fontFamily: FONTS.display }}>
          From <span style={{ color: "#fff" }}>$12</span> to <span style={{ color: "#fff" }}>$19</span> per month. Start today.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 2 — THE PROBLEM
// ═══════════════════════════════════════
const barriers = [
  { icon: "💰", title: "Too Expensive", stat: "$10k+", desc: "Private schooling costs more than college tuition" },
  { icon: "📐", title: "One-Size-Fits-All", stat: "1", desc: "A single curriculum for every learning style — no personalization" },
  { icon: "🌍", title: "Gated by Geography", stat: "2/3", desc: "Two-thirds of students lack access to quality education" },
];

export const SceneProblem: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;

  const titleOpacity = fadeIn(frame, 0);
  const titleY = slideUp(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 16px" : "0 24px" }}>
      <div style={{ opacity: titleOpacity, transform: `translateY(${(1 - titleY) * sz(10)}px)`, textAlign: "center", marginBottom: sz(8, p) }}>
        <Badge text="⚠️ The Problem" color={COLORS.amber} bg="rgba(245,158,11,0.15)" border="rgba(245,158,11,0.25)" p={p} />
        <h2 style={{ fontSize: sz(36, p), fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1, fontFamily: FONTS.display }}>
          Education Is Still<br />Stuck in the Past
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: p ? "column" : "row", gap: sz(8, p), width: "100%" }}>
        {barriers.map((b, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 18);
          const cardY = slideUp(frame, 10 + i * 18);
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardY) * sz(10)}px)`,
              flex: 1, background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: sz(8, p), padding: `${sz(14, p)}px ${sz(12, p)}px`, textAlign: "center",
            }}>
              <div style={{ fontSize: sz(30, p), marginBottom: sz(4, p) }}>{b.icon}</div>
              <div style={{
                fontSize: sz(24, p), fontWeight: 900, fontFamily: FONTS.mono,
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginBottom: sz(2, p),
              }}>{b.stat}</div>
              <h3 style={{ fontSize: sz(13, p), fontWeight: 700, color: "#fff", margin: "0 0 4px 0", fontFamily: FONTS.display }}>{b.title}</h3>
              <p style={{ fontSize: sz(9, p), color: COLORS.textDim, margin: 0, lineHeight: 1.4, fontFamily: FONTS.display }}>{b.desc}</p>
            </div>
          );
        })}
      </div>

      <div style={{
        opacity: fadeIn(frame, 120), marginTop: sz(10, p),
        background: "rgba(245,158,11,0.06)", borderRadius: sz(6, p),
        padding: `${sz(6, p)}px ${sz(12, p)}px`, textAlign: "center",
      }}>
        <p style={{ fontSize: sz(11, p), fontWeight: 600, color: "#fcd34d", fontFamily: FONTS.display, margin: 0 }}>
          But what if it didn't have to be this way?
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 3 — THE SOLUTION
// ═══════════════════════════════════════
const pillars = [
  { icon: "🧠", title: "AI-Tailored Curriculum", desc: "75+ programs across 28 countries, adapted to your pace and style", color: "#60a5fa" },
  { icon: "🤖", title: "24/7 AI Tutor", desc: "Google Gemini-powered Socratic companion — step-by-step guidance", color: "#a5b4fc" },
  { icon: "🎮", title: "Gamified Learning", desc: "Badges, streaks, XP levels, and Innovation Labs", color: "#6ee7b7" },
  { icon: "✅", title: "Verified Credentials", desc: "Camera-proctored exams with blockchain-backed certificates", color: "#fcd34d" },
];

export const SceneSolution: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;

  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 12px" : "0 20px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: sz(8, p) }}>
        <Badge text="💡 The Solution" color={COLORS.emeraldLight} bg="rgba(16,185,129,0.15)" border="rgba(16,185,129,0.25)" p={p} />
        <h2 style={{ fontSize: sz(32, p), fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1, fontFamily: FONTS.display }}>
          Meet <GradientText>Water Classroom</GradientText>
        </h2>
        <p style={{ fontSize: sz(11, p), color: COLORS.textDim, marginTop: sz(4, p), fontFamily: FONTS.display }}>
          The complete AI-powered school — in your browser, on any device.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: p ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: sz(8, p),
        width: "100%",
      }}>
        {pillars.map((pillar, i) => {
          const cardOpacity = fadeIn(frame, 8 + i * 15);
          const cardScale = spring({ frame: frame - 8 - i * 15, fps: 30, config: { damping: 14, mass: 0.4 } });
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `scale(${cardScale})`,
              background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: sz(8, p), padding: `${sz(12, p)}px ${sz(10, p)}px`, textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{
                width: sz(28, p), height: sz(28, p), borderRadius: sz(7, p),
                background: "rgba(30, 58, 95, 0.5)",
                border: `1px solid ${pillar.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: sz(14, p), marginBottom: sz(5, p),
              }}>
                {pillar.icon}
              </div>
              <h3 style={{ fontSize: sz(11, p), fontWeight: 700, color: "#fff", margin: 0, fontFamily: FONTS.display }}>{pillar.title}</h3>
              <p style={{ fontSize: sz(7, p), color: COLORS.textDim, margin: "4px 0 0 0", lineHeight: 1.4, fontFamily: FONTS.display }}>{pillar.desc}</p>
            </div>
          );
        })}
      </div>

      <div style={{
        opacity: fadeIn(frame, 220, 20), marginTop: sz(10, p),
        background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(124,58,237,0.1))",
        border: "1px solid rgba(59,130,246,0.2)", borderRadius: sz(6, p),
        padding: `${sz(6, p)}px ${sz(14, p)}px`, textAlign: "center",
      }}>
        <p style={{ fontSize: sz(10, p), color: COLORS.text, fontWeight: 600, fontFamily: FONTS.display, margin: 0 }}>
          Everything a student needs — from curriculum to credentials — in one seamless platform.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 4 — HOW IT WORKS
// ═══════════════════════════════════════
const steps = [
  { num: "1", title: "Choose Your Path", desc: "Select your country and curriculum from 75+ programs across 28 countries. Pick your track — Water Student, Independent, or School-enrolled." },
  { num: "2", title: "Learn Your Way", desc: "AI-powered lectures, interactive games, and a 24/7 Socratic tutor that adapts to YOUR learning pace and style." },
  { num: "3", title: "Earn Credentials", desc: "Browser-proctored exams with camera verification. Every certificate is hashed to our SHA-256 ledger — tamper-proof and shareable." },
];

export const SceneHowItWorks: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;

  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 16px" : "0 20px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: sz(8, p) }}>
        <Badge text="👣 Your Journey" color={COLORS.purpleLight} bg="rgba(99,102,241,0.15)" border="rgba(99,102,241,0.25)" p={p} />
        <h2 style={{ fontSize: sz(30, p), fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1, fontFamily: FONTS.display }}>
          Three Steps to a<br />World-Class Education
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: p ? "column" : "row", gap: sz(8, p), width: "100%" }}>
        {steps.map((s, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 22);
          const cardX = spring({ frame: frame - 10 - i * 22, fps: 30, config: { damping: 14, mass: 0.4 } });
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardX) * sz(8)}px)`,
              flex: 1, background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: sz(8, p), padding: `${sz(12, p)}px ${sz(10, p)}px`,
              position: "relative",
            }}>
              <StepBadge num={s.num} p={p} />
              <h3 style={{ fontSize: sz(13, p), fontWeight: 700, color: "#fff", margin: "0 0 6px 0", fontFamily: FONTS.display }}>{s.title}</h3>
              <p style={{ fontSize: sz(8, p), color: COLORS.textDim, margin: 0, lineHeight: 1.5, fontFamily: FONTS.display }}>{s.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 5 — THE EXPERIENCE
// ═══════════════════════════════════════
const experiences = [
  {
    icon: "🗣️",
    title: "Socratic AI Tutor",
    desc: "Ask anything, anytime. Our AI doesn't give answers — it guides you step-by-step with Socratic questioning, adapting to how you learn best.",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))",
    border: "rgba(59,130,246,0.3)",
  },
  {
    icon: "⚙️",
    title: "Innovation Labs",
    desc: "Teleoperate a humanoid robot. Balance the Trinity Game. Simulate real economics. Learning by doing — not by memorizing.",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))",
    border: "rgba(16,185,129,0.3)",
  },
  {
    icon: "📊",
    title: "Gamified Progress",
    desc: "Earn badges, level up, and track your streaks. Every lesson, game, and exam contributes to your verified learning record.",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))",
    border: "rgba(245,158,11,0.3)",
  },
];

export const SceneExperience: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;

  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 16px" : "0 20px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: sz(8, p) }}>
        <Badge text="🎯 The Experience" color={COLORS.blueLight} bg="rgba(29,78,216,0.2)" border="rgba(59,130,246,0.3)" p={p} />
        <h2 style={{ fontSize: sz(30, p), fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1, fontFamily: FONTS.display }}>
          Learning That Feels<br />Like Discovery
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: p ? "column" : "row", gap: sz(7, p), width: "100%" }}>
        {experiences.map((exp, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 20);
          const cardY = slideUp(frame, 10 + i * 20);
          return (
            <div key={i} style={{
              opacity: cardOpacity, transform: `translateY(${(1 - cardY) * sz(10)}px)`,
              flex: 1, background: exp.gradient, border: `1px solid ${exp.border}`,
              borderRadius: sz(8, p), padding: `${sz(12, p)}px ${sz(10, p)}px`,
            }}>
              <div style={{ fontSize: sz(30, p), marginBottom: sz(4, p), textAlign: "center" }}>{exp.icon}</div>
              <h3 style={{ fontSize: sz(12, p), fontWeight: 700, color: "#fff", margin: "0 0 6px 0", textAlign: "center", fontFamily: FONTS.display }}>{exp.title}</h3>
              <p style={{ fontSize: sz(8, p), color: COLORS.textDim, margin: 0, lineHeight: 1.5, textAlign: "center", fontFamily: FONTS.display }}>{exp.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 6 — TRUST & PRICING
// ═══════════════════════════════════════
const trustMetrics = [
  { stat: "75+", label: "Programs" },
  { stat: "28", label: "Countries" },
  { stat: "99.9%", label: "Uptime" },
  { stat: "24/7", label: "AI Support" },
];

export const SceneTrust: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;

  const titleOpacity = fadeIn(frame, 0);
  const pricingOpacity = fadeIn(frame, 70, 30);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: p ? "0 16px" : "0 20px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center" }}>
        <Badge text="🔐 Trusted Worldwide" color="#67e8f9" bg="rgba(6,182,212,0.15)" border="rgba(6,182,212,0.25)" p={p} />
      </div>

      {/* Trust metrics row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: p ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: sz(6, p),
        width: "100%",
        marginTop: sz(6, p),
      }}>
        {trustMetrics.map((m, i) => {
          const mOpacity = fadeIn(frame, 8 + i * 10);
          const mScale = spring({ frame: frame - 8 - i * 10, fps: 30, config: { damping: 14, mass: 0.4 } });
          return (
            <div key={i} style={{
              opacity: mOpacity, transform: `scale(${mScale})`,
              background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: sz(6, p), padding: `${sz(8, p)}px ${sz(6, p)}px`, textAlign: "center",
            }}>
              <div style={{
                fontSize: sz(20, p), fontWeight: 900, fontFamily: FONTS.mono,
                background: "linear-gradient(135deg, #60a5fa, #818cf8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {m.stat}
              </div>
              <div style={{ fontSize: sz(7, p), color: COLORS.textDim, marginTop: sz(1, p), fontFamily: FONTS.display, fontWeight: 600 }}>
                {m.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing */}
      <div style={{ opacity: pricingOpacity, marginTop: sz(10, p), textAlign: "center", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: p ? "column" : "row", gap: sz(5, p) }}>
          {[
            { label: "Water Student", price: "$19", period: "/mo", accent: "#60a5fa", featured: true },
            { label: "Independent", price: "$15", period: "/mo", accent: "#6ee7b7", featured: false },
            { label: "Institution", price: "$12", period: "/stud/mo", accent: "#a5b4fc", featured: false },
          ].map((tier, i) => {
            const tOpacity = fadeIn(frame, 75 + i * 14);
            const tY = slideUp(frame, 75 + i * 14);
            return (
              <div key={i} style={{
                opacity: tOpacity, transform: `translateY(${(1 - tY) * sz(6)}px)`,
                flex: 1,
                background: tier.featured
                  ? "linear-gradient(135deg, rgba(30,58,95,0.5), rgba(10,22,47,0.5))"
                  : "linear-gradient(135deg, rgba(30,58,95,0.2), rgba(10,22,47,0.2))",
                border: tier.featured ? `2px solid ${tier.accent}55` : `1px solid ${tier.accent}33`,
                borderRadius: sz(7, p), padding: `${sz(8, p)}px ${sz(10, p)}px`,
              }}>
                <div style={{ fontSize: sz(7, p), fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: tier.accent, fontFamily: FONTS.display }}>
                  {tier.label}
                </div>
                <div style={{ fontSize: sz(20, p), fontWeight: 900, color: "#fff", fontFamily: FONTS.mono }}>
                  {tier.price}
                  <span style={{ fontSize: sz(7, p), color: COLORS.textMuted, fontWeight: 400 }}>{tier.period}</span>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: sz(7, p), color: COLORS.textMuted, marginTop: sz(6, p), fontFamily: FONTS.display }}>
          Powered by the Stellarium Foundation — a registered non-profit for global knowledge access.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════
// SCENE 7 — CALL TO ACTION
// ═══════════════════════════════════════
export const SceneCTA: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const p = portrait;

  const mainOpacity = fadeIn(frame, 0);
  const scale = spring({ frame: frame, fps: 30, config: { damping: 8, mass: 0.6 } });
  const buttonGlow = pulse(frame, 10, 0.05);

  return (
    <AbsoluteFill style={{
      justifyContent: "center", alignItems: "center",
      padding: p ? "0 16px" : "0 24px",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", width: sz(280, p), height: sz(280, p),
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent 60%)",
        transform: `scale(${buttonGlow})`,
      }} />

      <div style={{ opacity: mainOpacity, transform: `scale(${scale})`, textAlign: "center", zIndex: 1 }}>
        {/* Logo */}
        <div style={{
          width: sz(48, p), height: sz(48, p), borderRadius: sz(10, p),
          background: "linear-gradient(135deg, #1e3a5f, #0a162f)",
          border: "2px solid rgba(59, 130, 246, 0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: `0 auto ${sz(10, p)}px`, fontSize: sz(20, p), fontWeight: 900,
          color: COLORS.blueLight, boxShadow: "0 0 40px rgba(59,130,246,0.2)",
        }}>
          W
        </div>

        <h2 style={{
          fontSize: sz(42, p), fontWeight: 900, color: "#fff",
          margin: `${sz(5, p)}px 0 ${sz(6, p)}px 0`, lineHeight: 1.1, fontFamily: FONTS.display,
        }}>
          Your Future<br />Starts Today
        </h2>

        <p style={{
          fontSize: sz(12, p), color: COLORS.textDim,
          margin: "0 auto sz(10, p)", lineHeight: 1.5, width: "100%", maxWidth: "70%",
          fontFamily: FONTS.display,
        }}>
          Join thousands of students worldwide who are already learning with Water Classroom.
          Your first step is free.
        </p>

        {/* Animated CTA button */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: sz(4, p),
          padding: `${sz(8, p)}px ${sz(18, p)}px`, borderRadius: sz(7, p),
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          color: "#fff", fontWeight: 700, fontSize: sz(11, p),
          letterSpacing: "0.06em", textTransform: "uppercase" as const,
          fontFamily: FONTS.display, boxShadow: `0 0 ${sz(12, p)}px rgba(96,165,250,0.3)`,
        }}>
          Enter the Classroom →
        </div>

        <p style={{
          fontSize: sz(9, p), color: COLORS.textMuted, marginTop: sz(8, p),
          fontFamily: FONTS.mono, fontWeight: 500,
        }}>
          waterclassroom.onrender.com
        </p>
      </div>
    </AbsoluteFill>
  );
};
