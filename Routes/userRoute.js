import express from "express";
import {
  getAllUser,
  getUser,
  loginUser,
  registerUser,
} from "../Controllers/userController.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../Middleware/customMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// Added auth middleware for checking user is loggedIn. If loggedIn, user info will be added to request
router.get("/getCurrentUser", authMiddleware, getUser);
// Added auth middleware for checking user is loggedIn. If loggedIn, user info will be added to request and adding admin restriction to this route
router.get("/getAllUsers", authMiddleware, adminMiddleware, getAllUser);

export default router;
