const rooms = {};
const { Chess } = require('chess.js');

exports.create = (player1, player2) => {
    const players = [player1, player2];
    const game = new Chess();
    rooms[player1.id] = { opponent: player2, game: game };
    rooms[player2.id] = { opponent: player1, game: game };
    return players;
};

exports.get = (id) => rooms[id];

exports.remove = (id) => delete rooms[id];
