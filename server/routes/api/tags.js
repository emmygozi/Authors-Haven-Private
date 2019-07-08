import { Router } from 'express';
import ArticleController from '@controllers/articles';

const tagRoute = Router();

tagRoute.get('/', ArticleController.getAllTags);

export default tagRoute;
