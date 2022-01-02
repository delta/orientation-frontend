import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIcons } from '@fortawesome/free-solid-svg-icons';
import { clsx } from '../../utils/clsx';
import { Tab } from '@headlessui/react';

const RoomList: React.FC<{
    chatRooms: string[];
    currentRoom: string;
    setCurrentRoom: any;
    toggleVc: (option: string) => void;
}> = ({ chatRooms, currentRoom, setCurrentRoom, toggleVc }) => {
    return (
        <div className="">
            {/* {chatRooms.map((roomName, index) => (
                <div
                    key={roomName + index}
                    className={clsx(
                        'w-20 truncate flex flex-row items-center p-2 border-r-2',
                        'cursor-pointer text-lg',
                        roomName === currentRoom
                            ? 'font-medium bg-accent1'
                            : 'border-b bg-orange-300'
                    )}
                    onClick={() => setCurrentRoom(roomName)}
                >
                    Users
                </div>
            ))} */}
            <Tab.List className="flex space-x-1 bg-blue-900/20 rounded-xl p-4 pr-6">
                <Tab
                    key="chat"
                    className={({ selected }) =>
                        clsx(
                            'w-full py-2.5 leading-5 font-medium rounded-t-xl rounded-b-sm text-lg',
                            selected
                                ? 'bg-base shadow  text-text'
                                : ' text-text hover:text-text bg-background hover:bg-accent2'
                        )
                    }
                >
                    Game
                </Tab>
                <Tab
                    key="users"
                    className={({ selected }) =>
                        clsx(
                            'w-full py-2.5 leading-5 font-medium rounded-t-xl rounded-b-sm text-lg',
                            selected
                                ? 'bg-base shadow  text-text'
                                : ' text-text hover:text-text bg-background hover:bg-accent2'
                        )
                    }
                >
                    Users
                </Tab>
            </Tab.List>
            {/* <div
                className={'w-10 truncate flex flex-row justify-center items-center p-2 border-b border-black cursor-pointer font-bold text-2xl bg-orange-300'}>
                    +
            </div> */}
            <FontAwesomeIcon
                onClick={() => toggleVc('close')}
                style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '10',
                    fontSize: '20px',
                    marginTop: '5px'
                }}
                icon={faTimes}
            />

            <div className="flex-grow border-b border-black"></div>
            {/* <div className="flex-grow border-b border-black"></div> */}
        </div>
    );
};

export default RoomList;
