export interface IIngredientPurchase {
  ingredient: string;
  quantityPurchase: number;
}

export interface IPurchaseHistory {
  _id: string;
  orderId: string; // Assuming ObjectId is represented as a string
  dishName: string;
  ingredientsPurchased: IIngredientPurchase[];
  createdAt: string;
}
