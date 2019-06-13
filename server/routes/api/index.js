import express from 'express';
import userRouter from './users';
import authRouter from './auth';
import profileRoute from './profile';
import userDetailRoute from './user';

const apiRouter = express.Router();

apiRouter.get('/', (request, response) => response.status(200).send('Welcome to the Authors Haven API'));

apiRouter.use('/users', userRouter);
apiRouter.use('/user', userDetailRoute);
apiRouter.use('/auth', authRouter);
apiRouter.use('/profiles', profileRoute);

export default apiRouter;
