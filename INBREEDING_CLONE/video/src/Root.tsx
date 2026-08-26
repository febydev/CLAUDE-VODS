import { Composition } from "remotion";
import { Main } from "./Main";
import data from "./scenes.json";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={data.totalFrames}
      fps={data.fps}
      width={data.width}
      height={data.height}
    />
  );
};
