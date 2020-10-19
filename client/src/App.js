import React from 'react';
import './App.css';
import { Home } from './components/Home';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    faChessPawn,
    faChessBishop,
    faChessKing,
    faChessQueen,
    faChessRook,
    faChessKnight,
} from '@fortawesome/free-solid-svg-icons';

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
            <h1>Hei mormor</h1>
            <Home />
        </div>
    );
}

export default App;
