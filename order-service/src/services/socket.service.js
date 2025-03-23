/**
 * @fileoverview Servicio para manejar la lógica de los sockets
 * @name socket.service.js
 */
module.exports = (() => {
  'use strict';

  const { SOCKET_HOST, SOCKET_URI_LISTENER, SOCKET_URI_EMITTER, NAME_SPACE } = require('../config/env');
  const socketIo = require("socket.io");
  const clientIo = require("socket.io-client");
  const socketclientIo = clientIo(SOCKET_HOST);

  /**
   * Inicializa el servidor de sockets
   * @param {Object} server Servidor HTTP
   */
  const initSocketServer = (server) => {
    const io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {      
      socket.on(SOCKET_URI_LISTENER, (notify) => {
        console.log("Evento recibido: ", notify);
        // Emitir el evento a todos los clientes conectados
        io.emit(SOCKET_URI_EMITTER, notify);
      });
    });
  };

  /**
   * Notificacion de cambios de estado
   */
  const socketNotify = () => {
    return new Promise((resolve, reject) => {
      try {
        socketclientIo.emit(SOCKET_URI_LISTENER, { origin: NAME_SPACE });
        resolve();
      } catch (error) {
        console.error(`Error al notificar cambio`, error);
        reject(`Error al notificar cambio`);
      }
    });
  };

  return {
    initSocketServer,
    socketNotify
  };
})();