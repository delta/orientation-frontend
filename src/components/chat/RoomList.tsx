import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIcons } from '@fortawesome/free-solid-svg-icons';

const RoomList: React.FC<{
    chatRooms: string[];
    currentRoom: string;
    setCurrentRoom: any;
    toggleVc: (option: string) => void;
}> = ({ chatRooms, currentRoom, setCurrentRoom, toggleVc }) => {
    return (
        <div className="flex flex-row h-full border-b-4 border-red-400">
            {chatRooms.map((roomName, index) => (
                <div
                    key={roomName + index}
                    className={
                        'w-20 truncate flex flex-row items-center p-2 border-r-2 border-black cursor-pointer ' +
                        (roomName === currentRoom
                            ? 'font-medium bg-red-400'
                            : 'border-b bg-orange-300')
                    }
                    onClick={() => setCurrentRoom(roomName)}
                >
                    {roomName}
                </div>
            ))}
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
        </div>
    );
};

export default RoomList;
