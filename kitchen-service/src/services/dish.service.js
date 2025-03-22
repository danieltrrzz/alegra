/**
 * @fileoverview Servicio para manejar la lógica de negocio de los platos
 * @name dish.service.js
 */
module.exports = (() => {
  'use strict';

  const DishModel = require('../models/dish.model');

  /**
   * Obtener un plato aleatorio
   * @returns {Promise<Object>} Plato aleatorio
   */
  const getRandom = async () => {
    try {
      const result = await DishModel.find({});
      const randomIndex = Math.floor(Math.random() * result.length);
      return result[randomIndex];

    } catch (error) {
      console.error(`Error al buscar un plato`, error);
      throw new Error(`Error al buscar un plato`);
    }
  };

  /**
    * Obtener uno o todos los platos
    * @param {String} id
    * @param {Object} filter
    * @returns {Promise<Object>} plato(s) encontrado(s)
    */
  const get = async (id = null, filter = {}) => {
    try {
      const result = id
        ? await DishModel.findOne({ _id: id })
        : await DishModel.find(filter);

      return result;

    } catch (error) {
      console.error(`Error al buscar platos`, error);
      throw new Error(`Error al buscar platos`);
    }
  };

  return {
    getRandom,
    get
  };
})();