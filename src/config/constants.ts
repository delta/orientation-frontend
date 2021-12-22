// an array of all player names
const PLAYERS = ['player', 'player2'];

// Starting and ending sprite positions for creating animations
const spriteAnimData = {
    left: { start: 9, end: 17 },
    right: { start: 27, end: 35 },
    front: { start: 18, end: 26 },
    back: { start: 0, end: 26 }
};

export const CONSTANTS = {
    SCENES: {},
    PLAYER_SPRITE_NAMES: PLAYERS,
    SPRITE_ANIMATION: PLAYERS.map((p) => {
        return { playerKey: p, ...spriteAnimData };
    }),
    SPRITE_ANIMATION_FRAME_RATE: 10
};
