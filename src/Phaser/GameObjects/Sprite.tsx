import React, { useEffect, useMemo } from 'react';
import { useScene } from './useScene';
import {
    BasicGameObjectComponentProps,
    GameObjectComponent
} from './GameObject';
import { GameElements } from './elements/types';

interface SpriteProps
    extends BasicGameObjectComponentProps,
        Omit<GameElements.Sprite, 'name'> {}

export const Sprite = ({
    x,
    y,
    key,
    animations,
    children,
    depth,
    origin,
    scale
}: SpriteProps) => {
    const scene = useScene();

    const spriteInstance = useMemo(() => {
        if (!scene) return;

        const newSpriteInstance = scene.add.sprite(x, y, key);

        if (origin) newSpriteInstance.setOrigin(origin);
        if (depth) newSpriteInstance.setDepth(depth);
        if (scale) newSpriteInstance.setScale(scale);

        // create animations via the anims engine
        if (animations) {
            scene.addAnimation(animations);
        }

        return newSpriteInstance;
    }, [scene]);

    useEffect(() => {
        return () => {
            process.env.NODE_ENV === 'development' &&
                console.log('removing the text');
            // removing the game object from the scene
            spriteInstance?.destroy(true);
        };
    }, []);

    if (!spriteInstance || !scene) return null;

    const spriteData: GameElements.Sprite = {
        name: 'SPRITE',
        x,
        y,
        key,
        depth,
        scale,
        origin,
        animations
    };

    return (
        <GameObjectComponent
            instance={spriteInstance}
            scene={scene}
            type="SPRITE"
            data={spriteData}
        >
            {children}
        </GameObjectComponent>
    );
};
