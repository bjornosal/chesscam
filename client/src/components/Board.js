import React, { useEffect, useState } from "react";
import socket from "../socket/socket";
import styled from "styled-components";
import {
  getTileInNotation,
  getTileColor,
  getSquare,
  colors,
  getDefaultBoard,
  isTilePossibleToMoveTo,
} from "../util/BoardUtil";
import { Piece } from "./Piece";
import { PromotionPopup } from "./PromotionPopup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledBoard = styled.div`
  width: calc(90vh);
  height: calc(90vh);
  margin: 20px;
  display: grid;
  grid-template: repeat(8, 1fr) / repeat(8, 1fr);
  border: 1px solid rgba(0, 0, 0, 0.4);
  @media only screen and (max-width: 768px) {
    width: calc(90vw);
    height: calc(90vw);
  }
`;

export const Board = ({ started }) => {
  const [board, setBoard] = useState(getDefaultBoard());
  const [chosenTile, setChosenTile] = useState({ column: -1, row: -1 });
  const [color, setColor] = useState(colors.NONE);
  const [myTurn, setMyTurn] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [fromTile, setFromTile] = useState("");
  const [toTile, setToTile] = useState("");
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [lastMove, setLastMove] = useState({});

  useEffect(() => {
    if (myTurn) {
      doToast("Det er din tur.");
    }
  }, [myTurn]);

  useEffect(() => {
    socket
      .on("start", (newBoard, color) => {
        switch (color) {
          case colors.BLACK:
            setColor(colors.BLACK);
            setBoard(reverseBoard(newBoard));
            setMyTurn(false);
            break;
          case colors.WHITE:
            setColor(colors.WHITE);
            setBoard(newBoard);
            setMyTurn(true);
            break;
          default:
            alert("Biip biip. Error. No comprende.");
        }
      })
      .on("successMove", (newBoard, isGameOver) => {
        setBoard(color === colors.WHITE ? newBoard : reverseBoard(newBoard));

        setIsGameOver(isGameOver);
        setMyTurn(false);
        setPossibleMoves([]);
        setFromTile("");
        setToTile("");
        setChosenTile({ column: -1, row: -1 });
      })
      .on("opponentMove", (newBoard, isGameOver, isChecked, lastMove) => {
        setBoard(color === colors.WHITE ? newBoard : reverseBoard(newBoard));
        setIsGameOver(isGameOver);
        setMyTurn(true);
        setFromTile("");
        setToTile("");
        setLastMove(lastMove);
        setChosenTile({ column: -1, row: -1 });
        if (isChecked) {
          doToast("Du er satt i sjakk! 🙃");
        }
      })
      .on("possibleMoves", (possibleMoves) => {
        setPossibleMoves(
          possibleMoves.map((move) => {
            return { to: move.to, promotion: move.promotion };
          })
        );
      })
      .on("invalidMove", () => {
        doToast("Oops. Der var det noe som gikk galt!");
        setMyTurn(true);
      });
  }, [color, started]);

  const reverseBoard = (board) => {
    return [...board].reverse().map((row) => [...row].reverse());
  };

  const choosePiece = (rowIndex, columnIndex) => {
    if (!myTurn) {
      doToast("Ikke din tur helt enda.");
      return false;
    }

    const piece = board[rowIndex][columnIndex];
    if (piece === null) {
      return false;
    }

    if (chosenTile.column !== -1 && piece.color !== color) {
      return false;
    }

    if (piece.color !== color) {
      doToast("Det er vel ikke din brikke? ♟️");
      return false;
    }

    setChosenTile({ column: columnIndex, row: rowIndex });
    const square = getSquare(columnIndex, rowIndex, color);

    socket.emit("choose", square);

    return true;
  };

  const doToast = (message, autoCloseTime = 3000) => {
    toast.info(message, {
      autoClose: autoCloseTime,
    });
  };

  const initPromotionPopup = (fromTile, toTile) => {
    setFromTile(fromTile);
    setToTile(toTile);
    setShowPromotionPopup(true);
  };

  const doClick = (rowIndex, columnIndex) => {
    if (isGameOver) {
      doToast("Spillet er dessverre over nå! ♟️");
      return false;
    }

    if (!myTurn) {
      doToast("Det er ikke din tur, smør deg med tålmodighet! ");
      return false;
    }

    let didChoosePiece = choosePiece(rowIndex, columnIndex);
    if (didChoosePiece) {
      return;
    }

    if (chosenTile.column === -1) {
      return;
    }

    let fromTile = getTileInNotation(chosenTile.column, chosenTile.row, color);
    let toTile = getTileInNotation(columnIndex, rowIndex, color);
    if (!possibleMoves.some((move) => move.to === toTile)) {
      doToast("Det er ikke et gyldig trekk.");
      return;
    }
    if (
      possibleMoves.some(
        (move) => move.to === toTile && move.promotion !== undefined
      )
    ) {
      initPromotionPopup(fromTile, toTile);
      return;
    }

    socket.emit("move", {
      from: fromTile,
      to: toTile,
    });
  };

  const getOverlayColor = (tileInNotation, possibleToMoveTo) => {
    if (possibleToMoveTo) {
      return "inset 1px 1px 1px 10000px rgba(0, 0, 0, 0.5)";
    }

    if (tileInNotation === lastMove.from || tileInNotation === lastMove.to) {
      return "inset 1px 1px 1px 10000px rgba(110, 141, 113, 0.5)";
    }

    return "";
  };

  const getOutlineColor = (tileInNotation, possibleToMoveTo) => {
    if (possibleToMoveTo) {
      return "2px solid black";
    }

    if (tileInNotation === lastMove.from || tileInNotation === lastMove.to) {
      return "2px solid var(--secondary-color)";
    }

    return "";
  };

  return (
    <>
      {(started && (
        <div className="gameContainer">
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
          />
          <PromotionPopup
            open={showPromotionPopup}
            color={color}
            fromTile={fromTile}
            toTile={toTile}
          />
          {isGameOver && (
            <div className="finishedGameModal">
              Spillet er ferdig! Du {myTurn ? "tapte" : "vant"}.
            </div>
          )}
          <StyledBoard className="boardContainer">
            {board.map((row, rowIndex) => {
              return row.map((tile, columnIndex) => {
                const possibleToMoveTo = isTilePossibleToMoveTo(
                  rowIndex,
                  columnIndex,
                  possibleMoves,
                  color
                );

                const tileInNotation = getTileInNotation(
                  columnIndex,
                  rowIndex,
                  color
                );

                return (
                  <div
                    key={rowIndex + "-" + columnIndex}
                    style={{
                      backgroundColor: getTileColor(rowIndex, columnIndex),
                      color: tile?.color === "b" ? "black" : "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      stroke: tile?.color === "b" ? "none" : "black",
                      strokeWidth: tile?.color === "b" ? "none" : "25px",
                      outline: getOutlineColor(
                        tileInNotation,
                        possibleToMoveTo
                      ),
                      outlineOffset: "-3px",
                      boxShadow: getOverlayColor(
                        tileInNotation,
                        possibleToMoveTo
                      ),
                    }}
                    onClick={() => doClick(rowIndex, columnIndex)}
                  >
                    <Piece type={tile?.type} />
                  </div>
                );
              });
            })}
          </StyledBoard>
        </div>
      )) || <></>}
    </>
  );
};
