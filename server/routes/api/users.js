import express from 'express';
import UserController from '../../controllers/users';
import trim from '../../middlewares/trim';

const userRoutes = express.Router();

userRoutes.get('/user', UserController.getUserDetails);
userRoutes.put('/user', trim, UserController.updateUser);
userRoutes.post('/users/login', trim, UserController.login);
userRoutes.post('/users', trim, UserController.create);

export default userRoutes;
