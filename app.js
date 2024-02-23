const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app); // Créer le serveur HTTP en utilisant express
const io = socketIO(server); // Passer le serveur HTTP à Socket.IO

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('Un nouveau client est connecté');

    let roomId = null;

    // Envoyer l'ID du client
    socket.emit('clientId', socket.id);

    socket.on('codeChange', function(codeData) {
        const { code, senderId, roomId } = codeData;
        if (roomId) {
            socket.to(roomId).emit('codeChange', { code: code, senderId: senderId, roomId: roomId });
        } else {
            // Si le client n'est dans aucune room,on diffuse à tous les clients (canal général)
            socket.broadcast.emit('codeChange', { code: code, senderId: senderId });
        }
    });

    // sortir et rentrer dans une salle

    socket.on('joinRoom', function(newRoomId) {
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

    socket.on('leaveRoom', function(roomId) {
        socket.leave(roomId);
        console.log(`Client ${socket.id} a quitté la salle ${roomId}`);
    });
});

server.listen(3000, function () {
    console.log('Le serveur écoute sur le port 3000');
});
