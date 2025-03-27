const { purchasingIngredients } = require('../../src/services/market-place.service');
const axios = require('axios');

jest.mock('axios');

describe('Market Place Service', () => {
  describe('purchasingIngredients', () => {
    it('should return the quantity purchased when the external service responds successfully', async () => {
      const mockIngredient = 'Tomato';
      const mockResponse = { data: { quantitySold: 10 } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await purchasingIngredients(mockIngredient);

      expect(axios.get).toHaveBeenCalledWith(expect.any(String), { params: { ingredient: mockIngredient } });
      expect(result).toEqual({ ingredient: mockIngredient, quantityPurchase: 10 });
    });

    it('should return quantityPurchase as 0 when the ingredient is not available', async () => {
      const mockIngredient = 'Onion';
      const mockResponse = { data: { quantitySold: 0 } };
      axios.get.mockResolvedValue(mockResponse);

      const result = await purchasingIngredients(mockIngredient);

      expect(axios.get).toHaveBeenCalledWith(expect.any(String), { params: { ingredient: mockIngredient } });
      expect(result).toEqual({ ingredient: mockIngredient, quantityPurchase: 0 });
    });

    it('should return quantityPurchase as 0 when an error occurs', async () => {
      const mockIngredient = 'Garlic';
      axios.get.mockRejectedValue(new Error('Network error'));

      const result = await purchasingIngredients(mockIngredient);

      expect(axios.get).toHaveBeenCalledWith(expect.any(String), { params: { ingredient: mockIngredient } });
      expect(result).toEqual({ ingredient: mockIngredient, quantityPurchase: 0 });
    });
  });
});