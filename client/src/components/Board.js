import React, { useEffect, useState } from 'react';
import socket from '../socket/socket';
import styled from 'styled-components';

const StyledBoard = styled.div`
    width: 400px;
    height: 400px;
    margin: 20px;
    display: grid;
    grid-template: repeat(8, 1fr) / repeat(8, 1fr);
    grid-gap: 10px;
`;
export const Board = () => {
    const [board, setBoard] = useState([]);

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
            {board.map((row) => {
                return row.map((tile) => {
                    return (
                        <div
                            style={{
                                backgroundColor: 'grey',
                                color: tile?.color === 'b' ? 'black' : 'white',
                            }}
                        >
                            {tile?.type || 'nada'}
                        </div>
                    );
                });
            })}
        </StyledBoard>
    );
};
