import express from 'express';
import UserController from '../../controllers/users';

const userRoutes = express.Router();

userRoutes.get('/user', UserController.getUserDetails);
userRoutes.put('/user', UserController.updateUser);
userRoutes.post('/users/login', UserController.login);
userRoutes.post('/users', UserController.create);

export default userRoutes;
