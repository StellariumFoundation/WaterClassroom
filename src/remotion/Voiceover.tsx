import { Audio, Sequence, staticFile } from "remotion";
import { DURATION } from "./theme";

/**
 * Plays voiceover narration synced to each scene.
 * Audio files are in public/ads/voiceover/ and loaded via staticFile().
 */
export const Voiceover: React.FC = () => {
  return (
    <>
      {/* Scene 1: Hook (0–210) */}
      <Sequence from={0} durationInFrames={DURATION.SCENE_HOOK}>
        <Audio src={staticFile("ads/voiceover/01-hook.wav")} />
      </Sequence>

      {/* Scene 2: Problem (210–420) */}
      <Sequence from={DURATION.SCENE_HOOK} durationInFrames={DURATION.SCENE_PROBLEM}>
        <Audio src={staticFile("ads/voiceover/02-problem.wav")} />
      </Sequence>

      {/* Scene 3: Solution (420–780) */}
      <Sequence
        from={DURATION.SCENE_HOOK + DURATION.SCENE_PROBLEM}
        durationInFrames={DURATION.SCENE_SOLUTION}
      >
        <Audio src={staticFile("ads/voiceover/03-solution.wav")} />
      </Sequence>

      {/* Scene 4: How It Works (780–1140) */}
      <Sequence
        from={DURATION.SCENE_HOOK + DURATION.SCENE_PROBLEM + DURATION.SCENE_SOLUTION}
        durationInFrames={DURATION.SCENE_HOW_IT_WORKS}
      >
        <Audio src={staticFile("ads/voiceover/04-how-it-works.wav")} />
      </Sequence>

      {/* Scene 5: Experience (1140–1440) */}
      <Sequence
        from={
          DURATION.SCENE_HOOK +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_SOLUTION +
          DURATION.SCENE_HOW_IT_WORKS
        }
        durationInFrames={DURATION.SCENE_EXPERIENCE}
      >
        <Audio src={staticFile("ads/voiceover/05-experience.wav")} />
      </Sequence>

      {/* Scene 6: Trust & Pricing (1440–1650) */}
      <Sequence
        from={
          DURATION.SCENE_HOOK +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_SOLUTION +
          DURATION.SCENE_HOW_IT_WORKS +
          DURATION.SCENE_EXPERIENCE
        }
        durationInFrames={DURATION.SCENE_TRUST}
      >
        <Audio src={staticFile("ads/voiceover/06-trust.wav")} />
      </Sequence>

      {/* Scene 7: CTA (1650–1800) */}
      <Sequence
        from={
          DURATION.SCENE_HOOK +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_SOLUTION +
          DURATION.SCENE_HOW_IT_WORKS +
          DURATION.SCENE_EXPERIENCE +
          DURATION.SCENE_TRUST
        }
        durationInFrames={DURATION.SCENE_CTA}
      >
        <Audio src={staticFile("ads/voiceover/07-cta.wav")} />
      </Sequence>
    </>
  );
};
