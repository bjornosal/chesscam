import React, { useState } from "react";
import PropTypes from "prop-types";

const StartGame = ({ startCall, clientId }) => {
    const [friendID, setFriendID] = useState(null);

    /**
     * Start the call with or without video
     * @param {Boolean} video
     */
    const callWithVideo = (video) => {
        const config = { audio: true, video };
        return () => friendID && startCall(true, friendID, config);
    };
    console.log(`Rendered ${clientId}`);

    return (
        <div className="container main-window">
            <div>
                <h3>
                    Din id er:
                    <input
                        type="text"
                        className="txt-clientId"
                        value={clientId}
                        readOnly
                    />
                </h3>
                <h4>Kom igang med å ringe ditt barnebarn</h4>
            </div>
            <div>
                <input
                    type="text"
                    className="txt-clientId"
                    spellCheck={false}
                    placeholder="Your friend ID"
                    onChange={(event) => {
                        setFriendID(event.target.value);
                    }}
                />
                <div>
                    <button
                        type="button"
                        className="btn-action fa fa-video-camera"
                        onClick={callWithVideo(true)}
                    />
                    <button
                        type="button"
                        className="btn-action fa fa-phone"
                        onClick={callWithVideo(false)}
                    />
                </div>
            </div>
        </div>
    );
};

StartGame.propTypes = {
    clientId: PropTypes.string.isRequired,
    startCall: PropTypes.func.isRequired,
};

export default StartGame;
