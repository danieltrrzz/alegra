const { get, update } = require('../../src/services/ingredient.service');
const InventoryModel = require('../../src/models/inventory.model');

jest.mock('../../src/models/inventory.model');

describe('Ingredient Service', () => {
  describe('get', () => {
    it('should return a single ingredient when ingredient parameter is provided', async () => {
      const mockIngredient = { ingredient: 'Tomato', stock: 10 };
      InventoryModel.findOne.mockResolvedValue(mockIngredient);

      const result = await get('Tomato');

      expect(InventoryModel.findOne).toHaveBeenCalledWith({ ingredient: 'Tomato' });
      expect(result).toEqual(mockIngredient);
    });

    it('should return all ingredients when no ingredient parameter is provided', async () => {
      const mockIngredients = [
        { ingredient: 'Tomato', stock: 10 },
        { ingredient: 'Onion', stock: 5 }
      ];
      InventoryModel.find.mockResolvedValue(mockIngredients);

      const result = await get();

      expect(InventoryModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockIngredients);
    });

    it('should throw an error when an exception occurs', async () => {
      InventoryModel.findOne.mockRejectedValue(new Error('Database error'));

      await expect(get('Tomato')).rejects.toThrow('Error al buscar ingredientes');
    });
  });

  describe('update', () => {
    it('should update the stock of ingredients and return the result', async () => {
      const mockIngredients = [
        { ingredient: 'Tomato', quantityPurchase: 5 },
        { ingredient: 'Onion', quantityPurchase: 3 }
      ];
      const mockResult = { modifiedCount: 2 };
      InventoryModel.bulkWrite.mockResolvedValue(mockResult);

      const result = await update(mockIngredients);

      expect(InventoryModel.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: { ingredient: 'Tomato' },
            update: { $inc: { stock: 5 } }
          }
        },
        {
          updateOne: {
            filter: { ingredient: 'Onion' },
            update: { $inc: { stock: 3 } }
          }
        }
      ]);
      expect(result).toEqual(mockResult);
    });

    it('should throw an error when an exception occurs', async () => {
      const mockIngredients = [{ ingredient: 'Tomato', quantityPurchase: 5 }];
      InventoryModel.bulkWrite.mockRejectedValue(new Error('Database error'));

      await expect(update(mockIngredients)).rejects.toThrow('Error al actualizar el stock de los ingrediente');
    });
  });
});