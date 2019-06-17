import express from 'express';
import ArticleController from '@controllers/articles';
import Token from '@helpers/Token';
import trim from '@middlewares/trim';

const articlesRouter = express.Router();

articlesRouter.get('/', ArticleController.getAll);
articlesRouter.get('/:slug', ArticleController.getOne);
articlesRouter.post('/', Token.authorize, ArticleController.create);
articlesRouter.put('/:slug', Token.authorize, ArticleController.update);
articlesRouter.delete('/:slug', Token.authorize, ArticleController.delete);
articlesRouter.post('/:slug/rate', trim, Token.authorize, ArticleController.rate);

export default articlesRouter;
