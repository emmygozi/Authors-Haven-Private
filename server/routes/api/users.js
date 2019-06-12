import express from 'express';
import trim from '@middlewares/trim';
import UserController from '@controllers/users';

const userRouter = express.Router();

userRouter.post('/', trim, UserController.create);


export default userRouter;
