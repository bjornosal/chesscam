import React from "react";
import "./App.css";
import { MainPage } from "./components/MainPage";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChessPawn,
  faChessBishop,
  faChessKing,
  faChessQueen,
  faChessRook,
  faChessKnight,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faChessPawn,
  faChessBishop,
  faChessKing,
  faChessQueen,
  faChessRook,
  faChessKnight
);
function App() {
  return (
    <div className="App">
      <MainPage />
    </div>
  );
}

export default App;
