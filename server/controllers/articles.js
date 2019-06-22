import models from '@models';
import { validateArticle } from '@validations/auth';
import { validationResponse } from '@helpers/validationResponse';
import Response from '@helpers/Response';
import { findAllArticle, findArticle } from '@helpers/articlePayload';
import validateRating from '@validations/rating';
import Pagination from '@helpers/Pagination';

const {
  Article, User, Rating, Profile
} = models;

/**
 * @exports ArticleController
 * @class ArticleController
 * @description Handles creation, modification, reading and deletion of Articles
 * */
class ArticleController {
  /**
  * Create a new article
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async create(req, res, next) {
    try {
      const articleDetails = await validateArticle(req.body);
      const { id: userId } = req.decoded;
      const { title } = articleDetails;
      articleDetails.title = articleDetails.title.replace(/ +/g, ' ');
      const createArticleDetails = {
        slug: title, userId, ...articleDetails
      };

      const createdArticle = await Article.create(createArticleDetails);
      const { slug } = createdArticle.dataValues;
      const payload = await findArticle({ slug });

      return res.status(201).json({ status: 'success', message: 'Article created successfully', payload });
    } catch (err) {
      if (err.isJoi && err.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(err)
        });
      }
      next(err);
    }
  }

  /**
  * Updates an article
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async update(req, res, next) {
    try {
      const articleDetails = await validateArticle(req.body);
      const { user } = req;
      const { slug: updatedSlug } = req.params;
      articleDetails.title = articleDetails.title.replace(/ +/g, ' ');

      const getArticle = await Article.findOne({ where: { slug: updatedSlug } });

      const canUpdate = await user.hasArticle(getArticle);


      if (!getArticle) {
        return Response.error(res, 404, 'Article does not exist');
      }

      if (!canUpdate) {
        return Response.error(res, 403, 'You do not have permission to update this article!');
      }

      const updateArticle = await getArticle.update(articleDetails);
      const { slug } = updateArticle.dataValues;
      const payload = await findArticle({ slug });

      return res.status(200).json({ status: 'success', message: 'Article successfully updated', payload });
    } catch (err) {
      if (err.isJoi && err.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(err)
        });
      }
      next(err);
    }
  }

  /**
  *
  *
  * @static
  * @param {*} req
  * @param {*} res
  * @param {*} next
  * @returns {json} Returns json object
  * @memberof ArticleController
  */
  static async rate(req, res, next) {
    try {
      const { id: userId } = req.user;

      // Validate the rating
      const articleDetails = await validateRating(req.body);

      const { rate } = articleDetails;
      const { slug } = req.params;

      const article = await Article.findOne({ where: { slug } });

      if (!article) return Response.error(res, 404, 'Article does not exist');

      const result = await article.addRating(userId, {
        through: { ratings: rate }
      });

      const updatedArticle = await findArticle({ slug });

      return Response.success(
        res,
        !result || !result[0].dataValues ? 200 : 201,
        { article: updatedArticle },
        'Article has been rated'
      );
    } catch (err) {
      if (err.isJoi && err.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(err)
        });
      }
      next(err);
    }
  }

  /**
  * Deletes an article
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async delete(req, res, next) {
    try {
      const { slug } = req.params;
      const { id: userId } = req.user;

      const getArticle = await Article.findOne({ where: { slug } });

      if (!getArticle) {
        return Response.error(res, 404, 'Article does not exist');
      }

      const deletedArticle = await Article.destroy({ where: { slug, userId } });

      if (!deletedArticle) {
        return Response.error(res, 403, 'You do not have permission to delete this article!');
      }

      return res.status(200).json({ status: 'success', message: 'Article successfully deleted' });
    } catch (err) {
      next(err);
    }
  }

  /**
  * Gets an article
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async getAll(req, res, next) {
    try {
      const payload = await findAllArticle(req);
      const { page, search } = req.query;
      const paginate = new Pagination(page, req.query.limit);
      const count = await Article.count();

      const extraQuery = search ? `search=${search}` : '';

      return Response.success(res, 200, { rows: payload, metadata: paginate.getPageMetadata(count, '/articles', extraQuery) }, 'Articles successfully retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
  * Gets an article
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async getOne(req, res, next) {
    try {
      const { slug } = req.params;
      const payload = await findArticle({ slug });
      if (!payload) {
        return Response.error(res, 404, 'Article does not exist');
      }
      return res.status(200).json({ status: 'success', message: 'Article successfully retrieved', payload });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get article ratings
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next The next middleware
   * @return {json} Returns json object
   * @static
   */
  static async getArticleRatings(req, res, next) {
    try {
      const { slug } = req.params;
      const { page, search } = req.query;
      const paginate = new Pagination(page, req.query.limit);
      const { limit, offset } = await paginate.getQueryMetadata();

      // Get the articleId
      const article = await Article.findOne({ where: { slug } });

      if (!article) return Response.error(res, 404, 'Article does not exist');

      const { id: articleId } = article.dataValues;
      const count = await Rating.count({ where: { articleId } });

      const ratings = await Rating.findAll({
        where: { articleId },
        limit,
        offset,
        attributes: ['ratings', 'createdAt', 'updatedAt', 'deletedAt'],
        include: [{
          model: User,
          as: 'rater',
          attributes: [
            'id',
            'username'
          ],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'bio', 'avatar']
          }]
        }
        ]
      });

      const extraQuery = search ? `search=${search}` : '';

      return Response.success(res, 200, { ratings, metadata: paginate.getPageMetadata(count, `/articles/${slug}/rate`, extraQuery) });
    } catch (err) {
      next(err);
    }
  }
}

export default ArticleController;
