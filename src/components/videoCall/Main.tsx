import { LiveKitRoom } from './LiveKitRoom';
import { useState, useCallback } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import styles from './styles.module.css';
import { config } from '../../config/config';
import { axiosInstance } from '../../utils/axios';
function Main() {
    const [, updateToken] = useState(''); //Access token
    const url = config.livekitUrl; //Livekit URL
    const [showVideo, setShowVideo] = useState(false);
    const [roomName, setRoomName] = useState('');
    const connectOldVc = async (name: string) => {
        let resp: any = await axiosInstance.get(`/api/joinvc?room=${name}`);
        console.log('Name:', name);
        updateToken(resp.data.token);
        setShowVideo(true);
        let comp = (
            <>
                <h1>
                    Your room is {resp.data.roomName}. Share it with your
                    friends to join
                </h1>
                <div className="roomContainer">
                    <div className={styles.cont}>
                        <LiveKitRoom
                            url={url}
                            token={resp.data.token}
                            queuefunc={queueUser}
                            onConnected={(room) => onConnected(room)}
                        ></LiveKitRoom>
                    </div>
                </div>
            </>
        );
        updateVc(comp);
    };
    const [videoComp, updateVc] = useState(<></>);

    const queueUser = useCallback(() => {
        //console.log('People in room',size)
        //TODO: Queueing system
        //Currently just redirecting to "/game"
    }, []);
    const connectVc = async () => {
        //Requesting server for an access token. Server SDK generates 1 and this is passed to the livekit server
        let resp: any = await axiosInstance.get('/api/joinvc');
        console.log(resp.data);
        updateToken(resp.data.token);
        setShowVideo(true);
        let comp = (
            <>
                <h1>
                    Your room is {resp.data.roomName}. Share it with your
                    friends to join
                </h1>
                <div className="roomContainer">
                    <div className={styles.cont}>
                        <LiveKitRoom
                            url={url}
                            token={resp.data.token}
                            queuefunc={queueUser}
                            onConnected={(room) => onConnected(room)}
                        ></LiveKitRoom>
                    </div>
                </div>
            </>
        );
        updateVc(comp);
    };
    if (showVideo && videoComp != <></>) {
        return videoComp;
    } else
        return (
            <>
                <input
                    onChange={(e) => {
                        console.log(e.target.value);
                        setRoomName(e.target.value);
                    }}
                />
                <button onClick={() => connectOldVc(roomName)}>Submit</button>
                <br />
                <button onClick={() => connectVc()}>
                    Click to create a new room
                </button>
            </>
        );
}
async function onConnected(room: any) {
    await room.localParticipant.setCameraEnabled(false);
    await room.localParticipant.setMicrophoneEnabled(false);
}

export default Main;
