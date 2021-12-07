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
        if (!scene) return;
        return scene?.add.text(x, y, text, style);
    }, [scene]);

    useEffect(() => {
        return () => {
            // removing the game object from the scene
            textInstance?.destroy(true);
        };
    }, []);
    if (!scene) return null;

    return null;
};
