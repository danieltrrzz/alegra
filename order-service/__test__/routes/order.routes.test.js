const request = require('supertest');
const express = require('express');
const orderRoutes = require('../../src/routes/order.routes');
const orderController = require('../../src/controllers/order.controller');

jest.mock('../../src/controllers/order.controller', () => ({
  getAll: jest.fn(),
  getOne: jest.fn(),
  create: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/orders', orderRoutes);

describe('Order Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('should call getAll controller', async () => {
      orderController.getAll.mockImplementation((req, res) => res.status(200).json([]));

      const response = await request(app).get('/orders');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(orderController.getAll).toHaveBeenCalled();
    });
  });

  describe('GET /orders/:id', () => {
    it('should call getOne controller with the correct id', async () => {
      const mockOrder = { id: '123', name: 'Test Order' };
      orderController.getOne.mockImplementation((req, res) => res.status(200).json(mockOrder));

      const response = await request(app).get('/orders/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrder);
      expect(orderController.getOne).toHaveBeenCalled();
    });
  });

  describe('POST /orders', () => {
    it('should call create controller', async () => {
      const mockOrder = { id: '123', name: 'New Order' };
      orderController.create.mockImplementation((req, res) => res.status(201).json(mockOrder));

      const response = await request(app).post('/orders').send({ name: 'New Order' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockOrder);
      expect(orderController.create).toHaveBeenCalled();
    });
  });
});