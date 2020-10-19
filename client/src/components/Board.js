import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import styled from 'styled-components';
import {
    getTileInNotation,
    getTileColor,
    getSquare,
    colors,
} from '../util/BoardUtil';

const StyledBoard = styled.div`
    width: 400px;
    height: 400px;
    margin: 20px;
    display: grid;
    grid-template: repeat(8, 1fr) / repeat(8, 1fr);
    grid-gap: 1px;
`;

export const Board = () => {
    const [board, setBoard] = useState([]);
    const [chosenTile, setChosenTile] = useState({ column: -1, row: -1 });
    const [color, setColor] = useState(colors.NONE);
    const [myTurn, setMyTurn] = useState(true);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        socket
            .on('start', (newBoard, color) => {
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
                        alert('Biip biip. Error. No comprende.');
                }
            })
            .on('successMove', (newBoard, isGameOver) => {
                setBoard(
                    color === colors.WHITE ? newBoard : reverseBoard(newBoard)
                );

                setIsGameOver(isGameOver);
                setMyTurn(false);
                setPossibleMoves([]);
            })
            .on('opponentMove', (newBoard, isGameOver) => {
                setBoard(
                    color === colors.WHITE ? newBoard : reverseBoard(newBoard)
                );
                setIsGameOver(isGameOver);
                setMyTurn(true);
            })
            .on('possibleMoves', (possibleMoves) => {
                setPossibleMoves(
                    possibleMoves.map((move) => {
                        return { to: move.to, promotion: move.promotion };
                    })
                );
            })
            .on('invalidMove', () => {
                alert('Server says: invalid move');
                setMyTurn(true);
            });
    }, [color]);

    const reverseBoard = (board) => {
        return [...board].reverse().map((row) => [...row].reverse());
    };

    const choosePiece = (rowIndex, columnIndex) => {
        if (!myTurn) {
            console.log('not your turn');
            return false;
        }

        const piece = board[rowIndex][columnIndex];
        if (piece === null) {
            return false;
        }

        if (piece.color !== color) {
            //TODO: not my piece, do a notification
            console.log('not your piece');
            return false;
        }

        setChosenTile({ column: columnIndex, row: rowIndex });
        const square = getSquare(columnIndex, rowIndex, color);

        socket.emit('choose', square);

        return true;
    };

    const doClick = (rowIndex, columnIndex) => {
        if (isGameOver) {
            console.log('The game is over.');
            return false;
        }

        if (!myTurn) {
            //TODO: do a small notification here.
            console.log('not your turn');
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
            console.log('Not a valid move.');
            return;
        }

        if (
            possibleMoves.some(
                (move) => move.to === toTile && move.promotion !== undefined
            )
        ) {
            console.log('This is a promotion! Show promotion popup');

            return;
        }

        socket.emit('move', {
            from: getTileInNotation(chosenTile.column, chosenTile.row, color),
            to: toTile,
        });
    };

    return (
        <div className="gameContainer">
            {isGameOver && (
                <div className="finishedGameModal">
                    Spillet er ferdig! Du {myTurn ? 'tapte' : 'vant'}.
                </div>
            )}
            <StyledBoard className="boardContainer">
                {board.map((row, rowIndex) => {
                    return row.map((tile, columnIndex) => {
                        return (
                            <div
                                key={rowIndex + '-' + columnIndex}
                                style={{
                                    backgroundColor: getTileColor(
                                        rowIndex,
                                        columnIndex
                                    ),
                                    color:
                                        tile?.color === 'b' ? 'black' : 'white',
                                }}
                                onClick={() => doClick(rowIndex, columnIndex)}
                            >
                                {tile?.type || ''}
                            </div>
                        );
                    });
                })}
            </StyledBoard>
        </div>
    );
};
