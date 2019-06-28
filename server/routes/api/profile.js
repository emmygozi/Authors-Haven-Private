import { Router } from 'express';
import authorizeAccess from '@middlewares/authorizeAccess';
import ProfileController from '@controllers/profile';

const profileRoute = Router();

profileRoute.post('/:username/follow', authorizeAccess, ProfileController.follow);
profileRoute.delete('/:username/follow', authorizeAccess, ProfileController.unfollow);
profileRoute.get('/:username', ProfileController.getProfile);

export default profileRoute;
