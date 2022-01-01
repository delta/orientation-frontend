import { useContext, useState } from 'react';
import ChatRoom from './ChatRoom';
import RoomList from './RoomList';
import { UserContext } from '../../contexts/userContext';
import { WebsocketApi } from '../../ws/ws';

const Chat: React.FC<{ ws: WebsocketApi | undefined }> = ({ ws }) => {
    const [chatRooms, setChatRooms] = useState(['Chat']);
    const [currentRoom, setCurrentRoom] = useState('Chat');

    const userContext = useContext(UserContext);

    // TODO: Hacky lines
    if (userContext == null || userContext.user == null) return <></>;

    const user = userContext.user;

    if (typeof ws === 'undefined') return <></>;

    return (
        <div className="h-screen flex flex-col">
            <div className="bg-slate-200 h-10">
                <RoomList
                    chatRooms={chatRooms}
                    currentRoom={currentRoom}
                    setCurrentRoom={setCurrentRoom}
                />
            </div>
            <div className="bg-slate-200 flex-grow">
                <ChatRoom user={user} sendMessage={ws.sendChatMessage} />
            </div>
        </div>
    );
};

export default Chat;
