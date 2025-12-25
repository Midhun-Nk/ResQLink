import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


/* ============================
   🔐 AUTHENTICATE USER MIDDLEWARE
   Checks JWT token validity
===============================*/

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded data to request
    req.user = decoded; 
    /*
      req.user = {
        user_id,
        email,
        role,
        iat,
        exp
      }
    */

    next();
  } catch (err) {
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
