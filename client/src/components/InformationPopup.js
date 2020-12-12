import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { setCookieToNeverExpire } from "../util/CookieUtil";

Modal.setAppElement("#root");

export const InformationPopup = ({ open }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={true}
      style={{
        overlay: {},
        content: {
          border: "3px solid var(--secondary-color)",
          background: "var(--main-bg-color)",
          overflow: "auto",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "35%",
        },
      }}
    >
      <section>
        <h1>Hva er dette?</h1>
        <p>
          Dette er en forenklet måte å spille spill virtuelt med dine eldre når
          du er litt langt borte, eller de ikke kan få besøk. Akkurat nå så er
          det kun sjakk.
        </p>
      </section>

      <section>
        <h1>Hvordan funker det?</h1>
        <p>
          Først, så må motparten også gå til denne siden.
          <br />
          Etter det må dere finne en måte å dele identifikatoren med hverandre
          på.
          <br />
          Når det er gjort så er det bare å skrive inn identifikatoren i feltet
          under denne boksen, og ringe i vei!
        </p>
      </section>
      {/* TODO: Save in cookies if clicked */}
      <button
        onClick={() => {
          setCookieToNeverExpire("informationUnderstood");
          setIsOpen(false);
        }}
      >
        Jeg forstår!
      </button>
    </Modal>
  );
};
