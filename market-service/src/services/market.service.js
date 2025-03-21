/**
 * @fileoverview Servicio para manejar la lógica de negocio del mercado
 * @name market.service.js
 */
module.exports = (() => {
  'use strict';

  const orderService = require('./order.service');
  const ingredientService = require('./ingredient.service');
  const marketPlaceService = require('./market-place.service');
  const { orderStatus } = require('../utils/const.util');

  /**
   * Inicia el proceso de inventario para una orden
   * NOTA: Se reciben los dos producer para evitar la dependencia circular
   * @param {String} orderId 
   * @param {Function} inventoryTopicProducer
   */
  const marketProcessStart = async (orderId, inventoryTopicProducer) => {
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
      };
      const ingredientsResult = await ingredientService.get(null, filter);
      const ingredients = ingredientsResult.map(ingredient => ingredient.toObject());

      //Extraigo los ingredientes que no tienen stock suficiente para la orden
      const ingredientsOutOfStock = order.dish.ingredients.filter(ingredient => {
        const ingredientStock = ingredients.find(inventory => inventory.stock >= 0 && inventory.ingredient === ingredient.name);
        return ingredientStock && ingredientStock.stock < ingredient.quantity;
      });

      // Si por alguna razon todos los ingredientes tienen stock suficiente, se envía la orden al proceso de inventario
      if (ingredientsOutOfStock.length == 0) {
        await inventoryTopicProducer({ orderId: order._id });
        return;
      };

      // Realizo la compra de los ingredientes faltantes 
      let promisesToBuyIngredients = [];
      ingredientsOutOfStock.forEach(ingredient => {
        promisesToBuyIngredients.push(marketPlaceService.purchasingIngredients(ingredient.name));
      });  
      const ingredientsPurchasedResult = await Promise.all(promisesToBuyIngredients);

      // Se actualiza el inventario de los ingredientes comprados y se notifica al servicio de pedidos
      let promisesToUpdateInventory = [];
      ingredientsPurchasedResult.forEach(buy => {
        promisesToUpdateInventory.push(
          ingredientService.update(buy.ingredient, buy.quantityPurchase, true)
        );
      });
      await Promise.all(promisesToUpdateInventory);
      await inventoryTopicProducer({ orderId: order._id });

    } catch (error) {
      console.error(`❌ error al procesar la orden ${orderId}`, error);
    };
  };

  return {
    marketProcessStart
  };
})();