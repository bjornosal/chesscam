import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import styled from "styled-components";

const StyledPiece = styled(FontAwesomeIcon)`
  transform: scale(3.5);
  @media only screen and (max-width: 768px) {
    
    transform: scale(2);
  }
`;

export const Piece = ({ type }) => {
  /**
   * - "p" for Pawn
   * - "n" for Knight
   * - "b" for Bishop
   * - "r" for Rook
   * - "q" for Queen
   * - "k" for King
   */
  const getIconString = (type) => {
    switch (type) {
      case "n":
        return "chess-knight";
      case "p":
        return "chess-pawn";
      case "k":
        return "chess-king";
      case "q":
        return "chess-queen";
      case "r":
        return "chess-rook";
      case "b":
        return "chess-bishop";
      default:
        return null;
    }
  };

  const iconType = getIconString(type);
  return iconType === null ? (
    <Fragment />
  ) : (
    <StyledPiece icon={iconType}  />
  );
};
