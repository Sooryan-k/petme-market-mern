const express = require("express");
const router = express.Router();
const {
  createPetListing,
  getUserAds,
  view,
  homepage,
  deleteList,
  updateListing,
} = require("../controllers/petListingController");
const {upload} = require("../cloudinaryConfig"); // import multer config for Cloudinary

// route to create a new pet listing with an image
router.post("/create", upload.single("image"), createPetListing);

//route to fetch pet details and show on home page

router.get("/listed-pets", homepage);

//route to view pet

router.get("/view/:petId", view);

//route to fetch userown ads
router.get("/userads/:uid", getUserAds);

//route to delete list
router.delete("/delete/:_id", deleteList);

// route to update a pet listing
router.put("/update/:id", upload.single("image"), updateListing);

module.exports = router;
