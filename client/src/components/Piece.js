import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";

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
    <FontAwesomeIcon
      icon={iconType}
      size="2x"
      
    />
  );
};
