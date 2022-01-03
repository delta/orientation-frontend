import { LiveKitRoom } from './LiveKitRoom';
import { useState, useEffect, useCallback, useRef } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import styles from './styles.module.css';
import { config } from '../../config/config';
import { axiosInstance } from '../../utils/axios';
import { useToast } from '../toast/ToastProvider';

const removeInput = new Event('remove-input');
const addInput = new Event('add-input');

function Main() {
    const inputRef = useRef<HTMLInputElement | null>(null);

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
    const reRender = () => {
        setShowVideo(false);
        console.log('Called finally');
    };

    useEffect(() => {
        console.log(inputRef.current);
        inputRef.current?.addEventListener('focus', () =>
            document.dispatchEvent(removeInput)
        );
        inputRef.current?.addEventListener('blur', () =>
            document.dispatchEvent(addInput)
        );
    }, [inputRef.current]);

    const showRoomCode = (code: any) => {
        return (
            <h3 className="room-code-box">
                Your room is{' '}
                <strong
                    className='room-code'
                    onClick={(e) => {
                        var textField = document.createElement('textarea');
                        textField.innerText = `${code}`;
                        document.body.appendChild(textField);
                        textField.select();
                        document.execCommand('copy');
                        textField.remove();
                        toast?.pushSuccess('Copied to clipboard');
                    }}
                >
                    {code}.
                </strong>{' '}
                Share it with your friends to join
            </h3>
        );
    };

    const connectOldVc = async (name: string) => {
        try {
            let resp: any = await axiosInstance.get(`/api/joinvc?room=${name}`);
            console.log(resp);
            updateToken(resp.data.token);
            setShowVideo(true);

            let comp = (
                <>
                    {showRoomCode(resp.data.roomName)}
                    <div className="roomContainer">
                        <div className={styles.cont}>
                            <LiveKitRoom
                                url={url}
                                token={resp.data.token}
                                queuefunc={queueUser}
                                onConnected={(room) => onConnected(room)}
                                reRender={reRender}
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
        let resp: any = await axiosInstance.get('/api/joinvc');
        console.log(resp.data);
        updateToken(resp.data.token);
        setShowVideo(true);

        let comp = (
            <>
                {/* <h1 className="text-white text-center">
                    Your room is {resp.data.roomName}. Share it with your
                    friends to join
                </h1> */}
                {showRoomCode(resp.data.roomName)}
                <div className="roomContainer">
                    <div className={styles.cont}>
                        <LiveKitRoom
                            url={url}
                            token={resp.data.token}
                            queuefunc={queueUser}
                            onConnected={(room) => onConnected(room)}
                            reRender={reRender}
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
                <div className="w-12/12 m-auto video-code">
                    <input
                        className="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring focus:bg-white w-4/12 pr-10"
                        placeholder="Enter Room Id"
                        onChange={(e) => {
                            console.log(e.target.value);
                            setRoomName(e.target.value);
                        }}
                        required
                        ref={inputRef}
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
