import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here"; // move to .env

// ================== REGISTER USER ===================
export const registerUser = async (req, res) => {
  try {
    const {  fullName, email, phoneNumber, password, role, bloodGroup } = req.body;

    let userName = email.split('@')[0];

    // check user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) 
      return res.status(409).json({ message: "Email already registered" });

    const newUser = await User.create({
      userName,
      fullName,
      email,
      phoneNumber,
      password, // auto hashed by model hooks
      role,
      bloodGroup
    });

    // Generate token immediately after creating user
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,           // return token here
      user: newUser
    });

  } catch (error) {

    console.log(error.message)
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};


// ================== LOGIN USER ===================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // create jwt token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// =========================
// 📌 UPDATE PROFILE
// =========================
// =========================
// 📌 UPDATE PROFILE
// =========================

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const { 
      fullName, 
      phoneNumber, 
      bloodGroup, 
      profile, 
      location,
      street,
      pincode
    } = req.body;

    // Basic validation
    if (phoneNumber && phoneNumber.length < 10) {
      return res.status(400).json({ message: "Phone number must be valid" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update only provided fields
    user.fullName = fullName ?? user.fullName;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;
    user.bloodGroup = bloodGroup ?? user.bloodGroup;
    user.profile = profile ?? user.profile;

    // 👉 NEW FIELDS ADDED
    user.street = street ?? user.street;
    user.pincode = pincode ?? user.pincode;

    // Location object: { country, state, city }
    user.location = location ?? user.location;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (err) {
    console.log("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
