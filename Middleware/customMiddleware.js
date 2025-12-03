import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/userSchema.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    // Getting token from Bearer Authorization from request header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        message: "User is not logged In",
      });
    }

    // Verifying jwt token from header with using jwt token secret
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Getting user info by using 'userId' which is passed in jwt token as payload
    req.user = await User.findById(decoded.userId).select("-password");

    // By 'next()' flow will carry to next operation
    next();
  } catch (error) {
    res.status(500).json({
      message: `Error in checking authorization of the user: ${error.message}`,
    });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    // Getting user from request [Because if user can access this api call user must be already logged in]
    const user = req.user;
    // Checking if loggedIn user is 'admin' or not
    if (user.role !== "admin") {
      res.status(401).json({
        message: "Unauthorized user, admin only can access",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: `Error in checking authentication of the user: ${error.message}`,
    });
  }
};
