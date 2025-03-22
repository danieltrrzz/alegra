/**
 * @fileoverview Servicio para manejar la lógica de negocio de los historiales de compra
 * @name purchase-history.service.js
 */
module.exports = (() => {
  'use strict';

  const PurchaseHistoryModel = require('../models/purchase-history.model');

  /**
   * Obtener una o varios historiales de compra
   * @param {String} id
   * @param {Object} filter
   * @returns {Promise<Object>} Historial de compra
   */
  const get = async (id = null, filter = {}) => {
    try {
      const result = id
        ? await PurchaseHistoryModel.findOne({ _id: id })
        : await PurchaseHistoryModel.find(filter);

      return result;

    } catch (error) {
      console.error(`Error al buscar historiales de compra`, error);
      throw new Error(`Error al buscar historiales de compra`);
    }
  };

  /**
   * Crear un historial de compra
   * @param {Object} purchaseHistoryData
   * @returns {Promise<Object>} Historial de compra creado
   */
  const create = async (purchaseHistoryData) => {
    try {
      const purchase = new PurchaseHistoryModel(purchaseHistoryData);
      const result = await purchase.save();

      return result;

    } catch (error) {
      console.error(`Error al guardar un historial de compra ${purchaseHistoryData}`, error);
      throw new Error(`Error al guardar un historial de compra ${purchaseHistoryData}`);
    }
  };

  return {
    get,
    create
  };
})();