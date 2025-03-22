/**
 * @fileoverview Modulo para manejar las rutas de los historiales de compra
 * @name purchase-history.routes.js
 */
module.exports = (() => {
  'use strict';

  // Express
  const express = require('express');
  const router = express.Router();

  // Controlador
  const controller = require('../controllers/purchase-history.controller');

  router.get("/", controller.getAll);
  router.get("/:id", controller.getOne);

  return router;
})();