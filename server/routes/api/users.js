import express from 'express';
import UserController from '../../controllers/users';
import ValidationHandler from '../../middlewares/ValidationHandler';
import authValidation from '../../validations/users';
import trim from '../../middlewares/trim';

const userRoutes = express.Router();
const validations = [ValidationHandler.validate, trim, ValidationHandler.isEmptyReq];


userRoutes.get('/user', UserController.getUserDetails);
userRoutes.put('/user', validations, authValidation.updateUserDetails, UserController.updateUser);
userRoutes.post('/users/login', authValidation.login, validations, UserController.login);
userRoutes.post('/users', authValidation.create, validations, UserController.create);

export default userRoutes;
