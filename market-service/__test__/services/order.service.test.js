const { getById } = require('../../src/services/order.service');
const OrderModel = require('../../src/models/order.model');

jest.mock('../../src/models/order.model');

describe('Order Service', () => {
  describe('getById', () => {
    it('should return an order when a valid ID is provided', async () => {
      const mockOrder = { _id: 'order123', dish: 'Pizza' };
      OrderModel.findById.mockResolvedValue(mockOrder);

      const result = await getById('order123');

      expect(OrderModel.findById).toHaveBeenCalledWith('order123');
      expect(result).toEqual(mockOrder);
    });

    it('should return null when no order is found for the given ID', async () => {
      OrderModel.findById.mockResolvedValue(null);

      const result = await getById('nonexistentId');

      expect(OrderModel.findById).toHaveBeenCalledWith('nonexistentId');
      expect(result).toBeNull();
    });

    it('should throw an error when an exception occurs', async () => {
      OrderModel.findById.mockRejectedValue(new Error('Database error'));

      await expect(getById('order123')).rejects.toThrow('Error al buscar una orden');
    });
  });
});