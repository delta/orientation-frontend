import { useContext, useState } from 'react';
import ChatRoom from './ChatRoom';
import RoomList from './RoomList';
import { UserContext } from '../../contexts/userContext';
import { WebsocketApi } from '../../ws/ws';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';
import { clsx } from '../../utils/clsx';

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

    const ToggleButton = (data: string) => {
        const style =
            data === 'open'
                ? {
                      transform: 'rotate(270deg)',
                      right: '-1%',
                      top: '10%'
                  }
                : {
                      transform: 'rotate(270deg)',
                      left: '-11%',
                      top: '10%'
                  };
        return (
            <div
                className={clsx(
                    'absolute bg-accent2 px-3 py-2',
                    'text-black cursor-pointer hover:bg-accent1',
                    'font-semibold z-50 rounded-t-lg'
                )}
                style={style}
                onClick={() => {
                    toggleVc(data);
                }}
            >
                {data === 'open' ? 'Show Chat' : 'Hide Chat'}
            </div>
        );
    };

    if (typeof ws === 'undefined') return <></>;

    return showChat == '' ? (
        <div className={'w-1/4 text-text relative' + showChat}>
            {ToggleButton('hidden')}
            <Tab.Group>
                <div className="h-screen flex flex-col">
                    <div className="" style={{ height: '5%' }}>
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
            </Tab.Group>
        </div>
    ) : (
        <div className="">
            {/* <button
                className="w-24 top-0 position-absolute h-8 bg-gray-500 hover:bg-blue-700 text-white font-bold"
                onClick={() => toggleVc('open')}
            >
                {' '}
                <FontAwesomeIcon
                    style={{ fontSize: '15px' }}
                    icon={faAngleLeft}
                />{' '}
                Open Chat
            </button> */}
            {ToggleButton('open')}
        </div>
    );
};

export default Chat;
