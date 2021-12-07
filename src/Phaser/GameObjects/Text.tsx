import React, { useEffect, useMemo } from 'react';
import { Types } from 'phaser';

import { useScene } from './useScene';

interface TextProps {
    children?: React.ReactNode;
    text: string;
    x: number;
    y: number;
    style: Types.GameObjects.Text.TextStyle;
}

export const Text = ({ x, y, text, style }: TextProps) => {
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
        return () => {
            process.env.NODE_ENV === 'development' &&
                console.log('removing the text');
            // removing the game object from the scene
            textInstance?.destroy(true);
        };
    }, []);

    // BUG: Since we are returning null, a node will not be be created
    // so reconciler won't work. We need to return a placeholder JSX Element
    // which is not null
    return null as unknown as JSX.Element;
};
