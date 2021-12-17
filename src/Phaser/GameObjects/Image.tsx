import React, { useEffect, useMemo } from 'react';
import { useScene } from './useScene';
import {
    BasicGameObjectComponentProps,
    GameObjectComponent
} from './GameObject';
import { GameElements } from './elements/types';

interface ImageProps
    extends BasicGameObjectComponentProps,
        Omit<GameElements.Image, 'name'> {}

export const Image = ({
    x,
    y,
    key,
    origin,
    depth,
    scale,
    onClick,
    children
}: ImageProps) => {
    const scene = useScene();

    const imageInstance = useMemo(() => {
        if (!scene) return;

        const newImageInstance = scene?.add.image(x, y, key);

        if (origin) newImageInstance.setOrigin(origin);
        if (depth) newImageInstance.setDepth(depth);
        if (scale) newImageInstance.setScale(scale);

        if (onClick !== undefined) {
            newImageInstance.setInteractive();
            newImageInstance.on('pointerup', () => onClick(newImageInstance));
        }

        return newImageInstance;
    }, [scene]);

    useEffect(() => {
        return () => {
            process.env.NODE_ENV === 'development' &&
                console.log('removing the text');
            // removing the game object from the scene
            imageInstance?.destroy(true);
        };
    }, []);

    if (!imageInstance || !scene) return null;

    const imageData: GameElements.Image = {
        name: 'IMAGE',
        x,
        y,
        key,
        depth,
        scale,
        origin,
        onClick
    };

    return (
        <GameObjectComponent
            instance={imageInstance}
            scene={scene}
            type="IMAGE"
            data={imageData}
        >
            {children}
        </GameObjectComponent>
    );
};
