import { ConnectOptions, Participant, Room } from 'livekit-client';
import React, { useEffect } from 'react';
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
    const roomState = useRoom({ sortParticipants });
    if (!connectOptions) {
        connectOptions = {};
    }
    if (adaptiveVideo) {
        connectOptions.autoManageVideo = true;
    }

    useEffect(() => {
        roomState.connect(url, token, connectOptions).then((room) => {
            if (!room) {
                return;
            }
            if (onConnected) {
                //User limit
                if (room.participants.size >= 10) {
                    queuefunc(room.participants.size);
                }
                onConnected(room);
            }
            return () => {
                room.disconnect();
            };
        });
    }, [connectOptions, onConnected, queuefunc, roomState, token, url]);

    const selectedStageRenderer = stageRenderer ?? StageView;

    return selectedStageRenderer({
        roomState,
        participantRenderer,
        controlRenderer,
        onLeave
    });
};
