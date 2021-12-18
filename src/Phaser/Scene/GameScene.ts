import Phaser from 'phaser';
import { PhaserScene } from '.';
// import { Anims } from '../anims';
// import scriptJson from '../assets/data/script.json';
import map from '../../assets/Maps/Admin.json';
import AdminBlock from '../../assets/TilesetImages/AdminBlock_16.png';
import Modern from '../../assets/TilesetImages/cute_modern_v1-0.png';
import Fountain from '../../assets/TilesetImages/fountain.png';
import Outdoors from '../../assets/TilesetImages/outdoors.png';
import Village from '../../assets/TilesetImages/Serene_Village_16x16.png';
import Trees from '../../assets/TilesetImages/trees.png';
/**
 * Parent class for all playable scenes
 */
export class GameScene extends Phaser.Scene {
    constructor(sceneName: any) {
        console.log('gamescene');
        super({
            key: sceneName
        });
        // this.controls = null; // User controls
        // this.cursors = null;
        // this.player = null;
        // this.spawnPoint = null;
        // this.portals = {};
    }

    init(scene: any, data: any) {}

    static preload(that: any) {
        console.log('Preloading');
        that.load.tilemapTiledJSON('map', map);
        // that.load.image('AdminBlock', AdminBlock);
        // that.load.image('Fountain', Fountain);
        that.load.image('Modern', Modern);
        that.load.image('Roads', Outdoors);
        that.load.image('SereneVillage', Village);
        that.load.image('Trees', Trees);
        that.load.on('progress', (percentage: number) => {
            console.log(percentage);
        });
    }

    static create(that: Phaser.Scene) {
        console.log('creating');
        const map = that.make.tilemap({
            key: 'map',
            tileWidth: 16,
            tileHeight: 16
        });
        let allTileSets = [];
        let tilesetNames = [
            // 'AdminBlock',
            'Modern',
            // 'Fountain',
            'Roads',
            'SereneVillage',
            'Trees'
        ];
        for (let i = 0; i < tilesetNames.length; i++) {
            const tempTileSet = map.addTilesetImage(
                tilesetNames[i],
                tilesetNames[i]
            );
            console.log(tempTileSet);
            if (tempTileSet) {
                allTileSets.push(tempTileSet);
            }
        }
        console.log(allTileSets);
        (window as any).tileSets = allTileSets;
        const baseOverheadLayer2 = map.createLayer(
            'BaseOverhead2',
            allTileSets,
            0,
            0
        );
        const baseOverheadLayer = map.createLayer(
            'BaseOverhead1',
            allTileSets,
            0,
            0
        );
        const baseLayer = map.createLayer('Base', allTileSets, 0, 0);
        const backGroundLayer = map.createLayer(
            'Background',
            allTileSets,
            0,
            0
        );
        const grassLayer = map.createLayer('Grass', allTileSets, 0, 0);

        // Set up the main (only?) camera
        const camera = that.cameras.main;
        camera.zoom = 2;
        // camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update(time: any, delta: any) {}

    addAnimation(animations: any) {}
}
