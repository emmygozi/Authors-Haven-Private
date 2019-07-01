import express from 'express';
import ArticleController from '@controllers/articles';
import trim from '@middlewares/trim';
import authorizeAccess from '@middlewares/authorizeAccess';
import CommentController from '@controllers/comments';
import articleFinder from '@middlewares/articleFinder';
import isUserVerified from '@middlewares/isVerified';
import { find, commentFinder } from '@middlewares/commentFinder';

const articlesRouter = express.Router();

articlesRouter.post('/:slug/comments', authorizeAccess, isUserVerified, trim, articleFinder, CommentController.create);
articlesRouter.get('/:slug/comments', authorizeAccess, articleFinder, CommentController.getComments);
articlesRouter.put('/:slug/comments/:id', authorizeAccess, isUserVerified, trim, commentFinder, CommentController.updateComment);
articlesRouter.delete('/:slug/comments/:id', authorizeAccess, isUserVerified, commentFinder, CommentController.deleteComment);

articlesRouter.post('/:slug/comments/:id/like', authorizeAccess, find, CommentController.likeComment);
articlesRouter.delete('/:slug/comments/:id/like', authorizeAccess, find, CommentController.unlikeComment);

articlesRouter.get('/', ArticleController.getAll);
articlesRouter.get('/:slug', ArticleController.getOne);
articlesRouter.post('/', authorizeAccess, isUserVerified, ArticleController.create);
articlesRouter.put('/:slug', authorizeAccess, isUserVerified, ArticleController.update);
articlesRouter.delete('/:slug', authorizeAccess, isUserVerified, ArticleController.delete);

articlesRouter.get('/:slug/rate', ArticleController.getArticleRatings);
articlesRouter.post('/:slug/rate', trim, authorizeAccess, isUserVerified, ArticleController.rate);

export default articlesRouter;
