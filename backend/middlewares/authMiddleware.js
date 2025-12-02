import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

/* ============================
   🔐 AUTHENTICATE USER MIDDLEWARE
   Checks JWT token validity
===============================*/
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"

    if (!token) return res.status(401).json({ message: "Unauthorized. Token missing." });

    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user to request to use later
    req.user = await User.findByPk(decoded.id);

    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


/* ============================
   🛡 ROLE BASED ACCESS CONTROL
   authorize("admin","manager")
===============================*/
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }
    next();
  };
};
