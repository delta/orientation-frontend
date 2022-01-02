import { Room } from 'livekit-client';
import { ReactElement } from 'react';
// import { useParticipant } from './useParticipant';
import { AudioSelectButton } from './AudioSelectButton';
import { ControlButton } from './ControlButton';
import styles from './styles.module.css';
import { VideoSelectButton } from './VideoSelectButton';
import { useHistory } from 'react-router-dom';

export interface ControlsProps {
    room: Room;
    enableScreenShare?: boolean;
    enableAudio?: boolean;
    enableVideo?: boolean;
    onLeave?: (room: Room) => void;
    reRender: () => void;
}

export const ControlsView = ({
    room,
    enableScreenShare,
    enableAudio,
    enableVideo,
    onLeave,
    reRender
}: ControlsProps) => {
    // const { unpublishTrack } = useParticipant(room.localParticipant);

    const history = useHistory();
    if (enableScreenShare === undefined) {
        enableScreenShare = true;
    }
    if (enableVideo === undefined) {
        enableVideo = true;
    }
    if (enableAudio === undefined) {
        enableAudio = true;
    }

    let muteButton: ReactElement | undefined;
    if (enableAudio) {
        const enabled = room.localParticipant.isMicrophoneEnabled;
        muteButton = (
            <AudioSelectButton
                isMuted={!enabled}
                onClick={() =>
                    room.localParticipant.setMicrophoneEnabled(!enabled)
                }
                onSourceSelected={(device) =>
                    room.switchActiveDevice('audioinput', device.deviceId)
                }
            />
        );
    }

    let videoButton: ReactElement | undefined;
    if (enableVideo) {
        const enabled = room.localParticipant.isCameraEnabled;
        videoButton = (
            <VideoSelectButton
                isEnabled={enabled}
                onClick={() => room.localParticipant.setCameraEnabled(!enabled)}
                onSourceSelected={(device) => {
                    room.switchActiveDevice('videoinput', device.deviceId);
                }}
            />
        );
    }

    return (
        <div className={styles.controlsWrapper}>
            {muteButton}
            {videoButton}
            <ControlButton
                label="End"
                className={styles.dangerButton}
                onClick={() => {
                    room.disconnect();
                    reRender();
                }}
            />
        </div>
    );
};
