import { Scene, Types } from 'phaser';
import { GameElements } from '../GameObjects/elements/types';
import { Anims } from './anims';
import { config } from '../../config/config';
import SpawnPoints from '../../utils/spawnPoints';
import { WebsocketApi } from '../../ws/ws';
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
    otherPlayers: { [key: string]: any } | null;
    socketContext: any;
    positionInteval: NodeJS.Timeout | null;
    ws: WebsocketApi | null | undefined;
    sceneErrorHandler: any;
    facing: string;

    constructor(
        config: string | Types.Scenes.SettingsConfig,
        ws: WebsocketApi | null | undefined,
        mapName: string,
        tilesetNames: string[],
        layers: string[],
        sceneErrorHandler: any
    ) {
        super(config);
        this.sceneKey = '';
        if (config instanceof Object && config.key) this.sceneKey = config.key;
        this.tilesetNames = tilesetNames;
        this.layers = layers;
        this.mapName = mapName;
        this.spawnPoint = { x: 168, y: 300, facing: 'back' };
        this.otherPlayers = null;
        this.animsManager = new Anims(this);
        this.positionInteval = null;
        this.ws = ws;
        this.sceneErrorHandler = sceneErrorHandler;
        this.facing = 'back';
        return;
    }

    destructor() {
        console.log('Destroy');
        if (this.positionInteval) clearInterval(this.positionInteval);
    }

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

    init(data: any) {
        this.events.on('shutdown', () => {
            this.destructor();
        });

        this.addUserToRoom();
        this.listenForOtherPlayers();

        this.positionInteval = setInterval(
            this.sendPlayerPositionToServer.bind(this),
            1000 / config.tickRate
        );

        if (data.origin) {
            this.spawnPoint = (SpawnPoints as any)[data.origin];
        }
    }

    // TODO
    addUserToRoom() {
        if (this.ws) {
            try {
                this.ws.registerUser({
                    room: this.sceneKey,
                    position: {
                        x: this.spawnPoint.x,
                        y: this.spawnPoint.y,
                        direction: this.spawnPoint.facing
                    }
                });
            } catch (err) {
                this.sceneErrorHandler(err);
            }
        }
    }

    // TODO
    moveUserToRoom(roomName: string) {
        if (this.ws) {
            try {
                this.ws.changeRoom({
                    from: this.sceneKey,
                    to: roomName,
                    position: {
                        x: this.spawnPoint.x,
                        y: this.spawnPoint.y,
                        direction: this.spawnPoint.facing
                    }
                });
            } catch (err) {
                this.sceneErrorHandler(err);
            }
        }
    }

    // TODO
    sendPlayerPositionToServer() {
        if (this.ws) {
            try {
                this.ws.moveUser({
                    room: this.sceneKey,
                    position: {
                        x: Math.round(this.player.x),
                        y: Math.round(this.player.y),
                        direction: this.facing
                    }
                });
            } catch (err) {
                this.sceneErrorHandler(err);
            }
        }
    }

    // TOOD
    listenForOtherPlayers() {
        document.addEventListener('ws-room-broadcasts', (e: any) => {
            let players = e.detail;
            this.updateOtherPlayers(players);
        });
    }

    addNewPlayers(players: any) {
        players.forEach((player: any) => {
            // @ts-ignore
            let tempPlayer = this.add.rpgcharacter(player);
            tempPlayer.setDepth(4);
            tempPlayer.setScale(0.5);
            if (this.otherPlayers === null) this.otherPlayers = {};
            this.otherPlayers[player.id] = tempPlayer;
        });
    }

    updateOtherPlayers(players: any) {
        if (typeof players == 'object') return;

        if (players.length <= 1 || this.otherPlayers === null) return;

        console.log(players);

        for (let player of players) {
            if (player.Id === this.player.id) return;

            if (
                this.otherPlayers &&
                this.otherPlayers[player.Id] !== undefined
            ) {
                this.otherPlayers[player.Id].MoveAndUpdate(player);
            } else {
                console.log('New player');
                this.addNewPlayers([player]);
            }
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

    create(data: any) {
        console.log('creating');
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set up the player character
        // @ts-ignore
        this.player = this.add.rpgcharacter({
            name: 'player',
            x: this.spawnPoint.x,
            y: this.spawnPoint.y,
            id: 0,
            type: 'player',
            facing: this.spawnPoint.facing
        });

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
            this.moveUserToRoom(target.properties.destination);
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
