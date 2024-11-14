const FoodItem = require("../models/FoodItem");
const { generateAdminToken } = require("../firebase"); 
const admin = require("../firebase").admin;
const User = require ('../models/userSchema')
const {removeItemFromAllCarts} = require ('../controllers/cartController')

// add food item
exports.addFoodItem = async (req, res) => {
  try {
    const foodItem = new FoodItem({
      uid: req.body.uid, 
      fname: req.body.fname, 
      sname: req.body.sname, 
      price: req.body.price, 
      category: req.body.category, 
      itemType: req.body.itemType, 
      about: req.body.about, 
      image: req.file.path, 
    });
    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(400).json({ message: "Error adding food item", error });
  }
};

// edit 
exports.editFoodItem = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

 
  if (req.file) {
    updatedData.image = req.file.path; 
  }

  try {
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json({ message: "Item updated successfully", updatedFoodItem });
  } catch (error) {
    console.error("Error editing food item:", error);
    res.status(500).json({ message: "Error editing food item", error });
  }
};


// Delete 
exports.deleteFoodItem = async (req, res) => {
  try {
    const itemId = req.params.id; 
    await FoodItem.findByIdAndDelete(itemId);
    await removeItemFromAllCarts(itemId); 
    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Error deleting food item:", error); 
    res.status(400).json({ message: "Error deleting food item", error: error.message || error });
  }
};


// fetch
exports.getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(400).json({ message: "Error fetching food items", error });
  }
};

//fetch to view page
exports.viewItems = async (req, res) => {
  const { itemId } = req.params;
  try {
    const items = await FoodItem.findById(itemId);
    if (items) {
      res.status(200).json(items);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item details" });
  }
};


//set admin

exports.setAdminClaim = async (req, res) => {
  const uid = req.params.uid;

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.status(200).send(`User ${uid} has been granted admin privileges.`);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error setting admin claim", details: error.message });
  }
};


// generate Admin Token
exports.generateAdminToken = async (req, res) => {
  const uid = req.params.uid;

  try {
    const token = await generateAdminToken(uid);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({
      error: "Error generating admin token",
      details: error.message,
    });
  }
};

//optional

exports.verifyToken = async (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(403).send("Unauthorized: No token provided");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.status(200).json({ decodedToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid token", details: error.message });
  }
};

//to get registered users list

exports.listAllUsers = async (req, res) => {
  try {
    const users = [];
    let nextPageToken; 

    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      result.users.forEach((userRecord) => {
        users.push({
          uid: userRecord.uid,
          email: userRecord.email,
          isAdmin: userRecord.customClaims?.admin || false,
        });
      });

      nextPageToken = result.pageToken;
    } while (nextPageToken); 

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

//to delete user account
exports.deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    await admin.auth().deleteUser(uid);
    await User.findOneAndDelete({ uid });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

// to make a user admin
exports.makeAdmin = async (req, res) => {
  const { uid } = req.params;

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.status(200).json({ message: `User ${uid} has been granted admin privileges.` });
  } catch (error) {
    console.error("Error making user admin:", error);
    res.status(500).json({ error: "Error making user admin" });
  }
};

//remove admin
exports.removeAdminRole = async (req, res) => {
  const { uid } = req.params;

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: null });
    res.status(200).json({ message: `Admin role removed for user ${uid}` });
  } catch (error) {
    console.error("Error removing admin role:", error);
    res.status(500).json({ error: "Error removing admin role" });
  }
};






