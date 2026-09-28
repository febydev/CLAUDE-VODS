import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import data from './scenes.json';
export const Root: React.FC = () => <Composition id="Main" component={Main} width={data.width} height={data.height} fps={data.fps} durationInFrames={data.totalFrames}/>;
