import express from 'express';
import ProfileController from '@controllers/profile';

const profileRoute = express.Router();

// userRouter.post('/', trim, UserController.create);
profileRoute.get('/:username', ProfileController.getProfile);


export default profileRoute;
