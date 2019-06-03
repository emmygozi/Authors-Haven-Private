import express from 'express';
import apiRoutes from './api';

const router = express.Router();

router.use('/api', apiRoutes);

router.use('*', (req, res) => res.status(404).send({
  status: 404,
  message: 'Page Not Found'
}));

export default router;
