export interface IDishIngredient {
  _id: string;
  name: string;
  quantity: number;
}

 export interface IDish {
  _id: string;
  name: string;
  ingredients: IDishIngredient[];
  createdAt: string;
}
