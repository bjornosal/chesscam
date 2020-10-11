const io = require('socket.io');
const users = require('./users');
const rooms = require('./rooms');
const { Chess } = require('chess.js');

function initSocket(socket) {
    let id;
    const chess = new Chess();
    socket
        .on('init', async () => {
            id = await users.create(socket);
            socket.emit('init', { id });
        })
        .on('request', (data) => {
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit('request', { from: id });
            }
        })
        .on('call', (data) => {
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit('call', {
                    ...data,
                    from: id,
                });
                rooms.create(id, data.to);
            } else {
                socket.emit('failed');
            }
        })
        .on('start', (data) => {
/*             let players = rooms.get(id);
            players.forEach((player) => {
                let playerSocket = users.get(player);
                playerSocket.emit('start', chess.board());
            });
 */
            //TODO: Remove this line and uncomment above
            socket.emit('start', chess.board());
        })
        .on('move', (data) => {
            // Validate move
            let result = chess.move({ from: data.from, to: data.to });
            if (result == null) {
                socket.emit('invalidMove');
            } else {
                receiver.emit('move', { board: chess.board() });
            }
        })
        .on('end', (data) => {
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit('end');
            }
        })
        .on('disconnect', () => {
            users.remove(id);
            console.log(id, 'disconnected');
        });
}

module.exports = (server) => {
    io({ path: '/bridge', serveClient: false })
        .listen(server, { log: true })
        .on('connection', (socket) => initSocket(socket));
};
