const io = require("socket.io");
const users = require("./users");

function initializeSocket(socket) {
    let id;
    socket
        .on("init", async () => {
            id = await users.create(socket);
            socket.emit("init", { id });
            console.log("init");
        })
        .on("request", (data) => {
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit("request", { from: id });
            }
            console.log("request");
        })
        .on("call", (data) => {
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit("call", { ...data, from: id });
            } else {
                socket.emit("failed");
            }
            console.log("call");
        })
        .on("end", (data) => {
            const receiver = users.get(data.to);
            if (receiver) {
                receiver.emit("end");
            }
            console.log("end");
        })
        .on("disconnect", () => {
            users.remove(id);
            console.log(id, "disconnected");
        });
}

module.exports = (server) => {
    io({ path: "/bridge", serveClient: false })
        .listen(server)
        .on("connection", initializeSocket);
};
