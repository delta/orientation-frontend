import { FC, ReactNode } from 'react';
import { GameObjects, Scene, Types } from 'phaser';

const GameObjectElement = 'gameObject';

// A Interface common to all game objects
export interface BasicGameObjectComponentProps {
    children?: ReactNode;
}

type AllowedGameObjectTypes = 'Text' | 'Image' | 'TileMap';

interface GameObjectProps<T> {
    instance: T;
    type: AllowedGameObjectTypes;
}

interface GameObjectComponentType
    extends GameObjectProps<GameObjects.GameObject> {
    scene: Scene;
    // Not sure when an element will have children
    children?: ReactNode;
}

export const GameObjectComponent =
    GameObjectElement as unknown as FC<GameObjectComponentType>;
