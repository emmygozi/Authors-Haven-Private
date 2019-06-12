import express from 'express';
import Token from '@helpers/Token';
import ArticleController from '@controllers/articles';
import trim from '../../middlewares/trim';

const articleRoutes = express.Router();

articleRoutes.post('/rate', trim, Token.verifyToken, ArticleController.rate);

export default articleRoutes;
