const express = require("express");
const {
  addFoodItem,
  editFoodItem,
  deleteFoodItem,
  getFoodItems,
  setAdminClaim,
  generateAdminToken,
  verifyToken,
  listAllUsers,
  deleteUser,
  makeAdmin,
  removeAdminRole,
  viewItems
} = require("../controllers/adminController");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const { upload } = require("../cloudinaryConfig");

const router = express.Router();

router.post("/food", authenticateAdmin, upload.single("image"), addFoodItem);
router.get("/food", authenticateAdmin, getFoodItems);
router.get("/food/view/:itemId", authenticateAdmin, viewItems);
router.put("/food/edit/:id",upload.single("image"), authenticateAdmin, editFoodItem);
router.delete("/food/delete/:id", authenticateAdmin, deleteFoodItem);


router.post("/set-admin/:uid", setAdminClaim);
router.get("/generate-admin-token/:uid", generateAdminToken);
router.get("/verify-token", verifyToken);
router.get("/users", authenticateAdmin, listAllUsers);
router.delete("/delete-user/:uid", authenticateAdmin, deleteUser);
router.post("/make-admin/:uid", authenticateAdmin, makeAdmin);
router.post("/remove-admin/:uid", authenticateAdmin, removeAdminRole);

module.exports = router;
