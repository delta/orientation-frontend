/**
 * This Anims class is tightly coupled to the Game Scene class and used to
 * seperate the sprite animation definitions into their own file.
 */
import { PhaserScene } from '.';
import { config } from '../../config/config';
export class Anims {
    playerTypes: string[] = [];
    scene?: PhaserScene;
    constructor(scene: PhaserScene) {
        if (!scene) return;
        this.playerTypes = ['player', 'player2'];
        this.scene = scene;
    }

    preload() {
        for (let i = 0; i < this.playerTypes.length; i++) {
            this.scene?.load.atlas(
                `${this.playerTypes[i]}`,
                `${config.assetUrl}/sprites/${this.playerTypes[i]}.png`,
                `${config.assetUrl}/sprites/${this.playerTypes[i]}.json`
            );
        }
    }

    create() {
        const anims = this.scene?.anims;
        if (!anims) return;
        for (let i = 0; i < this.playerTypes.length; i++) {
            this.addWalkAnimations(anims, this.playerTypes[i]);
        }
    }
    addWalkAnimations(
        anims: Phaser.Animations.AnimationManager,
        playerType: string
    ) {
        anims.create({
            key: `${playerType}-walk-left`,
            frames: anims.generateFrameNames(`${playerType}`, {
                prefix: `${playerType}-`,
                start: 9,
                end: 17
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: `${playerType}-walk-right`,
            frames: anims.generateFrameNames(`${playerType}`, {
                prefix: `${playerType}-`,
                start: 27,
                end: 35
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: `${playerType}-walk-front`,
            frames: anims.generateFrameNames(`${playerType}`, {
                prefix: `${playerType}-`,
                start: 18,
                end: 26
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: `${playerType}-walk-back`,
            frames: anims.generateFrameNames(`${playerType}`, {
                prefix: `${playerType}-`,
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
    }
}
