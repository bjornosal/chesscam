import Modal from 'react-modal';
import React, { useState } from 'react';
import socket from '../socket/socket';
import { Piece } from './Piece';
import styled from 'styled-components';

Modal.setAppElement('#root');

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
    socket.emit('move', {
      from: fromTile,
      to: toTile,
      promotion: type,
    });
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} ariaHideApp={true}>
      <p>Velg din brikke!</p>
      <PieceContainer>
        <Tile color="grey" onClick={() => choosePromotion('p')}>
          <Piece type="p" color={color} />
        </Tile>
        <Tile color="beige" onClick={() => choosePromotion('q')}>
          <Piece type="q" color={color} />
        </Tile>
        <Tile color="grey" onClick={() => choosePromotion('n')}>
          <Piece type="n" color={color} />
        </Tile>
        <Tile color="beige" onClick={() => choosePromotion('b')}>
          <Piece type="b" color={color} />
        </Tile>
        <Tile color="grey" onClick={() => choosePromotion('r')}>
          <Piece type="r" color={color} />
        </Tile>
      </PieceContainer>
    </Modal>
  );
};
