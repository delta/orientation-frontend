import React from 'react';
import { LiveKitRoom } from './LiveKitRoom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'react-aspect-ratio/aspect-ratio.css';
import styles from './styles.module.css';

function Main() {
    const [token, updateToken] = useState(''); //Access token
    const [videoComp, updateVc] = useState(<></>);
    const url = 'ws://localhost:7880'; //Livekit URL
    const history = useHistory();

    useEffect(() => {
        connectVc();
    }, []);

    const connectVc = async () => {
        //Requesting server for an access token. Server SDK generates 1 and this is passed to the livekit server
        let resp = await axios.get('http://localhost:8000/joinvc');
        updateToken(resp.data);
        let comp = (
            <div className={styles.cont}>
                <LiveKitRoom
                    url={url}
                    token={resp.data}
                    queuefunc={queueUser}
                    onConnected={(room) => onConnected(room)}
                ></LiveKitRoom>
            </div>
        );
        updateVc(comp);
    };

    const queueUser = (size: number) => {
        //console.log('People in room',size)
        //TODO: Queueing system
        //Currently just redirecting to "/game"
        history.push('/game');
    };
    return <div className="roomContainer">{videoComp}</div>;
}
async function onConnected(room: any) {
    await room.localParticipant.setCameraEnabled(false);
    await room.localParticipant.setMicrophoneEnabled(false);
}

export default Main;
