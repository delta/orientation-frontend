import { Scene, Types } from 'phaser';
import { GameElements } from '../GameObjects/elements/types';
import { Anims } from './anims';

// A extension of Phaser scene which includes the preload, init and
// create method which isn't part of default Phaser Scene
//
export class PhaserScene extends Scene {
    tilesetNames: string[];
    layers: string[];
    mapName: string;
    cursors: any;
    player: any;
    animsManager: any;
    spawnPoint: { x: number; y: number };
    map: any;
    sceneKey: string;
    constructor(
        config: string | Types.Scenes.SettingsConfig,
        mapName: string,
        tilesetNames: string[],
        layers: string[]
    ) {
        // right now we are not adding the newPhaserScene methods
        // user is responsible for adding the methods on their own
        //
        // TODO: get the methods in constructor call itself
        //
        console.log(config);
        super(config);
        this.sceneKey = '';
        if (config instanceof Object && config.key) this.sceneKey = config.key;
        this.tilesetNames = tilesetNames;
        this.layers = layers;
        this.mapName = mapName;
        this.spawnPoint = { x: 168, y: 300 };
        this.animsManager = new Anims(this);
        return;
    }
    /**
     * Preload method of Phaser Scene
     */
    preload() {
        if (!this.mapName || this.mapName === '') return;
        let baseUrl = 'http://localhost:3000';
        this.load.tilemapTiledJSON(
            'map',
            `${baseUrl}/Maps/${this.mapName}.json`
        );
        for (let i = 0; i < this.tilesetNames.length; i++) {
            this.load.image(
                this.tilesetNames[i],
                `${baseUrl}/TilesetImages/${this.tilesetNames[i]}.png`
            );
        }
        this.load.on('progress', (percentage: number) => {
            console.log(percentage);
        });
        this.animsManager.preload();
    }
    /**
     * Init method of a Phaser Scene, read phaser docs for more info
     * @param {any} data any data you wish to pass to the init function
     */
    init(data: any) {
        console.log(data);
        if (data.spawnPoint) this.spawnPoint = data.spawnPoint;
    }

    setupObjectLayer(layerName: string, callBack: any) {
        // Extract objects from the object layer
        const objectLayer = this.map.getObjectLayer(layerName);
        // Convert object layer objects to Phaser game objects
        if (objectLayer && objectLayer.objects) {
            objectLayer.objects.forEach((object: any) => {
                let tmp: any = this.add.rectangle(
                    object.x + object.width / 2,
                    object.y + object.height / 2,
                    object.width,
                    object.height
                );
                tmp.properties = object.properties.reduce(
                    (obj: any, item: any) =>
                        Object.assign(obj, { [item.name]: item.value }),
                    {}
                );
                this.physics.world.enable(tmp, 1);
                this.physics.add.collider(
                    this.player,
                    tmp,
                    callBack,
                    undefined,
                    this
                );
            });
        }
    }

    /**
     * Create method of a Phaser Scene, read phaser docs for more info
     * @param {any} data any data you wish to pass to the create function
     */
    create(data: any) {
        console.log('creating');

        // Set up simple keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set up the player character
        // @ts-ignore
        this.player = this.add.rpgcharacter({
            x: this.spawnPoint.x,
            y: this.spawnPoint.y,
            name: 'zeta',
            image: 'zeta',
            speed: 225
        });

        this.player.setTexture('zeta', 'zeta-front');

        this.map = this.make.tilemap({ key: 'map' });

        let allTileSets = [];
        for (let i = 0; i < this.tilesetNames.length; i++) {
            const tempTileSet = this.map.addTilesetImage(
                this.tilesetNames[i],
                this.tilesetNames[i]
            );
            allTileSets.push(tempTileSet);
        }

        let allLayers: any = {};
        for (let i = 0; i < this.layers.length; i++) {
            allLayers[this.layers[i]] = this.map.createLayer(
                this.layers[i],
                allTileSets,
                0,
                0
            );
            allLayers[this.layers[i]].setDepth(this.layers.length - i);
            allLayers[this.layers[i]].setCollisionByProperty({
                isCollidable: true
            });
            this.physics.add.collider(
                this.player,
                allLayers[this.layers[i]],
                this.HitScript.bind(this)
            );
        }

        this.player.setDepth(4);

        this.setupObjectLayer('Portals', this.UsePortal.bind(this));

        // Set up the main (only?) camera
        const camera = this.cameras.main;
        camera.zoom = window.innerHeight / this.map.heightInPixels;
        // camera.centerOn(map.widthInPixels/2, this.map.heightInPixels);
        camera.startFollow(this.player);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.animsManager.create();
    }

    update(time: any, delta: any) {
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > this.map.widthInPixels)
            this.player.x = this.map.widthInPixels;
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > this.map.heightInPixels)
            this.player.y = this.map.heightInPixels;

        if (this.cursors.left.isDown)
            this.player.SetInstruction({ action: 'walk', option: 'left' });
        else if (this.cursors.right.isDown)
            this.player.SetInstruction({ action: 'walk', option: 'right' });

        if (this.cursors.up.isDown)
            this.player.SetInstruction({ action: 'walk', option: 'back' });
        else if (this.cursors.down.isDown)
            this.player.SetInstruction({ action: 'walk', option: 'front' });

        this.player.update();

        return true;
    }

    HitScript(player: any, target: any) {
        console.log('hit');
    }

    UsePortal(player: any, target: any) {
        if (target.properties && target.properties.type === 'portal') {
            console.log(target.properties.destination);
            this.scene.start(target.properties.destination, {
                origin: this.scene.key
            });
        }
    }

    addAnimation(animations: GameElements.GameObjectUtilityType.Anims[]) {
        animations.forEach((animation) => {
            this.anims.create({
                key: animation.key,
                frames: this.anims.generateFrameNumbers(this.scene.key, {
                    frames: animation.frames
                }),
                frameRate: animation.frameRate,
                repeat: animation.repeat,
                repeatDelay: animation.repeatDelay
            });
        });
    }
}
