const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());

io.on("connection", function (socket) {
  console.log("Un nouveau client est connecté");

  socket.on("codeChange", function (codeData) {
    io.emit("codeChange", { code: codeData.code }); 
    console.log(`voici le changement du code`, codeData.code);
  });
});

const PORT = process.env.PORT || 3000; 
server.listen(PORT, function () {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
