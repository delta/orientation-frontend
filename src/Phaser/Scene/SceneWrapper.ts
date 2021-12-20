import { Scene, Types } from 'phaser';
import { GameElements } from '../GameObjects/elements/types';
import { Anims } from './anims';
import { config } from '../../config/config';
import SpawnPoints from '../../utils/spawnPoints';
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
    spawnPoint: { x: number; y: number; facing: string };
    map: any;
    sceneKey: string;
    otherPlayers: any;
    defaultTiles: { [key: string]: any };
    socketContext: any;
    constructor(
        config: string | Types.Scenes.SettingsConfig,
        mapName: string,
        tilesetNames: string[],
        layers: string[]
    ) {
        super(config);
        this.sceneKey = '';
        if (config instanceof Object && config.key) this.sceneKey = config.key;
        this.tilesetNames = tilesetNames;
        this.layers = layers;
        this.mapName = mapName;
        this.spawnPoint = { x: 168, y: 300, facing: 'back' };
        this.otherPlayers = [];
        this.animsManager = new Anims(this);
        this.defaultTiles = {
            left: 13,
            right: 33,
            front: 18,
            back: 0
        };
        // this.socketContext;
        setInterval(this.sendPlayerPositionToServer, 500);
        return;
    }
    /**
     * Preload method of Phaser Scene
     */
    preload() {
        if (!this.mapName || this.mapName === '') return;
        this.load.tilemapTiledJSON(
            `${this.mapName}`,
            `${config.assetUrl}/Maps/${this.mapName}.json`
        );
        for (let i = 0; i < this.tilesetNames.length; i++) {
            this.load.image(
                this.tilesetNames[i],
                `${config.assetUrl}/TilesetImages/${this.tilesetNames[i]}.png`
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
        // load SpawnPoint.json from Map Folder into spawnPoints variable
        if (data.origin) {
            this.spawnPoint = (SpawnPoints as any)[data.origin];
        }
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

    loadOtherPlayers(players: any) {
        // declare type of object
        players.forEach((player: any) => {
            // @ts-ignore
            let tempPlayer = this.add.rpgcharacter({
                x: player.x,
                y: player.y,
                name: player.name,
                image: player.type,
                speed: 100
            });
            tempPlayer.setTexture(
                player.type,
                `${player.type}-${this.defaultTiles[player.facing]}`
            );
            tempPlayer.setDepth(4);
            tempPlayer.setScale(0.5);
            this.otherPlayers.push(tempPlayer);
        });
    }

    sendPlayerPositionToServer() {}

    /**
     * Create method of a Phaser Scene, read phaser docs for more info
     * @param {any} data any data you wish to pass to the create function
     */
    create(data: any) {
        console.log('creating');
        (window as any).scene = this;
        // Set up simple keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set up the player character
        // @ts-ignore
        this.player = this.add.rpgcharacter({
            x: this.spawnPoint.x,
            y: this.spawnPoint.y,
            name: 'player',
            image: 'player',
            speed: 100
        });

        this.loadOtherPlayers([
            {
                name: 'player2',
                x: this.spawnPoint.x,
                y: this.spawnPoint.y - 100,
                facing: 'left',
                type: 'player'
            },
            {
                name: 'player3',
                x: this.spawnPoint.x - 30,
                y: this.spawnPoint.y - 150,
                facing: 'right',
                type: 'player2'
            }
        ]);

        this.player.setTexture(
            'player',
            `player-${this.defaultTiles[this.spawnPoint.facing]}`
        );
        this.map = this.make.tilemap({ key: this.mapName });
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
        this.player.setScale(0.5);

        this.setupObjectLayer('Portals', this.UsePortal.bind(this));
        this.setupObjectLayer('Minigames', this.StartMinigame.bind(this));
        this.setupObjectLayer('Text', this.ShowText.bind(this));
        this.setupObjectLayer('Preview', this.ShowPreview.bind(this));

        // Set up the main (only?) camera
        const camera = this.cameras.main;
        let zoomFactor = 1.25;
        camera.zoom =
            (zoomFactor * window.innerHeight) / this.map.heightInPixels;
        // camera.centerOn(map.widthInPixels/2, this.map.heightInPixels);
        camera.startFollow(this.player);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.animsManager.create();
    }

    updateMap() {
        var origin = this.map.getTileAtWorldXY(this.player.x, this.player.y);
        this.map.forEachTile((tile: any) => {
            var dist = Phaser.Math.Distance.Chebyshev(
                origin.x,
                origin.y,
                tile.x,
                tile.y
            );
            tile.setAlpha(1 - 0.1 * dist);
        });
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
        // this.updateMap();
        return true;
    }

    HitScript(player: any, target: any) {
        console.log('hit');
    }

    UsePortal(player: any, target: any) {
        if (target.properties && target.properties.type === 'portal') {
            console.log(target.properties.destination);
            this.scene.start(target.properties.destination, {
                origin: target.properties.name
            });
        }
    }

    StartMinigame(player: any, target: any) {
        console.log(target.properties.name);
    }

    ShowText(player: any, target: any) {
        console.log(target.properties);
    }

    ShowPreview(player: any, target: any) {
        // open in a new tab target.properties.link
        // let win = window.open(target.properties.link, '_blank');
        // win?.focus();
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
