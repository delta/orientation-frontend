import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import IMessage from './interfaces/IMessage';
import Message from './Message';
import { IUser } from '../../contexts/userContext';
import { clsx } from '../../utils/clsx';
import { Tab } from '@headlessui/react';

const removeInput = new Event('remove-input');
const addInput = new Event('add-input');

const ChatRoom: React.FC<{ user: IUser; sendMessage: any }> = ({
    user,
    sendMessage
}) => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    const [connectionStatus, setConnectionStatus] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        console.log(inputRef.current);
        inputRef.current?.addEventListener('focus', () =>
            document.dispatchEvent(removeInput)
        );
        inputRef.current?.addEventListener('blur', () =>
            document.dispatchEvent(addInput)
        );
    }, [inputRef.current]);

    const appendMessage = (e: any) => {
        let chatMessage = e.detail;

        let newMessage: IMessage = {
            message: chatMessage.Message,
            name: chatMessage.UserName,
            id: chatMessage.UserId
        };

        let objDiv = document.getElementById('chat-messages');
        if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;

        setMessages(messages.concat(newMessage));
    };

    const handleConnectionStatus = () => {
        setConnectionStatus(true);
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
        document.addEventListener('ws-chat-message', appendMessage);
        document.addEventListener('user-register', handleConnectionStatus);

        return () => {
            document.removeEventListener('ws-chat-message', appendMessage);
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
                                                key={
                                                    message.name +
                                                    Date.now().toString()
                                                }
                                                message={message}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="">loading...</div>
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
                {/* <Tab.Panel
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
                </Tab.Panel>*/}
            </Tab.Panels>
        </div>
    );
};

export default ChatRoom;
