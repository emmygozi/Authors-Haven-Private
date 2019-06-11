import express from 'express';
import ArticleController from '../../controllers/articles';
import trim from '../../middlewares/trim';
import Token from '../../helpers/Token';

const articleRoutes = express.Router();

articleRoutes.post('/rate', trim, Token.verifyToken, ArticleController.rate);

export default articleRoutes;
