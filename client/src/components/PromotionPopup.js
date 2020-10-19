import Modal from 'react-modal';
import React, { useState } from 'react';
import socket from '../socket/socket';

Modal.setAppElement('#root');

export const PromotionPopup = ({ color, open, fromTile, toTile }) => {
	const [isOpen, setIsOpen] = useState(open);

	const choosePromotion = (type) => {
        socket.emit('move', {
            from: fromTile,
			to: toTile,
			promotion: type
        });	}


    return (
        <Modal isOpen={isOpen} ariaHideApp={true}>
            <p>Velg din brikke!</p>
            <div className="pieceContainer">
                <div onClick={() => {}}>p</div>
                <div>q</div>
                <div>r</div>
                <div>n</div>
            </div>
        </Modal>
    );
};
