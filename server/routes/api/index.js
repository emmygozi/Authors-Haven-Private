import express from 'express';
import userRoutes from './users';
import articleRoutes from './articles';

const apiRoutes = express.Router();

apiRoutes.use('/auth', userRoutes);
apiRoutes.use('/articles', articleRoutes);

export default apiRoutes;
