import { ConnectOptions, Participant, Room } from 'livekit-client';
import React, { useEffect, useState } from 'react';
import { ControlsProps } from './ControlsView';
import { ParticipantProps } from './ParticipantView';
import { StageProps } from './StageProps';
import { StageView } from './StageView';
import { useRoom } from './useRoom';

export interface RoomProps {
    url: string;
    token: string;
    connectOptions?: ConnectOptions;
    // override default participant sort
    sortParticipants?: (participants: Participant[]) => void;
    /**
     * when set to true, optimize bandwidth (and room capacity) by
     * * disabling receiving video when participant is hidden
     * * use lower quality video when participant is displayed as thumbnail
     */
    adaptiveVideo?: Boolean;
    // when first connected to room
    onConnected?: (room: Room) => void;
    // when user leaves the room
    onLeave?: (room: Room) => void;
    stageRenderer?: (props: StageProps) => React.ReactElement | null;
    participantRenderer?: (
        props: ParticipantProps
    ) => React.ReactElement | null;
    controlRenderer?: (props: ControlsProps) => React.ReactElement | null;
    queuefunc: (size: number) => void;
}

export const LiveKitRoom = ({
    url,
    token,
    connectOptions,
    sortParticipants,
    stageRenderer,
    participantRenderer,
    controlRenderer,
    onConnected,
    onLeave,
    queuefunc,
    adaptiveVideo
}: RoomProps) => {
    console.log('LiveKitRoom');
    const roomState = useRoom({ sortParticipants });
    if (!connectOptions) {
        connectOptions = {};
    }
    if (adaptiveVideo) {
        connectOptions.autoManageVideo = true;
    }
    const [value, setValue] = useState(0); // integer state
    const forceUpdate = () => {
        setValue((value) => value + 1);
    };
    useEffect(() => {
        console.log('running connect');
        roomState.connect(url, token, connectOptions).then((room) => {
            if (!room) {
                return;
            }
            if (onConnected) {
                //User limit
                if (room.participants.size >= 10) {
                    queuefunc(room.participants.size);
                }
                const roomCreateEvent = new CustomEvent<any>(
                    'vc-room-created',
                    {
                        detail: {
                            room: room,
                            forceUpdate: forceUpdate
                        }
                    }
                );
                document.dispatchEvent(roomCreateEvent);
                onConnected(room);
            }
            return () => {
                room.disconnect();
            };
        });
    }, [value]);

    const selectedStageRenderer = stageRenderer ?? StageView;

    return selectedStageRenderer({
        roomState,
        participantRenderer,
        controlRenderer,
        onLeave
    });
};
