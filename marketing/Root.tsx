import { Composition } from "remotion";
import { WaterClassroomAd } from "./WaterClassroomAd";
import { FPS, TOTAL_DURATION } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape - for YouTube / TV / Website */}
      <Composition
        id="WaterClassroomAd-Landscape"
        component={WaterClassroomAd}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ portrait: false }}
      />

      {/* 9:16 Portrait - for TikTok / Reels / Shorts */}
      <Composition
        id="WaterClassroomAd-Portrait"
        component={WaterClassroomAd}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ portrait: true }}
      />
    </>
  );
};
