import { useContext } from 'react';
import { SceneContext } from '../Scene';

export const useScene = () => {
    return useContext(SceneContext);
};
