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
  position: absolute;
  background-color: #ffdab9;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
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
      <button type="button" onClick={() => socket.emit("start")}>
        Start a chessgame
      </button>
      <Board />
      <video
        id="peerVideo"
        ref={peerVideo}
        autoPlay
        style={{ width: "200px" }}
      />
      <video
        id="localVideo"
        ref={localVideo}
        autoPlay
        muted
        style={{ width: "200px" }}
      />
      <div className="video-control">
        <button
          key="btnVideo"
          type="button"
          className={getButtonClass("fa-video-camera", video)}
          onClick={() => toggleMediaDevice("video")}
        >
          <FontAwesomeIcon icon={faVideo} />
        </button>
        <button
          key="btnAudio"
          type="button"
          className={getButtonClass("fa-microphone", audio)}
          onClick={() => toggleMediaDevice("audio")}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
        <button type="button" className="hangup" onClick={() => endCall(true)}>
          <FontAwesomeIcon icon={faPhone} />
        </button>
      </div>
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
