const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getUserWishlist,
  deleteWishlist,
} = require("../controllers/wishlistController");

//add pet to wishlist

router.post("/add", addToWishlist);

// remove a pet from favorites
router.delete("/remove", deleteWishlist);

// get all favorites for a user
router.get("/user/:uid", getUserWishlist);

module.exports = router;
