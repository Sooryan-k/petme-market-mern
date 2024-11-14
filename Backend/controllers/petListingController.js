const Listing = require("../models/petListingSchema");
const { removePetFromAllWishlists } = require("./wishlistController");

// create petlisting

const createPetListing = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : null; // get the image URL from Cloudinary
    const petListing = new Listing({
      uid: req.body.uid,
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      category: req.body.category,
      bname: req.body.bname,
      price: req.body.price,
      image: imageUrl, 
      about: req.body.about,
      createdDate: new Date().setHours(0, 0, 0, 0),
    });
    // save to MongoDB
    await petListing.save();
    res
      .status(201)
      .json({ message: "Pet listing created successfully!", petListing });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Failed to create pet listing", error });
  }
};

//fetch details in to home page

const homepage = async (req, res) => {
  try {
    const pets = await Listing.find(); 
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pet listings:", error);
    res.status(500).json({ error: "Failed to fetch pet listings" });
  }
};

//fetch to view page
const view = async (req, res) => {
  const { petId } = req.params;
  try {
    const pet = await Listing.findById(petId);
    if (pet) {
      res.status(200).json(pet);
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pet details" });
  }
};

//get user own ads

const getUserAds = async (req, res) => {
  const { uid } = req.params;
  try {
    const userAds = await Listing.find({ uid });
    res.status(200).json(userAds);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user ads" });
  }
};

//to delete petlist

const deleteList = async (req, res) => {
  const { _id } = req.params; 
  const { uid } = req.body;

  try {
    // find the listing by _id and check if uid matches the creator's uid
    const listing = await Listing.findOne({ _id, uid });
    if (!listing) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this ad" });
    }

    
    await Listing.findOneAndDelete({ _id });
    
    await removePetFromAllWishlists(_id);

    res
      .status(200)
      .json({
        message: "Listing and associated wishlists deleted successfully",
      });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//update
const updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (req.file) {
    updatedData.image = req.file.path; 
  }

  try {
    const listing = await Listing.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json({ message: "Listing updated successfully", listing });
  } catch (error) {
    res.status(500).json({ message: "Failed to update listing", error });
  }
};

module.exports = {
  createPetListing,
  homepage,
  view,
  getUserAds,
  deleteList,
  updateListing,
};
