require('dotenv').config();
const { SOCKET_PORT, SOCKET_URI_LISTENER, SOCKET_URI_EMITTER } = process.env;
const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const gateway = require('express-gateway');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});
io.on("connection", (socket) => {  
  socket.on(SOCKET_URI_LISTENER, (notify) => {
    console.log("Evento recibido: ", notify);
    // Emitir el evento a todos los clientes conectados
    io.emit(SOCKET_URI_EMITTER, notify);
  });
});

gateway()
  .load(path.join(__dirname, 'config'))
  .run(app);

const PORT = +SOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});