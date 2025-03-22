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
   * @param {Object} filter
   * @returns {Promise<Object>} Ingrediente(s) encontrado(s)
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
   * Actualizar el stock de los ingredientes
   * @param {[ name: String, quantity: Number]} ingredients 
   * @returns {Promise<Object>} Ingrediente actualizado
   */
  const update = async (ingredients) => {
    try {
      const bulkOperations = ingredients.map(ingredient => ({
        updateOne: {
          filter: { ingredient: ingredient.name, stock: { $gte: ingredient.quantity } },
          update: { $inc: { stock: -ingredient.quantity } }
        }
      }));
      const result = await InventoryModel.bulkWrite(bulkOperations);

      return result;

    } catch (error) {
      console.error(`Error al actualizar el stock de los ingrediente ${ingredients}`, error);
      throw new Error(`Error al actualizar el stock de los ingrediente ${ingredients}`);
    }
  };

  return {
    get,
    update
  };
})();