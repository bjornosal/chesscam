import Modal from "react-modal";
import React, { useState } from "react";
import socket from "../socket/socket";
import { Piece } from "./Piece";
import styled from "styled-components";

Modal.setAppElement("#root");

const PieceContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Tile = styled.div`
  background-color: ${(props) => props.color};
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PromotionPopup = ({ color, open, fromTile, toTile }) => {
  const [isOpen, setIsOpen] = useState(open);

  const choosePromotion = (type) => {
    socket.emit("move", {
      from: fromTile,
      to: toTile,
      promotion: type,
    });
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
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
        },
      }}
    >
      <div>Velg din brikke!</div>
      <PieceContainer>
        <Tile color="grey" onClick={() => choosePromotion("p")}>
          <Piece type="p" color={color} />
        </Tile>
        <Tile color="beige" onClick={() => choosePromotion("q")}>
          <Piece type="q" color={color} />
        </Tile>
        <Tile color="grey" onClick={() => choosePromotion("n")}>
          <Piece type="n" color={color} />
        </Tile>
        <Tile color="beige" onClick={() => choosePromotion("b")}>
          <Piece type="b" color={color} />
        </Tile>
        <Tile color="grey" onClick={() => choosePromotion("r")}>
          <Piece type="r" color={color} />
        </Tile>
      </PieceContainer>
    </Modal>
  );
};