import { createContext } from 'react';
import { PhaserScene } from './SceneWrapper';
import { GameScene } from './GameScene';

const SceneContext = createContext<GameScene | PhaserScene | null>(null);

export { SceneContext };
