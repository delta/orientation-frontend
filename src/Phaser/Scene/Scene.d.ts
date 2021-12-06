import { Scene } from 'phaser';

// A extension of Phaser scene which includes the preload, init and
// create method which isn't part of default Phaser Scene
//
export interface PhaserScene extends Scene {
    /**
     * Preload method of Phaser Scene
     */
    preload?: () => void;
    /**
     * Init method of a Phaser Scene, read phaser docs for more info
     * @param {any} data any data you wish to pass to the init function
     */
    init?: (data: any) => void;
    /**
     * Create method of a Phaser Scene, read phaser docs for more info
     * @param {any} data any data you wish to pass to the create function
     */
    create?: (data: any) => void;
}