const mongoose = require("mongoose");
const InventorySchema = new mongoose.Schema({
  ingredient: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Inventory = mongoose.model('inventories', InventorySchema);
module.exports = Inventory;