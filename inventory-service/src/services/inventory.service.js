/**
 * @fileoverview Servicio para manejar la lógica de negocio del inventario
 * @name inventory.service.js
 */
module.exports = (() => {
  'use strict';
  
  const orderService = require('./order.service');
  const ingredientService = require('./ingredient.service');
  const { orderStatus } = require('../utils/const.util');

  /**
   * Inicia el proceso de inventario para una orden
   * NOTA: Se reciben los dos producer para evitar la dependencia circular
   * @param {String} orderId 
   * @param {Function} marketTopicProducer
   * @param {Function} ingredientsTopicProducer
   */
  const inventoryProcessStart = async (orderId, marketTopicProducer, ingredientsTopicProducer) => {
    try {
      const ordenResult = await orderService.getById(orderId);
      if (!ordenResult || ordenResult.status !== orderStatus.KITCHEN) {
        console.log(`⚠️ La orden N°${orderId} no fue encontrada o no está en estado "En la cocina"`);
        return;
      };
      // Se obtiene la orden en formato de objeto para mejor manipulación
      const order = ordenResult.toObject();

      // Verifico si todos los ingredientes están disponibles
      const filter = {
        ingredient: { $in: order.dish.ingredients.map(ingredient => ingredient.name) },
      };
      const ingredientsResult = await ingredientService.get(null, filter);
      const ingredients = ingredientsResult.map(ingredient => ingredient.toObject());

      /**
       * Verifico si hay stock suficiente para todos los ingredientes, si almenos uno 
       * de los ingredientes no tiene stock suficiente, se procede a solicitar la 
       * reposición de los ingredientes faltantes al servicio de compras
       */
      const ingredientsOutOfStock = order.dish.ingredients.filter(ingredient => {
        const ingredientStock = ingredients.find(inventory => inventory.ingredient === ingredient.name);
        return ingredientStock && ingredientStock.stock < ingredient.quantity;
      });

      // Si hay ingredientes sin stock suficiente, se solicita la reposición y se finaliza el proceso
      if (ingredientsOutOfStock.length > 0) {
        await marketTopicProducer({ orderId: order._id });
        return;
      };
      
      // Se actualiza el inventario de los ingredientes y se notifica al servicio de pedidos
      let promisesToUpdateInventory = [];
      order.dish.ingredients.forEach(ingredient => {
        promisesToUpdateInventory.push(
          ingredientService.update(ingredient.name, ingredient.quantity, false)
        );
      });

      await Promise.all(promisesToUpdateInventory);
      await ingredientsTopicProducer({ orderId: order._id });
      
    } catch (error) {
      console.error(`❌ error al procesar la orden ${orderId}`, error);
    };
  };  

  return {
    inventoryProcessStart
  };
})();