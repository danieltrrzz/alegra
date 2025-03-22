/**
 * @fileoverview Controlador para manejar las peticiones de los historiales de compra
 * @name purchase-history.controller.js
 */
'use strict';

const purchaseHistoryService = require('../services/purchase-history.service');

/**
 * Obtener un historial de compra
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseHistory = await purchaseHistoryService.get(id);

    if (!purchaseHistory) return res.status(404).json({ message: 'Historial de compra no encontrado' });

    res.status(200).json(purchaseHistory);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de compra', error });
  }
};

/**
 * Obtener todos los historiales de compra
 * @param {*} req 
 * @param {*} res 
 */
const getAll = async (req, res) => {
  try {
    const purchaseHistory = await purchaseHistoryService.get();
    res.status(200).json(purchaseHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los historiales de compra', error });
  }
};

module.exports = {
  getOne,
  getAll
};