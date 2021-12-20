import { FC, ReactNode } from 'react';
import { GameObjects, Scene } from 'phaser';

import { GameElements } from './elements/types';

const GameObjectElement = 'gameObject';

// A Interface common to all game objects
export interface BasicGameObjectComponentProps {
    children?: ReactNode;
}

interface GameObjectProps<T> {
    instance: T;
    type: GameElements.AllowedGameObjectTypes;
    data: GameElements.GameObject;
}

export interface GameObjectComponentType
    extends GameObjectProps<GameObjects.GameObject> {
    scene: Scene;
    // Not sure when an element will have children
    children?: ReactNode;
}

export const GameObjectComponent =
    GameObjectElement as unknown as FC<GameObjectComponentType>;
