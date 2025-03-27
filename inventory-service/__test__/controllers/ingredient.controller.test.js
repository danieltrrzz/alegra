const request = require('supertest');
const express = require('express');
const ingredientController = require('../../src/controllers/ingredient.controller');
const ingredientService = require('../../src/services/ingredient.service');

jest.mock('../../src/services/ingredient.service'); // Mock del servicio

const app = express();
app.use(express.json());
app.get('/ingredient/:ingredient', ingredientController.getOne);
app.get('/ingredients', ingredientController.getAll);

describe('Ingredient Controller', () => {
  describe('getOne', () => {
    it('should return 200 and the ingredient if found', async () => {
      const mockIngredient = { ingredient: 'Tomato', stock: 10 };
      ingredientService.get.mockResolvedValue(mockIngredient);

      const response = await request(app).get('/ingredient/Tomato');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockIngredient);
    });

    it('should return 404 if the ingredient is not found', async () => {
      ingredientService.get.mockResolvedValue(null);

      const response = await request(app).get('/ingredient/NonExistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Ingrediente no encontrado' });
    });

    it('should return 500 if an error occurs', async () => {
      ingredientService.get.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/ingredient/Tomato');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error al obtener el ingrediente',
        error: expect.anything(),
      });
    });
  });

  describe('getAll', () => {
    it('should return 200 and all ingredients', async () => {
      const mockIngredients = [
        { ingredient: 'Tomato', stock: 10 },
        { ingredient: 'Onion', stock: 5 },
      ];
      ingredientService.get.mockResolvedValue(mockIngredients);

      const response = await request(app).get('/ingredients');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockIngredients);
    });

    it('should return 500 if an error occurs', async () => {
      ingredientService.get.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/ingredients');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error al obtener los ingredientes',
        error: expect.anything(),
      });
    });
  });
});