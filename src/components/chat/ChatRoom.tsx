import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import IMessage from './interfaces/IMessage';
import IChatUser from './interfaces/IChatUser';
import { getColor } from './utils/colors';
import Message from './Message';
import { IUser } from '../../contexts/userContext';
import { clsx } from '../../utils/clsx';
import { Tab } from '@headlessui/react';

const fakeMesages = [
    { id: 1, from: 'player1', room: 'chat', text: 'Player 1 message' },
    { id: 2, from: 'player2', room: 'chat', text: 'Player 2 message' },
    { id: 3, from: 'player3', room: 'chat', text: 'Player 3 message' },
    { id: 4, from: 'player4', room: 'chat', text: 'Player 4 message' },
    { id: 5, from: 'player5', room: 'chat', text: 'Player 5 message' },
    { id: 6, from: 'player6', room: 'chat', text: 'Player 6 message' },
    { id: 7, from: 'player7', room: 'chat', text: 'Player 7 message' },
    { id: 8, from: 'player8', room: 'chat', text: 'Player 8 message' },
    { id: 9, from: 'player9', room: 'chat', text: 'Player 9 message' },
    { id: 10, from: 'player10', room: 'chat', text: 'Player 10 message' },
    { id: 11, from: 'player11', room: 'chat', text: 'Player 11 message' },
    { id: 12, from: 'player12', room: 'chat', text: 'Player 12 message' },
    { id: 13, from: 'player31', room: 'chat', text: 'Player 13 message' },
    { id: 14, from: 'player14', room: 'chat', text: 'Player 14 message' },
    { id: 15, from: 'player15', room: 'chat', text: 'Player 15 message' },
    { id: 16, from: 'player16', room: 'chat', text: 'Player 16 message' },
    { id: 17, from: 'player17', room: 'chat', text: 'Player 17 message' },
    { id: 18, from: 'player18', room: 'chat', text: 'Player 18 message' },
    { id: 19, from: 'player19', room: 'chat', text: 'Player 19 message' },
    { id: 20, from: 'player20', room: 'chat', text: 'Player 20 message' },
    { id: 21, from: 'player21', room: 'chat', text: 'Player 21 message' },
    { id: 22, from: 'player22', room: 'chat', text: 'Player 22 message' },
    { id: 23, from: 'player23', room: 'chat', text: 'Player 23 message' }
];

const fakeUsers = [
    { id: 1, name: 'player1' },
    { id: 2, name: 'player2' },
    { id: 3, name: 'player3' },
    { id: 4, name: 'player4' },
    { id: 5, name: 'player5' },
    { id: 6, name: 'player6' },
    { id: 7, name: 'player7' }
];

const removeInput = new Event('remove-input');
const addInput = new Event('add-input');

const ChatRoom: React.FC<{ user: IUser; sendMessage: any }> = ({
    user,
    sendMessage
}) => {
    const [users, setUsers] = useState<IChatUser[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [textInput, setTextInput] = useState<string>('');

    const [connectionStatus, setConnectionStatus] = useState<boolean>(true);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const updateChatStatus = () => setConnectionStatus(true);

        document.addEventListener('user-register', updateChatStatus);

        return () => {
            document.removeEventListener('user-register', updateChatStatus);
        };
    });

    useEffect(() => {
        console.log(inputRef.current);
        inputRef.current?.addEventListener('focus', () =>
            document.dispatchEvent(removeInput)
        );
        inputRef.current?.addEventListener('blur', () =>
            document.dispatchEvent(addInput)
        );
    }, [inputRef.current]);

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
        let objDiv = document.getElementById('chat-messages');
        if(objDiv)
            objDiv.scrollTop = objDiv.scrollHeight;
        setMessages(messages.concat(newMessage));
    };

    const handleUserAction = (e: any) => {
        const userAction = e.detail;
        console.log('heyyasd');

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log((e.target as any).elements.data);
        // console.log(e.target);
        const data: string = (e.target as any).elements.data.value;
        if (!data) return;
        sendMessage({ message: data });
        (e.target as any).elements.data.value = '';
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
        <div className="h-full relative" style={{ height: '95%' }}>
            {/* <div className="col-span-1 border-r border-black">
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
            </div> */}
            <Tab.Panels className="h-full relative">
                <Tab.Panel
                    key="chat"
                    className="overflow-y-scroll"
                    style={{ height: '100%' }}
                >
                    {' '}
                    <div
                        className="bg-base mt-3 mb-3 mx-4 relative  py-1 rounded-lg"
                        style={{
                            height: '85%'
                        }}
                    >
                        <h1 className="text-3xl font-medium mt-3 mb-5 px-4 pb-3 border-b-2 rounded-md">
                            👾 Live Chat 👾
                        </h1>
                        <div
                            className="px-4 overflow-y-scroll"
                            id="chat-messages"
                            style={{
                                height: '85%'
                            }}
                        >
                            {connectionStatus ? (
                                <>
                                    <div className="px-4">
                                        {messages.map((message) => (
                                            <Message
                                                key={message.id}
                                                message={message}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="">
                                    Press Play to connect with chat
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Input Button */}
                    <div className="bg-base  mx-4 border-none">
                        <form
                            className="flex border-none relative"
                            onSubmit={handleSubmit}
                        >
                            <input
                                className="rounded-lg p-4  mr-0  text-text  bg-base border-none text-lg"
                                placeholder="Start Typing here..."
                                style={{
                                    width: '70%'
                                }}
                                name="data"
                                disabled={!connectionStatus}
                                ref={inputRef}
                            />
                            <div
                                className="h-full"
                                style={{
                                    width: '15%'
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 cursor-pointer"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    color="#f4efe2"
                                    style={{
                                        transform: 'translate(+80%, 60%)'
                                    }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <button
                                className={clsx(
                                    'px-8 rounded-r-lg bg-accent1  text-gray-800',
                                    'font-bold p-4 uppercase',
                                    'border-t border-b border-r'
                                )}
                                style={{
                                    width: '15%'
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    color="#f4efe2"
                                    style={{ transform: 'translate(-45%, 0%)' }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                </Tab.Panel>
                <Tab.Panel
                    className="overflow-y-scroll"
                    style={{ height: '100%' }}
                >
                    <div
                        className="bg-base mt-3 mb-3 mx-4 relative  py-1 rounded-lg"
                        style={{
                            height: '85%'
                        }}
                    >
                        <h1 className="text-xl font-medium mt-3 mb-5 px-4 pb-3 border-b-2 border-background rounded-md">
                            {connectionStatus
                                ? `${users.length} Players are using Utopia right now!`
                                : 'Loading...'}
                        </h1>
                        <div
                            className="px-4 overflow-y-scroll"
                            style={{
                                height: '85%'
                            }}
                        >
                            {connectionStatus ? (
                                <>
                                    <div className="px-4">
                                        {users.map((u, i) => {
                                            return (
                                                <div className="py-2 text-lg">
                                                    <span className="pr-2">
                                                        <span className="underline capitalize pr-1">
                                                            {i + 1}
                                                        </span>
                                                        :
                                                    </span>
                                                    <span
                                                        className={`${getColor(
                                                            u.id
                                                        )} font-semibold pr-2 capitalize`}
                                                    >
                                                        {u.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm">
                                    Press Play to connect with chat
                                </div>
                            )}
                        </div>
                    </div>
                </Tab.Panel>
            </Tab.Panels>
        </div>
    );
};

export default ChatRoom;
