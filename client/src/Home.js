import React, { useEffect, useState } from "react";
import io from "socket.io-client";

export const Home = () => {
    const socket = io({ path: "/bridge" });
    const [clientId, setClientId] = useState(-1);
    useEffect(() => {
        socket
            .on("init", ({ id: clientId }) => {
                console.log("init");
                document.title = `${clientId} - Video`;
                setClientId(clientId);
            })
            .on("request", ({ from: callFrom }) => {
                // this.setState({ callModal: "active", callFrom });
            })
            .on("call", (data) => {
                if (data.sdp) {
                    // this.pc.setRemoteDescription(data.sdp);
                    if (data.sdp.type === "offer") this.pc.createAnswer();
                } else {
                    // this.pc.addIceCandidate(data.candidate);
                }
            })
            .on("end", () => {
                console.log("end client");
            })
            .emit("init");
    }, []);
    return <div>{clientId}</div>;
};
