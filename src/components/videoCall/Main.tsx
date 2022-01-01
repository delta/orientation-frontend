import { LiveKitRoom } from './LiveKitRoom';
import { useState, useCallback } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import styles from './styles.module.css';
import { config } from '../../config/config';
import { axiosInstance } from '../../utils/axios';
import { useToast } from '../toast/ToastProvider';
function Main() {
    const [, updateToken] = useState(''); //Access token
    const url = config.livekitUrl; //Livekit URL
    const [showVideo, setShowVideo] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [vcPanel, changePanel] = useState('');
    const toast = useToast();
    const joinParty = () => {
        if (roomName == '') {
            toast?.pushError('Enter valid Meet ID');
            return;
        }
        connectOldVc(roomName);
    };
    const connectOldVc = async (name: string) => {
        try {
            let resp: any = await axiosInstance.get(
                `/api/joinvc?room=${name}&status=old`
            );
            console.log(resp);
            updateToken(resp.data.token);
            setShowVideo(true);

            let comp = (
                <>
                    <h1 className="text-white text-center">
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
        } catch (e) {
            console.log(e);
            toast?.pushError('Enter valid Meet ID');
        }
    };
    const [videoComp, updateVc] = useState(<></>);

    const queueUser = useCallback(() => {
        //console.log('People in room',size)
        //TODO: Queueing system
        //Currently just redirecting to "/game"
    }, []);
    const connectVc = async () => {
        //Requesting server for an access token. Server SDK generates 1 and this is passed to the livekit server
        let resp: any = await axiosInstance.get('/api/joinvc?room=&status=new');
        console.log(resp.data);
        updateToken(resp.data.token);
        setShowVideo(true);

        let comp = (
            <>
                <h1 className="text-white text-center">
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
                <div className="w-7/12 m-0 m-auto pl-32 pt-4">
                    <input
                        className="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring focus:bg-white w-4/12 pr-10"
                        placeholder="Enter Room Id"
                        onChange={(e) => {
                            console.log(e.target.value);
                            setRoomName(e.target.value);
                        }}
                        required
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-2"
                        onClick={() => joinParty()}
                    >
                        Submit
                    </button>
                    <span className="text-white text-lg"> (OR)</span>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded ml-4"
                        onClick={() => connectVc()}
                    >
                        Click to create a new room
                    </button>
                </div>
            </>
        );
}
async function onConnected(room: any) {
    await room.localParticipant.setCameraEnabled(false);
    await room.localParticipant.setMicrophoneEnabled(false);
}

export default Main;
