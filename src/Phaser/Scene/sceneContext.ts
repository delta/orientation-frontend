import { createContext } from 'react';
import { PhaserScene } from './SceneWrapper';

const SceneContext = createContext<PhaserScene | null>(null);

export { SceneContext };
