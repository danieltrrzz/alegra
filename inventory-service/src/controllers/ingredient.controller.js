/**
 * @fileoverview Controlador para manejar las peticiones de los ingredientes
 * @name inventory.controller.js
 */
'use strict';

const ingredientService = require('../services/ingredient.service');

/**
 * Obtener un ingrediente
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getOne = async (req, res) => {
  try {
    const { ingredient } = req.params;
    const inventory = await ingredientService.get(ingredient);

    if (!inventory) return res.status(404).json({ message: 'Ingrediente no encontrado' });

    res.status(200).json(inventory);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el ingrediente', error });
  }
};

/**
 * Obtener todos los ingredientes
 * @param {*} req 
 * @param {*} res 
 */
const getAll = async (req, res) => {
  try {
    const inventory = await ingredientService.get();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los ingredientes', error });
  }
};

module.exports = {
  getOne,
  getAll
};