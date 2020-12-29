import React, { useEffect, useState } from "react";
import PeerConnection from "../socket/PeerConnection";
import CallWindow from "./CallWindow";
import CallModal from "./CallModal";
import CallPage from "./CallPage";
import socket from "../socket/socket";

let pc = {};

export const MainPage = () => {
  const [clientId, setClientId] = useState("gamle drops");
  const [callWindowActive, setCallWindowActive] = useState(false);
  const [callModalActive, setCallModalActive] = useState(false);
  const [callFrom, setCallFrom] = useState("");
  const [localSource, setLocalSource] = useState(null);
  const [peerSource, setPeerSource] = useState(null);
  const [config, setConfig] = useState({});

  useEffect(() => {
    socket
      .on("init", ({ id: clientId }) => {
        setClientId(clientId);
      })
      .on("request", ({ from: callFrom }) => {
        setCallModalActive(true);
        setCallFrom(callFrom);
      })
      .on("call", (data) => {
        if (data.sdp) {
          pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === "offer") pc.createAnswer();
        } else {
          pc.addIceCandidate(data.candidate);
        }
      })
      .on("end", () => {
        endCall();
      })
      .emit("init");
  }, []);

  const startCall = (isCaller, friendID, config) => {
    setConfig(config);
    pc = new PeerConnection(friendID)
      .on("localStream", (src) => {
        if (!isCaller) {
          setCallModalActive(false);
        }
        setCallWindowActive(true);
        setLocalSource(src);
      })
      .on("peerStream", (src) => {
        setPeerSource(src);
      })
      .start(isCaller, config);
  };

  const rejectCall = () => {
    socket.emit("end", { to: callFrom });
    setCallModalActive(false);
  };

  const endCall = (isStarter) => {
    // if (_.isFunction(this.pc.stop)) {
    pc.stop(isStarter);
    // }
    pc = {};
    setConfig({});
    setPeerSource(null);
    setLocalSource(null);
    setCallWindowActive(false);
    setCallModalActive(false);
  };

  return (
    <div>
      {(!callWindowActive && (
        <CallPage startCall={startCall} clientId={clientId} />
      )) ||
        (Object.keys(config).length !== 0 && (
          <CallWindow
            active={callWindowActive}
            localSrc={localSource}
            peerSrc={peerSource}
            config={config}
            mediaDevice={pc.mediaDevice}
            endCall={endCall}
          />
        ))}
      <CallModal
        status={callModalActive}
        startCall={startCall}
        rejectCall={rejectCall}
        callFrom={callFrom}
      />
    </div>
  );
};
