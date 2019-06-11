import models from '../models';
import validateRating from '../validations/rating';
import { validationResponse } from '../helpers/validationResponse';
import Response from '../helpers/Response';
import extractRatingDetails from '../helpers/extractRatingDetails';

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
      const { error } = validateRating(req.body);

      if (error !== null) {
        return res
          .status(400)
          .json({ status: 400, error: validationResponse(error) });
      }

      const { articleId, rate } = req.body;

      // Check if the article exists
      const article = await Article.findOne({
        where: { id: articleId }
      });

      if (!article) return Response.error(res, 404, 'Article does not exist');

      // Get the full details of user and article
      const moreDetails = await Article.findOne({
        where: { id: articleId },
        include: [
          {
            model: User
          }
        ]
      });

      console.log(moreDetails);

      let fullRatingInfo = extractRatingDetails(moreDetails);

      // Check if this user has made a rating before
      const userArticleRating = await Rating.findOne({
        where: {
          userId,
          articleId: req.body.articleId
        }
      });

      let statusCode;
      let newRating;
      if (userArticleRating) {
        // Update the user's rating
        newRating = await userArticleRating.update({
          ratings: rate
        });
        statusCode = 200;
      } else {
        // Create new rating for the user
        newRating = await Rating.create({
          userId,
          articleId,
          ratings: rate
        });
        statusCode = 201;
      }

      // Append the new rate to the full object
      const { id, ratings } = newRating;
      fullRatingInfo = {
        id,
        rate: Number(ratings),
        ...fullRatingInfo
      };

      if (newRating) return Response.success(res, statusCode, fullRatingInfo);
    } catch (err) {
      next(err);
    }
  }
}

export default ArticleController;
