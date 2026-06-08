import { AbsoluteFill, useCurrentFrame, interpolate, spring, Sequence } from "remotion";
import { COLORS, FONTS, DURATION } from "./theme";
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

// ─── Background ───

export const Bg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse at 50% 0%, #0f2b5e 0%, #0a1628 70%)",
    }}
  />
);

// ─── Particle Overlay ───

const particles = Array.from({ length: 30 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  speed: Math.random() * 0.5 + 0.2,
  delay: Math.random() * 100,
}));

export const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const yPos = ((frame * p.speed + p.delay * 10) % 120) - 10;
        const opacity = interpolate(
          yPos,
          [-10, 20, 80, 110],
          [0, 0.4, 0.4, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: COLORS.blueLight,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 1: Hero ───

export const SceneHero: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const titleScale = slideUp(frame, 5);
  const subOpacity = fadeIn(frame, 20);
  const badgeOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: portrait ? "0 30px" : "0 80px" }}>
      <div style={{ opacity: badgeOpacity, marginBottom: portrait ? 20 : 30, textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: 9999,
            background: "rgba(29, 78, 216, 0.3)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            color: COLORS.blueLight,
            fontSize: portrait ? 11 : 14,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            fontFamily: FONTS.mono,
          }}
        >
          ✦ Stellarium Foundation
        </span>
      </div>

      <div
        style={{
          transform: `scale(${titleScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: portrait ? 70 : 90,
            height: portrait ? 70 : 90,
            borderRadius: 20,
            background: "linear-gradient(135deg, #1e3a5f, #0a162f)",
            border: "2px solid rgba(59, 130, 246, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: portrait ? 32 : 40,
            fontWeight: 900,
            color: COLORS.blueLight,
          }}
        >
          W
        </div>

        <h1
          style={{
            fontSize: portrait ? 52 : 72,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textTransform: "uppercase" as const,
            color: "#fff",
            margin: 0,
          }}
        >
          Water{" "}
          <GradientText>Classroom</GradientText>
        </h1>
      </div>

      <p
        style={{
          opacity: subOpacity,
          fontSize: portrait ? 16 : 22,
          color: COLORS.textDim,
          fontWeight: 300,
          maxWidth: portrait ? 500 : 700,
          textAlign: "center",
          lineHeight: 1.6,
          marginTop: portrait ? 16 : 24,
        }}
      >
        A Complete AI-Powered School — Interactive Content, Games, AI Tutoring &amp; Verified Exams for K–12 and Beyond
      </p>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Problem ───

const problems = [
  { icon: "💰", title: "Cost", desc: "Private schooling is prohibitively expensive" },
  { icon: "🌍", title: "Geography", desc: "Quality education concentrated in urban areas" },
  { icon: "📐", title: "One-Size-Fits-All", desc: "Curricula fail to adapt to individual learners" },
];

export const SceneProblem: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const titleOpacity = fadeIn(frame, 0);
  const titleY = slideUp(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: portrait ? "0 24px" : "0 60px" }}>
      <div style={{ opacity: titleOpacity, transform: `translateY(${(1 - titleY) * 30}px)`, textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 9999,
            background: "rgba(245, 158, 11, 0.2)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            color: COLORS.amber,
            fontSize: portrait ? 10 : 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            fontFamily: FONTS.mono,
            marginBottom: portrait ? 16 : 24,
          }}
        >
          💡 The Problem
        </div>

        <h2
          style={{
            fontSize: portrait ? 32 : 44,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 24px 0",
            lineHeight: 1.15,
          }}
        >
          Education Is Broken
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: portrait ? 12 : 20, width: "100%", maxWidth: portrait ? 500 : 800 }}>
        {problems.map((p, i) => {
          const cardOpacity = fadeIn(frame, 15 + i * 15);
          const cardY = slideUp(frame, 15 + i * 15);
          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${(1 - cardY) * 30}px)`,
                flex: 1,
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: 16,
                padding: portrait ? "16px 20px" : "20px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: portrait ? 28 : 36, marginBottom: 8 }}>{p.icon}</div>
              <h3 style={{ fontSize: portrait ? 14 : 18, fontWeight: 700, color: "#fff", margin: "0 0 4px 0" }}>{p.title}</h3>
              <p style={{ fontSize: portrait ? 11 : 14, color: COLORS.textDim, margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Features ───

const features = [
  { icon: "🧠", title: "AI-Tailored Curriculum", desc: "75+ programs across 28 countries" },
  { icon: "🤖", title: "24/7 AI Tutoring", desc: "Google Gemini Socratic companion" },
  { icon: "✅", title: "Verified Exams", desc: "Camera-based VLM proctoring" },
  { icon: "🎮", title: "Gamified Learning", desc: "Badges, streaks, XP levels" },
];

export const SceneFeatures: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const titleOpacity = fadeIn(frame, 0);

  const gridCols = portrait
    ? { display: "flex", flexDirection: "column" as const, gap: 10 }
    : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: portrait ? "0 24px" : "0 60px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: portrait ? 16 : 24 }}>
        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 9999,
            background: "rgba(29, 78, 216, 0.3)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            color: COLORS.blueLight,
            fontSize: portrait ? 10 : 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            fontFamily: FONTS.mono,
            marginBottom: portrait ? 12 : 16,
          }}
        >
          🚀 Key Features
        </div>
        <h2 style={{ fontSize: portrait ? 28 : 38, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.15 }}>
          Everything a Student Needs
        </h2>
      </div>

      <div style={{ width: "100%", maxWidth: portrait ? 450 : 700, ...gridCols }}>
        {features.map((f, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 12);
          const cardY = slideUp(frame, 10 + i * 12);
          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${(1 - cardY) * 20}px)`,
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: 14,
                padding: portrait ? "12px 16px" : "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: portrait ? 12 : 16,
              }}
            >
              <div
                style={{
                  width: portrait ? 36 : 44,
                  height: portrait ? 36 : 44,
                  borderRadius: 10,
                  background: "rgba(30, 58, 95, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: portrait ? 18 : 22,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: portrait ? 13 : 16, fontWeight: 700, color: "#fff", margin: 0 }}>{f.title}</h3>
                <p style={{ fontSize: portrait ? 11 : 13, color: COLORS.textDim, margin: "2px 0 0 0" }}>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Innovation Labs ───

const labs = [
  { icon: "⚙️", title: "Robotics Simulator", desc: "Calibrate & balance humanoid robots" },
  { icon: "📊", title: "Incentive Economics", desc: "Model real-world business incentives" },
  { icon: "🏆", title: "Trinity Game", desc: "Balance Do Good, Make Money, Have Fun" },
];

export const SceneLabs: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: portrait ? "0 24px" : "0 60px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: portrait ? 16 : 24 }}>
        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 9999,
            background: "rgba(16, 185, 129, 0.2)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: COLORS.emeraldLight,
            fontSize: portrait ? 10 : 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            fontFamily: FONTS.mono,
            marginBottom: portrait ? 12 : 16,
          }}
        >
          🎯 Innovation Labs
        </div>
        <h2 style={{ fontSize: portrait ? 28 : 38, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.15 }}>
          Learn by Doing
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: portrait ? 10 : 16, width: "100%", maxWidth: portrait ? 450 : 700 }}>
        {labs.map((l, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 15);
          const cardY = slideUp(frame, 10 + i * 15);
          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${(1 - cardY) * 25}px)`,
                flex: 1,
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: 16,
                padding: portrait ? "14px 18px" : "20px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: portrait ? 32 : 40, marginBottom: 8 }}>{l.icon}</div>
              <h3 style={{ fontSize: portrait ? 13 : 16, fontWeight: 700, color: "#fff", margin: "0 0 4px 0" }}>{l.title}</h3>
              <p style={{ fontSize: portrait ? 11 : 13, color: COLORS.textDim, margin: 0 }}>{l.desc}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Pricing ───

export const ScenePricing: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const titleOpacity = fadeIn(frame, 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: portrait ? "0 24px" : "0 60px" }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: portrait ? 16 : 24 }}>
        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 9999,
            background: "rgba(99, 102, 241, 0.2)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: COLORS.purpleLight,
            fontSize: portrait ? 10 : 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            fontFamily: FONTS.mono,
            marginBottom: portrait ? 12 : 16,
          }}
        >
          💰 Simple Pricing
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", gap: portrait ? 12 : 20, width: "100%", maxWidth: portrait ? 400 : 650 }}>
        {[
          { tier: "Water Student", price: "$19/mo", color: COLORS.blueLight, accent: "rgba(59,130,246,0.4)", featured: true },
          { tier: "Institution", price: "$12/stud/mo", color: COLORS.purpleLight, accent: "rgba(99,102,241,0.3)", featured: false },
        ].map((p, i) => {
          const cardOpacity = fadeIn(frame, 10 + i * 15);
          const cardY = slideUp(frame, 10 + i * 15);
          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${(1 - cardY) * 25}px)`,
                flex: 1,
                background: p.featured
                  ? "linear-gradient(135deg, rgba(30,58,95,0.3), rgba(10,22,47,0.3))"
                  : "linear-gradient(135deg, rgba(30,58,95,0.15), rgba(10,22,47,0.15))",
                border: p.featured ? `2px solid ${p.accent}` : `1px solid ${p.accent}`,
                borderRadius: 18,
                padding: portrait ? "20px 16px" : "24px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: portrait ? 10 : 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: p.color, marginBottom: 8 }}>
                {p.tier}
              </div>
              <div style={{ fontSize: portrait ? 36 : 44, fontWeight: 900, color: "#fff", fontFamily: FONTS.mono, marginBottom: 8 }}>
                {p.price}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA ───

export const SceneCTA: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 5);
  const scale = spring({ frame: frame - 5, fps: 30, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: portrait ? "0 30px" : "0 80px" }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: "center" }}>
        <h2 style={{ fontSize: portrait ? 38 : 52, fontWeight: 900, color: "#fff", margin: "0 0 16px 0", lineHeight: 1.1 }}>
          Ready to Transform<br />Education?
        </h2>
        <p style={{ fontSize: portrait ? 16 : 20, color: COLORS.textDim, maxWidth: portrait ? 400 : 550, margin: "0 auto 24px", lineHeight: 1.6 }}>
          Join the global movement to democratize learning. 
          Water Classroom is open for students, educators, and institutions worldwide.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: Outro / Logo ───

export const SceneOutro: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 5);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: portrait ? "0 30px" : "0 80px" }}>
      <div style={{ opacity, textAlign: "center" }}>
        <div
          style={{
            width: portrait ? 60 : 80,
            height: portrait ? 60 : 80,
            borderRadius: 18,
            background: "linear-gradient(135deg, #1e3a5f, #0a162f)",
            border: "2px solid rgba(59, 130, 246, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: portrait ? 28 : 36,
            fontWeight: 900,
            color: COLORS.blueLight,
          }}
        >
          W
        </div>
        <h3 style={{ fontSize: portrait ? 16 : 20, fontWeight: 700, color: "#fff", margin: 0 }}>
          Water <GradientText>Classroom</GradientText>
        </h3>
        <p style={{ fontSize: portrait ? 11 : 13, color: COLORS.textMuted, marginTop: 8, fontFamily: FONTS.mono }}>
          waterclassroom.onrender.com
        </p>
      </div>
    </AbsoluteFill>
  );
};
