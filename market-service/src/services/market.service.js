/**
 * @fileoverview Servicio para manejar la lógica de negocio del mercado
 * @name market.service.js
 */
module.exports = (() => {
  'use strict';

  const orderService = require('./order.service');
  const ingredientService = require('./ingredient.service');
  const marketPlaceService = require('./market-place.service');
  const purchaseHistoryService = require('./purchase-history.service');
  const { orderStatus } = require('../utils/const.util');

  /**
   * Inicia el proceso de inventario para una orden
   * NOTA: Se reciben el producer como callback para evitar la dependencia circular
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
        stock: { $gte: 0 }
      };
      const ingredientsResult = await ingredientService.get(null, filter);
      const ingredients = ingredientsResult.map(ingredient => ingredient.toObject());

      //Extraigo los ingredientes que no tienen stock suficiente para la orden
      const ingredientsOutOfStock = order.dish.ingredients.filter(ingredient => {
        const ingredientStock = ingredients.find(inventory => inventory.ingredient === ingredient.name);
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

      // Se actualiza el inventario de los ingredientes comprados       
      await ingredientService.update(ingredientsPurchasedResult);

      // Se crea el historial de compra
      const purchaseHistoryData = {
        orderId: order._id,
        dishName: order.dish.name,
        ingredientsPurchased: ingredientsPurchasedResult.map(buy => ({
          ingredient: buy.ingredient,
          quantityPurchase: buy.quantityPurchase
        }))
      };
      purchaseHistoryService.create(purchaseHistoryData);

      // Se notifica al servicio de inventario para que procese la orden
      await inventoryTopicProducer({ orderId: order._id });

    } catch (error) {
      console.error(`❌ error al procesar la orden ${orderId}`, error);
    };
  };

  return {
    marketProcessStart
  };
})();