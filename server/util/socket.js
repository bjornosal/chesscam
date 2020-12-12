const io = require("socket.io");
const users = require("./users");
const rooms = require("./rooms");
const logger = require("../logging/logger");
require("chess.js");

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
        if (socket !== null) {
          socket.emit("failed");
        }
      }
    })
    .on("start", () => {
      let room = getRoom(socket);
      if (room === null) {
        return;
      }

      let game = getGame(room);
      if (room === null) {
        return;
      }

      const opponent = getOpponent(room);
      if (opponent === null) {
        return;
      }
      if (socket !== null) {
        socket.emit("start", game.board(), colors.BLACK);
        opponent.emit("start", game.board(), colors.WHITE);
      }
    })
    .on("choose", (tile) => {
      let room = getRoom(socket);
      if (room === null) {
        return;
      }

      let game = getGame(room);
      if (game === null) {
        return;
      }

      if (socket === null) {
        return;
      }

      socket.emit("possibleMoves", game.moves({ verbose: true, square: tile }));
    })
    .on("move", (data) => {
      let room = getRoom(socket);
      if (room === null) {
        return;
      }

      let game = getGame(room);
      if (game === null) {
        return;
      }

      let result;
      if (data.promotion) {
        result = game.move({
          from: data.from,
          to: data.to,
          promotion: data.promotion,
        });
      } else {
        result = game.move({ from: data.from, to: data.to });
      }

      if (result === null) {
        if (socket !== null) {
          socket.emit("invalidMove");
        }
      } else {
        const receiver = getOpponent(room);

        if (receiver === null) {
          return;
        }

        const isGameOver = game.game_over();
        const gameBoard = game.board();
        if (socket !== null) {
          socket.emit("successMove", gameBoard, isGameOver);
        }
        if (receiver !== null && receiver !== undefined) {
          const lastMove = { from: data.from, to: data.to };
          const isChecked = game.in_check();
          receiver.emit(
            "opponentMove",
            game.board(),
            isGameOver,
            isChecked,
            lastMove
          );
        }
      }
    })
    .on("end", (data) => {
      const receiver = users.get(data.to);
      if (receiver !== null && receiver !== undefined) {
        receiver.emit("end");
      }
    })
    .on("disconnect", () => {
      // TODO: Inform that the other player left
      users.remove(id);
      console.log(id, "disconnected");
    });
}

function getRoom(socket) {
  if (socket === null || socket === undefined) {
    logger.error(`Socket is missing. `);
    return null;
  }

  let room = rooms.get(socket.id);
  if (room === null || room === undefined) {
    logger.error(`Room was undefined for socket with id ${socket.id}.`);
    return null;
  }
  return room;
}

function getGame(room) {
  let game = room.game;
  if (game === null || game === undefined) {
    logger.error(`Game was not present in room ${room}`);
    socket.emit("error");
    return null;
  }
  return game;
}

function getOpponent(room) {
  let opponent = room.opponent;
  if (opponent === null || opponent === undefined) {
    logger.error(`Opponent was not present in room ${room}`);
    socket.emit("error");
    return null;
  }
  return opponent;
}

module.exports = (server) => {
  io({ path: "/bridge", serveClient: false })
    .listen(server, { log: true })
    .on("connection", (socket) => initSocket(socket));
};
