import { Types, GameObjects } from 'phaser';
import { GameElements } from './types';

const TextMethodWrapper = (type: 'x' | 'y' | 'text' | 'style') => {
    if (type === 'x')
        return (gameObj: GameObjects.Text, val: number) => {
            gameObj.setX(val);
        };
    else if (type === 'y')
        return (gameObj: GameObjects.Text, val: number) => {
            gameObj.setY(val);
        };
    else if (type === 'text')
        return (gameObj: GameObjects.Text, val: string | string[]) => {
            gameObj.setText(val);
        };
    else
        return (
            gameObj: GameObjects.Text,
            val: Types.GameObjects.Text.TextStyle
        ) => {
            gameObj.setStyle(val);
        };
};

/**
 * A compilation of all the methods need to update every phaser Game object
 */
export const updateGameObjectData: Record<
    GameElements.AllowedGameObjectTypes,
    (type: any) => (...args: any) => any
> = {
    TEXT: TextMethodWrapper,
    Image: TextMethodWrapper,
    TileMap: TextMethodWrapper
};
