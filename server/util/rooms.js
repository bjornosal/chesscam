const rooms = {};
const { Chess } = require("chess.js");

exports.create = (player1, player2) => {
  const players = [player1, player2];
  const game = new Chess();
  game.load("rnbq1bnr/pp1pPppp/2p5/8/3k4/8/PPPK1PPP/RNBQ1BNR w - - 0 9")
  rooms[player1.id] = { opponent: player2, game: game };
  rooms[player2.id] = { opponent: player1, game: game };
  return players;
};

exports.get = (id) => rooms[id];

exports.remove = (id) => delete rooms[id];
