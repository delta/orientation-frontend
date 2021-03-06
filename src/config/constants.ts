import { config } from './config';

// an array of all player names
const PLAYERS = ['male', 'female', 'male2', 'female2'];

const TILESET_ASSETS_NAMES = [
    'Modern',
    'Fountain',
    'SereneVillage',
    'Roads',
    'Trees'
];

// Starting and ending sprite positions for creating animations
const spriteAnimData = {
    left: { start: 9, end: 17 },
    right: { start: 27, end: 35 },
    front: { start: 18, end: 26 },
    back: { start: 1, end: 8 }
};

export const CONSTANTS = {
    SCENES: [
        {
            SCENE_KEY: 'Entrance',
            MAP_NAME: 'Entrance',
            TILESET_NAMES: ['Modern', 'Fountain', 'SereneVillage', 'Trees'],
            LOAD_TILESET_NAMES: ['AdminGate'],
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            ZOOM: 1.5,
            DEPTH: 4
        },
        {
            SCENE_KEY: 'Admin',
            MAP_NAME: 'Admin',
            TILESET_NAMES: [
                'Modern',
                'Fountain',
                'Roads',
                'SereneVillage',
                'Trees'
            ],
            LOAD_TILESET_NAMES: ['AdminBlock'],
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            ZOOM: 1.5,
            DEPTH: 4
        },
        {
            SCENE_KEY: 'Library',
            MAP_NAME: 'Library',
            TILESET_NAMES: [
                'Modern',
                'Fountain',
                'Roads',
                'SereneVillage',
                'Trees'
            ],
            LOAD_TILESET_NAMES: ['Library', 'Gate'],
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            ZOOM: 1.5,
            DEPTH: 4
        },
        {
            SCENE_KEY: 'LHC',
            MAP_NAME: 'LHC',
            TILESET_NAMES: [
                'Modern',
                'Fountain',
                'Roads',
                'SereneVillage',
                'Trees'
            ],
            LOAD_TILESET_NAMES: ['AcadBuildings'],
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            ZOOM: 1.25,
            DEPTH: 4
        },
        {
            SCENE_KEY: 'Octa',
            MAP_NAME: 'Octa',
            TILESET_NAMES: [
                'Modern',
                'Fountain',
                'Roads',
                'SereneVillage',
                'Trees'
            ],
            LOAD_TILESET_NAMES: ['AcadBuildings'],
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            ZOOM: 1,
            DEPTH: 4
        },
        {
            SCENE_KEY: 'Orion',
            MAP_NAME: 'Orion',
            TILESET_NAMES: [
                'Modern',
                'Fountain',
                'Roads',
                'SereneVillage',
                'Trees'
            ],
            LOAD_TILESET_NAMES: ['Barn_Orion'],
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            ZOOM: 1.75,
            DEPTH: 4
        },
        {
            SCENE_KEY: 'Barn',
            MAP_NAME: 'Barn',
            TILESET_NAMES: [
                'Modern',
                'Fountain',
                'Roads',
                'SereneVillage',
                'Trees'
            ],
            LOAD_TILESET_NAMES: ['Barn_Orion'],
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            ZOOM: 1.5,
            DEPTH: 4
        },
        {
            SCENE_KEY: 'NSO',
            MAP_NAME: 'NSO',
            TILESET_NAMES: [
                'Modern',
                'Fountain',
                'Roads',
                'SereneVillage',
                'Trees'
            ],
            LOAD_TILESET_NAMES: ['FootballGround', 'Lines', 'RunningTrack'],
            LAYERS: ['Overlay', 'Football', 'Base3', 'Base2', 'Base'],
            ZOOM: 1.75,
            DEPTH: 5
        },
        {
            SCENE_KEY: 'ConnectionLeft',
            MAP_NAME: 'ConnectionLeft',
            TILESET_NAMES: ['Modern', 'Roads', 'SereneVillage', 'Trees'],
            LOAD_TILESET_NAMES: [],
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            ZOOM: 1.3,
            DEPTH: 4
        }
    ],
    PLAYER_SPRITE_NAMES: PLAYERS,
    SPRITE_ANIMATION: PLAYERS.map((p) => {
        return { playerKey: p, ...spriteAnimData };
    }),
    SPRITE_ANIMATION_FRAME_RATE: 10,
    LOADER: {
        imagePrefixPath: config.assetUrl + '/TilesetImages',
        images: TILESET_ASSETS_NAMES.map((t) => {
            return { key: t, url: t + '.png' };
        }),
        spritesPrefixPath: config.assetUrl + '/sprites',
        sprites: PLAYERS.map((p) => {
            return { key: p, atlasURL: p + '.json', textureURL: p + '.png' };
        })
    },
    MINIGAMES: {
        'minigame/2048': {
            name: '2048',
            path: '/2048/index.html',
            width: 720,
            height: 450,
            description:
                'Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!',
            madeBy: 'Gabriele Cirulli',
            liscense: '',
            repo: 'https://github.com/gabrielecirulli/2048'
        },
        'minigame/hextris': {
            name: 'hextris',
            path: '/hextris/index.html',
            width: 720,
            height: 450,
            description:
                'Use your arrow keys to rotate. Try to catch the falling blocks of same color. Join 3 or more blocks to gain points. Game ends, when you go outside the main hex.',
            madeBy: 'Logan Engstrom',
            liscense: '',
            repo: 'https://github.com/Hextris/hextris'
        },
        'minigame/stack': {
            name: 'stack',
            path: '/stack/index.html',
            width: 720,
            height: 450,
            description:
                'Use spacebar or click to place a block. Align the block perfectly on top of the tower. Each misalignment costs you a piece. Game ends, when the block is finished.',
            madeBy: 'Mehmood Deshmukh',
            liscense: '',
            repo: 'https://github.com/meshde/tower-stack-game'
        },
        'minigame/pacman': {
            name: 'pacman',
            path: '/pacman/index.html',
            width: 720,
            height: 450,
            description:
                'Move around using wasd keys, and try to eat all the dots. Avoid ghosts. You have three lives. Game ends, when you run out of lives. Collect Powerups to kill ghosts.',
            madeBy: 'bward2',
            liscense: '',
            repo: 'https://github.com/bward2/pacman-js'
        }
    }
};
