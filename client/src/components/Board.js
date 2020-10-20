import React, { useEffect, useState } from "react";
import socket from "../socket/socket";
import styled from "styled-components";
import {
  getTileInNotation,
  getTileColor,
  getSquare,
  colors,
  getDefaultBoard,
} from "../util/BoardUtil";
import { Piece } from "./Piece";
import { PromotionPopup } from "./PromotionPopup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledBoard = styled.div`
  width: 400px;
  height: 400px;
  margin: 20px;
  display: grid;
  grid-template: repeat(8, 1fr) / repeat(8, 1fr);
  border: 1px solid #000;
`;

export const Board = () => {
  const [board, setBoard] = useState(getDefaultBoard());
  const [chosenTile, setChosenTile] = useState({ column: -1, row: -1 });
  const [color, setColor] = useState(colors.NONE);
  const [myTurn, setMyTurn] = useState(true);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [fromTile, setFromTile] = useState("");
  const [toTile, setToTile] = useState("");
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  useEffect(() => {
    socket
      .on("start", (newBoard, color) => {
        console.log(newBoard);
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
      })
      .on("opponentMove", (newBoard, isGameOver) => {
        setBoard(color === colors.WHITE ? newBoard : reverseBoard(newBoard));
        setIsGameOver(isGameOver);
        setMyTurn(true);
      })
      .on("possibleMoves", (possibleMoves) => {
        setPossibleMoves(
          possibleMoves.map((move) => {
            return { to: move.to, promotion: move.promotion };
          })
        );
      })
      .on("invalidMove", () => {
        toast.info("Oops. Der var det noe som gikk galt!", {
          autoClose: 5000,
        });
        setMyTurn(true);
      });
  }, [color]);

  const reverseBoard = (board) => {
    return [...board].reverse().map((row) => [...row].reverse());
  };

  const choosePiece = (rowIndex, columnIndex) => {
    if (!myTurn) {
      toast.info("Ikke din tur helt enda.", {
        autoClose: 3000,
      });
      return false;
    }

    const piece = board[rowIndex][columnIndex];
    if (piece === null) {
      return false;
    }

    if (piece.color !== color) {
      toast.info("Det er vel ikke din brikke? ♟️", {
        autoClose: 3000,
      });
      return false;
    }

    setChosenTile({ column: columnIndex, row: rowIndex });
    const square = getSquare(columnIndex, rowIndex, color);

    socket.emit("choose", square);

    return true;
  };

  const initPromotionPopup = (fromTile, toTile) => {
    setFromTile(fromTile);
    setToTile(toTile);
    setShowPromotionPopup(true);
  };

  const doClick = (rowIndex, columnIndex) => {
    if (isGameOver) {
      toast.info("Spillet er dessverre over nå! ♟️", {
        autoClose: 3000,
      });
      return false;
    }

    if (!myTurn) {
      //TODO: do a small notification here.
      toast.info("Det er ikke din tur, smør deg med tålmodighet! ", {
        autoClose: 3000,
      });
      return false;
    }
    let didChoosePiece = choosePiece(rowIndex, columnIndex);
    if (didChoosePiece) {
      return;
    }

    if (chosenTile.column === -1) {
      return;
    }

    let toTile = getTileInNotation(columnIndex, rowIndex, color);
    if (!possibleMoves.some((move) => move.to === toTile)) {
      //TODO: Localization
      toast.info("Det er ikke et gyldig trekk", {
        autoClose: 3000,
      });
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
      from: getTileInNotation(chosenTile.column, chosenTile.row, color),
      to: toTile,
    });
  };

  return (
    <div className="gameContainer">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
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
            return (
              <div
                key={rowIndex + "-" + columnIndex}
                style={{
                  backgroundColor: getTileColor(
                    rowIndex,
                    columnIndex,
                    possibleMoves,
                    color
                  ),
                  color: tile?.color === "b" ? "black" : "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
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
  );
};
