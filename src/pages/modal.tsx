import { Dialog, Transition, Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import React, {
    createRef,
    useEffect,
    useRef,
    Fragment,
    useState,
    useContext
} from 'react';
import { createPortal } from 'react-dom';

import { Modal } from '../components/modal';
import { PortalContext } from '../contexts/portalContext';
import { clsx } from '../utils/clsx';

interface ModalProps {
    to: string;
}

const MiniGame2048 = () => {
    return (
        <div>
            <iframe width={45 * 16} height={450} src="/minigames/2048"></iframe>
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button
                            className={clsx(
                                'flex justify-between w-full px-4 py-2 text-sm mt-5',
                                ' font-medium text-left text-black bg-green-100 ',
                                'rounded-lg hover:bg-green-200 focus:outline-none focus-visible:ring',
                                'focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
                            )}
                        >
                            <span>How to play?</span>
                            <ChevronUpIcon
                                className={`${
                                    open ? 'transform rotate-180' : ''
                                } w-5 h-5 text-black`}
                            />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            Use your <strong>arrow keys</strong> to move the
                            tiles. When two tiles with the same number touch,
                            they <strong>merge into one!</strong>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    );
};

export const Portal = ({}: ModalProps) => {
    const portalContext = useContext(PortalContext);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const el = document.getElementById('modal');

    useEffect(() => {
        if (!iframeRef.current) return;

        const handler = (event: any) => {
            /**
             * MESSAGE FORMAT
             * source - modal-iframe
             * message - any
             * error - any
             */
            console.log(event.data);
            // const data = JSON.parse(event.data);
        };

        /**
         * MESSAGE FORMAT
         * source - modal-iframe
         * message - any
         * error - any
         */

        window.addEventListener('message', handler);

        return window.removeEventListener('message', handler);
    }, [iframeRef]);

    const closeModal2 = () => {
        portalContext?.setOpen(false);
    };

    let [isOpen, setIsOpen] = useState(true);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    if (!el) return null;

    return createPortal(
        <>
            <div className="fixed inset-0 flex items-center justify-center">
                <button
                    type="button"
                    onClick={openModal}
                    className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 z-50"
                >
                    Open dialog
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
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
                                    'inline-block w-full max-w-3xl p-6 my-8 bg-white shadow-xl rounded-2xl',
                                    'overflow-hidden text-left align-middle',
                                    'transition-all transform'
                                )}
                            >
                                <Dialog.Title>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 inline-block">
                                        2048
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
                                <div className="mt-2">
                                    <MiniGame2048 />
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>,
        el
    );
};
