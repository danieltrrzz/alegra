/**
 * @fileoverview Servicio para manejar la lógica de los sockets
 * @name socket.service.js
 */
module.exports = (() => {
  'use strict';

  const { SOCKET_HOST, SOCKET_URI_EMITTER, NAME_SPACE } = require('../config/env');
  const clientIo = require("socket.io-client");
  const socketclientIo = clientIo(SOCKET_HOST);

  /**
   * Notificacion de cambios de estado
   */
  const socketNotify = () => {
    return new Promise((resolve, reject) => {
      try {
        socketclientIo.emit(SOCKET_URI_EMITTER, { origin: NAME_SPACE });
        resolve();
      } catch (error) {
        console.error(`Error al notificar cambio`, error);
        reject(`Error al notificar cambio`);
      }
    });
  };

  return {
    socketNotify
  };
})();