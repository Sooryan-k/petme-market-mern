const wishlist = require("../models/wishlistSchema");

// add pet to wishlist
const addToWishlist = async (req, res) => {
  const { uid, petId } = req.body;

  try {
    const existingFavorite = await wishlist.findOne({ uid, petId });
    if (existingFavorite) {
      return res.status(409).json({ message: "Pet already in wishlist" });
    }

    const favorite = new wishlist({ uid, petId });
    await favorite.save();
    res.status(201).json({ message: "Pet added to favorites", favorite });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to favorites" });
  }
};

// get user's wishlist
const getUserWishlist = async (req, res) => {
  const { uid } = req.params;

  try {
    const favorites = await wishlist.find({ uid }).populate("petId");
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

//to delete wishlist

const deleteWishlist = async (req, res) => {
  const { uid, petId } = req.body;
  try {
    await wishlist.findOneAndDelete({ uid, petId });
    res.status(200).json({ message: "pet deleted from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "failed to remove" });
  }
};

// remove all occurrences of a pet from wishlists when it is deleted from listings
const removePetFromAllWishlists = async (petId) => {
  try {
    await wishlist.deleteMany({ petId });
    console.log(`All wishlist entries for petId ${petId} have been removed`);
  } catch (error) {
    console.error("Error removing pet from all wishlists:", error);
  }
};

module.exports = {
  addToWishlist,
  getUserWishlist,
  deleteWishlist,
  removePetFromAllWishlists,
};
