import express from 'express';
import ArticleController from '@controllers/articles';
import Token from '@helpers/Token';
import trim from '@middlewares/trim';
import CommentController from '@controllers/comments';
import articleFinder from '@middlewares/articleFinder';
import commentFinder from '@middlewares/commentFinder';

const articlesRouter = express.Router();

articlesRouter.post('/:slug/rate', trim, Token.authorize, ArticleController.rate);
articlesRouter.post('/:slug/comments', Token.authorize, trim, articleFinder, CommentController.create);
articlesRouter.get('/:slug/comments', Token.authorize, articleFinder, CommentController.getComments);
articlesRouter.put('/:slug/comments/:id', Token.authorize, trim, commentFinder, CommentController.updateComment);
articlesRouter.delete('/:slug/comments/:id', Token.authorize, commentFinder, CommentController.deleteComment);

articlesRouter.get('/', ArticleController.getAll);
articlesRouter.get('/:slug', ArticleController.getOne);
articlesRouter.post('/', Token.authorize, ArticleController.create);
articlesRouter.put('/:slug', Token.authorize, ArticleController.update);
articlesRouter.delete('/:slug', Token.authorize, ArticleController.delete);

export default articlesRouter;
