/**
 * @fileoverview Modulo para manejar las rutas de los platos
 * @name dish.routes.js
 */
module.exports = (() => {
  'use strict';

  // Express
  const express = require('express');
  const router = express.Router();

  // Controlador
  const controller = require('../controllers/dish.controller');

  router.get("/", controller.getAll);
  router.get("/:id", controller.getOne);

  return router;
})();