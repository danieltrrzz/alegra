const request = require('supertest');
const express = require('express');
const dishRoutes = require('../../src/routes/dish.routes');
const dishController = require('../../src/controllers/dish.controller');

jest.mock('../../src/controllers/dish.controller', () => ({
  getAll: jest.fn(),
  getOne: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/dishes', dishRoutes);

describe('Dish Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /dishes', () => {
    it('should call getAll controller', async () => {
      dishController.getAll.mockImplementation((req, res) => res.status(200).json([]));

      const response = await request(app).get('/dishes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(dishController.getAll).toHaveBeenCalled();
    });
  });

  describe('GET /dishes/:id', () => {
    it('should call getOne controller with the correct id', async () => {
      const mockDish = { id: '1', name: 'Paella' };
      dishController.getOne.mockImplementation((req, res) => res.status(200).json(mockDish));

      const response = await request(app).get('/dishes/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDish);
      expect(dishController.getOne).toHaveBeenCalled();
    });

    it('should return 404 if the dish is not found', async () => {
      dishController.getOne.mockImplementation((req, res) => res.status(404).json({ message: 'Plato no encontrado' }));

      const response = await request(app).get('/dishes/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Plato no encontrado' });
      expect(dishController.getOne).toHaveBeenCalled();
    });
  });
});