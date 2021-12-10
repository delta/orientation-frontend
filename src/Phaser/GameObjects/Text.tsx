import React, { useEffect, useMemo } from 'react';
import { Types, GameObjects } from 'phaser';

import { useScene } from './useScene';
import {
    BasicGameObjectComponentProps,
    GameObjectComponent
} from './GameObject';
interface TextProps extends BasicGameObjectComponentProps {
    text: string;
    x: number;
    y: number;
    style: Types.GameObjects.Text.TextStyle;
}

export const Text = ({ x, y, text, style, children }: TextProps) => {
    const scene = useScene();

    // creating a new TextInstance
    const textInstance = useMemo(() => {
        // BUG: When the props are changed, we don't do anything
        // and react is throwing a "exhaustive-deps" warning
        //
        // we have to create a game object when the Component is created
        // and use appropriate methods to update the the game object instance

        if (!scene) return;
        return scene?.add.text(x, y, text, style);
    }, []);

    useEffect(() => {
        const propType = { x, y, text, style };
        let z: Types.GameObjects.GameObjectConfig;

        return () => {
            process.env.NODE_ENV === 'development' &&
                console.log('removing the text');
            // removing the game object from the scene
            // textInstance?.destroy(true);
        };
    }, []);

    // FIXED: Since we are returning null, a node will not be be created
    // so reconciler won't work. We need to return a placeholder JSX Element
    // which is not null
    // If the scene is not created yet, we return NULL, aka we don't create
    // a DOM Node (This is a edge case which happens very rarely when there
    // is a race condition)
    if (!textInstance || !scene) return null;
    return (
        <GameObjectComponent instance={textInstance} scene={scene} type="Text">
            {children}
        </GameObjectComponent>
    );
};
