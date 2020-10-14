import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const StyledCallModal = styled.div`
    position: absolute;
    width: 400px;
    padding: 20px;
    left: calc(50vw - 200px);
    top: calc(50vh - 60px);
    text-align: center;
    background-color: blue;
    display: ${props => props.active ? "block" : "none"};
    z-index: ${props => props.active ? 9999 : ''};
`;

// TODO: Rewrite to aria friendly modal
function CallModal({ status, callFrom, startCall, rejectCall }) {
    const acceptWithVideo = (video) => {
        const config = { audio: true, video };
        return () => startCall(false, callFrom, config);
    };

    return (
        <StyledCallModal active={status} className={`call-modal `}>
            <p>
                <span className="caller">{`${callFrom} ringer`}</span>
            </p>
            <button type="button" onClick={acceptWithVideo(true)}>
                <FontAwesomeIcon icon={faVideo} />
            </button>
            <button
                type="button"
                onClick={acceptWithVideo(false)}
                style={{ backgroundColor: 'green' }}
            >
                <FontAwesomeIcon icon={faPhone} />
            </button>
            <button
                type="button"
                className="hangup"
                onClick={rejectCall}
                style={{ backgroundColor: 'red' }}
            >
                <FontAwesomeIcon icon={faPhone} />
            </button>
        </StyledCallModal>
    );
}

CallModal.propTypes = {
    status: PropTypes.bool.isRequired,
    callFrom: PropTypes.string.isRequired,
    startCall: PropTypes.func.isRequired,
    rejectCall: PropTypes.func.isRequired,
};

export default CallModal;
