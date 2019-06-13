import express from 'express';
import trim from '@middlewares/trim';
import Token from '@helpers/Token';
import UserController from '@controllers/users';

const userRouter = express.Router();

userRouter.post('/', trim, UserController.create);
userRouter.get('/', Token.authorize, UserController.getUsers);

export default userRouter;
