import Modal from 'react-modal';
import React, { useState } from 'react';
import socket from '../socket/socket';
import { Piece } from './Piece';
import styled from 'styled-components';

Modal.setAppElement('#root');

const PieceContainer = styled.Tile`
  display: flex;
  flex-direction: row;
`;

const Tile = styled.Tile`
  background-color: ${props.color};
`;

export const PromotionPopup = ({ color, open, fromTile, toTile }) => {
  const [isOpen, setIsOpen] = useState(open);

  const choosePromotion = (type) => {
    socket.emit('move', {
      from: fromTile,
      to: toTile,
      promotion: type,
    });
  };

  return (
    <Modal isOpen={isOpen} ariaHideApp={true}>
      <p>Velg din brikke!</p>
      <PieceContainer>
        <Tile color="yellow" onClick={() => choosePromotion('p')}>
          <Piece type="p" color={color} />
        </Tile>
        <Tile color="black" color={color} onClick={() => choosePromotion('q')}>
          <Piece type="q" />
        </Tile>
        <Tile color="yellow" color={color} onClick={() => choosePromotion('n')}>
          <Piece type="n" />
        </Tile>
        <Tile color="black" color={color} onClick={() => choosePromotion('b')}>
          <Piece type="b" />
        </Tile>
        <Tile color="yellow" color={color} onClick={() => choosePromotion('r')}>
          <Piece type="r" />
        </Tile>
      </PieceContainer>
    </Modal>
  );
};
