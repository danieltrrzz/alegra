/**
 * @fileoverview Servicio para manejar la lógica de negocio de las entregas
 * @name delivery.service.js
 */
module.exports = (() => {
  'use strict';

  const { get, update } = require('./order.service');
  const { orderStatus } = require('../utils/const.util');

  /**
   * Inicia el proceso de entrega de una orden
   * @param {String} orderId 
   */
  const deliveryProcessStart = async (orderId) => {
    try {
      const ordenResult = await get(orderId);
      if (!ordenResult || ordenResult.status !== orderStatus.FINISHED) {
        console.log(`⚠️ La orden N°${orderId} no fue encontrada o no está en estado "Finalizada"`);
        return;
      };
      // Se obtiene la orden en formato de objeto para mejor manipulación
      const order = ordenResult.toObject();

      // Se actualiza la orden con el estado de "Entregada"
      await update(order._id, {
        status: orderStatus.DELIVERED,
      });

      // Se envía un mensaje al cliente con la confirmación de la entrega
      console.log(`✅ Orden N°${orderId} entregada con éxito`);

    } catch (error) {
      console.error(`❌ error al procesar la orden ${orderId}`, error);
    };
  };

  return {
    deliveryProcessStart
  };
})();