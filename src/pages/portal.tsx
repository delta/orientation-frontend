import { Dialog, Transition } from '@headlessui/react';
import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { MiniGame2048 } from '../components/modal/MiniGame2048';
import { config } from '../config/config';
import { clsx } from '../utils/clsx';
import { Modal } from '../components/modal';
import { DuplicateWSConnectionError } from '../components/modal/DuplicateWs';

type AllowedPortals = 'minigame/2048' | 'hello-world' | 'ws-already-connected';

interface AsyncFunc {
    (url: string, game_name: string, score: number): Promise<void>;
}

type HighscoreWasmType = {
    send_score: AsyncFunc | null;
};

export const Portal = () => {
    const [currentMethod, setCurrentMethod] = useState<AllowedPortals | null>();
    const [open, setOpen] = useState(false);

    const setCurrentMethodEventHandler = (event: any) => {
        process.env.NODE_ENV === 'development' && console.log(event.detail);
        setCurrentMethod(event.detail);
        setOpen(true);
    };

    const alreadyConnectedEventHandler = async (event: any) => {
        setCurrentMethod('ws-already-connected');
        setOpen(true);
    };

    useEffect(() => {
        document.addEventListener(
            'portal-listener',
            setCurrentMethodEventHandler
        );

        document.addEventListener(
            'ws-already-connected',
            alreadyConnectedEventHandler
        );
        return () => {
            document.addEventListener(
                'portal-listener',
                setCurrentMethodEventHandler
            );
            document.removeEventListener(
                'ws-already-connected',
                alreadyConnectedEventHandler
            );
        };
    }, []);

    const el = document.getElementById('modal');
    const [send, setSend] = useState<HighscoreWasmType>({ send_score: null });

    const getTitle = useMemo(() => {
        if (currentMethod === 'minigame/2048') {
            return '2048';
        }

        if (currentMethod === 'hello-world') {
            return 'hello world';
        }
        if (currentMethod === 'ws-already-connected') {
            return (
                <span className={clsx('text-2xl font-medium text-red-600')}>
                    Duplicate Connection Detected
                </span>
            );
        }
        return '';
    }, [currentMethod]);

    const getPortalData = useMemo(() => {
        if (currentMethod === 'minigame/2048') {
            return <MiniGame2048 />;
        }

        if (currentMethod === 'hello-world') {
            return <Modal />;
        }

        if (currentMethod === 'ws-already-connected') {
            return <DuplicateWSConnectionError />;
        }

        return null;
    }, [currentMethod]);

    useEffect(() => {
        const init = async () => {
            const wasm = await import('highscore-wasm');
            setSend(wasm);
        };
        init();
    }, []);

    useEffect(() => {
        // a handler to communicate with between react app and phaser game
        if (send === null || send.send_score === null) return;
        else {
            const handler = async (event: MessageEvent<any>) => {
                /**
                 * MESSAGE FORMAT
                 * source - "modal-iframe"
                 * message - any
                 * error - any
                 */
                if (event.data.source !== 'modal-iframe') return;
                process.env.NODE_ENV === 'development' &&
                    console.log(event.data);

                if (event.data.type === 'highscore') {
                    process.env.NODE_ENV === 'development' &&
                        console.log(
                            `user requested for updating\n Game: ${event.data.name} \n New Score : ${event.data.value}`
                        );

                    if (isNaN(event.data.value)) {
                        console.error('Score is not a number');
                    }

                    // Send the data to backend
                    // @ts-ignore
                    const res = await send.send_score(
                        config.backendOrigin + '/api/addscore',
                        event.data.name,
                        event.data.value
                    );
                    console.log(res);
                }

                // const data = JSON.parse(event.data);
            };

            /**
             * MESSAGE FORMAT
             * source - "modal-iframe"
             * message - any
             * error - any
             */
            window.addEventListener('message', handler);

            return () => window.removeEventListener('message', handler);
        }
    }, [send]);

    function closeModal() {
        setOpen(false);
    }

    if (!el) return null;

    return createPortal(
        <>
            <Transition appear show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div
                                className={clsx(
                                    'inline-block w-full max-w-max p-6 my-8 bg-white shadow-xl rounded-2xl',
                                    'overflow-hidden text-left align-middle',
                                    'transition-all transform'
                                )}
                            >
                                <Dialog.Title>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 inline-block">
                                        {getTitle}
                                    </h3>
                                    <span
                                        className="float-right text-base"
                                        style={
                                            {
                                                // transform: 'translateY(-5px)'
                                            }
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            cursor="pointer"
                                            onClick={closeModal}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </span>
                                </Dialog.Title>
                                <div className="mt-2">{getPortalData}</div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>,
        el
    );
};
