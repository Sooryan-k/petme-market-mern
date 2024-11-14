const mongoose = require("mongoose");

const petListingSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["cat", "dog", "fish", "rabbit", "birds", "others"],
    required: true,
  },
  bname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
});

const petListing = new mongoose.model("petlisting", petListingSchema);

module.exports = petListing;
