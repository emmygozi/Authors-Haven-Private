import express from 'express';
import trim from '@middlewares/trim';
import Token from '@helpers/Token';
import UserController from '@controllers/users';
import ProfileController from '@controllers/profile';

const userRouter = express.Router();

userRouter.post('/', trim, UserController.create);
userRouter.get('/', Token.authorize, UserController.getUsers);
userRouter.put('/', Token.authorize, trim, ProfileController.updateProfile);

export default userRouter;
