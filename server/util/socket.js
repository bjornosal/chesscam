const io = require('socket.io');
const users = require('./users');
const { Chess } = require('chess.js');

function initSocket(socket) {
    let id;
    const chess = new Chess();
    console.log('chess');
    console.log(chess.ascii());
    socket
        .on('init', async () => {
            id = await users.create(socket);
            socket.emit('init', { id });
        })
        .on('request', (data) => {
            const receiver = users.get(data.to);
            if (receiver) {
                console.log('From: ' + id);
                receiver.emit('request', { from: id });
            }
        })
        .on('call', (data) => {
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit('call', {
                    ...data,
                    from: id,
                    board: chess.board(),
                });
            } else {
                socket.emit('failed');
            }
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
        .on('connection', initSocket);
};
