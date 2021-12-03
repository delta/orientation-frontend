import React, { useContext, useEffect } from 'react';

import { GameContext } from '../Game/GameContext';

const Scene = (props: any) => {
    const game = useContext(GameContext);
    useEffect(() => console.log(game), [game]);
    return (
        <>
            <div className="h-1/2 w-1/2"></div>
        </>
    );
};

export { Scene };
