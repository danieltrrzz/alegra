/**
 * @fileoverview Servicio para manejar la lógica de negocio de las órdenes
 * @name order.service.js
 */
module.exports = (() => {
  'use strict';

  const OrderModel = require('../models/order.model');

  /**
   * Obtener una orden por su id
   * @param {String} id
   * @returns {Promise<Object>} Orden encontrada
   */
  const getById = async (id) => {
    try {
      const result = await OrderModel.findById(id);
      return result;

    } catch (error) {
      console.error(`Error al buscar una orden`, error);
      throw new Error(`Error al buscar una orden`);
    }
  };

  return {
    getById
  };
})();