const io = require("socket.io");
const users = require("./users");
const rooms = require("./rooms");
const { Chess } = require("chess.js");

const colors = {
  BLACK: "b",
  WHITE: "w",
};

function initSocket(socket) {
  let id;

  socket
    .on("init", async () => {
      id = await users.create(socket);
      socket.emit("init", { id });
    })
    .on("request", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("request", { from: id });
      }
    })
    .on("call", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("call", {
          ...data,
          from: id,
        });
        rooms.create(socket, receiver);
      } else {
        socket.emit("failed");
      }
    })
    .on("start", () => {
      let opponent = rooms.get(socket.id).opponent;
      let game = rooms.get(socket.id).game;
      if (opponent === undefined || opponent === null) {
        console.log("Couldn't start.");
        return;
      }
      socket.emit("start", game.board(), colors.BLACK);
      opponent.emit("start", game.board(), colors.WHITE);
    })
    .on("choose", (tile) => {
      let game = rooms.get(socket.id).game;
      socket.emit("possibleMoves", game.moves({ verbose: true, square: tile }));
    })
    .on("move", (data) => {
      // Validate move
      let game = rooms.get(socket.id).game;
      let result = game.move({ from: data.from, to: data.to });
      if (result == null) {
        socket.emit("invalidMove");
      } else {
        const receiver = rooms.get(socket.id).opponent;
        const isGameOver = game.game_over();
        socket.emit("successMove", game.board(), isGameOver);
        if (receiver) {
          const isChecked = game.in_check();
          receiver.emit("opponentMove", game.board(), isGameOver, isChecked);
        }
      }
    })
    .on("end", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("end");
      }
    })
    .on("disconnect", () => {
      // TODO: Inform that the other player left
      users.remove(id);
      console.log(id, "disconnected");
    });
}

module.exports = (server) => {
  io({ path: "/bridge", serveClient: false })
    .listen(server, { log: true })
    .on("connection", (socket) => initSocket(socket));
};
