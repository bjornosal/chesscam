import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
const StartGamePage = ({ startCall, clientId }) => {
  const [friendID, setFriendID] = useState(null);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

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
        <h4>Kom igang med å ringe din besteforelder/ditt barnebarn</h4>
      </div>
      <div>
        <input
          type="text"
          className="txt-clientId"
          spellCheck={false}
          placeholder="Din mormors ID"
          onChange={(event) => {
            setFriendID(event.target.value);
          }}
        />
        <div>
          <button
            type="button"
            className=" fa fa-video-camera"
            onClick={callWithVideo(true)}
          >
            <FontAwesomeIcon icon={faVideo} />
          </button>
          <button
            type="button"
            className=" fa fa-phone"
            onClick={callWithVideo(false)}
          >
            <FontAwesomeIcon icon={faPhone} />
          </button>
        </div>
      </div>
    </div>
  );
};

StartGamePage.propTypes = {
  clientId: PropTypes.number.isRequired,
  startCall: PropTypes.func.isRequired,
};

export default StartGamePage;
