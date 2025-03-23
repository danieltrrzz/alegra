/**
 * @fileoverview Servicio para manejar la lógica de negocio de las órdenes
 * @name order.service.js
 */
module.exports = (() => {
  'use strict';

  const OrderModel = require('../models/order.model');
  const { orderStatus } = require('../utils/const.util');
  const { socketNotify } = require('./socket.service');

  /**
    * Obtener una o todas las órdenes
    * @param {String} id
    * @param {Object} filter
    * @returns {Promise<Object>} ordenes encontradas
    */
  const get = async (id = null, filter = {}) => {
    try {
      const result = id
        ? await OrderModel.findOne({ _id: id })
        : await OrderModel.find(filter);

      return result;

    } catch (error) {
      console.error(`Error al buscar ordenes`, error);
      throw new Error(`Error al buscar ordenes`);
    }
  };

  /**
   * Crear una orden
   * @param {Object} orderData
   * @returns {Promise<Object>} Orden creada
   */
  const create = async () => {
    try {
      const order = new OrderModel({
        status: orderStatus.PREPARATION
      });
      const result = await order.save();
      // Notificar cambio
      socketNotify();
      
      return result;

    } catch (error) {
      console.error(`Error al guardar una orden`, error);
      throw new Error(`Error al guardar una orden`);
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
    get,
    create,
    update
  };
})();