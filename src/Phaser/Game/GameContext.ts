import { createContext } from 'react';
import { Game } from 'phaser';

const GameContext = createContext<Game | null>(null);

export { GameContext };
