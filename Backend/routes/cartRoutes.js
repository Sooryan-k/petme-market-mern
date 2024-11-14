const express = require("express");
const router = express.Router();
const {
  addToCart,
  getUserCart,
  deleteCart,
} = require("../controllers/cartController");

//add item to cart

router.post("/add", addToCart);

// get all cart for a user
router.get("/user/:uid", getUserCart);

// remove a item from cart
router.delete("/remove", deleteCart);

module.exports = router;
