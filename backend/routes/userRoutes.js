import express from 'express';
import { loginUser, registerUser, updateProfile,
    getAllUsers, createUser, updateUser, deleteUser
 } from '../controller/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const userRoutes = express.Router();

userRoutes.post('/register',registerUser)
userRoutes.post('/login',loginUser);
userRoutes.put('/update-profile',authenticate, updateProfile);
userRoutes.get('/', getAllUsers);
userRoutes.post('/', createUser);
userRoutes.put('/:id', updateUser);
userRoutes.delete('/:id', deleteUser);
export default userRoutes;