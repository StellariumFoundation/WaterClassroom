# Water Classroom – User Experience Vision  
_File: docs/USER_EXPERIENCE_VISION.md_  
_Version 1.0 · June 2025_

---

## 0 · Purpose  
Define how Water Classroom will deliver the **most engaging, inclusive, and future-proof learning UX** across 2-D, 3-D, Web3 and XR surfaces.

---

## 1 · Evolution Journey: 2-D ➜ 3-D ➜ Immersive Metaverse  

| Phase | Learner Touch-points | Experience Hallmarks |
|-------|---------------------|----------------------|
| **Stage A – Web 2-D** (today) | React SPA lessons, markdown, quizzes, chat tutor | Clean UI, fast load, keyboard-only nav |
| **Stage B – Hybrid 2-D / 3-D** (Q3-25) | Inline WebGL mini-labs, avatar chat pop-outs | Portal metaphors bridging flat & spatial views |
| **Stage C – Full Metaverse** (Q4-25 → 2026) | VR/AR campus, physics labs, co-quests | Embodied presence, haptics, voice & gesture |
| **Stage D – Ambient & Neural** (2028+) | Eye-tracking, BCI, holographic tables | Hands-free intent capture, bio-adaptive pacing |

Design principle: **continuity with choice**—users may remain in 2-D yet benefit from 3-D assets rendered as video-overlays.

---

## 2 · Persona-Driven Design  

| Persona | Goals & Needs | UX Tactics |
|---------|---------------|-----------|
| **Sofia (14, Student, Mobile-first)** | Engaging STEM, social study, low data | Micro-lessons ≤5 MB, offline cache, emoji-driven UI |
| **Carlos (11, Homeschool)** | Full curriculum, parent feedback | Guided daily path, streak tracker, parent dashboard |
| **Ms Chen (Teacher, VR-curious)** | Enhance lessons, track class mastery | Web console, one-click quest assignment, analytics heatmaps |
| **Mr Ali (Parent, Time-poor)** | Progress transparency & safety | Weekly snapshot, AI alerts, parental controls |
| **Prof Amani (Creator)** | Monetise VR quests | In-app Quest Builder, royalty insights, versioning |

Interface copy, colour contrast and voice tones are adapted via **persona theme packs** identified at sign-up.

---

## 3 · Cross-Platform Consistency  

Design token system (**WC-Core**) synchronises:  
* Typography scale (rem-based)  
* Colour + elevation (dark/light, VR HDR)  
* Motion curves (100/250/400 ms)  
* Spatial unit grid (0.1 m = 8 px equivalent)

Platform specifics:

| Surface | Navigation Pattern | Input |
|---------|-------------------|-------|
| Web | Top nav bar + breadcrumb | Mouse / keyboard |
| Mobile | Bottom nav + gesture sheet | Touch, voice |
| VR | Spatial menu ring + laser pointer | Controllers, hand tracking |
| AR | Docked card + world anchors | Touch, gaze |

Automated **visual regression tests** run per surface in CI.

---

## 4 · AI-Powered Personalisation & Adaptive UI  

* **PACE Loop** (Present → Assess → Coach → Elevate) drives flow.  
* Dynamic difficulty slider surfaces UI hints, colour saturation & reward cadence.  
* Dashboard widgets reorder based on mastery; high-priority gaps animate pulse ring.  
* Tutor avatar selects empathy gestures fitting learner emotional telemetry (See AI_TUTORING_EVOLUTION.md).

Privacy mode: personalization data processed client-side unless consent given.

---

## 5 · Gamification & Engagement Principles  

1. **Clear Goals** – quest cards show XP, badge & NFT reward upfront.  
2. **Immediate Feedback** – confetti micro-burst or haptic pulse <300 ms after success.  
3. **Progress Visibility** – radial ocean-level fills; waterline metaphor across devices.  
4. **Voluntary Participation** – opt-in competitive leaderboards.  
5. **Fair Economy** – WC tokens/min are capped to avoid grind fatigue.  

Game design pattern library stored in Figma → Storybook → Unity prefabs.

---

## 6 · Social & Collaborative UX  

* **Proximity Voice & Spatial Emojis** – fosters presence yet prevents noise.  
* **Knowledge Raids** – 4-6 learners tackle multi-step puzzles; shared inventory panel.  
* **Safe-Zone Bubbles** – auto-mute non-friends, AI toxicity filter.  
* **Mentor Rooms** – teachers spectate as ghosts, drop hologram hints.  
* **Shared Artefacts** – 3-D annotations persist; property rights via NFT.

