import React from 'react';
import { LiveKitRoom } from './LiveKitRoom';
import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import 'react-aspect-ratio/aspect-ratio.css';
import styles from './styles.module.css';
import { config } from '../../config/config';
import { axiosInstance } from '../../utils/axios';
function Main() {
    const [, updateToken] = useState(''); //Access token
    const [videoComp, updateVc] = useState(<></>);
    const url = config.livekitUrl; //Livekit URL
    const history = useHistory();
    const [showVideo, setShowVideo] = useState(true);

    const queueUser = useCallback(
        (size: number) => {
            //console.log('People in room',size)
            //TODO: Queueing system
            //Currently just redirecting to "/game"
            history.push('/game');
        },
        [history]
    );
    useEffect(() => {
        (async () => {
            const connectVc = async () => {
                //Requesting server for an access token. Server SDK generates 1 and this is passed to the livekit server
                let resp: any = await axiosInstance.get('/api/joinvc');
                updateToken(resp.data.token);
                let comp = (
                    <div className={styles.cont}>
                        <LiveKitRoom
                            url={url}
                            token={resp.data.token}
                            queuefunc={queueUser}
                            onConnected={(room) => onConnected(room)}
                        ></LiveKitRoom>
                    </div>
                );
                updateVc(comp);
            };
            await connectVc();
        })();
    }, []);

    return <div className="roomContainer">{videoComp}</div>;
}
async function onConnected(room: any) {
    await room.localParticipant.setCameraEnabled(false);
    await room.localParticipant.setMicrophoneEnabled(false);
}

export default Main;
