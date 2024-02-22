const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app); // Créer le serveur HTTP en utilisant express
const io = socketIO(server); // Passer le serveur HTTP à Socket.IO

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('New client connected');
    socket.on('codeChange', function(code) {
        socket.broadcast.emit('codeChange', { code: code, senderId: socket.id }); // Diffuser le code à tous les autres clients avec l'ID du socket émetteur
    });
});

server.listen(3000, function(){
    console.log('Server listening on port 3000');
});
