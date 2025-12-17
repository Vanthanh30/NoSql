const express = require("express");
const router = express.Router();
const userController = require("../../controllers/client/userController");
const upload = require("../../middlewares/upload");
const authClient = require("../../middlewares/authClient");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/profile", authClient, userController.getUserProfile);
router.put(
  "/profile",
  authClient,
  upload.single("avatar"),
  userController.updateUserProfile
);
router.get("/all", authClient, userController.getAllUsers);
router.get("/:id", authClient, userController.getUserById);
module.exports = router;
