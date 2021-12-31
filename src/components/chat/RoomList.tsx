import React from 'react';

const RoomList: React.FC<{
    chatRooms: string[];
    currentRoom: string;
    setCurrentRoom: any;
}> = ({ chatRooms, currentRoom, setCurrentRoom }) => {
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
            <div className="flex-grow border-b border-black"></div>
        </div>
    );
};

export default RoomList;
