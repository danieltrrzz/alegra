/**
 * @fileoverview Servicio para manejar la lógica de negocio de las órdenes
 * @name order.service.js
 */
module.exports = (() => {
  'use strict';

  const OrderModel = require('../models/order.model');

  /**
   * Obtener una orden por su id
   * @param {*} id 
   * @returns 
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
   * @returns 
   */
  const update = async (id, data) => {
    try {
      const result = await OrderModel.findByIdAndUpdate(
        id, 
        data, 
        { new: true }
      );    
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