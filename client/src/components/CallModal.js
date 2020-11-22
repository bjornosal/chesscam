import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const StyledCallModal = styled.div`
  position: fixed;
  width: 600px;
  padding: 50px;
  left: calc(50vw - 350px);
  top: calc(50vh - 60px);
  text-align: center;
  background-color: var(--main-bg-color);
  display: ${(props) => (props.active ? "block" : "none")};
  z-index: ${(props) => (props.active ? 9999 : "")};
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
`;

const StyledIncomingCallButton = styled.button`
  padding: 1em;
  background-color: var(--secondary-color);
  margin: 0.1em;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 24px;
  box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.1);
  transition: 0.5s ease;
  :hover {
    border: 2px solid var(--main-bg-color);
    cursor: pointer;
    box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.4);
    transition: 0.5s ease;
  }
`;

function CallModal({ status, callFrom, startCall, rejectCall }) {
  const acceptWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };

  return (
    <StyledCallModal active={status} className={`call-modal `}>
      <p>
        <span className="caller" style={{ fontSize: "2em" }}>{`${
          callFrom || "Barnebarnet ditt"
        } ringer`}</span>
      </p>
      <StyledIncomingCallButton type="button" onClick={acceptWithVideo(true)}>
        <FontAwesomeIcon icon={faVideo} size="2x"/>
      </StyledIncomingCallButton>
      <StyledIncomingCallButton
        type="button"
        onClick={acceptWithVideo(false)}
      >
        <FontAwesomeIcon icon={faPhone} size="2x" />
      </StyledIncomingCallButton>
      <StyledIncomingCallButton
        type="button"
        className="hangup"
        onClick={rejectCall}
        style={{ backgroundColor: "red" }}
      >
        <FontAwesomeIcon icon={faPhone} size="2x" />
      </StyledIncomingCallButton>
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
