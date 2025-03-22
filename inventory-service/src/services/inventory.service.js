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
   * NOTA: Se reciben los dos producer como callback para evitar la dependencia circular
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

      // Consulto los ingredientes de la orden
      const filter = {
        ingredient: { $in: order.dish.ingredients.map(ingredient => ingredient.name) },
        stock: { $gte: 0 }
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
      
      // Se actualiza el inventario de los ingredientes restando la cantidad usada
      await ingredientService.update(order.dish.ingredients);

      // Se actualiza el estado de la orden a "Finalizada"
      await orderService.update(order._id, { status: orderStatus.FINISHED });

      // Se notifica al servicio de cocina que los ingredientes están listos
      await ingredientsTopicProducer({ orderId: order._id });
      
    } catch (error) {
      console.error(`❌ error al procesar la orden ${orderId}`, error);
    };
  };  

  return {
    inventoryProcessStart
  };
})();