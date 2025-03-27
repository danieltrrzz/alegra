const request = require('supertest');
const express = require('express');
const purchaseHistoryController = require('../../src/controllers/purchase-history.controller');
const purchaseHistoryService = require('../../src/services/purchase-history.service');

jest.mock('../../src/services/purchase-history.service');

const app = express();
app.use(express.json());
app.get('/purchase-history/:id', purchaseHistoryController.getOne);
app.get('/purchase-history', purchaseHistoryController.getAll);

describe('Purchase History Controller', () => {
  describe('getOne', () => {
    it('should return 200 and the purchase history when it exists', async () => {
      const mockPurchaseHistory = { id: '1', item: 'Product A', quantity: 2 };
      purchaseHistoryService.get.mockResolvedValue(mockPurchaseHistory);

      const response = await request(app).get('/purchase-history/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPurchaseHistory);
      expect(purchaseHistoryService.get).toHaveBeenCalledWith('1');
    });

    it('should return 404 when the purchase history does not exist', async () => {
      purchaseHistoryService.get.mockResolvedValue(null);

      const response = await request(app).get('/purchase-history/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Historial de compra no encontrado' });
      expect(purchaseHistoryService.get).toHaveBeenCalledWith('1');
    });

    it('should return 500 when an error occurs', async () => {
      purchaseHistoryService.get.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/purchase-history/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error al obtener el historial de compra',
        error: expect.anything(),
      });
    });
  });

  describe('getAll', () => {
    it('should return 200 and all purchase histories', async () => {
      const mockPurchaseHistories = [
        { id: '1', item: 'Product A', quantity: 2 },
        { id: '2', item: 'Product B', quantity: 1 },
      ];
      purchaseHistoryService.get.mockResolvedValue(mockPurchaseHistories);

      const response = await request(app).get('/purchase-history');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPurchaseHistories);
      expect(purchaseHistoryService.get).toHaveBeenCalled();
    });

    it('should return 500 when an error occurs', async () => {
      purchaseHistoryService.get.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/purchase-history');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error al obtener los historiales de compra',
        error: expect.anything(),
      });
    });
  });
});