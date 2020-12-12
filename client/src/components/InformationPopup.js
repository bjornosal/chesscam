import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setCookieToNeverExpire } from "../util/CookieUtil";

Modal.setAppElement("#root");

const ConfirmButton = styled.button`
  background-color: var(--primary-color);
  border: 1px solid #000;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s linear;
  /* transition: color 0.2s linear; */

  &:hover {
    background-color: var(--secondary-color);
    color: #fff;
  }
`;

export const InformationPopup = ({ open }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const closeModal = (isUnderstood) => {
    if (isUnderstood) {
      setCookieToNeverExpire("informationUnderstood");
    }
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={true}
      className="Modal"
      onRequestClose={() => closeModal(false)}
      shouldCloseOnOverlayClick={true}
    >

        <section>
          <h2>Hva er spillmedmormor.no?</h2>
          <p>
            Dette er en forenklet måte å spille spill virtuelt med dine eldre
            når du er litt langt borte, eller de ikke kan få besøk. Akkurat nå
            så er det kun sjakk.
          </p>
        </section>

        <section>
          <h2>Hvordan funker det?</h2>
          <p>
            Først, så må motparten også gå til denne siden.
            <br />
            Etter det må dere finne en måte å dele identifikatoren med hverandre
            på.
            <br />
            Når det er gjort så er det bare å skrive inn identifikatoren i
            feltet under denne boksen, og ringe i vei!
          </p>
        </section>
      <ConfirmButton className="confirmButton" onClick={() => closeModal(true)}>
        Jeg forstår!
      </ConfirmButton>
    </Modal>
  );
};
