const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem", //model name of fooditemlisting
    required: true,
  },
});

const cart = new mongoose.model("cart", cartSchema);

module.exports = cart;
