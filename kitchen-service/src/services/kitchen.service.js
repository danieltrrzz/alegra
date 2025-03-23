/**
 * @fileoverview Servicio para manejar la lógica de negocio de la cocina.
 * @name kitchen.service.js
 */
module.exports = (() => {
  'use strict';

  const orderService = require('./order.service');
  const dishService = require('./dish.service');
  const { orderStatus } = require('../utils/const.util');
  const { KITCHEN_TIME } = require('../config/env');

  /**
   * Inicia el proceso de preparación de un plato aleatorio para una orden específica.
   * NOTA: Se reciben los dos producer como callback para evitar la dependencia circular
   * @param {String} orderId 
   * @param {Function} inventoryTopicProducer
   */
  const kitchenProcessStart = async (orderId, inventoryTopicProducer) => {
    try {
      const ordenResult = await orderService.getById(orderId);
      if (!ordenResult || ordenResult.status !== orderStatus.PREPARATION) {
        console.log(`⚠️ La orden N°${orderId} no fue encontrada o no está en estado "En preparación"`);
        return;
      };
      // Se obtiene la orden en formato de objeto para mejor manipulación
      const order = ordenResult.toObject();

      // Selección del plato aleatorio a preparar
      const dish = await dishService.getRandom();

      // Se actualiza la orden con el plato seleccionado y se cambia el estado a "En la cocina"
      const dataToUpdate = {
        status: orderStatus.KITCHEN,
        dish: dish.toObject()
      };
      await orderService.update(order._id, dataToUpdate);

      // Se notifica al servicio de inventario para que reserve los ingredientes
      await inventoryTopicProducer({ orderId: order._id });

    } catch (error) {
      console.error(`❌ error al procesar la orden ${orderId}`, error);
    };
  };

  /**
   * Inicia el proceso para finalizar la preparación de ya seleccionado para una orden específica.
   * NOTA: Se reciben los dos producer como callback para evitar la dependencia circular
   * @param {String} orderId 
   * @param {Function} orderTopicProducer
   */
  const preparationProcessStart = async (orderId, orderTopicProducer) => {
    try {
      const ordenResult = await orderService.getById(orderId);
      if (!ordenResult || ordenResult.status !== orderStatus.FINISHED) {
        console.log(`⚠️ La orden N°${orderId} no fue encontrada o no está en estado "Finalizadas"`);
        return;
      };
      // Se obtiene la orden en formato de objeto para mejor manipulación
      const order = ordenResult.toObject();

      // Se simula el tiempo de preparación del plato
      await new Promise(resolve => setTimeout(resolve, KITCHEN_TIME));

      // Se notifica al servicio de ordenes que la orden está lista
      await orderTopicProducer({ orderId: order._id });

    } catch (error) {
      console.error(`❌ error al procesar la orden ${orderId}`, error);
    }
  }

  return {
    kitchenProcessStart,
    preparationProcessStart
  };
})();