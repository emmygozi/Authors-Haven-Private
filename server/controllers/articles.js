import models from '@models';
import { validateArticle, validateReport } from '@validations/auth';
import { validationResponse } from '@helpers/validationResponse';
import Response from '@helpers/Response';
import { findAllArticle, findArticle, getSpecificTag } from '@helpers/articlePayload';
import validateRating from '@validations/rating';
import Pagination from '@helpers/Pagination';

const {
  Article, User, Rating, Profile, ReportArticle, Tag
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
      let { tags } = articleDetails;
      articleDetails.title = articleDetails.title.replace(/ +/g, ' ');
      const createArticleDetails = {
        slug: title, userId, ...articleDetails
      };
      if (typeof tags === 'undefined' || tags === null) {
        tags = [];
      }
      const createdArticle = await Article.create(createArticleDetails);
      const { slug } = createdArticle;
      await Tag.create({ articleSlug: slug, tagList: tags });
      const article = await findArticle({ slug });
      const articleTags = await getSpecificTag(slug);
      const payload = article.dataValues;
      payload.tags = articleTags.tagList;
      return Response.success(res, 201, payload, 'Article created successfully');
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
      let { tags } = req.body;
      articleDetails.title = articleDetails.title.replace(/ +/g, ' ');
      const getArticle = await Article.findOne({ where: { slug: updatedSlug } });
      const canUpdate = await user.hasArticle(getArticle);
      let articleTags = await getSpecificTag(updatedSlug);
      if (articleTags) {
        if (typeof tags === 'undefined' || tags === null) {
          tags = articleTags.tagList;
        }
      }
      if (!getArticle) {
        return Response.error(res, 404, 'Article does not exist');
      }
      if (!canUpdate) {
        return Response.error(res, 403, 'You do not have permission to update this article!');
      }
      await Tag.update({ tagList: tags }, {
        where: {
          articleSlug: updatedSlug
        }
      });
      await getArticle.update(articleDetails);
      const article = await findArticle({ slug: updatedSlug });
      articleTags = await getSpecificTag(updatedSlug);

      const payload = article.dataValues;
      payload.tags = tags;

      return Response.success(res, 200, payload, 'Article successfully updated');
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

      await Tag.destroy({ where: { articleSlug: slug } });
      const deletedArticle = await Article.destroy({ where: { slug, userId } });


      if (!deletedArticle) {
        return Response.error(res, 403, 'You do not have permission to delete this article!');
      }
      return Response.success(res, 200, {}, 'Article successfully deleted');
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

      if (req.user && (req.decoded.id !== payload.get().author.id)) {
        await req.user.addHistory(payload);
      }

      return Response.success(res, 200, payload, 'Article successfully retrieved');
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

  /**
  * Users can like an article
  *
  * @static
  * @param {*} req
  * @param {*} res
  * @param {*} next
  * @memberof ArticleController
  * @return {json} Returns json object
  */
  static async like(req, res, next) {
    try {
      const me = req.user;
      const { slug } = req.params;
      let article = await findArticle({ slug });
      if (!article) return Response.error(res, 404, 'Article not found');
      await article.addLike(me);
      article = await findArticle({ slug });
      return Response.success(res, 201, article, 'Article has been liked');
    } catch (err) {
      return next(err);
    }
  }

  /**
 * Users can unlike an article
 *
 * @static
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @memberof ArticleController
 * @return {json} Returns json object
 */
  static async unlike(req, res, next) {
    try {
      const me = req.user;
      const { slug } = req.params;
      let article = await findArticle({ slug });
      if (!article) return Response.error(res, 404, 'Article to unlike was not found');
      await article.removeLike(me);
      article = await findArticle({ slug });
      return Response.success(res, 200, article, 'Article has been unliked');
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Users can report an article
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof ArticleController
   * @return {json} return json object
   */
  static async report(req, res, next) {
    try {
      const userId = req.decoded.id;
      const { slug } = req.params;
      const report = await validateReport(req.body);
      const article = await findArticle({ slug });
      if (!article) return Response.error(res, 404, 'Article was not found');
      const { id } = article;
      const reportArticle = await ReportArticle.create({ articleId: id, userId, ...report });
      return Response.success(res, 201, reportArticle, 'Article successfully reported!');
    } catch (error) {
      if (error.isJoi && error.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(error)
        });
      }
      return next(error);
    }
  }

  /**
   * Retrieves all tags
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof ArticleController
   * @returns {json} returns json object
   */
  static async getAllTags(req, res, next) {
    try {
      const allTags = await Tag.findAll({
        attributes: ['id', ['articleSlug', 'slug'], ['tagList', 'tags']]
      });
      return Response.success(res, 200, allTags, 'All tags retrieved');
    } catch (err) {
      return next(err);
    }
  }
}

export default ArticleController;
