import React, { KeyboardEvent, useEffect, useState } from 'react';
import IMessage from './interfaces/IMessage';
import IChatUser from './interfaces/IChatUser';
import { getColor } from './utils/colors';
import Message from './Message';

const ChatRoom: React.FC<{ user: IChatUser; sendMessage: any }> = ({
    user,
    sendMessage
}) => {
    const [users, setUsers] = useState<IChatUser[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [textInput, setTextInput] = useState<string>('');

    const setConnectedUsers = (e: any) => {
        const userList: { id: number; name: string }[] = JSON.parse(e.detail);
        setUsers(
            userList.map(({ id, name }) => ({
                id,
                name
            }))
        );
    };

    const appendMessage = (e: any) => {
        setMessages(messages.concat(JSON.parse(e.detail).text));
    };

    const handleUserAction = (e: any) => {
        const userAction = JSON.parse(e.detail);
        switch (userAction.action) {
            case 'j':
                setUsers(users.concat(userAction.userId));
                break;
            case 'l':
                setUsers(users.filter((u) => u != userAction.userId));
                break;
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (textInput.trim().length !== 0) {
                sendMessage({ text: textInput.trim() });
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
                <div className="flex-grow border-b border-black flex flex-col justify-end px-4">
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </div>
                <div className="min-h-[2.5rem] px-4 flex items-center">
                    <div className={`mr-2 font-medium ${getColor(user.id)}`}>
                        {user.name}:
                    </div>
                    <input
                        onKeyDown={handleKeyDown}
                        value={textInput}
                        onChange={(e: any) => setTextInput(e.target.value)}
                        type="text"
                        className="flex-grow border border-gray-400 px-2"
                        placeholder="Press Enter to send"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
