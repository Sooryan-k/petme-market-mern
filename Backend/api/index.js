const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("../db/connection");

const userRoutes = require("../routes/user");
const petListingRoutes = require("../routes/petListing");
const wishlistRoutes = require("../routes/wishlist");
const adminRoutes = require("../routes/adminRoutes");
const foodRoutes = require("../routes/foodRoutes");
const cartRoutes = require("../routes/cartRoutes");
const razorpayRoutes = require("../routes/razorpayRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api", userRoutes);
app.use("/api/pet-listing", petListingRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/food-items", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", razorpayRoutes);


// exporting the app for Vercel
module.exports = app;
