import { config } from './config';

// an array of all player names
const PLAYERS = ['player', 'player2'];

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
    back: { start: 0, end: 26 }
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
            LAYERS: [
                'BaseOverhead2',
                'BaseOverhead1',
                'Base',
                'Background',
                'Grass'
            ],
            DEPTH: 5
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
    }
};
