export interface IOrderIngredient {
  name: string;
  quantity: number;
}

export interface IOrderDish {
  name: string;
  ingredients: IOrderIngredient[];
}

export interface IOrder {
  _id: string;
  status: string;
  dish?: IOrderDish;
  createdAt: string;
}

export interface IOrderBoard {
  PREPARATION: IOrder[],
  KITCHEN: IOrder[],
  FINISHED: IOrder[],
  DELIVERED: IOrder[],
}
