const DishModel = require('../../src/models/dish.model');
const dishService = require('../../src/services/dish.service');

jest.mock('../../src/models/dish.model');

describe('Dish Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRandom', () => {
    it('should return a random dish from the database', async () => {
      const mockDishes = [
        { _id: '1', name: 'Paella' },
        { _id: '2', name: 'Tacos' },
        { _id: '3', name: 'Pizza' },
      ];
      DishModel.find.mockResolvedValue(mockDishes);

      const result = await dishService.getRandom();

      expect(DishModel.find).toHaveBeenCalledWith({});
      expect(mockDishes).toContainEqual(result);
    });

    it('should throw an error if fetching dishes fails', async () => {
      DishModel.find.mockRejectedValue(new Error('Database error'));

      await expect(dishService.getRandom()).rejects.toThrow('Error al buscar un plato');
      expect(DishModel.find).toHaveBeenCalledWith({});
    });
  });

  describe('get', () => {
    it('should return a single dish when id is provided', async () => {
      const mockDish = { _id: '1', name: 'Paella' };
      DishModel.findOne.mockResolvedValue(mockDish);

      const result = await dishService.get('1');

      expect(DishModel.findOne).toHaveBeenCalledWith({ _id: '1' });
      expect(result).toEqual(mockDish);
    });

    it('should return all dishes when no id is provided', async () => {
      const mockDishes = [
        { _id: '1', name: 'Paella' },
        { _id: '2', name: 'Tacos' },
      ];
      DishModel.find.mockResolvedValue(mockDishes);

      const result = await dishService.get();

      expect(DishModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockDishes);
    });

    it('should return filtered dishes when a filter is provided', async () => {
      const mockDishes = [{ _id: '1', name: 'Paella' }];
      const filter = { name: 'Paella' };
      DishModel.find.mockResolvedValue(mockDishes);

      const result = await dishService.get(null, filter);

      expect(DishModel.find).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockDishes);
    });

    it('should throw an error if fetching dishes fails', async () => {
      DishModel.find.mockRejectedValue(new Error('Database error'));

      await expect(dishService.get()).rejects.toThrow('Error al buscar platos');
      expect(DishModel.find).toHaveBeenCalledWith({});
    });
  });
});