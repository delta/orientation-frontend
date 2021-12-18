/**
 * This Anims class is tightly coupled to the Game Scene class and used to
 * seperate the sprite animation definitions into their own file.
 */
export class Anims {
    constructor(scene) {
        if (!scene) return;

        this.scene = scene;
    }

    preload() {
        let baseUrl = 'http://localhost:3000';
        this.scene.load.atlas(
            'zeta',
            `${baseUrl}/sprites/zeta_walk.png`,
            `${baseUrl}/sprites/zeta_walk.json`
        );
    }

    create() {
        const anims = this.scene.anims;
        anims.create({
            key: 'zeta-walk-left',
            frames: anims.generateFrameNames('zeta', {
                prefix: 'zeta-walk-left.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'zeta-walk-right',
            frames: anims.generateFrameNames('zeta', {
                prefix: 'zeta-walk-right.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'zeta-walk-front',
            frames: anims.generateFrameNames('zeta', {
                prefix: 'zeta-walk-front.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'zeta-walk-back',
            frames: anims.generateFrameNames('zeta', {
                prefix: 'zeta-walk-back.',
                start: 0,
                end: 3,
                zeroPad: 3
            }),
            frameRate: 10,
            repeat: -1
        });
    }
}
