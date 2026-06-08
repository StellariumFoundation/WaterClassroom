import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TOTAL_DURATION, DURATION, FPS } from "./theme";
import {
  Bg,
  Particles,
  SceneHero,
  SceneProblem,
  SceneFeatures,
  SceneLabs,
  ScenePricing,
  SceneCTA,
  SceneOutro,
} from "./Scenes";

interface WaterClassroomAdProps {
  portrait?: boolean;
}

export const WaterClassroomAd: React.FC<WaterClassroomAdProps> = ({ portrait = false }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ width, height, overflow: "hidden" }}>
      <Bg />
      <Particles />

      <Sequence from={0} durationInFrames={DURATION.SCENE_HERO}>
        <SceneHero portrait={portrait} />
      </Sequence>

      <Sequence from={DURATION.SCENE_HERO} durationInFrames={DURATION.SCENE_PROBLEM}>
        <SceneProblem portrait={portrait} />
      </Sequence>

      <Sequence
        from={DURATION.SCENE_HERO + DURATION.SCENE_PROBLEM}
        durationInFrames={DURATION.SCENE_FEATURES}
      >
        <SceneFeatures portrait={portrait} />
      </Sequence>

      <Sequence
        from={DURATION.SCENE_HERO + DURATION.SCENE_PROBLEM + DURATION.SCENE_FEATURES}
        durationInFrames={DURATION.SCENE_LABS}
      >
        <SceneLabs portrait={portrait} />
      </Sequence>

      <Sequence
        from={
          DURATION.SCENE_HERO +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_FEATURES +
          DURATION.SCENE_LABS
        }
        durationInFrames={DURATION.SCENE_PRICING}
      >
        <ScenePricing portrait={portrait} />
      </Sequence>

      <Sequence
        from={
          DURATION.SCENE_HERO +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_FEATURES +
          DURATION.SCENE_LABS +
          DURATION.SCENE_PRICING
        }
        durationInFrames={DURATION.SCENE_CTA}
      >
        <SceneCTA portrait={portrait} />
      </Sequence>

      <Sequence
        from={
          DURATION.SCENE_HERO +
          DURATION.SCENE_PROBLEM +
          DURATION.SCENE_FEATURES +
          DURATION.SCENE_LABS +
          DURATION.SCENE_PRICING +
          DURATION.SCENE_CTA
        }
        durationInFrames={DURATION.SCENE_OUTRO}
      >
        <SceneOutro portrait={portrait} />
      </Sequence>
    </AbsoluteFill>
  );
};
