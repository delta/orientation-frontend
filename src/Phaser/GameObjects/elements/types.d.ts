// A collection of all the GameObject types
import { Types, GameObjects, Scene } from 'phaser';
import { ReactNode } from 'react';

declare namespace GameElements {
    declare type AllowedGameObjectTypes = 'TEXT' | 'Image' | 'TileMap';

    declare type GameObject = Text;
    declare interface Text {
        name: 'TEXT';
        x: number;
        y: number;
        text: string;
        style: Types.GameObjects.Text.TextStyle;
    }

    // Reconciler Fiber root instance of a game object
    // Aka this is element returned from createInstance hostConfig method of reconciler
    declare interface FiberGameObject {
        instanceType: 'PHASER';
        type: AllowedGameObjectTypes;
        instance: GameObjects.GameObject;
        data: Text;
        scene: Scene;
    }
}
