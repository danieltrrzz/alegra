const kitchenService = require('../../src/services/kitchen.service');
const orderService = require('../../src/services/order.service');
const dishService = require('../../src/services/dish.service');
const { orderStatus } = require('../../src/utils/const.util');

jest.mock('../../src/services/order.service');
jest.mock('../../src/services/dish.service');

describe('Kitchen Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('kitchenProcessStart', () => {
    it('should process the order and update its status to KITCHEN', async () => {
      const mockOrder = {
        _id: '123',
        status: orderStatus.PREPARATION,
        toObject: jest.fn().mockReturnValue({ _id: '123', status: orderStatus.PREPARATION }),
      };
      const mockDish = {
        _id: '1',
        name: 'Paella',
        toObject: jest.fn().mockReturnValue({ _id: '1', name: 'Paella' }),
      };
      const mockInventoryProducer = jest.fn();

      orderService.getById.mockResolvedValue(mockOrder);
      dishService.getRandom.mockResolvedValue(mockDish);
      orderService.update.mockResolvedValue();

      await kitchenService.kitchenProcessStart('123', mockInventoryProducer);

      expect(orderService.getById).toHaveBeenCalledWith('123');
      expect(dishService.getRandom).toHaveBeenCalled();
      expect(orderService.update).toHaveBeenCalledWith('123', {
        status: orderStatus.KITCHEN,
        dish: { _id: '1', name: 'Paella' },
      });
      expect(mockInventoryProducer).toHaveBeenCalledWith({ orderId: '123' });
    });

    it('should not process the order if it is not in PREPARATION status', async () => {
      const mockOrder = {
        _id: '123',
        status: orderStatus.FINISHED,
        toObject: jest.fn(),
      };

      orderService.getById.mockResolvedValue(mockOrder);

      await kitchenService.kitchenProcessStart('123', jest.fn());

      expect(orderService.getById).toHaveBeenCalledWith('123');
      expect(dishService.getRandom).not.toHaveBeenCalled();
      expect(orderService.update).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      orderService.getById.mockRejectedValue(new Error('Database error'));

      await kitchenService.kitchenProcessStart('123', jest.fn());

      expect(orderService.getById).toHaveBeenCalledWith('123');
    });
  });

  describe('preparationProcessStart', () => {
    it('should simulate preparation time and notify order service', async () => {
      jest.setTimeout(15000);
      const mockOrder = {
        _id: '123',
        status: orderStatus.FINISHED,
        toObject: jest.fn().mockReturnValue({ _id: '123', status: orderStatus.FINISHED }),
      };
      const mockOrderProducer = jest.fn();
      orderService.getById.mockResolvedValue(mockOrder);
      await kitchenService.preparationProcessStart('123', mockOrderProducer);

      expect(orderService.getById).toHaveBeenCalledWith('123');
      expect(mockOrderProducer).toHaveBeenCalledWith({ orderId: '123' });
      jest.useRealTimers();
    }, 20000);

    it('should not process the order if it is not in FINISHED status', async () => {
      const mockOrder = {
        _id: '123',
        status: orderStatus.PREPARATION,
        toObject: jest.fn(),
      };

      orderService.getById.mockResolvedValue(mockOrder);

      await kitchenService.preparationProcessStart('123', jest.fn());

      expect(orderService.getById).toHaveBeenCalledWith('123');
      expect(orderService.update).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      orderService.getById.mockRejectedValue(new Error('Database error'));

      await kitchenService.preparationProcessStart('123', jest.fn());

      expect(orderService.getById).toHaveBeenCalledWith('123');
    });
  });
});