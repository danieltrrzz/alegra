/**
 * @fileoverview Servicio para manejar la lógica de negocio de los ingredientes
 * @name ingredient.service.js
 */
module.exports = (() => {
  'use strict';

  const InventoryModel = require('../models/inventory.model');

  /**
   * Obtener uno o todos los ingredientes
   * @param {String} ingredient 
   */
  const get = async (ingredient = null, filter = {}) => {
    try {
      const result = ingredient
        ? await InventoryModel.findOne({ ingredient })
        : await InventoryModel.find(filter);

      return result;

    } catch (error) {
      console.error(`Error al buscar ingredientes`, error);
      throw new Error(`Error al buscar ingredientes`);
    }
  };

  /**
   * Actualizar el stock de un ingrediente
   * @param {String} ingredient 
   * @param {Number} stock 
   * @param {Boolean} add me indica si se agrega o se resta del stock
   * @returns 
   */
  const update = async (ingredient, stock, add = true) => {
    try {
      const result = await InventoryModel.findOneAndUpdate(
        { ingredient },
        { $inc: { stock: add ? stock : -stock } },
        { new: true }
      );

      return result;

    } catch (error) {
      console.error(`Error al actualizar el stock del ingrediente ${ingredient}`, error);
      throw new Error(`Error al actualizar el stock del ingrediente ${ingredient}`);
    }
  };

  return {
    get,
    update
  };
})();