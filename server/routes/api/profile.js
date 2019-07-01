import { Router } from 'express';
import authorizeAccess from '@middlewares/authorizeAccess';
import ProfileController from '@controllers/profile';
import isUserVerified from '@middlewares/isVerified';

const profileRoute = Router();

profileRoute.post('/:username/follow', authorizeAccess, isUserVerified, ProfileController.follow);
profileRoute.delete('/:username/follow', authorizeAccess, isUserVerified, ProfileController.unfollow);
profileRoute.get('/:username', ProfileController.getProfile);

export default profileRoute;
