const InventoryModel = require('../../src/models/inventory.model');
const ingredientService = require('../../src/services/ingredient.service');

jest.mock('../../src/models/inventory.model'); // Mock del modelo

describe('Ingredient Service', () => {
  describe('get', () => {
    it('should return an ingredient if a name is provided', async () => {
      const mockIngredient = { ingredient: 'Tomato', stock: 10 };
      InventoryModel.findOne.mockResolvedValue(mockIngredient);

      const result = await ingredientService.get('Tomato');

      expect(InventoryModel.findOne).toHaveBeenCalledWith({ ingredient: 'Tomato' });
      expect(result).toEqual(mockIngredient);
    });

    it('should return all ingredients if no name is provided', async () => {
      const mockIngredients = [
        { ingredient: 'Tomato', stock: 10 },
        { ingredient: 'Onion', stock: 5 },
      ];
      InventoryModel.find.mockResolvedValue(mockIngredients);

      const result = await ingredientService.get();

      expect(InventoryModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockIngredients);
    });

    it('should throw an error if an issue occurs while fetching ingredients', async () => {
      InventoryModel.findOne.mockRejectedValue(new Error('Database error'));

      await expect(ingredientService.get('Tomato')).rejects.toThrow('Error al buscar ingredientes');
    });
  });

  describe('update', () => {
    it('should update the stock of ingredients if conditions are met', async () => {
      const mockIngredients = [
        { name: 'Tomato', quantity: 5 },
        { name: 'Onion', quantity: 2 },
      ];
      const mockResult = { modifiedCount: 2 };
      InventoryModel.bulkWrite.mockResolvedValue(mockResult);

      const result = await ingredientService.update(mockIngredients);

      const expectedBulkOperations = [
        {
          updateOne: {
            filter: { ingredient: 'Tomato', stock: { $gte: 5 } },
            update: { $inc: { stock: -5 } },
          },
        },
        {
          updateOne: {
            filter: { ingredient: 'Onion', stock: { $gte: 2 } },
            update: { $inc: { stock: -2 } },
          },
        },
      ];

      expect(InventoryModel.bulkWrite).toHaveBeenCalledWith(expectedBulkOperations);
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if an issue occurs while updating stock', async () => {
      const mockIngredients = [{ name: 'Tomato', quantity: 5 }];
      InventoryModel.bulkWrite.mockRejectedValue(new Error('Database error'));

      await expect(ingredientService.update(mockIngredients)).rejects.toThrow(
        'Error al actualizar el stock de los ingrediente', Object.assign({}),
      );
    });

    it('should handle an empty list of ingredients correctly', async () => {
      const mockIngredients = [];
      const mockResult = { modifiedCount: 0 };
      InventoryModel.bulkWrite.mockResolvedValue(mockResult);

      const result = await ingredientService.update(mockIngredients);

      expect(InventoryModel.bulkWrite).toHaveBeenCalledWith([]);
      expect(result).toEqual(mockResult);
    });
  });
});