import { validationResponse } from '@helpers/validationResponse';
import Response from '@helpers/Response';
import models from '@models';
import validateRating from '@validations/rating';
import sequelize from 'sequelize';

const { User, Article, Rating } = models;

/**
 * @exports ArticleController
 * @class ArticleController
 * @description Handles Article related actions
 * */
class ArticleController {
  /**
   * Rate an article
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next The next middleware
   * @return {json} Returns json object
   * @static
   */
  static async rate(req, res, next) {
    try {
      const userId = req.decoded.id;

      // Validate the rating
      const articleDetails = await validateRating(req.body);

      const { rate } = articleDetails;
      const { slug } = req.params;

      const article = await Article.findOne({ where: { slug } });

      if (!article) return Response.error(res, 404, 'Article does not exist');

      await article.addRating(userId, { through: { ratings: rate } });
      await article.save();

      const updatedArticle = await ArticleController.findArticle({ slug });

      return Response.success(res, 200, 'Article has been rated', { article: updatedArticle });
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
   * Rate an article
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next The next middleware
   * @return {json} Returns json object
   * @static
   */
  static async findArticle({ articleId, slug }) {
    const where = {};
    if (articleId) {
      where.articleId = articleId;
    } else if (slug) {
      where.slug = slug;
    } else {
      throw new Error('Parameters undefined');
    }

    return Article.findOne({
      where,
      attributes: [
        'id',
        'slug',
        [sequelize.fn('AVG', sequelize.col('articleRatings.ratings')), 'averageRating']
      ],
      include: [
        {
          model: Rating,
          as: 'articleRatings',
          required: false,
          attributes: []
        },
        {
          model: User,
          as: 'author',
          attributes: [
            'id',
            'username',
            'email',
            'firstname',
            'lastname',
            'middlename',
            'active'
          ]
        }
      ],
      group: [
        'Article.id',
        'author.id'
      ]
    });
  }
}

export default ArticleController;
