import express from 'express';
import Token from '@helpers/Token';
import trim from '@middlewares/trim';

import UserController from '@controllers/users';


const authRouter = express.Router();

authRouter.post('/login', trim, UserController.login);

authRouter.post('/logout', Token.authorize, UserController.logout);

export default authRouter;
