import express from 'express';
import trim from '@middlewares/trim';
import ProfileController from '@controllers/profile';
import Token from '@helpers/Token';

const userRouter = express.Router();

userRouter.put('/', Token.authorize, trim, ProfileController.updateProfile);


export default userRouter;
