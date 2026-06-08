import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TOTAL_DURATION, DURATION, FPS } from "./theme";
import {
  Bg,
  Particles,
  SceneHook,
  SceneProblem,
  SceneSolution,
  SceneHowItWorks,
  SceneExperience,
  SceneTrust,
  SceneCTA,
} from "./Scenes";
import { FontLoader } from "./FontLoader";
import { Voiceover } from "./Voiceover";

interface WaterClassroomAdProps {
  portrait?: boolean;
}

export const WaterClassroomAd: React.FC<WaterClassroomAdProps> = ({ portrait = false }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ width, height, overflow: "hidden" }}>
      <FontLoader>
        <Bg />
        <Particles />
        <Voiceover />

        <Sequence from={0} durationInFrames={DURATION.SCENE_HOOK}>
          <SceneHook portrait={portrait} />
        </Sequence>

        <Sequence from={DURATION.SCENE_HOOK} durationInFrames={DURATION.SCENE_PROBLEM}>
          <SceneProblem portrait={portrait} />
        </Sequence>

        <Sequence
          from={DURATION.SCENE_HOOK + DURATION.SCENE_PROBLEM}
          durationInFrames={DURATION.SCENE_SOLUTION}
        >
          <SceneSolution portrait={portrait} />
        </Sequence>

        <Sequence
          from={DURATION.SCENE_HOOK + DURATION.SCENE_PROBLEM + DURATION.SCENE_SOLUTION}
          durationInFrames={DURATION.SCENE_HOW_IT_WORKS}
        >
          <SceneHowItWorks portrait={portrait} />
        </Sequence>

        <Sequence
          from={
            DURATION.SCENE_HOOK +
            DURATION.SCENE_PROBLEM +
            DURATION.SCENE_SOLUTION +
            DURATION.SCENE_HOW_IT_WORKS
          }
          durationInFrames={DURATION.SCENE_EXPERIENCE}
        >
          <SceneExperience portrait={portrait} />
        </Sequence>

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
          <SceneTrust portrait={portrait} />
        </Sequence>

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
          <SceneCTA portrait={portrait} />
        </Sequence>
      </FontLoader>
    </AbsoluteFill>
  );
};
