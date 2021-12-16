// A collection of all the GameObject types
import { Types, GameObjects, Scene } from 'phaser';
import { ReactNode } from 'react';

declare namespace GameElements {
    declare type AllowedGameObjectTypes = 'TEXT' | 'IMAGE' | 'TileMap';

    declare type GameObject = Text | Image;
    declare interface Text {
        name: 'TEXT';
        x: number;
        y: number;
        text: string;
        style: Types.GameObjects.Text.TextStyle;
    }

    declare interface Image {
        name: 'IMAGE';
        x: number;
        y: number;
        key: string;
        depth?: number;
        origin?: number;
        scale?: number;
        isInteractive?: boolean;
        onClick?: (image: GameObject.Image) => void;
    }

    // Reconciler Fiber root instance of a game object
    // Aka this is element returned from createInstance hostConfig method of reconciler
    declare interface FiberGameObject {
        instanceType: 'PHASER';
        type: AllowedGameObjectTypes;
        instance: GameObjects.GameObject;
        data: Text | Image;
        scene: Scene;
    }
}
