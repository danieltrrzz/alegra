const request = require('supertest');
const express = require('express');
const orderController = require('../../src/controllers/order.controller');
const orderService = require('../../src/services/order.service');
const { kitchenTopicProducer } = require('../../src/services/kafka.service');
const { SECRET_KEY } = require('../../src/config/env');

jest.mock('../../src/services/order.service');
jest.mock('../../src/services/kafka.service');

const app = express();
app.use(express.json());
app.get('/orders/:id', orderController.getOne);
app.get('/orders', orderController.getAll);
app.post('/orders', orderController.create);

describe('Order Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOne', () => {
    it('should return 200 and the order if found', async () => {
      const mockOrder = { id: '123', name: 'Test Order' };
      orderService.get.mockResolvedValueOnce(mockOrder);

      const response = await request(app).get('/orders/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrder);
      expect(orderService.get).toHaveBeenCalledWith('123');
    });

    it('should return 404 if the order is not found', async () => {
      orderService.get.mockResolvedValueOnce(null);

      const response = await request(app).get('/orders/123');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'orden no encontrado' });
    });

    it('should return 500 on error', async () => {
      orderService.get.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/orders/123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error al obtener el orden', error: expect.any(Object) });
    });
  });

  describe('getAll', () => {
    it('should return 200 and all orders', async () => {
      const mockOrders = [{ id: '123', name: 'Order 1' }, { id: '456', name: 'Order 2' }];
      orderService.get.mockResolvedValueOnce(mockOrders);

      const response = await request(app).get('/orders');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
    });

    it('should return 500 on error', async () => {
      orderService.get.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/orders');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error al obtener los ordenes', error: expect.any(Object) });
    });
  });

  describe('create', () => {
    it('should return 200 and create an order if secretKey is valid', async () => {
      const mockOrder = { _id: '123', name: 'New Order' };
      orderService.create.mockResolvedValueOnce(mockOrder);

      const response = await request(app)
        .post('/orders')
        .send({ secretKey: SECRET_KEY });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrder);
      expect(orderService.create).toHaveBeenCalled();
      expect(kitchenTopicProducer).toHaveBeenCalledWith({ orderId: '123' });
    });

    it('should return 400 if secretKey is invalid', async () => {
      const response = await request(app)
        .post('/orders')
        .send({ secretKey: 'invalid_key' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Solicud inválid o clave secreta incorrecta' });
    });

    it('should return 500 on error', async () => {
      orderService.create.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/orders')
        .send({ secretKey: SECRET_KEY });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error al crear orden', error: expect.any(Object) });
    });
  });
});