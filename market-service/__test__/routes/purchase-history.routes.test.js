const request = require('supertest');
const express = require('express');
const purchaseHistoryRoutes = require('../../src/routes/purchase-history.routes');
const purchaseHistoryService = require('../../src/services/purchase-history.service');

jest.mock('../../src/services/purchase-history.service');

const app = express();
app.use(express.json());
app.use('/purchase-history', purchaseHistoryRoutes);

describe('Purchase History Routes', () => {
  describe('GET /purchase-history', () => {
    it('should return 200 and all purchase histories', async () => {
      const mockPurchaseHistories = [
        { id: '1', item: 'Product A', quantity: 2 },
        { id: '2', item: 'Product B', quantity: 1 },
      ];
      purchaseHistoryService.get.mockResolvedValue(mockPurchaseHistories);

      const response = await request(app).get('/purchase-history');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPurchaseHistories);
    });

    it('should return 500 if an error occurs', async () => {
      purchaseHistoryService.get.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/purchase-history');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error al obtener los historiales de compra',
        error: expect.anything(),
      });
    });
  });

  describe('GET /purchase-history/:id', () => {
    it('should return 200 and the purchase history if found', async () => {
      const mockPurchaseHistory = { id: '1', item: 'Product A', quantity: 2 };
      purchaseHistoryService.get.mockResolvedValue(mockPurchaseHistory);

      const response = await request(app).get('/purchase-history/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPurchaseHistory);
    });

    it('should return 404 if the purchase history is not found', async () => {
      purchaseHistoryService.get.mockResolvedValue(null);

      const response = await request(app).get('/purchase-history/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Historial de compra no encontrado' });
    });

    it('should return 500 if an error occurs', async () => {
      purchaseHistoryService.get.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/purchase-history/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error al obtener el historial de compra',
        error: expect.anything(),
      });
    });
  });
});