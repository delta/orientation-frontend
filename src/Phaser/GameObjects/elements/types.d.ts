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

    declare interface Image
        extends GameObjectUtilityType.Origin,
            GameObjectUtilityType.Scale,
            GameObjectUtilityType.Depth {
        name: 'IMAGE';
        x: number;
        y: number;
        key: string;
        onClick?: (image: GameObjects.Image) => void;
    }

    declare interface Sprite
        extends GameObjectUtilityType.Origin,
            GameObjectUtilityType.Scale,
            GameObjectUtilityType.Depth {
        name: 'SPRITE';
        x: number;
        y: number;
        key: string;
        animations: GameObjectUtilityType.Anims[];
    }

    declare namespace GameObjectUtilityType {
        declare interface Anims {
            key: string;
            frameRate: number;
            repeat: number;
            frames: number[];
            repeatDelay?: number;
        }

        declare interface Origin {
            origin?: number;
            // TODO: the commented items are not implemented
            // originX: number;
            // originY: number;
        }
        declare interface Scale {
            scale?: number;
            // TODO: the commented items are not implemented
            // scaleX: number;
            // scaleY: number;
        }

        declare interface Depth {
            depth?: number;
        }
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
