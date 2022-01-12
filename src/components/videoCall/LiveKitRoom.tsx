import { ConnectOptions, Participant, Room } from 'livekit-client';
import React, { useEffect, useState } from 'react';
import { ControlsProps } from './ControlsView';
import { ParticipantProps } from './ParticipantView';
import { StageProps } from './StageProps';
import { StageView } from './StageView';
import { useRoom } from './useRoom';
import { useToast } from '../toast/ToastProvider';

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
    queuefunc: () => void;
    reRender: () => void;
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
    // queuefunc,
    adaptiveVideo,
    reRender
}: RoomProps) => {
    console.log('LiveKitRoom');
    const roomState = useRoom({ sortParticipants });
    if (!connectOptions) {
        connectOptions = {};
    }
    if (adaptiveVideo) {
        connectOptions.autoManageVideo = true;
    }
    const [value] = useState(0); // integer state
    // const forceUpdate = () => {
    //     setValue((value) => value + 1);
    // };
    const toast = useToast();

    useEffect(() => {
        console.log('running connect');
        roomState.connect(url, token, connectOptions).then((room) => {
            if (!room) {
                return;
            }
            if (onConnected) {
                //User limit
                if (room.participants.size >= 10) {
                    toast?.pushError('Sorry call limit reached');
                    room.disconnect();
                }

                onConnected(room);
            }
            return () => {
                room.disconnect();
            };
        });
        // eslint-disable-next-line
    }, [value]);

    const selectedStageRenderer = stageRenderer ?? StageView;

    return selectedStageRenderer({
        roomState,
        participantRenderer,
        controlRenderer,
        onLeave,
        reRender
    });
};
