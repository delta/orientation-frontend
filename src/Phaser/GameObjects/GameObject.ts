import { FC, ReactNode } from 'react';
import { GameObjects, Scene } from 'phaser';

const GameObjectElement = 'gameObject';

type AllowedGameObjectTypes = 'Text' | 'Image' | 'TileMap';

interface GameObjectProps<T> {
    instance: T;
}

interface GameObjectComponentType
    extends GameObjectProps<GameObjects.GameObject> {
    type: AllowedGameObjectTypes;
    scene: Scene;
    // Not sure when an element will have children
    children?: ReactNode;
}

const GameObjectComponent =
    GameObjectElement as unknown as FC<GameObjectComponentType>;

export { GameObjectComponent };
