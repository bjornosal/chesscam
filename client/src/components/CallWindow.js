import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faPhone,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Board } from "./Board";
import socket from "../socket/socket";

const StyledCallWindow = styled.div`
  background-color: var(--main-bg-color);
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-evenly;
  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
    height: 90vh;
  }
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  @media only screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column-reverse;
  }
`;

const MyInfoContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  width: 80%;
  margin-top: 5px;

  @media only screen and (max-width: 768px) {
    margin-bottom: 2px;
  }
`;

const StyledPeerVideo = styled.video`
  width: 80%;
  padding-bottom: 1em;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.4);
  @media only screen and (max-width: 768px) {
    width: 90%;
  }
`;

const MyVideo = styled.video`
  width: 30%;
  align-self: flex-end;
  border: 1px solid rgba(0, 0, 0, 0.4);
  margin: 1px;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.4);
  @media only screen and (max-width: 768px) {
    background-color: transparent;
    border: none;
  }
`;

const VideoControl = styled.div`
  align-self: flex-end;
`;

const StyledCallButton = styled.button`
  padding: 2em;
  background-color: ${(props) =>
    props.active ? "var(--secondary-color)" : "red"};
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

  @media only screen and (max-width: 768px) {
    padding: 1em;
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
        <Board started={started} />
        {!started && (
          <StyledGameButton type="button" onClick={() => socket.emit("start")}>
            Start et spill!
          </StyledGameButton>
        )}
      </GameContainer>
      <ChatContainer>
        <StyledPeerVideo id="peerVideo" ref={peerVideo} autoPlay />
        <MyInfoContainer>
          <MyVideo id="localVideo" ref={localVideo} autoPlay muted />
          <VideoControl>
            <StyledCallButton
              key="btnVideo"
              type="button"
              className={getButtonClass("fa-video-camera", video)}
              onClick={() => toggleMediaDevice("video")}
              active={video}
            >
              <FontAwesomeIcon
                icon={video ? faVideo : faVideoSlash}
                style={{ transform: "scale(2)" }}
              />
            </StyledCallButton>
            <StyledCallButton
              key="btnAudio"
              type="button"
              className={getButtonClass("fa-microphone", audio)}
              onClick={() => toggleMediaDevice("audio")}
              active={audio}
            >
              <FontAwesomeIcon
                icon={audio ? faMicrophone : faMicrophoneSlash}
                style={{ transform: "scale(2)" }}
              />
            </StyledCallButton>
            <StyledCallButton
              type="button"
              className="hangup"
              onClick={() => endCall(true)}
              style={{ backgroundColor: "red" }}
            >
              <FontAwesomeIcon
                icon={faPhone}
                style={{ transform: "scale(2)" }}
              />
            </StyledCallButton>
          </VideoControl>
        </MyInfoContainer>
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
