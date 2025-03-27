const OrderModel = require('../../src/models/order.model');
const orderService = require('../../src/services/order.service');
const { socketNotify } = require('../../src/services/socket.service');

jest.mock('../../src/models/order.model');
jest.mock('../../src/services/socket.service');

describe('Order Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return a single order when id is provided', async () => {
      const mockOrder = { _id: '123', status: 'PREPARATION' };
      OrderModel.findById.mockResolvedValueOnce(mockOrder);

      const result = await orderService.getById('123');

      expect(OrderModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if fetching the order fails', async () => {
      OrderModel.findById.mockRejectedValueOnce(new Error('Database error'));

      await expect(orderService.getById('123')).rejects.toThrow('Error al buscar una orden');
      expect(OrderModel.findById).toHaveBeenCalledWith('123');
    });
  });

  describe('update', () => {
    it('should update an order and notify', async () => {
      const mockOrder = { _id: '123', status: 'DELIVERED' };
      OrderModel.findByIdAndUpdate.mockResolvedValueOnce(mockOrder);

      const result = await orderService.update('123', { status: 'DELIVERED' });

      expect(OrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { status: 'DELIVERED' },
        { new: true }
      );
      expect(socketNotify).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if updating the order fails', async () => {
      OrderModel.findByIdAndUpdate.mockRejectedValueOnce(new Error('Database error'));

      await expect(orderService.update('123', { status: 'DELIVERED' })).rejects.toThrow(
        'Error al actualizar una orden'
      );
      expect(OrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { status: 'DELIVERED' },
        { new: true }
      );
    });
  });
});