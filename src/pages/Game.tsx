import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Scene } from '../Phaser/Scene/Scene';
import { Game } from '../Phaser/Game/Game';
// import { LoaderScene } from '../Phaser/Scene/Loader';
import { Loader } from '../components/scenes/LoaderScene';
import { WebsocketApi } from '../ws/ws';

export const GamePage = () => {
    const history = useHistory();
    const ws = useMemo(() => {
        try {
            return new WebsocketApi();
        } catch (err) {
            history.push('/auth/login');
        }
    }, [history]);

    return (
        <Game>
            <Loader nextScene={'Entrance'} />
            <Scene
                ws={ws as WebsocketApi}
                sceneKey="Entrance"
                mapName="Entrance"
                tilesetNames={['Modern', 'Fountain', 'SereneVillage', 'Trees']}
                loadTilesetNames={['AdminGate']}
                layers={[
                    'BaseOverhead2',
                    'BaseOverhead1',
                    'Base',
                    'Background',
                    'Grass'
                ]}
            ></Scene>
            <Scene
                ws={ws as WebsocketApi}
                sceneKey="Admin"
                mapName="Admin"
                tilesetNames={[
                    'Modern',
                    'Fountain',
                    'Roads',
                    'SereneVillage',
                    'Trees'
                ]}
                loadTilesetNames={['AdminBlock']}
                layers={[
                    'BaseOverhead2',
                    'BaseOverhead1',
                    'Base',
                    'Background',
                    'Grass'
                ]}
            ></Scene>
        </Game>
    );
};
