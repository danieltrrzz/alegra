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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Dish = mongoose.model("dishes", DishSchema);
module.exports = Dish;