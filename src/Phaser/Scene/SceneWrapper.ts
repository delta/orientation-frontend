import { Scene, Types } from 'phaser';
import { GameElements } from '../GameObjects/elements/types';
import { config } from '../../config/config';
import SpawnPoints from '../../utils/spawnPoints';
import { WebsocketApi } from '../../ws/ws';
import { phaserLoadingAnimation } from '../../utils/loadingAnimation';

interface ConstructorProps {
    config: string | Types.Scenes.SettingsConfig;
    mapName: string;
    tilesetNames: string[];
    loadTilesetNames: string[];
    layers: string[];
    sceneErrorHandler: any;
    ws: WebsocketApi | null | undefined;
    spriteAnims?: Array<{
        playerKey: string;
        left: { start: number; end: number };
        right: { start: number; end: number };
        front: { start: number; end: number };
        back: { start: number; end: number };
    }>;
    spriteFrameRate?: number;
}

// A extension of Phaser scene which includes the preload, init and
// create method which isn't part of default Phaser Scene
//
export class PhaserScene extends Scene {
    tilesetNames: string[];
    loadTilesetNames: string[];
    layers: string[];
    mapName: string;
    cursors: any;
    player: any;
    // animsManager: any;
    spawnPoint: { x: number; y: number; facing: string };
    map: any;
    sceneKey: string;
    otherPlayers: { [key: string]: any } | null;
    socketContext: any;
    positionInteval: NodeJS.Timeout | null;
    ws: WebsocketApi | null | undefined;
    sceneErrorHandler: any;
    facing: string;
    spriteAnims?: any;
    spriteFrameRate = 10;
    constructor({
        config,
        mapName,
        tilesetNames,
        loadTilesetNames,
        layers,
        sceneErrorHandler,
        ws,
        spriteAnims,
        spriteFrameRate
    }: ConstructorProps) {
        super(config);
        this.sceneKey = '';
        if (config instanceof Object && config.key) this.sceneKey = config.key;
        this.loadTilesetNames = loadTilesetNames;
        this.tilesetNames = tilesetNames.concat(loadTilesetNames);
        this.layers = layers;
        this.mapName = mapName;
        this.spawnPoint = { x: 168, y: 300, facing: 'back' };
        this.otherPlayers = null;
        // this.animsManager = new Anims(this);
        this.positionInteval = null;
        this.ws = ws;
        this.sceneErrorHandler = sceneErrorHandler;
        this.facing = 'back';
        this.spriteAnims = spriteAnims;
        this.spriteFrameRate = spriteFrameRate ? spriteFrameRate : 10;
        return;
    }

    destructor() {
        // console.log('Destroy');
        if (this.positionInteval) clearInterval(this.positionInteval);
    }

    preload() {
        if (!this.mapName || this.mapName === '') return;
        this.load.tilemapTiledJSON(
            `${this.mapName}`,
            `${config.assetUrl}/Maps/${this.mapName}.json`
        );
        for (let i = 0; i < this.loadTilesetNames.length; i++) {
            this.load.image(
                this.loadTilesetNames[i],
                `${config.assetUrl}/TilesetImages/${this.loadTilesetNames[i]}.png`
            );
        }
        phaserLoadingAnimation(this);
    }

    init(data: any) {
        this.events.on('shutdown', () => {
            this.destructor();
        });

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
                        direction: this.player.facing
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
            // debugger;d
            let players: Array<string> = e.detail;

            if (players.length === 1) return;

            this.updateOtherPlayers(players);
        });
    }

    addNewPlayers(player: any) {
        // console.log(player);
        // @ts-ignore
        let p = {
            name: `${Date.now()}`,
            x: player.Position.X,
            y: player.Position.Y,
            id: player.Id,
            type: 'player',
            facing: player.Position.Direction
        };

        //@ts-ignore
        let tempPlayer = this.add.rpgcharacter(p);
        tempPlayer.setDepth(4);
        tempPlayer.setScale(0.5);

        if (this.otherPlayers === null) this.otherPlayers = {};

        this.otherPlayers[player.Id] = tempPlayer;
    }

    updateOtherPlayers(players: Array<string>) {
        console.log(this.otherPlayers, this.player.id);
        // console.log(players);

        for (let s of players) {
            let player = JSON.parse(s);
            console.log(player);
            // if its me dont update
            if (Number(player.Id) !== Number(this.player.id)) {
                if (
                    this.otherPlayers &&
                    this.otherPlayers[player.Id] !== undefined
                ) {
                    console.log('update');
                    this.otherPlayers[player.Id].MoveAndUpdate(player);
                } else {
                    console.log('New player');
                    this.addNewPlayers(player);
                }
            } else {
                console.log('hmmmmmm');
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
        // console.log('creating');
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set up the player character
        // @ts-ignore
        this.player = this.add.rpgcharacter({
            name: 'player',
            x: this.spawnPoint.x,
            y: this.spawnPoint.y,
            id: localStorage.getItem('userId') || 0,
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

        // console.log('allTileSets: ', allTileSets);
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
        this.addSpriteAnimations();

        this.addUserToRoom();
        this.listenForOtherPlayers();

        this.positionInteval = setInterval(
            this.sendPlayerPositionToServer.bind(this),
            1000 / config.tickRate
        );
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
        // console.log('hit');
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
        // console.log(target.properties.name);
    }

    ShowText(player: any, target: any) {
        // console.log(target.properties);
    }

    ShowPreview(player: any, target: any) {
        // open in a new tab target.properties.link
        // let win = window.open(target.properties.link, '_blank');
        // win?.focus();
    }

    addSpriteAnimations() {
        if (!this.spriteAnims) return;
        const anims = this.anims;
        const spriteAnims = this.spriteAnims;
        spriteAnims?.forEach((s: any) => {
            ['left', 'right', 'front', 'back'].forEach((direction) => {
                anims.create({
                    key: `${s.playerKey}-walk-${direction}`,
                    frames: anims.generateFrameNames(`${s.playerKey}`, {
                        prefix: `${s.playerKey}-`,
                        //@ts-ignore
                        start: s[direction].start,
                        //@ts-ignore
                        end: s[direction].end
                    }),
                    frameRate: this.spriteFrameRate,
                    repeat: -1
                });
            });
        });
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
