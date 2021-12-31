import { Scene, Types } from 'phaser';
import { GameElements } from '../GameObjects/elements/types';
import { config } from '../../config/config';
import SpawnPoints from '../../utils/spawnPoints';
import { WebsocketApi } from '../../ws/ws';
import { phaserLoadingAnimation } from '../../utils/loadingAnimation';
import { axiosInstance } from '../../utils/axios';

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
    zoom: number;
    playerDepth: number;
    // playerDepth: number;
    openModal: (data: string) => void;
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
    userMap: Record<
        string,
        { userId: number; name: string; spriteType: string }
    > = {};
    room: any;
    roomForceUpdate: any;
    isVideoOn = true;
    handleOtherPlayersBinded: any;
    handleRoomLeftBinded: any;
    zoom: number;
    playerDepth: number;

    // timeouts to conditionally display stuff on screen
    currentTimeoutId: null | NodeJS.Timeout = null;
    callbackData: any = null;
    timeoutDuration = 100;

    // key-down events
    intractableData: { type: 'minigame' | 'gmap'; data: any } | null = null;

    // opening modals
    openModal!: (data: string) => void;

    constructor({
        config,
        mapName,
        tilesetNames,
        loadTilesetNames,
        layers,
        sceneErrorHandler,
        ws,
        spriteAnims,
        spriteFrameRate,
        zoom,
        playerDepth,
        openModal
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
        this.zoom = zoom;
        this.playerDepth = playerDepth;

        this.room = null;
        this.roomForceUpdate = null;
        this.isVideoOn = true;
        this.handleVcToggle();
        this.handleOtherPlayersBinded = null;
        this.handleRoomLeftBinded = null;
        this.openModal = openModal;
        return;
    }

    destructor() {
        if (this.positionInteval) clearInterval(this.positionInteval);
        document.removeEventListener(
            'ws-room-broadcasts',
            this.handleOtherPlayersBinded
        );
        document.removeEventListener('ws-room-left', this.handleRoomLeftBinded);
        this.otherPlayers = null;
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

    handleVcToggle() {
        document.addEventListener('vc-room-created', (e: any) => {
            this.room = e.detail.room;
            this.roomForceUpdate = e.detail.forceUpdate;
            (window as any).room = this.room;
            (window as any).roomForceUpdate = this.roomForceUpdate;
        });
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
                if (this.room.state === 'connected') this.room.disconnect();
                this.isVideoOn = false;
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

    handleOtherPlayers(e: any) {
        let players: Array<string> = e.detail;
        if (players.length === 1) return;
        this.updateOtherPlayers(players);
    }

    // TOOD
    listenForOtherPlayers() {
        this.handleOtherPlayersBinded = this.handleOtherPlayers.bind(this);
        document.addEventListener(
            'ws-room-broadcasts',
            this.handleOtherPlayersBinded
        );
    }

    handleRoomLeft(e: any) {
        if (this.otherPlayers) {
            this.otherPlayers[e.detail].text.setVisible(false);
            this.otherPlayers[e.detail].destroy();
            delete this.otherPlayers[e.detail];
        }
    }

    removePlayerOnRoomLeave() {
        this.handleRoomLeftBinded = this.handleRoomLeft.bind(this);
        document.addEventListener('ws-room-left', this.handleRoomLeftBinded);
    }

    async addNewPlayers(player: any) {
        let playerData = this.userMap[player.Id];
        if (!playerData) {
            // if the user doesn't exist in our map,
            // we make the user data from backend
            // and add it to our list
            try {
                const resp = await axiosInstance.get(
                    '/api/user/map/' + player.Id
                );
                // debugger;
                if (resp.status === 200) {
                    this.userMap[resp.data.userMap.userId] = resp.data.userMap;
                    localStorage.setItem(
                        'user-map',
                        JSON.stringify(this.userMap)
                    );
                    playerData = resp.data.userMap;
                } else {
                    // setting user data to random stuff so the game doesn't break
                    playerData = {
                        name: 'OXOXOXOX',
                        spriteType: 'male',
                        userId: 1000
                    };
                }
            } catch (err) {
                console.error(err);
                playerData = {
                    name: 'OXOXOXOX',
                    spriteType: 'male',
                    userId: 1000
                };
            }
        }

        // @ts-ignore
        let p = {
            name: playerData.name,
            x: player.Position.X,
            y: player.Position.Y,
            id: playerData.userId,
            type: playerData.spriteType,
            facing: player.Position.Direction
        };

        //@ts-ignore
        let tempPlayer = this.add.rpgcharacter(p);
        tempPlayer.setDepth(this.playerDepth);
        tempPlayer.setScale(0.5);

        if (this.otherPlayers === null) this.otherPlayers = {};

        this.otherPlayers[player.Id] = tempPlayer;
    }

    updateOtherPlayers(players: Array<string>) {
        for (let s of players) {
            let player = JSON.parse(s);
            // if its me dont update
            if (Number(player.Id) !== Number(this.player.id)) {
                if (
                    this.otherPlayers &&
                    this.otherPlayers[player.Id] !== undefined
                ) {
                    this.otherPlayers[player.Id].MoveAndUpdate(player);
                } else {
                    this.addNewPlayers(player);
                }
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
                this.physics.add.overlap(
                    this.player,
                    tmp,
                    callBack,
                    undefined,
                    this
                );
            });
        }
    }

    addTimeout(callback: () => any, cleanup: (data: any) => void) {
        if (this.currentTimeoutId === null) {
            this.callbackData = callback();
            this.currentTimeoutId = setTimeout(() => {
                cleanup(this.callbackData);
                this.currentTimeoutId = null;
                this.callbackData = null;
            }, this.timeoutDuration);
        } else {
            clearTimeout(this.currentTimeoutId);
            this.currentTimeoutId = setTimeout(() => {
                cleanup(this.callbackData);
                this.currentTimeoutId = null;
                this.callbackData = null;
            }, this.timeoutDuration);
        }
    }

    create(data: any) {
        this.userMap = JSON.parse(localStorage.getItem('user-map') as any);
        process.env.NODE_ENV === 'development' &&
            ((window as any).scene = this);
        this.cursors = this.input.keyboard.createCursorKeys();

        const userId = localStorage.getItem('userId') || 0;
        // Set up the player character
        // @ts-ignore
        this.player = this.add.rpgcharacter({
            name: 'player',
            x: this.spawnPoint.x,
            y: this.spawnPoint.y,
            id: userId,
            type: this.userMap[userId].spriteType || 'male',
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

        this.player.setDepth(this.playerDepth);
        this.player.setScale(0.5);

        this.setupObjectLayer('Portals', this.UsePortal.bind(this));
        this.setupObjectLayer('Minigames', this.StartMinigame.bind(this));
        this.setupObjectLayer('Text', this.ShowText.bind(this));
        this.setupObjectLayer('Preview', this.ShowPreview.bind(this));

        // Set up the main (only?) camera
        const camera = this.cameras.main;
        let zoomFactor = this.zoom;
        camera.zoom =
            (zoomFactor * window.innerHeight) / this.map.heightInPixels;
        // camera.centerOn(map.widthInPixels/2, this.map.heightInPixels);
        camera.startFollow(this.player);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.addSpriteAnimations();

        this.addUserToRoom();
        this.listenForOtherPlayers();
        this.removePlayerOnRoomLeave();

        this.positionInteval = setInterval(
            this.sendPlayerPositionToServer.bind(this),
            1000 / config.tickRate
        );

        let videoInput = this.input.keyboard.addKey('v');
        videoInput.on('down', () => {
            if (this.isVideoOn) {
                this.isVideoOn = false;
                this.room.disconnect();
            } else {
                this.isVideoOn = true;
                this.roomForceUpdate();
            }
        });
        // Listening for key presses
        let Markiplier = this.input.keyboard.addKey('e');
        Markiplier.on('down', () => {
            if (this.intractableData) {
                console.log(this.intractableData);
                if (this.intractableData.type === 'minigame') {
                    const elm = this.openModal(
                        this.intractableData.type +
                            '/' +
                            this.intractableData.data
                    );
                }
            }
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
        const callback = () => {
            const width = this.cameras.main.width;
            const height = this.cameras.main.height;

            this.intractableData = {
                type: 'minigame',
                data: target.properties.name
            };

            const text = this.add
                .text(
                    width / 2,
                    (height * 3) / 5,
                    'Press E to start the game',
                    {
                        fontSize: '10px',
                        backgroundColor: '#000'
                    }
                )
                .setScrollFactor(0)
                .setDepth(100)
                .setOrigin(0.5, 0.5);
            (window as any).text = text;
            return text;
        };
        const cleanup = (data: Phaser.GameObjects.Text) => {
            data.destroy(true);
            this.intractableData = null;
        };
        this.addTimeout(callback, cleanup);
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
