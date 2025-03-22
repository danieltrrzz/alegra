const mongoose = require("mongoose");

const IngredientPurchaseSchema = new mongoose.Schema({
  ingredient: {
    type: String,
    required: true,
    trim: true,
  },
  quantityPurchase: {
    type: Number,
    required: true
  }
});

const PurchaseHistorySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "orders",
  },
  dishName: {
    type: String,
    required: true,
    trim: true,
  },
  ingredientsPurchased: {
    type: [IngredientPurchaseSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const PurchaseHistory = mongoose.model('purchase-histories', PurchaseHistorySchema);
module.exports = PurchaseHistory;