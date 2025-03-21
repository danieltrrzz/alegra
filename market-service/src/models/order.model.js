const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  }
});

const DishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ingredients: {
    type: [IngredientSchema],
    required: true,
  }
});

const OrderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true,
  },
  dish: {
    type: DishSchema,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Order = mongoose.model("orders", OrderSchema);
module.exports = Order;