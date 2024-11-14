const FoodItem = require ('../models/FoodItem')

//fetch details in to home page

const homepageFood = async (req, res) => {
  try {
    const food = await FoodItem.find(); 
    res.status(200).json(food);
  } catch (error) {
    console.error("Error fetching items :", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

//fetch to view page
const viewFood = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await FoodItem.findById(itemId);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item details" });
  }
};

module.exports = {homepageFood,viewFood}
