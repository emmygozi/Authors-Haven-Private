import express from 'express';
import userRoutes from './users';

const apiRoutes = express.Router();

apiRoutes.use('/', userRoutes);

export default apiRoutes;
