import express from 'express';
import UserController from '../../controllers/users';
import trim from '../../middlewares/trim';
import Token from '../../helpers/Token';

const userRoutes = express.Router();

userRoutes.get('/user', UserController.getUserDetails);
userRoutes.put('/user', trim, UserController.updateUser);
userRoutes.post('/login', trim, UserController.login);
userRoutes.post('/register', trim, UserController.create);
userRoutes.post('/logout', Token.authorize, UserController.logout);

export default userRoutes;
