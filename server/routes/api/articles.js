import express from 'express';
import Token from '@helpers/Token';
import ArticleController from '@controllers/articles';
import trim from '@middlewares/trim';

const articleRoutes = express.Router();

articleRoutes.post('/:slug/rate', trim, Token.authorize, ArticleController.rate);

export default articleRoutes;
