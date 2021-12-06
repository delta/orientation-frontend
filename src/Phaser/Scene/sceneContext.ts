import { createContext } from 'react';
import { Scene } from 'phaser';

const SceneContext = createContext<Scene | null>(null);

export { SceneContext };
