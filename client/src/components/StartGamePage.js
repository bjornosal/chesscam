import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const StyledIdContainer = styled.div`
  width: 70vw;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
  background-color: var(--primary-color);
`;

const StyledFriendIdContainer = styled.div`
  width: 40vw;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
  background-color: var(--secondary-color);
`;

const StyledInput = styled.input`
  width: 2em;
  border: none;
  font-size: 3em;
  text-align: ${(props) => props.align};
`;

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
      <h1>Velkomsthilsen</h1>
      <StyledIdContainer>
        <StyledInput
          type="text"
          className="clientId"
          value={clientId}
          readOnly
          align={"right"}
        />
        -
        <StyledInput
          type="text"
          className="clientId"
          value={clientId}
          readOnly
          align={"center"}
        />
        -
        <StyledInput
          type="text"
          className="clientId"
          value={clientId}
          readOnly
          align={"left"}
        />
      </StyledIdContainer>

      <StyledFriendIdContainer>
        <input
          type="text"
          className="clientId"
          spellCheck={false}
          placeholder="Bestemors id"
          onChange={(event) => {
            setFriendID(event.target.value);
          }}
        />
        -
        <input
          type="text"
          className="clientId"
          spellCheck={false}
          placeholder="Bestemors id"
          onChange={(event) => {
            setFriendID(event.target.value);
          }}
        />
        -
        <input
          type="text"
          className="clientId"
          spellCheck={false}
          placeholder="Bestemors id"
          onChange={(event) => {
            setFriendID(event.target.value);
          }}
        />
      </StyledFriendIdContainer>
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
  );
};

StartGamePage.propTypes = {
  clientId: PropTypes.number.isRequired,
  startCall: PropTypes.func.isRequired,
};

export default StartGamePage;
