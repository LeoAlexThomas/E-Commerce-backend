import User from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Creating new user
    const newUser = new User({ name, email, password: hashedPassword });
    // Saving user in db
    await newUser.save();
    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(503).json({
      message: "Cannot create user, Error in creating user",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // Checking user is available in db
    if (!user) {
      res.status(404).json({
        message: "User email not found",
      });
    }
    // Checking user password and stored password are same.
    const isValidPassword = await bcrypt.compare(password, user.password);
    // If password is incorrect
    if (!isValidPassword) {
      res.status(401).json({
        message: "Password is incorrect",
      });
    }

    // Generating jwt token with payload of userId adding secret to jwt token
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Storing the jwt token in user data
    user.token = jwtToken;

    await user.save();

    res.status(200).json({
      message: "User loggedIn successfully",
      data: {
        token: jwtToken,
      },
    });
  } catch (error) {
    res.status(503).json({
      message: "Cannot create user, Error in creating user",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    res.status(200).json({
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot get User data, Error in getting user info",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot get All user data, Error in getting all user info",
    });
  }
};
