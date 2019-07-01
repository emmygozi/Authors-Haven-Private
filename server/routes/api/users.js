import express from 'express';
import trim from '@middlewares/trim';
import authorizeAccess from '@middlewares/authorizeAccess';
import UserController from '@controllers/users';
import ProfileController from '@controllers/profile';

const userRouter = express.Router();

userRouter.post('/', trim, UserController.create);
userRouter.get('/', authorizeAccess, UserController.getUsers);
userRouter.put('/', authorizeAccess, trim, ProfileController.updateProfile);
userRouter.get('/history', UserController.getReadHistory);

export default userRouter;
