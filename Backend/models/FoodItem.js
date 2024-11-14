const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  fname: { type: String, required: true },
  sname: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["cat", "dog", "fish", "rabbit", "birds", "others"],
    required: true,
  },
  itemType: { type: String, enum: ["food", "accessories"], required: true },
  about: { type: String, required: true },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
