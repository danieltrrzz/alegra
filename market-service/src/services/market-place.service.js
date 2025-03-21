/**
 * @fileoverview Servicio para manejar la lógica de negocio de la compra de ingredientes
 * @name market-place.service.js
 */
module.exports = (() => {
  'use strict';

  const { MARKET_PLACE_URI } = require('../config/env');
  const axios = require('axios');

  /**
   * Realiza la compra de los ingredientes consumiendo un servicio externo
   * @param {String} ingredient
   * @returns {Object} Resultado de la compra
   */
  const purchasingIngredients = async (ingredient) => {
    try {
      const purchaseResult = await axios.get(MARKET_PLACE_URI, { params: { ingredient } });
      const { quantitySold } = purchaseResult.data;

      typeof quantitySold === 'number' && quantitySold > 0
        ? console.log(`📦 Compra exitosa: ${ingredient} x${quantitySold}`)
        : console.log(`⚠️ Ingrediente ${ingredient} no disponible en la plaza de mercado.`);
    
      return { 
        ingredient,
        quantityPurchase: quantitySold || 0
      };

    } catch (error) {
      console.error(`❌ Error al realizar la compra de ingredientes`, error);
      return { 
        ingredient,
        quantityPurchase: 0
      };
    }
  };

  return {
    purchasingIngredients
  };
})();