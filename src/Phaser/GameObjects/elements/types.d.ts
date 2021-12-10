// A collection of all the GameObject types
import { Types } from 'phaser';

declare namespace GameElements {
    declare type GameObject = Text;
    declare interface Text {
        name: 'TEXT';
        x: number;
        y: number;
        text: string;
        style: Types.GameObjects.Text.TextStyle;
    }
}
