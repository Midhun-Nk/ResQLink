import express from 'express';
import { loginUser, registerUser, updateProfile } from '../controller/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const userRoutes = express.Router();

userRoutes.post('/register',registerUser)
userRoutes.post('/login',loginUser);
userRoutes.put('/update-profile',authenticate, updateProfile);

export default userRoutes;