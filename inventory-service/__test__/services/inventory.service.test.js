const inventoryService = require('../../src/services/inventory.service');
const orderService = require('../../src/services/order.service');
const ingredientService = require('../../src/services/ingredient.service');
const { orderStatus } = require('../../src/utils/const.util');

jest.mock('../../src/services/order.service'); // Mock del servicio de órdenes
jest.mock('../../src/services/ingredient.service'); // Mock del servicio de ingredientes

describe('Inventory Service', () => {
  describe('inventoryProcessStart', () => {
    const mockMarketTopicProducer = jest.fn();
    const mockIngredientsTopicProducer = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should terminate if the order does not exist or is not in "KITCHEN" status', async () => {
      orderService.getById.mockResolvedValue(null);

      await inventoryService.inventoryProcessStart('orderId123', mockMarketTopicProducer, mockIngredientsTopicProducer);

      expect(orderService.getById).toHaveBeenCalledWith('orderId123');
      expect(mockMarketTopicProducer).not.toHaveBeenCalled();
      expect(mockIngredientsTopicProducer).not.toHaveBeenCalled();
    });

    it('should request replenishment if there is insufficient stock for ingredients', async () => {
      const mockOrder = {
        _id: 'orderId123',
        status: orderStatus.KITCHEN,
        dish: {
          ingredients: [
            { name: 'Tomato', quantity: 5 },
            { name: 'Onion', quantity: 3 },
          ],
        },
      };
      const mockIngredients = [
        { ingredient: 'Tomato', stock: 1, toObject: () => ({ ingredient: 'Tomato', stock: 1 }) },
        { ingredient: 'Onion', stock: 1, toObject: () => ({ ingredient: 'Onion', stock: 1 }) },
      ];

      orderService.getById.mockResolvedValue({ ...mockOrder, toObject: () => mockOrder });
      ingredientService.get.mockResolvedValue(mockIngredients);

      await inventoryService.inventoryProcessStart('orderId123', mockMarketTopicProducer, mockIngredientsTopicProducer);

      expect(orderService.getById).toHaveBeenCalledWith('orderId123');
      expect(ingredientService.get).toHaveBeenCalledWith(null, {
        ingredient: { $in: ['Tomato', 'Onion'] },
        stock: { $gte: 0 },
      });
      expect(mockMarketTopicProducer).toHaveBeenCalledWith({ orderId: 'orderId123' });
      expect(mockIngredientsTopicProducer).not.toHaveBeenCalled();
    });

    it('should update inventory and notify if there is sufficient stock', async () => {
      const mockOrder = {
        _id: 'orderId123',
        status: "KITCHEN",
        dish: {
          name: "French Fries with Ketchup",
          ingredients: [
            {
              name: "potato",
              quantity: 2,
            },
            {
              name: "ketchup",
              quantity: 1,
            }
          ]
        }
      };
      const mockIngredients = [
        { ingredient: 'Tomato', stock: 10, toObject: () => ({ ingredient: 'Tomato', stock: 10 }) },
        { ingredient: 'Onion', stock: 5, toObject: () => ({ ingredient: 'Tomato', stock: 5 }) },
      ];

      // Mock setup
      orderService.getById.mockResolvedValue({ ...mockOrder, toObject: () => mockOrder });
      ingredientService.get.mockResolvedValue(mockIngredients);
      ingredientService.update.mockResolvedValue();
      orderService.update = jest.fn(); // Explicit mock for orderService.update

      // Service call
      await inventoryService.inventoryProcessStart('orderId123', mockMarketTopicProducer, mockIngredientsTopicProducer);

      // Assertions
      expect(orderService.getById).toHaveBeenCalledWith('orderId123');
      expect(ingredientService.get).toHaveBeenCalled();
      expect(ingredientService.update).toHaveBeenCalledWith(mockOrder.dish.ingredients);
      expect(orderService.update).toHaveBeenCalledWith('orderId123', { status: orderStatus.FINISHED });
      expect(mockIngredientsTopicProducer).toHaveBeenCalledWith({ orderId: 'orderId123' });
      expect(mockMarketTopicProducer).not.toHaveBeenCalled();
    });

    it('should handle errors and not throw exceptions', async () => {
      orderService.getById.mockRejectedValue(new Error('Database error'));

      await expect(
        inventoryService.inventoryProcessStart('orderId123', mockMarketTopicProducer, mockIngredientsTopicProducer)
      ).resolves.not.toThrow();

      expect(orderService.getById).toHaveBeenCalledWith('orderId123');
      expect(mockMarketTopicProducer).not.toHaveBeenCalled();
      expect(mockIngredientsTopicProducer).not.toHaveBeenCalled();
    });
  });
});