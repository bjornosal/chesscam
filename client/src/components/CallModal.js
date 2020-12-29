import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const CallButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledIncomingCallButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  background-color: var(--secondary-color);
  margin: 0.1em;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.1);
  transition: 0.5s ease;
  flex: 1 1 0px;

  p {
    color: #fff;
    font-weight: bold;
    font-size: 1.5em;
  }

  :hover {
    border: 2px solid var(--main-bg-color);
    box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.4);
    transition: 0.5s ease;
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    width: 80%;
  }
`;

function CallModal({ status, callFrom, startCall, rejectCall }) {
  const acceptWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };

  return (
    <Modal
      isOpen={status}
      ariaHideApp={true}
      style={{
        overlay: {},
        content: {
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.75)",
          padding: "50px",
          textAlign: "center",
        },
      }}
    >
      <p>
        <span className="caller" style={{ fontSize: "2em" }}>{`${
          callFrom || "Barnebarnet ditt"
        } ringer`}</span>
      </p>
      <CallButtonContainer>
        <StyledIncomingCallButton type="button" onClick={acceptWithVideo(true)}>
          <FontAwesomeIcon icon={faVideo} size="3x" />
          <p>Svar med video</p>
        </StyledIncomingCallButton>
        <StyledIncomingCallButton
          type="button"
          onClick={acceptWithVideo(false)}
        >
          <FontAwesomeIcon icon={faPhone} size="3x" />
          <p>Svar uten video</p>
        </StyledIncomingCallButton>
        <StyledIncomingCallButton
          type="button"
          className="hangup"
          onClick={rejectCall}
          style={{ backgroundColor: "red" }}
        >
          <FontAwesomeIcon icon={faPhone} size="3x" />
          <p>Avslå anrop</p>
        </StyledIncomingCallButton>
      </CallButtonContainer>
    </Modal>
  );
}

CallModal.propTypes = {
  status: PropTypes.bool.isRequired,
  callFrom: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
  rejectCall: PropTypes.func.isRequired,
};

export default CallModal;
