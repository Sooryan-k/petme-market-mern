const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "petlisting", //model name of petlisting
    required: true,
  },
});

const wishlist = new mongoose.model("wishlist", wishlistSchema);

module.exports = wishlist;
