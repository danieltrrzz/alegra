/**
 * @fileoverview Modulo para manejar las rutas de las órdenes
 * @name order.routes.js
 */
module.exports = (() => {
  'use strict';

  // Express
  const express = require('express');
  const router = express.Router();

  // Controlador
  const controller = require('../controllers/order.controller');

  router.get("/", controller.getAll);
  router.get("/:id", controller.getOne);
  router.post("/", controller.create);

  return router;
})();