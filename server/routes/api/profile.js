import { Router } from 'express';
import Token from '@helpers/Token';
import ProfileController from '@controllers/profile';

const profileRoute = Router();

profileRoute.post('/:username/follow', Token.authorize, ProfileController.follow);
profileRoute.delete('/:username/follow', Token.authorize, ProfileController.unfollow);
profileRoute.get('/:username', ProfileController.getProfile);

export default profileRoute;
