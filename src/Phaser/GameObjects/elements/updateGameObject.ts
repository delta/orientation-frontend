import { Types, GameObjects } from 'phaser';
import { GameElements } from './types';

const TextMethodWrapper = (type: 'x' | 'y' | 'text' | 'style') => {
    process.env.NODE_ENV === 'development' &&
        console.warn(
            'Re-rendering text is quite expensive,',
            'Consider using Bit Map Text if your Phaser Text Component requires many re-renders'
        );
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

const ImageMethodWrapper = (
    type: 'x' | 'y' | 'key' | 'origin' | 'depth' | 'scale'
) => {
    if (type === 'x')
        return (gameObj: GameObjects.Image, val: number) => {
            gameObj.setX(val);
        };
    else if (type === 'y')
        return (gameObj: GameObjects.Image, val: number) => {
            gameObj.setY(val);
        };
    else if (type === 'key')
        return (gameObj: GameObjects.Image, val: string) => {
            gameObj.setTexture(val);
        };
    else if (type === 'depth')
        return (gameObj: GameObjects.Image, val?: number) => {
            if (val === undefined) val = 1;
            gameObj.setDepth(val);
        };
    else if (type === 'origin')
        return (gameObj: GameObjects.Image, val?: number) => {
            if (val === undefined) val = 1;
            gameObj.setOrigin(val);
        };
    else if (type === 'scale')
        return (gameObj: GameObjects.Image, val?: number) => {
            if (val === undefined) val = 1;
            gameObj.setScale(val);
        };
    else {
        return (
            gameObj: GameObjects.Image,
            val?: (image: GameObjects.Image) => void
        ) => {
            if (val === undefined) val = (_image) => {};
            gameObj.on('pointerup', () => val && val(gameObj));
        };
    }
};

/**
 * A collection of all the methods need to update every phaser Game object
 */
export const updateGameObjectData: Record<
    GameElements.AllowedGameObjectTypes,
    (type: any) => (...args: any) => any
> = {
    TEXT: TextMethodWrapper,
    IMAGE: ImageMethodWrapper,
    TileMap: TextMethodWrapper
};
