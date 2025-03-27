const { marketProcessStart } = require('../../src/services/market.service');
const orderService = require('../../src/services/order.service');
const ingredientService = require('../../src/services/ingredient.service');
const marketPlaceService = require('../../src/services/market-place.service');
const purchaseHistoryService = require('../../src/services/purchase-history.service');
const { orderStatus } = require('../../src/utils/const.util');

jest.mock('../../src/services/order.service');
jest.mock('../../src/services/ingredient.service');
jest.mock('../../src/services/market-place.service');
jest.mock('../../src/services/purchase-history.service');

describe('marketProcessStart', () => {
  const mockInventoryTopicProducer = jest.fn();
  const mockOrderId = 'order123';
  const mockOrder = {
    _id: mockOrderId,
    status: orderStatus.KITCHEN,
    dish: {
      name: 'Pizza',
      ingredients: [
        { name: 'Cheese', quantity: 2 },
        { name: 'Tomato', quantity: 3 }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process the order when all ingredients are in stock', async () => {
    orderService.getById.mockResolvedValue({ ...mockOrder, toObject: () => mockOrder });
    ingredientService.get.mockResolvedValue([
      { ingredient: 'Cheese', stock: 5, toObject: () => ({ ingredient: 'Cheese', stock: 5 }) },
      { ingredient: 'Tomato', stock: 4, toObject: () => ({ ingredient: 'Tomato', stock: 4 }) }
    ]);

    await marketProcessStart(mockOrderId, mockInventoryTopicProducer);

    expect(orderService.getById).toHaveBeenCalledWith(mockOrderId);
    expect(ingredientService.get).toHaveBeenCalledWith(null, expect.any(Object));
    expect(mockInventoryTopicProducer).toHaveBeenCalledWith({ orderId: mockOrderId });
    expect(marketPlaceService.purchasingIngredients).not.toHaveBeenCalled();
    expect(purchaseHistoryService.create).not.toHaveBeenCalled();
  });

  it('should purchase missing ingredients and update inventory', async () => {
    jest.setTimeout(15000);
    orderService.getById.mockResolvedValue({ ...mockOrder, toObject: () => mockOrder });
    ingredientService.get.mockResolvedValue([
      { ingredient: 'Cheese', stock: 1, toObject: () => ({ ingredient: 'Cheese', stock: 1 }) },
      { ingredient: 'Tomato', stock: 1, toObject: () => ({ ingredient: 'Tomato', stock: 1 }) }
    ]);
    marketPlaceService.purchasingIngredients
      .mockResolvedValueOnce({ ingredient: 'Cheese', quantityPurchase: 1 })
      .mockResolvedValueOnce({ ingredient: 'Tomato', quantityPurchase: 2 });

    await marketProcessStart(mockOrderId, mockInventoryTopicProducer);

    expect(orderService.getById).toHaveBeenCalledWith(mockOrderId);
    expect(ingredientService.get).toHaveBeenCalledWith(null, expect.any(Object));
    expect(marketPlaceService.purchasingIngredients).toHaveBeenCalledWith('Cheese');
    expect(marketPlaceService.purchasingIngredients).toHaveBeenCalledWith('Tomato');
    expect(ingredientService.update).toHaveBeenCalledWith([
      { ingredient: 'Cheese', quantityPurchase: 1 },
      { ingredient: 'Tomato', quantityPurchase: 2 }
    ]);
    expect(purchaseHistoryService.create).toHaveBeenCalledWith({
      orderId: mockOrderId,
      dishName: 'Pizza',
      ingredientsPurchased: [
        { ingredient: 'Cheese', quantityPurchase: 1 },
        { ingredient: 'Tomato', quantityPurchase: 2 }
      ]
    });
    expect(mockInventoryTopicProducer).toHaveBeenCalledWith({ orderId: mockOrderId });
  }, 20000);

  it('should log an error if an exception occurs', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    orderService.getById.mockRejectedValue(new Error('Database error'));

    await marketProcessStart(mockOrderId, mockInventoryTopicProducer);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('❌ error al procesar la orden'), expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  it('should not process the order if it is not in the KITCHEN status', async () => {
    orderService.getById.mockResolvedValue({ toObject: () => ({ ...mockOrder, status: orderStatus.DELIVERED }) });

    await marketProcessStart(mockOrderId, mockInventoryTopicProducer);

    expect(orderService.getById).toHaveBeenCalledWith(mockOrderId);
    expect(mockInventoryTopicProducer).not.toHaveBeenCalled();
    expect(ingredientService.get).not.toHaveBeenCalled();
  });
});