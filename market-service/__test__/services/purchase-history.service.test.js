const { get, create } = require('../../src/services/purchase-history.service');
const PurchaseHistoryModel = require('../../src/models/purchase-history.model');

jest.mock('../../src/models/purchase-history.model');

describe('Purchase History Service', () => {
  describe('get', () => {
    it('should return a single purchase history when an ID is provided', async () => {
      const mockPurchaseHistory = { _id: 'history123', orderId: 'order123' };
      PurchaseHistoryModel.findOne.mockResolvedValue(mockPurchaseHistory);

      const result = await get('history123');

      expect(PurchaseHistoryModel.findOne).toHaveBeenCalledWith({ _id: 'history123' });
      expect(result).toEqual(mockPurchaseHistory);
    });

    it('should return all purchase histories when no ID is provided', async () => {
      const mockPurchaseHistories = [
        { _id: 'history123', orderId: 'order123' },
        { _id: 'history124', orderId: 'order124' }
      ];
      PurchaseHistoryModel.find.mockResolvedValue(mockPurchaseHistories);

      const result = await get();

      expect(PurchaseHistoryModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockPurchaseHistories);
    });

    it('should throw an error when an exception occurs', async () => {
      PurchaseHistoryModel.findOne.mockRejectedValue(new Error('Database error'));

      await expect(get('history123')).rejects.toThrow('Error al buscar historiales de compra');
    });
  });

  describe('create', () => {
    it('should create a new purchase history and return it', async () => {
      const mockPurchaseHistoryData = { orderId: 'order123', dishName: 'Pizza' };
      const mockSavedPurchaseHistory = { _id: 'history123', ...mockPurchaseHistoryData };
      PurchaseHistoryModel.prototype.save = jest.fn().mockResolvedValue(mockSavedPurchaseHistory);

      const result = await create(mockPurchaseHistoryData);

      expect(PurchaseHistoryModel).toHaveBeenCalledWith(mockPurchaseHistoryData);
      expect(result).toEqual(mockSavedPurchaseHistory);
    });

    it('should throw an error when an exception occurs during creation', async () => {
      const mockPurchaseHistoryData = { orderId: 'order123', dishName: 'Pizza' };
      PurchaseHistoryModel.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(create(mockPurchaseHistoryData)).rejects.toThrow('Error al guardar un historial de compra');
    });
  });
});