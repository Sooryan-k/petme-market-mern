const cart = require("../models/cart");

// add item to cart
const addToCart = async (req, res) => {
  const { uid, itemId } = req.body;

  try {
    const existingCart= await cart.findOne({ uid, itemId });
    if (existingCart) {
      return res.status(409).json({ message: "item already in cart" });
    }

    const Cart = new cart({ uid, itemId });
    await Cart.save();
    res.status(201).json({ message: "item added to cart", Cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// get user's cart
const getUserCart = async (req, res) => {
  const { uid } = req.params;

  try {
    const carts = await cart.find({ uid }).populate("itemId");
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

//to delete cart

const deleteCart = async (req, res) => {
  const { uid, itemId } = req.body;
  try {
    await cart.findOneAndDelete({ uid, itemId });
    res.status(200).json({ message: "item deleted from cart" });
  } catch (error) {
    res.status(500).json({ message: "failed to remove" });
  }
};

// remove all occurrences of a item from cart when it is deleted from listings
const removeItemFromAllCarts = async (itemId) => {
  try {
    await cart.deleteMany({ itemId });
    console.log(`All cart entries for itemId ${itemId} have been removed`);
  } catch (error) {
    console.error("Error removing item from all carts:", error);
  }
};

module.exports = {
  addToCart,
  getUserCart,
  deleteCart,
  removeItemFromAllCarts,
};
