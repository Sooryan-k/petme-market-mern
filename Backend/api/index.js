const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("../db/connection");
const userRoutes = require("../routes/user");
const petListingRoutes = require("../routes/petListing");
const wishlistRoutes = require("../routes/wishlist");
const adminRoutes = require("../routes/adminRoutes");
const foodRoutes = require ("../routes/foodRoutes")
const cartRoutes = require ("../routes/cartRoutes")
const razorpayRoutes = require("../routes/razorpayRoutes");

const app = express();
app.use(cors());
app.use(express.json());

//for handling user-related endpoints
app.use("/api/", userRoutes);

//listing
app.use("/api/pet-listing", petListingRoutes);

//wishlist
app.use("/api/wishlist", wishlistRoutes);

//admin
app.use("/api/admin", adminRoutes);

//fooditem

app.use("/api/food-items",foodRoutes)

app.use("/api/cart",cartRoutes)

//payment

app.use("/api/payment", razorpayRoutes);

app.get("/api/test", (req, res) => {
  res.send("Test route is working!");
});



module.exports = app; 