import React, { KeyboardEvent, useEffect, useState } from 'react';
import IMessage from './interfaces/IMessage';
import IChatUser from './interfaces/IChatUser';
import { getColor } from './utils/colors';
import Message from './Message';
import { IUser } from '../../contexts/userContext';

const ChatRoom: React.FC<{ user: IUser; sendMessage: any }> = ({
    user,
    sendMessage
}) => {
    const [users, setUsers] = useState<IChatUser[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [textInput, setTextInput] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<Boolean>(false);

    const setConnectedUsers = (e: any) => {
        const userList: { id: number; name: string }[] = e.detail;
        setUsers(userList);
    };

    const appendMessage = (e: any) => {
        let chatMessage = e.detail;

        let newMessage: IMessage = {
            id: chatMessage.user.id,
            from: chatMessage.user,
            room: 'chat', //may be remove later
            text: chatMessage.message
        };
        setMessages(messages.concat(newMessage));
    };

    const handleUserAction = (e: any) => {
        const userAction = e.detail;

        if (userAction.user.id === user.id && userAction.status) {
            setConnectionStatus(true); // setting chat connection status
            return;
        }

        switch (userAction.status) {
            case true:
                setUsers(users.concat(userAction.user));
                break;
            case false:
                setUsers(users.filter((u) => u.id !== userAction.user.id));
                break;
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (textInput.trim().length !== 0) {
                sendMessage({ message: textInput.trim() });
                setTextInput('');
            }
        }
    };

    useEffect(() => {
        document.addEventListener('ws-connected-users', setConnectedUsers);
        document.addEventListener('ws-chat-message', appendMessage);
        document.addEventListener('ws-user-action', handleUserAction);

        return () => {
            document.removeEventListener(
                'ws-connected-users',
                setConnectedUsers
            );
            document.removeEventListener('ws-chat-message', appendMessage);
            document.removeEventListener('ws-user-action', handleUserAction);
        };
    });

    return (
        <div className="grid grid-cols-5 h-full border-t border-black">
            <div className="col-span-1 border-r border-black">
                <div className="py-1 text-sm text-center border-b border-black">
                    {users.length} Users
                </div>
                {users.map((user, index) => (
                    <div
                        className={`font-medium border-b border-black pl-2 truncate cursor-pointer ${getColor(
                            user.id
                        )} hover:bg-slate-300`}
                    >
                        {user.name}
                    </div>
                ))}
            </div>
            <div className="col-span-4 flex flex-col">
                {connectionStatus ? (
                    <>
                        <div className="flex-grow border-b border-black flex flex-col justify-end px-4">
                            {messages.map((message) => (
                                <Message key={message.id} message={message} />
                            ))}
                        </div>
                        <div className="min-h-[2.5rem] px-4 flex items-center">
                            <div
                                className={`mr-2 font-medium ${getColor(
                                    user.id
                                )}`}
                            >
                                {user.username}:
                            </div>
                            <input
                                onKeyDown={handleKeyDown}
                                value={textInput}
                                onChange={(e: any) =>
                                    setTextInput(e.target.value)
                                }
                                type="text"
                                className="flex-grow border border-gray-400 px-2"
                                placeholder="Press Enter to send"
                            />
                        </div>
                    </>
                ) : (
                    <div>press play to connect with chat</div>
                )}
            </div>
        </div>
    );
};

export default ChatRoom;
