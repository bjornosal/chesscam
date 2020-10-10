const http = require("http");
const express = require("express");
const port = process.env.PORT || 5000;
const socket = require("./util/socket");

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
    res.send("<h1>Hello<h1/>");
});

app.use("/", express.static(`${__dirname}/../client`));

server.listen(port, () => {
    socket(server);
    console.log("Server is listening at :", port);
});
