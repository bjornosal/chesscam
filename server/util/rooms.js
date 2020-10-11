const rooms = {};

exports.create = (player1, player2) => {
    const players = [player1, player2];
    rooms[player1] = players;
    rooms[player2] = players;
    return players;
};

exports.get = (id) => rooms[id];

exports.remove = (id) => delete rooms[id];
