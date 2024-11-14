const User = require("../models/userSchema");

//to save user data in to db

const saveUser = async (req, res) => {
  const { uid, username, email } = req.body;

  try {
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const newUser = new User({ uid, username, email });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user :", error);
    res.status(500).json({ message: error });
  }
};

//to retreive data from db

const getUserDetails = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { saveUser, getUserDetails };
