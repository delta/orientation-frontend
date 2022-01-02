import { useContext, useState } from 'react';
import ChatRoom from './ChatRoom';
import RoomList from './RoomList';
import { UserContext } from '../../contexts/userContext';
import { WebsocketApi } from '../../ws/ws';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';

const Chat: React.FC<{ ws: WebsocketApi | undefined }> = ({ ws }) => {
    const [chatRooms, setChatRooms] = useState(['Chat']);
    const [currentRoom, setCurrentRoom] = useState('Chat');
    const [showChat, changeDisp] = useState('');
    const userContext = useContext(UserContext);

    // TODO: Hacky lines
    if (userContext == null || userContext.user == null) return <></>;
    const toggleVc = (option: string) => {
        if (option == 'open') {
            changeDisp('');
        } else {
            changeDisp('hidden');
        }
    };
    const user = userContext.user;

    if (typeof ws === 'undefined') return <></>;

    return showChat == '' ? (
        <div className={'w-1/4 bg-gray-500 ' + showChat}>
            <div className="h-screen flex flex-col">
                <div className="bg-slate-200 h-10">
                    <RoomList
                        chatRooms={chatRooms}
                        currentRoom={currentRoom}
                        setCurrentRoom={setCurrentRoom}
                        toggleVc={toggleVc}
                    />
                </div>
                {/* <div className="" style={{ height: '80%' }}> */}
                <ChatRoom user={user} sendMessage={ws.sendChatMessage} />
                {/* </div> */}
                {/* </Tab.Group> */}
            </div>
        </div>
    ) : (
        <div>
            <button
                className="w-24 top-0 position-absolute h-8 bg-gray-500 hover:bg-blue-700 text-white font-bold"
                onClick={() => toggleVc('open')}
            >
                {' '}
                <FontAwesomeIcon
                    style={{ fontSize: '15px' }}
                    icon={faAngleLeft}
                />{' '}
                Open Chat
            </button>
        </div>
    );
};

export default Chat;
