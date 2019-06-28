import express from 'express';
import ArticleController from '@controllers/articles';
import trim from '@middlewares/trim';
import authorizeAccess from '@middlewares/authorizeAccess';
import CommentController from '@controllers/comments';
import articleFinder from '@middlewares/articleFinder';
import { find, commentFinder } from '@middlewares/commentFinder';

const articlesRouter = express.Router();

articlesRouter.post('/:slug/comments', authorizeAccess, trim, articleFinder, CommentController.create);
articlesRouter.get('/:slug/comments', authorizeAccess, articleFinder, CommentController.getComments);
articlesRouter.put('/:slug/comments/:id', authorizeAccess, trim, commentFinder, CommentController.updateComment);
articlesRouter.delete('/:slug/comments/:id', authorizeAccess, commentFinder, CommentController.deleteComment);

articlesRouter.post('/:slug/comments/:id/like', authorizeAccess, find, CommentController.likeComment);
articlesRouter.delete('/:slug/comments/:id/like', authorizeAccess, find, CommentController.unlikeComment);

articlesRouter.get('/', ArticleController.getAll);
articlesRouter.get('/:slug', ArticleController.getOne);
articlesRouter.post('/', authorizeAccess, ArticleController.create);
articlesRouter.put('/:slug', authorizeAccess, ArticleController.update);
articlesRouter.delete('/:slug', authorizeAccess, ArticleController.delete);

articlesRouter.get('/:slug/rate', ArticleController.getArticleRatings);
articlesRouter.post('/:slug/rate', trim, authorizeAccess, ArticleController.rate);

export default articlesRouter;
