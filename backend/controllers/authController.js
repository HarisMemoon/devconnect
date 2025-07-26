// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc   Register new user
export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Determine the username to use
  const finalUsername = username || name || email.split('@')[0];

  if (!finalUsername) {
    return res.status(400).json({ message: "Username or name is required" });
  }

  try {
    // Check for existing user by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username: finalUsername });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.create({
      username: finalUsername,
      email,
      password
    });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: finalUsername,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// @desc   Login existing user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
