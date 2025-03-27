const request = require('supertest');
const express = require('express');
const ingredientRoutes = require('../../src/routes/ingredient.routes');
const ingredientController = require('../../src/controllers/ingredient.controller');

jest.mock('../../src/controllers/ingredient.controller'); // Mock del controlador

const app = express();
app.use(express.json());
app.use('/ingredients', ingredientRoutes);

describe('Ingredient Routes', () => {
  describe('GET /ingredients', () => {
    it('should return 200 and all ingredients', async () => {
      const mockIngredients = [
        { ingredient: 'Tomato', stock: 10 },
        { ingredient: 'Onion', stock: 5 },
      ];
      ingredientController.getAll.mockImplementation((req, res) => {
        res.status(200).json(mockIngredients);
      });

      const response = await request(app).get('/ingredients');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockIngredients);
    });

    it('should return 500 if an error occurs', async () => {
      ingredientController.getAll.mockImplementation((req, res) => {
        res.status(500).json({ message: 'Error al obtener los ingredientes' });
      });

      const response = await request(app).get('/ingredients');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error al obtener los ingredientes' });
    });
  });

  describe('GET /ingredients/:ingredient', () => {
    it('should return 200 and the ingredient if found', async () => {
      const mockIngredient = { ingredient: 'Tomato', stock: 10 };
      ingredientController.getOne.mockImplementation((req, res) => {
        res.status(200).json(mockIngredient);
      });

      const response = await request(app).get('/ingredients/Tomato');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockIngredient);
    });

    it('should return 404 if the ingredient is not found', async () => {
      ingredientController.getOne.mockImplementation((req, res) => {
        res.status(404).json({ message: 'Ingrediente no encontrado' });
      });

      const response = await request(app).get('/ingredients/NonExistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Ingrediente no encontrado' });
    });

    it('should return 500 if an error occurs', async () => {
      ingredientController.getOne.mockImplementation((req, res) => {
        res.status(500).json({ message: 'Error al obtener el ingrediente' });
      });

      const response = await request(app).get('/ingredients/Tomato');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error al obtener el ingrediente' });
    });
  });
});