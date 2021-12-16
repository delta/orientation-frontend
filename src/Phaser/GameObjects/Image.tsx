import React, { useEffect, useMemo } from 'react';
import { useScene } from './useScene';
import {
    BasicGameObjectComponentProps,
    GameObjectComponent
} from './GameObject';
import { GameElements } from './elements/types';
import { GameObjects } from 'phaser';
import { invariant } from '../../utils/invariant';

interface ImageProps extends BasicGameObjectComponentProps {
    key: string;
    x: number;
    y: number;

    origin?: number;
    depth?: number;
    scale?: number;

    isInteractive?: boolean;
    onClick?: (image: GameObjects.Image) => void;
}

const Image = ({
    x,
    y,
    key,
    origin,
    depth,
    scale,
    isInteractive,
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

        if (isInteractive) {
            invariant(!onClick, 'onClick function is not provided');
            newImageInstance.setInteractive();
            newImageInstance.on(
                'pointerup',
                () => onClick && onClick(newImageInstance)
            );
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
        isInteractive,
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
