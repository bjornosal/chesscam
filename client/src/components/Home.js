import React, { useEffect, useState } from 'react';
import PeerConnection from '../socket/PeerConnection';
import CallWindow from './CallWindow';
import CallModal from './CallModal';
import StartGamePage from './StartGamePage';
import socket from '../socket/socket';

export const Home = () => {
    const [clientId, setClientId] = useState(-1);
    const [callWindow, setCallWindow] = useState('');
    const [callModal, setCallModal] = useState('');
    const [callFrom, setCallFrom] = useState('');
    const [localSource, setLocalSource] = useState(null);
    const [peerSource, setPeerSource] = useState(null);
    const [config, setConfig] = useState({});
    const [pc, setPc] = useState({});

    useEffect(() => {
        socket
            .on('init', ({ id: clientId }) => {
                console.log('init');
                document.title = `${clientId} - Video`;
                setClientId(clientId);
            })
            .on('request', ({ from: callFrom }) => {
                setCallModal('active');
                console.log('from: ', callFrom);
                setCallFrom(callFrom);
            })
            .on('call', (data) => {
                if (data.sdp) {
                    pc.setRemoteDescription(data.sdp);
                    if (data.sdp.type === 'offer') pc.createAnswer();
                } else {
                    pc.addIceCandidate(data.candidate);
                }
            })
            .on('end', () => {
                console.log('Ending');
                endCall();
            })
            .emit('init');
    }, []);

    const startCall = (isCaller, friendID, config) => {
        console.log('friend ' + friendID);
        setConfig(config);
        let pc = new PeerConnection(friendID)
            .on('localStream', (src) => {
                if (!isCaller) {
                    setCallModal('');
                }
                setCallWindow('active');
                setLocalSource(src);
            })
            .on('peerStream', (src) => setPeerSource(src))
            .start(isCaller, config);
        setPc(pc);
    };

    const rejectCall = () => {
        socket.emit('end', { to: callFrom });
        setCallModal('');
    };

    const endCall = (isStarter) => {
        // if (_.isFunction(this.pc.stop)) {
        pc.stop(isStarter);
        // }
        pc = {};
        setConfig({});
        setPeerSource(null);
        setLocalSource(null);
        setCallWindow('');
        setCallModal('');
    };

    console.log('pc', pc);
    return (
        <div>
            <StartGamePage startCall={startCall} clientId={clientId} />
            {Object.keys(config).length !== 0 && (
                <CallWindow
                    status={callWindow}
                    localSrc={localSource}
                    peerSrc={peerSource}
                    config={config}
                    mediaDevice={pc.mediaDevice}
                    endCall={endCall}
                />
            )}
            <CallModal
                status={callModal}
                startCall={() => startCall}
                rejectCall={rejectCall}
                callFrom={callFrom}
            />
        </div>
    );
};
