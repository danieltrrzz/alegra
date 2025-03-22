/**
 * @fileoverview Controlador para manejar las peticiones de los platos
 * @name dish.controller.js
 */
'use strict';

const dishService = require('../services/dish.service');

/**
 * Obtener un plato
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await dishService.get(id);

    if (!dish) return res.status(404).json({ message: 'Plato no encontrado' });

    res.status(200).json(dish);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el plato', error });
  }
};

/**
 * Obtener todos los platos
 * @param {*} req 
 * @param {*} res 
 */
const getAll = async (req, res) => {
  try {
    const dish = await dishService.get();
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los platos', error });
  }
};

module.exports = {
  getOne,
  getAll
};