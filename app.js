const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app); // Créer le serveur HTTP en utilisant express
const io = socketIO(server); // Passer le serveur HTTP à Socket.IO

// Servir les fichiers statiques depuis le répertoire racine
app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("Un nouveau client est connecté");

  let roomId = null;
  let username = "";
  
 // Envoyer l'ID du client et son nom
    socket.on('setUsername', function(name) {
        username = name;
        socket.emit('clientId', { id: socket.id, name: username });
        // Envoyer un message à tous les autres clients pour informer de la connexion de cet utilisateur
        socket.broadcast.emit('userConnected', { name: username });
    });
  // Gestion de la déconnexion de l'utilisateur
   socket.on('disconnect', function () {
        if (username) {
            // Envoyer un message à tous les autres clients pour informer de la déconnexion de cet utilisateur
            socket.broadcast.emit('userDisconnected', { name: username });
        }
    });

  // Envoyer l'ID du client
  socket.emit("clientId", socket.id);

  socket.on("codeChange", function (codeData) {
    const { code, senderId, roomId } = codeData;
    if (roomId) {
      socket
        .to(roomId)
        .emit("codeChange", { code: code, senderId: senderId, roomId: roomId });
    } else {
      // Si le client n'est dans aucune room,on diffuse à tous les clients (canal général)
      socket.broadcast.emit("codeChange", { code: code, senderId: senderId });
    }
  });

  // sortir et rentrer dans une salle

  socket.on("joinRoom", function (newRoomId) {
    if (roomId !== newRoomId) {
      if (roomId) {
        socket.leave(roomId);
        console.log(`Client ${socket.id} a quitté la salle ${roomId}`);
      }
      roomId = newRoomId;
      socket.join(roomId);
      console.log(`Client ${socket.id} a rejoint la salle ${roomId}`);
    }
  });

  socket.on("leaveRoom", function (roomId) {
    socket.leave(roomId);
    console.log(`Client ${socket.id} a quitté la salle ${roomId}`);
  });
});

const PORT = process.env.PORT || 3000; 

server.listen(PORT, function () {
    console.log(`Le serveur écoute sur le port ${PORT}`);
});
