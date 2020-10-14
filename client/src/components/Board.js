import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import styled from 'styled-components';
import { Chess } from 'chess.js';
// const { Chess } = require('chessjs')

const StyledBoard = styled.div`
    width: 400px;
    height: 400px;
    margin: 20px;
    display: grid;
    grid-template: repeat(8, 1fr) / repeat(8, 1fr);
    grid-gap: 1px;
`;

const colors = {
    BLACK: 'b',
    WHITE: 'w',
};

const getColumnLetter = (column) => {
    switch (column) {
        case 0:
            return 'a';
        case 1:
            return 'b';
        case 2:
            return 'c';
        case 3:
            return 'd';
        case 4:
            return 'e';
        case 5:
            return 'f';
        case 6:
            return 'g';
        case 7:
            return 'h';
    }
};

const getSquare = (column, row) => {
    return getColumnLetter(column) + (row + 1);
};
export const Board = () => {
    const [board, setBoard] = useState([
        [
            { type: 'r', color: 'b' },
            { type: 'n', color: 'b' },
            { type: 'b', color: 'b' },
            { type: 'q', color: 'b' },
            { type: 'k', color: 'b' },
            { type: 'b', color: 'b' },
            { type: 'n', color: 'b' },
            { type: 'r', color: 'b' },
        ],
        [
            { type: 'p', color: 'b' },
            { type: 'p', color: 'b' },
            { type: 'p', color: 'b' },
            { type: 'p', color: 'b' },
            { type: 'p', color: 'b' },
            { type: 'p', color: 'b' },
            { type: 'p', color: 'b' },
            { type: 'p', color: 'b' },
        ],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [
            { type: 'p', color: 'w' },
            { type: 'p', color: 'w' },
            { type: 'p', color: 'w' },
            { type: 'p', color: 'w' },
            { type: 'p', color: 'w' },
            { type: 'p', color: 'w' },
            { type: 'p', color: 'w' },
            { type: 'p', color: 'w' },
        ],
        [
            { type: 'r', color: 'w' },
            { type: 'n', color: 'w' },
            { type: 'b', color: 'w' },
            { type: 'q', color: 'w' },
            { type: 'k', color: 'w' },
            { type: 'b', color: 'w' },
            { type: 'n', color: 'w' },
            { type: 'r', color: 'w' },
        ],
    ]);
    const [chosenTile, setChosenTile] = useState({ column: -1, row: -1 });
    const [color, setColor] = useState(colors.WHITE);
    const [myTurn, setMyTurn] = useState(true);
    const [validMoves, setValidMoves] = useState([]);

    useEffect(() => {
        //TODO: Can I just send the entire chess object?
        socket
            .on('start', (chessObject, board, color) => {
                
                setBoard(board);
                console.log('board', board);
                switch (color) {
                    case colors.BLACK:
                        setColor(colors.BLACK);
                        setMyTurn(false);
                        break;
                    case colors.WHITE:
                        setColor(colors.WHITE);
                        setMyTurn(true);
                        break;
                    default:
                        alert('Biip biip. Error. No comprende.');
                }
                console.log(chessObject);
            })
            .on('move', (chessObject, board) => {
                // const game = new Game(chessObject);
                setBoard(board);
                setMyTurn(true);
            })
            .on('invalidMove', () => {
                alert('invalid move');
                setMyTurn(true);
            });
    }, []);

    const choosePiece = (rowIndex, columnIndex) => {
        //Validate
        if (!myTurn) {
            //TODO: do a small notification here.
            console.log('not your turn');
            return false;
        }

        const piece = board[rowIndex][columnIndex];
        if (piece === null) {
            return false;
        }

        if (piece.color !== color) {
            //TODO: not my piece, do a notification
            console.log(piece);
            console.log('not your piece');
            return false;
        }

        setChosenTile({ column: columnIndex, row: rowIndex });

        //TODO: Get valid moves chess.moves({from: a8, to: a2})
        const square = getSquare(columnIndex, rowIndex);
        socket.emit("choose", square);
        /* 
        const tile = currentGame.board.getTile(columnIndex + 1, rowIndex + 1);
        console.log('tile', tile);
        const moves = currentGame.rules
            .findValidMoves(currentGame, tile)
            .map((move) => {
                const toRow = move.to.y;
                const toColumn = move.to.x;
                return { toRow, toColumn };
            });
        setValidMoves(moves); */
        return true;
    };

    const doClick = (rowIndex, columnIndex) => {
        //HVis den piecen inneholder min egen, og jeg ikke har valgt en piece, velg piece

        if (!myTurn) {
            //TODO: do a small notification here.
            console.log('not your turn');
            return false;
        }

        const didChoosePiece = choosePiece(rowIndex, columnIndex);

        if (didChoosePiece) {
            return;
        }

        //Reset chosen tile on every new turn
        if (chosenTile.column === -1) {
            return;
        }

        //Now i should have a chosen piece.
        //DO MOVE

        /*   socket.emit('move', {
            from: chosenTile,
            to: { column: columnIndex, row: rowIndex },
        }); */
    };

    const shouldBeColorX = (row, column) => {
        return (
            (row % 2 === 0 && column % 2 === 0) ||
            (row % 2 !== 0 && column % 2 !== 0)
        );
    };

    const getTileColor = (row, column) => {
        if (
            validMoves.some(
                (move) => move.toRow - 1 === row && move.toColumn - 1 === column
            )
        ) {
            return 'red';
        }
        return shouldBeColorX(row, column) ? 'grey' : 'silver';
    };

    return (
        <StyledBoard className="boardContainer">
            {[...board].reverse().map((row, rowIndex) => {
                return row.map((tile, columnIndex) => {
                    return (
                        <div
                            key={rowIndex + '-' + columnIndex}
                            style={{
                                backgroundColor: getTileColor(
                                    rowIndex,
                                    columnIndex
                                ),
                                color: tile?.color === 'b' ? 'black' : 'white',
                            }}
                            onClick={() => doClick(rowIndex, columnIndex)}
                        >
                            {tile?.type || ''}
                        </div>
                    );
                });
            })}
        </StyledBoard>
    );
};
