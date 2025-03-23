/**
 * @fileoverview Servicio para manejar la lógica de negocio de las órdenes
 * @name order.service.js
 */
module.exports = (() => {
  'use strict';

  const OrderModel = require('../models/order.model');
  const { socketNotify } = require('./socket.service');

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

  /**
   * Actualizar una orden
   * @param {*} id 
   * @param {*} data 
   * @returns {Promise<Object>} Orden actualizada
   */
  const update = async (id, data) => {
    try {
      const result = await OrderModel.findByIdAndUpdate(
        id, 
        data, 
        { new: true }
      );   
      // Notificar cambio
      socketNotify();
       
      return result;
    }
    catch (error) {
      console.error(`Error al actualizar una orden`, error);
      throw new Error(`Error al actualizar una orden`);
    };
  };

  return {
    getById,
    update
  };
})();