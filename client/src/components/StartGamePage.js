import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const StyledIdContainer = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    font-size: 1em;
  }
`;

const StyledFriendIdContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const StyledInput = styled.input`
  /* TODO: Calculate width according to things */
  border: none;
  border-radius: 10px;
  font-size: 2em;
  text-align: ${(props) => props.align};
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  @media only screen and (max-width: 768px) {
    text-align: center;
    width: 80%;
  }
`;

const StyledLabel = styled.label`
  color: #000;
  font-size: 3rem;
  font-weight: bold;
  @media only screen and (max-width: 768px) {
    font-size: 2.1em;
  }
`;

const StartPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 40em;
  margin: auto;
  width: 60vw;
  border-radius: 24px;
  background-color: var(--primary-color);
  -webkit-box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.4);
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.4);
  @media only screen and (max-width: 768px) {
    height: 80vh;
    width: 90vw;
  }
`;

const StyledCallContainer = styled.div`
  margin: auto;
  font-weight: bold;
`;

const StyledCallButton = styled.button`
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

const StartGamePage = ({ startCall, clientId }) => {
  const [friendID, setFriendID] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

  const greetings = [
    "Hi grandma!",
    "Hei mormor!",
    "Hei bestemor!",
    "Hei farmor!",
    "Hola abuela",
    "Hé grand-mère!",
    "Hey Oma!",
    "Obaasan!",
    "Hej bedstemor!",
  ];

  return (
    <div className="container main-window">
      <h1 style={{ fontSize: "3em" }}>{title}</h1>
      <StartPageContainer>
        <StyledIdContainer>
          <StyledLabel>Din identifikator</StyledLabel>
          <StyledInput
            type="text"
            className="clientId"
            value={clientId}
            readOnly
            align={"center"}
          />
        </StyledIdContainer>

        <StyledFriendIdContainer>
          <StyledLabel>Hvem skal du ringe?</StyledLabel>
          <StyledInput
            type="text"
            className="clientId"
            spellCheck={false}
            placeholder="Bestemors id"
            autoCorrect={false}
            onChange={(event) => {
              setFriendID(event.target.value);
            }}
          />
        </StyledFriendIdContainer>
        <StyledCallContainer>
          <StyledCallButton
            type="button"
            className=" fa fa-video-camera fa-3x"
            onClick={callWithVideo(true)}
          >
            <FontAwesomeIcon icon={faVideo} />
          </StyledCallButton>
          <StyledCallButton
            type="button"
            className=" fa fa-phone fa-3x"
            onClick={callWithVideo(false)}
          >
            <FontAwesomeIcon icon={faPhone} />
          </StyledCallButton>
        </StyledCallContainer>
      </StartPageContainer>
    </div>
  );
};

StartGamePage.propTypes = {
  clientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  startCall: PropTypes.func.isRequired,
};

export default StartGamePage;
