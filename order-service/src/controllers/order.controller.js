/**
 * @fileoverview Controlador para manejar las peticiones de las órdenes
 * @name order.controller.js
 */
'use strict';

const orderService = require('../services/order.service');
const { SECRET_KEY } = require('../config/env');

/**
 * Obtener una orden
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.get(id);

    if (!order) return res.status(404).json({ message: 'orden no encontrado' });

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el orden', error });
  }
};

/**
 * Obtener todas las ordenes
 * @param {*} req 
 * @param {*} res 
 */
const getAll = async (req, res) => {
  try {
    const order = await orderService.get();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los ordenes', error });
  }
};

/**
 * Crear una orden
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const create = async (req, res) => {
  try {
    const { secretKey } = req.body;
    if (!secretKey || secretKey !== SECRET_KEY) return res.status(400).json({ message: 'Solicud inválid o clave secreta incorrecta' });

    const order = await orderService.create();

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el orden', error });
  }
};

module.exports = {
  getOne,
  getAll,
  create
};