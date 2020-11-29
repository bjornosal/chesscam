const http = require("http");
const express = require("express");
const port = process.env.PORT || 5000;
const socket = require("./util/socket");

const app = express();
const server = http.createServer(app);

app.use("/", express.static(`${__dirname}/../client/build`));

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

app.use(requireHTTPS); 

server.listen(port, () => {
  socket(server);
  console.log("Server is listening at :", port);
});
