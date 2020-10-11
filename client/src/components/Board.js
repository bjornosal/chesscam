import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import styled from 'styled-components';

const StyledBoard = styled.div`
    width: 400px;
    height: 400px;
    margin: 20px;
    display: grid;
    grid-template: repeat(8, 1fr) / repeat(8, 1fr);
    grid-gap: 1px;
`;
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

    useEffect(() => {
        socket
            .on('start', (board) => {
                console.log('STARTING', board);
                setBoard(board);
            })
            .on('move', (data) => {
                console.log('The other guy move');
                console.log('This is the new board?', data);
                setBoard(data.board);
            })
            .on('invalidMove', () => {
                alert('invalid move');
            });
    }, []);

    return (
        <StyledBoard className="boardContainer">
            {board.map((row, rowIndex) => {
                return row.map((tile, tileIndex) => {
                    return (
                        <div
                            style={{
                                backgroundColor:
                                    (rowIndex % 2 === 0 &&
                                        tileIndex % 2 === 0) ||
                                    (rowIndex % 2 !== 0 && tileIndex % 2 !== 0)
                                        ? 'grey'
                                        : 'brown',
                                color: tile?.color === 'b' ? 'black' : 'white',
                            }}
                        >
                            {tile?.type || ''}
                        </div>
                    );
                });
            })}
        </StyledBoard>
    );
};
