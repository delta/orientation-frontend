import { Scene } from 'phaser';
export interface PhaserScene extends Scene {
    preload?: () => void;
    init?: () => void;
    create?: () => void;
}
