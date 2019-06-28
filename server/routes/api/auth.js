import express from 'express';
import authorizeAccess from '@middlewares/authorizeAccess';
import trim from '@middlewares/trim';
import UserController from '@controllers/users';


const authRouter = express.Router();

authRouter.post('/login', trim, UserController.login);

authRouter.post('/logout', authorizeAccess, UserController.logout);
authRouter.post('/forgot_password', trim, UserController.forgotPassword);
authRouter.post('/reset_password', trim, UserController.resetPassword);

export default authRouter;
