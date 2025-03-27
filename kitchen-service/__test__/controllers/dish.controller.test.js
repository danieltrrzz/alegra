const request = require('supertest');
const express = require('express');
const dishController = require('../../src/controllers/dish.controller');
const dishService = require('../../src/services/dish.service');

jest.mock('../../src/services/dish.service');

const app = express();
app.use(express.json());
app.get('/dishes/:id', dishController.getOne);
app.get('/dishes', dishController.getAll);

describe('Dish Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /dishes/:id - getOne', () => {
    it('should return 200 and the dish when it exists', async () => {
      const mockDish = { id: '1', name: 'Paella' };
      dishService.get.mockResolvedValue(mockDish);

      const response = await request(app).get('/dishes/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDish);
      expect(dishService.get).toHaveBeenCalledWith('1');
    });

    it('should return 404 when the dish does not exist', async () => {
      dishService.get.mockResolvedValue(null);

      const response = await request(app).get('/dishes/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Plato no encontrado' });
      expect(dishService.get).toHaveBeenCalledWith('999');
    });

    it('should return 500 when there is a server error', async () => {
      dishService.get.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/dishes/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error al obtener el plato',
        error: expect.anything(),
      });
      expect(dishService.get).toHaveBeenCalledWith('1');
    });
  });

  describe('GET /dishes - getAll', () => {
    it('should return 200 and a list of dishes', async () => {
      const mockDishes = [
        { id: '1', name: 'Paella' },
        { id: '2', name: 'Tacos' },
      ];
      dishService.get.mockResolvedValue(mockDishes);

      const response = await request(app).get('/dishes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDishes);
      expect(dishService.get).toHaveBeenCalledWith();
    });

    it('should return 500 when there is a server error', async () => {
      dishService.get.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/dishes');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error al obtener los platos',
        error: expect.anything(),
      });
      expect(dishService.get).toHaveBeenCalledWith();
    });
  });
});