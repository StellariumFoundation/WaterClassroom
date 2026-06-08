import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { DURATION } from "./theme";

/**
 * Crossfade duration in frames (0.5s at 30fps).
 * Audio N fades out over this range at the end of its scene,
 * while Audio N+1 fades in during the same overlap window.
 */
const FADE = 15;

// Large finite duration so Remotion never clips audio sequences.
// 36000 frames = 20 minutes at 30fps — more than enough for a 60s ad.
const FOREVER = 36000;

/**
 * Returns a volume function for an audio clip that plays during a scene.
 * - Stays at full volume for the scene duration
 * - Fades out over `FADE` frames *past* the scene boundary (overlapping with next scene's fade-in)
 */
const sceneVolume = (duration: number) => {
  return (f: number) => {
    if (f > duration - FADE) {
      return interpolate(f, [duration - FADE, duration + FADE], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    return 1;
  };
};

/**
 * Returns a volume function for an audio clip that starts during a scene.
 * - Fades in over `FADE` frames at the start (beginning earlier than absolute scene start)
 * - Fades out over `FADE` frames past the scene boundary (for next crossfade)
 */
const sceneVolumeFadeIn = (duration: number) => {
  return (f: number) => {
    // Fade in during first FADE frames
    if (f < FADE) {
      return interpolate(f, [0, FADE], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    // Fade out past end of scene
    if (f > duration - FADE) {
      return interpolate(f, [duration - FADE, duration + FADE], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    return 1;
  };
};

export const Voiceover: React.FC = () => {
  return (
    <>
      {/* ─── Scene 1: Hook (0 – 210) ─── */}
      {/* First audio — starts at frame 0, fades out past scene 1 boundary */}
      <Sequence from={0} durationInFrames={FOREVER}>
        <Audio
          src={staticFile("ads/voiceover/01-hook.wav")}
          volume={sceneVolume(DURATION.SCENE_HOOK)}
        />
      </Sequence>

      {/* ─── Scene 2: Problem (210 – 420) ─── */}
      {/* Starts FADE frames before scene 2 begins for crossfade overlap */}
      <Sequence from={DURATION.SCENE_HOOK - FADE} durationInFrames={FOREVER}>
        <Audio
          src={staticFile("ads/voiceover/02-problem.wav")}
          volume={sceneVolumeFadeIn(DURATION.SCENE_PROBLEM + FADE)}
        />
      </Sequence>

      {/* ─── Scene 3: Solution (420 – 780) ─── */}
      <Sequence
        from={DURATION.SCENE_HOOK + DURATION.SCENE_PROBLEM - FADE}
        durationInFrames={FOREVER}
      >
        <Audio
          src={staticFile("ads/voiceover/03-solution.wav")}
          volume={sceneVolumeFadeIn(DURATION.SCENE_SOLUTION + FADE)}
        />
      </Sequence>

      {/* ─── Scene 4: How It Works (780 – 1140) ─── */}
      <Sequence
        from={
          DURATION.SCENE_HOOK + DURATION.SCENE_PROBLEM + DURATION.SCENE_SOLUTION - FADE
        }
        durationInFrames={FOREVER}
      >
        <Audio
          src={staticFile("ads/voiceover/04-how-it-works.wav")}
          volume={sceneVolumeFadeIn(DURATION.SCENE_HOW_IT_WORKS + FADE)}
        />
      </Sequence>

      {/* ─── Scene 5: Experience (1140 – 1440) ─── */}
      <Sequence
        from={
          DURATION.SCENE_HOOK +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_SOLUTION +
          DURATION.SCENE_HOW_IT_WORKS -
          FADE
        }
        durationInFrames={FOREVER}
      >
        <Audio
          src={staticFile("ads/voiceover/05-experience.wav")}
          volume={sceneVolumeFadeIn(DURATION.SCENE_EXPERIENCE + FADE)}
        />
      </Sequence>

      {/* ─── Scene 6: Trust & Pricing (1440 – 1650) ─── */}
      <Sequence
        from={
          DURATION.SCENE_HOOK +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_SOLUTION +
          DURATION.SCENE_HOW_IT_WORKS +
          DURATION.SCENE_EXPERIENCE -
          FADE
        }
        durationInFrames={FOREVER}
      >
        <Audio
          src={staticFile("ads/voiceover/06-trust.wav")}
          volume={sceneVolumeFadeIn(DURATION.SCENE_TRUST + FADE)}
        />
      </Sequence>

      {/* ─── Scene 7: CTA (1650 – 1800) ─── */}
      {/* Last audio — no fade out; volume stays at 1 to natural end */}
      <Sequence
        from={
          DURATION.SCENE_HOOK +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_SOLUTION +
          DURATION.SCENE_HOW_IT_WORKS +
          DURATION.SCENE_EXPERIENCE +
          DURATION.SCENE_TRUST -
          FADE
        }
        durationInFrames={FOREVER}
      >
        <Audio
          src={staticFile("ads/voiceover/07-cta.wav")}
          volume={(f: number) => {
            // Fade in during first FADE frames
            if (f < FADE) {
              return interpolate(f, [0, FADE], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
            }
            // Stay at full volume to natural end
            return 1;
          }}
        />
      </Sequence>
    </>
  );
};
