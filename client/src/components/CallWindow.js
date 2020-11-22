import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faPhone,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Board } from "./Board";
import socket from "../socket/socket";

const StyledCallWindow = styled.div`
  background-color: var(--main-bg-color);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-evenly;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledPeerVideo = styled.video`
  width: 25em;
  padding-bottom: 1em;
`;

const MyVideo = styled.video`
  width: 10em;
  align-self: flex-end;
`;

const StyledCallButton = styled.button`
  padding: 1em;
  background-color: var(--secondary-color);
  margin: 0.1em;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 2px;
  box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.1);
  transition: 0.5s ease;
  :hover {
    border: 2px solid var(--main-bg-color);
    cursor: pointer;
    box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.4);
    transition: 0.5s ease;
  }
`;

const StyledGameButton = styled.button`
  width: 40%;
  align-self: center;
`;

const getButtonClass = (icon, enabled) => {
  return ` fa ${icon}`, { disable: !enabled };
};

function CallWindow({
  peerSrc,
  localSrc,
  config,
  mediaDevice,
  active,
  endCall,
}) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;

    socket.on("start", () => {
      setStarted(true);
    });
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle("Video", video);
      mediaDevice.toggle("Audio", audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === "video") {
      setVideo(!video);
      mediaDevice.toggle("Video");
    }
    if (deviceType === "audio") {
      setAudio(!audio);
      mediaDevice.toggle("Audio");
    }
  };

  return (
    <StyledCallWindow active={active} className={"call-window"}>
      <GameContainer>
        <Board />
        {!started && (
          <StyledGameButton type="button" onClick={() => socket.emit("start")}>
            Start et spill!
          </StyledGameButton>
        )}
      </GameContainer>
      <ChatContainer>
        <StyledPeerVideo id="peerVideo" ref={peerVideo} autoPlay />
        <MyVideo id="localVideo" ref={localVideo} autoPlay muted />
        <div className="video-control">
          <StyledCallButton
            key="btnVideo"
            type="button"
            className={getButtonClass("fa-video-camera", video)}
            onClick={() => toggleMediaDevice("video")}
          >
            <FontAwesomeIcon icon={faVideo} />
          </StyledCallButton>
          <StyledCallButton
            key="btnAudio"
            type="button"
            className={getButtonClass("fa-microphone", audio)}
            onClick={() => toggleMediaDevice("audio")}
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </StyledCallButton>
          <StyledCallButton
            type="button"
            className="hangup"
            onClick={() => endCall(true)}
            style={{ backgroundColor: "red" }}
          >
            <FontAwesomeIcon icon={faPhone} />
          </StyledCallButton>
        </div>
      </ChatContainer>
    </StyledCallWindow>
  );
}

CallWindow.propTypes = {
  active: PropTypes.bool.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired,
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
};

export default CallWindow;
