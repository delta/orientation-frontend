import { faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement } from 'react';
// import { useMediaQuery } from 'react-responsive';
import { AudioRenderer } from './AudioRenderer';
import { DesktopStage } from './desktop/DesktopStage';
import { StageProps } from './StageProps';
import styles from './styles.module.css';

export const StageView = (stageProps: StageProps) => {
    const { room } = stageProps.roomState;

    let mainElement: ReactElement;

    mainElement = <DesktopStage {...stageProps} />;

    return (
        <div className={styles.container}>
            {mainElement}
            {stageProps.roomState.audioTracks.map((track: any) => (
                <AudioRenderer key={track.sid} track={track} isLocal={false} />
            ))}

            {room?.canPlaybackAudio === false && (
                <div className={styles.overlay}>
                    <button
                        className={styles.unmuteButton}
                        onClick={() => {
                            room.startAudio();
                        }}
                    >
                        <FontAwesomeIcon
                            className={styles.icon}
                            size="1x"
                            icon={faVolumeMute}
                        />
                        Click to Unmute
                    </button>
                </div>
            )}
        </div>
    );
};
