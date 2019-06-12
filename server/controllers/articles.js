import { validationResponse } from '@helpers/validationResponse';
import Response from '@helpers/Response';
import models from '@models';
import validateRating from '@validations/rating';

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
    const userId = req.decoded.id;

    try {
      // Validate the rating
      const articleDetails = await validateRating(req.body);

      const { rate } = articleDetails;
      const { articleId } = req.params;

      // Check if the article exists
      const article = await Article.findOne({
        where: { id: articleId },
        include: [
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
        ]
      });

      if (!article) return Response.error(res, 404, 'Article does not exist');
      let result;

      // Check if there is a rating
      const userRating = await article.getRating({ where: { userId } });

      const newRating = { userId, ratings: rate };

      let statusCode;
      if (userRating) {
        statusCode = 200;
        result = await userRating.update(newRating);
      } else {
        statusCode = 201;
        result = await article.createRating(newRating);
      }

      const { id, ratings } = result;

      const fullRatingInfo = {
        id,
        rate: Number(ratings),
        article
      };

      if (result) return Response.success(res, statusCode, fullRatingInfo);
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
}

export default ArticleController;
