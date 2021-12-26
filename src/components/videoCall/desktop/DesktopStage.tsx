import { Track, VideoTrack } from 'livekit-client';
import React, { ReactElement, useState, useEffect } from 'react';
import { ControlsView } from '../ControlsView';
import { ParticipantView } from '../ParticipantView';
import { ScreenShareView } from '../ScreenShareView';
import { StageProps } from '../StageProps';
import styles from './styles.module.css';

export const DesktopStage = ({
    roomState,
    participantRenderer,
    controlRenderer,
    onLeave
}: StageProps) => {
    const { isConnecting, error, participants, room } = roomState;
    const [showOverlay, setShowOverlay] = useState(false);
    const [centreVideo, changeCentre] = useState(<></>);
    const [enter, changeEnter] = useState(0);
    if (error) {
        return <div>error {error.message}</div>;
    }

    if (isConnecting) {
        return <div>connecting</div>;
    }
    if (!room) {
        return <div>room closed</div>;
    }

    if (participants.length === 0) {
        return <div>no one is in the room</div>;
    }

    const ParticipantRenderer = participantRenderer ?? ParticipantView;
    const ControlRenderer = controlRenderer ?? ControlsView;
    // find first participant with screen shared
    let screenTrack: VideoTrack | undefined;
    participants.forEach((p: any) => {
        if (screenTrack) {
            return;
        }
        const track = p.getTrack(Track.Source.ScreenShare);
        if (track?.isSubscribed && track.videoTrack) {
            screenTrack = track.videoTrack;
        }
    });
    const otherParticipants = participants;
    const spotlight = (e: any) => {
        console.log(e.target.id);
        let curMain = otherParticipants.find(
            (p: any) => p.identity == e.target.id
        );
        if (curMain) {
            setShowOverlay(false);
            changeCentre(
                <ParticipantRenderer
                    key={curMain.identity}
                    participant={curMain}
                    width="100%"
                    height="100%"
                    orientation="landscape"
                    showOverlay={!showOverlay}
                    onMouseEnter={() => setShowOverlay(true)}
                    onMouseLeave={() => setShowOverlay(false)}
                />
            );
            changeEnter(1);
        }
    };

    let mainView: ReactElement;
    if (screenTrack) {
        mainView = (
            <ScreenShareView track={screenTrack} height="100%" width="100%" />
        );
    } else {
        mainView = (
            <ParticipantRenderer
                key={participants[0].identity}
                participant={participants[0]}
                width="100%"
                height="100%"
                orientation="landscape"
                showOverlay={showOverlay}
                onMouseEnter={() => setShowOverlay(true)}
                onMouseLeave={() => setShowOverlay(false)}
            />
        );
    }

    return (
        // global container
        <div className={styles.container}>
            <div className={styles.stage}>
                <div className={styles.leftSidebar}>
                    {otherParticipants.length > 5 ? (
                        otherParticipants.slice(5).map((participant: any) => {
                            return (
                                <ParticipantRenderer
                                    key={participant.identity}
                                    participant={participant}
                                    width="100%"
                                    aspectWidth={16}
                                    aspectHeight={9}
                                    showOverlay={showOverlay}
                                    onMouseEnter={() => setShowOverlay(true)}
                                    onMouseLeave={() => setShowOverlay(false)}
                                    onClick={spotlight}
                                />
                            );
                        })
                    ) : (
                        <></>
                    )}
                </div>
                <div className={styles.stageCenter}>
                    {enter == 0 ? mainView : centreVideo}
                </div>
                <div className={styles.sidebar}>
                    {otherParticipants.slice(0, 5).map((participant: any) => {
                        return (
                            <ParticipantRenderer
                                key={participant.identity}
                                participant={participant}
                                width="100%"
                                aspectWidth={16}
                                aspectHeight={9}
                                showOverlay={showOverlay}
                                onMouseEnter={() => setShowOverlay(true)}
                                onMouseLeave={() => setShowOverlay(false)}
                                onClick={spotlight}
                            />
                        );
                    })}
                </div>
            </div>
            <div className={styles.controlsArea}>
                <ControlRenderer room={room} onLeave={onLeave} />
            </div>
        </div>
    );
};
