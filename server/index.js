const http = require("http");
const express = require("express");
const port = process.env.PORT || 5000;
const socket = require("./util/socket");

const app = express();
const server = http.createServer(app);

app.use("/", express.static(`${__dirname}/../client/build`));

server.listen(port, () => {
    socket(server);
    console.log("Server is listening at :", port);
});
