const OrderModel = require('../../src/models/order.model');
const orderService = require('../../src/services/order.service');
const { orderStatus } = require('../../src/utils/const.util');
const { socketNotify } = require('../../src/services/socket.service');

jest.mock('../../src/models/order.model');
jest.mock('../../src/services/socket.service');

describe('Order Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return a single order when id is provided', async () => {
      const mockOrder = { _id: '123', status: orderStatus.PREPARATION };
      OrderModel.findOne.mockResolvedValueOnce(mockOrder);

      const result = await orderService.get('123');

      expect(OrderModel.findOne).toHaveBeenCalledWith({ _id: '123' });
      expect(result).toEqual(mockOrder);
    });

    it('should return all orders when no id is provided', async () => {
      const mockOrders = [
        { _id: '123', status: orderStatus.PREPARATION },
        { _id: '456', status: orderStatus.DELIVERED },
      ];
      OrderModel.find.mockResolvedValueOnce(mockOrders);

      const result = await orderService.get();

      expect(OrderModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockOrders);
    });

    it('should throw an error if fetching orders fails', async () => {
      OrderModel.findOne.mockRejectedValueOnce(new Error('Database error'));

      await expect(orderService.get('123')).rejects.toThrow('Error al buscar ordenes');
      expect(OrderModel.findOne).toHaveBeenCalledWith({ _id: '123' });
    });
  });

  describe('create', () => {
    it('should create a new order and notify', async () => {
      const mockOrder = { _id: '123', status: orderStatus.PREPARATION };
      OrderModel.prototype.save = jest.fn().mockResolvedValueOnce(mockOrder);

      const result = await orderService.create();

      expect(OrderModel.prototype.save).toHaveBeenCalled();
      expect(socketNotify).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if creating an order fails', async () => {
      OrderModel.prototype.save = jest.fn().mockRejectedValueOnce(new Error('Database error'));

      await expect(orderService.create()).rejects.toThrow('Error al guardar una orden');
      expect(OrderModel.prototype.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an order and notify', async () => {
      const mockOrder = { _id: '123', status: orderStatus.DELIVERED };
      OrderModel.findByIdAndUpdate.mockResolvedValueOnce(mockOrder);

      const result = await orderService.update('123', { status: orderStatus.DELIVERED });

      expect(OrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { status: orderStatus.DELIVERED },
        { new: true }
      );
      expect(socketNotify).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if updating an order fails', async () => {
      OrderModel.findByIdAndUpdate.mockRejectedValueOnce(new Error('Database error'));

      await expect(orderService.update('123', { status: orderStatus.DELIVERED })).rejects.toThrow(
        'Error al actualizar una orden'
      );
      expect(OrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { status: orderStatus.DELIVERED },
        { new: true }
      );
    });
  });
});