Flow example: _Sofia joins Geometry Island raid ➜ voice lobby ➜ solves angle puzzle ➜ group unlocks portal ➜ receives co-badge minted._

---

## 7 · Accessibility & Inclusive Design  

| Principle | Implementation |
|-----------|----------------|
| **WCAG 2.2 AA** | High-contrast theme, keyboard & screen-reader labels |
| Cognitive load | Option for “focus mode” hides side XP noise |
| Motion sensitivity | Reduce-motion toggle lowers parallax & VR locomotion speed |
| Subtitles & STT | All spoken avatar content captioned & transcript downloadable |
| Colour-blind safe palette | Auto-swap textures & UI states |
| Low bandwidth | Lesson assets progressive-load; 2-D fallback video if WebGL fails |

Assistive tech partners: Beeline Reader, Tobii eye-control.

---

## 8 · Onboarding & Progressive Complexity  

1. **3-minute Interactive Tour** – basic nav + tutor chat sample.  
2. **Micro-Task Ladder** – first badge earned within 5 min.  
3. **Decision Points** – after mastery level 3, prompt to unlock VR lab.  
4. **Adaptive Hint Budget** – gradually reduce scaffolding as competence rises.  
5. **Parental/Teacher Setup** – separate flow, minimal steps, privacy toggles upfront.

Metrics: target day-7 activation >65 %.

---

## 9 · Future Interaction Paradigms  

| Year | Interaction | UX Exploration |
|------|-------------|----------------|
| 2025 | Voice commands (“Hey Tutor…”) | Whisper + intent graph |
| 2026 | Hand & body gestures | OpenXR hand tracking; gesture glyph HUD |
| 2027 | Eye-gaze targeting | Foveated UI pop-ups, dwell select |
| 2028 | Neural input (EEG) | Attention-based pause/rewind |
| 2030 | Holographic tabletop | Spatial anchors & shared AR chessboard lessons |

Design lab runs quarterly prototyping sprints with children & neurodiverse testers.

---

## 10 · Design System & Component Architecture Roadmap  

| Layer | Tooling | Milestone |
|-------|---------|-----------|
| **Tokens** | Figma → Style Dictionary | Unified light/dark/VR export (Q3-25) |
| **2-D Components** | Storybook / React | Version 3 with XR-ready props (Q4-25) |
| **3-D Prefabs** | Unity Package Manager | Physics-friendly UI widgets (Q1-26) |
| **XR Layout Engine** | Yoga-XR fork | Anchored UI panels & grid (Q2-26) |
| **Pattern Library** | Zeroheight public portal | Governance DAO proposals (2027) |

Every component tagged with **a11y, perf-budget, persona fit** metadata enabling automated lint in CI.

---

## 11 · Representative Interaction Flow (End-2026 Vision)  

1. **Launch** Water Classroom on Quest headset → home cove loads.  
2. **AI Avatar Ada** greets Sofia by name, summarises last session goal.  
3. Sofia **opens skill tree**, selects “Optics Lab”.  
4. Scene transitions into **VR physics lab** (3 s).  
5. Ada demonstrates refraction; Sofia steers laser — haptic confirm.  
6. System detects mastery, **mints NFT badge**; XP bar animates water splash.  
7. Friends ping; Sofia **accepts raid invite** via radial menu.  
8. In Geometry Arena, group voice chat & hologram puzzle; teacher Ms Chen spectates.  
9. Session ends → **parent dashboard** auto-emails highlight reel & progress delta.

End-to-end latency target <400 ms through steps 4-6 under 4G conditions.

---

## 12 · KPIs & Continuous UX Validation  

| Metric | Target 2026 | Source |
|--------|-------------|--------|
| Session length | 18 min avg | Mixpanel |
| Retention day-30 | >55 % | Cohort analysis |
| Avatar CSAT | ≥ 4.6/5 | In-app NPS |
| Accessibility bugs | <0.5 per 1 k sessions | Sentry |
| Edge-case crash rate | <0.2 % | Crashlytics |
| Motion sickness reports | <2 % VR users | Survey |

Quarterly **UX research sprints** re-test KPIs and feed backlog.

---

### Conclusion  
Water Classroom’s UX strategy blends **pedagogical rigour, playful gamification and cutting-edge interaction paradigms** to ensure every learner—whether on a 2-D laptop or fully immersive VR setup—experiences education that is *engaging, equitable and unforgettable*.  
