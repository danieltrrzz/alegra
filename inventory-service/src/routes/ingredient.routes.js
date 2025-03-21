/**
 * @fileoverview Modulo para manejar las rutas de los ingredientes
 * @name inventory.controller.js
 */
module.exports = (() => {
  'use strict';

  // Express
  const express = require('express');
  const router = express.Router();

  // Controlador
  const controller = require('../controllers/ingredient.controller');

  router.get("/", controller.getAll);
  router.get("/:ingredient", controller.getOne);

  return router;
})();