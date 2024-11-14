const express = require("express");
const router = express.Router();
const { saveUser, getUserDetails } = require("../controllers/userController");

// POST route for saving user data
router.post("/", saveUser);

// GET route to fetch user details by UID
router.get("/:uid", getUserDetails);

module.exports = router;
