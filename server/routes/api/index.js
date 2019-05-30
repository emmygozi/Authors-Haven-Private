import express from 'express';
import userRoutes from './users';

const apiRoutes = express.Router();

apiRoutes.use('/', userRoutes);

apiRoutes.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }

  return next(err);
});

export default apiRoutes;
