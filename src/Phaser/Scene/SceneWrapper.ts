import { Scene, Types } from 'phaser';

// A extension of Phaser scene which includes the preload, init and
// create method which isn't part of default Phaser Scene
//
export class PhaserScene extends Scene {
    /**
     * Preload method of Phaser Scene
     */
    preload?: (() => void) | null;
    /**
     * Init method of a Phaser Scene, read phaser docs for more info
     * @param {any} data any data you wish to pass to the init function
     */
    init?: ((data?: any) => void) | null;
    /**
     * Create method of a Phaser Scene, read phaser docs for more info
     * @param {any} data any data you wish to pass to the create function
     */
    create?: ((data?: any) => void) | null;
    constructor(config: string | Types.Scenes.SettingsConfig) {
        // right now we are not adding the newPhaserScene methods
        // user is responsible for adding the methods on their own
        //
        // TODO: get the methods in constructor call itself
        //
        super(config);
    }
}
