import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import randomString from 'random-string';
import { config } from 'dotenv';
import models from '@models';
import {
  validateLogin,
  validateSignup,
  validatePasswordReset,
  validateForgotPassword
} from '@validations/auth';
import Token from '@helpers/Token';
import userExtractor from '@helpers/userExtractor';
import { articleObject, extractArticle } from '@helpers/articlePayload';
import {
  validationResponse,
  validateUniqueResponse
} from '@helpers/validationResponse';
import Response from '@helpers/Response';
import { sendForgotPasswordMail, sendResetSuccessMail, sendVerifyMailToken } from '@helpers/mailer';

config();

const {
  User, DroppedToken, VerifyUser
} = models;

/**
 * @exports UserController
 * @class UserController
 * @description Handles Social Users
 * */
class UserController {
  /**
   * Create a new user
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next The next middleware
   * @return {json} Returns json object
   * @static
   */
  static async create(req, res, next) {
    try {
      const userDetails = await validateSignup(req.body);
      const user = await User.create({ ...userDetails });
      const payload = {
        id: user.id,
        email: user.email
      };

      await user.createProfile();

      const token = await Token.create(payload);

      const tokenExpiry = Date.now() + ((Number(process.env.RESET_TOKEN_EXPIRE)) || 75600000);
      const verifyToken = randomString({ length: 40 });

      const verifyDetails = {
        verifyToken, tokenExpiry, userId: user.id
      };

      await VerifyUser.create({ ...verifyDetails });
      sendVerifyMailToken(verifyToken, user.email, user.username);
      return res.status(201).json({
        status: 'success', message: 'User created successfully', payload: userExtractor(user, token)
      });
    } catch (err) {
      if (err.isJoi && err.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(err)
        });
      }

      if (err.errors && err.errors[0].type === 'unique violation') {
        return res.status(400).json({
          status: 400,
          errors: validateUniqueResponse(err)
        });
      }
      next(err);
    }
  }

  /**
   * Login and Authenticate user.
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next The next middleware
   * @return {json} Returns json object
   * @static
   */
  static async login(req, res, next) {
    try {
      const logindetails = await validateLogin(req.body);
      const { email, password } = logindetails;
      const user = await User.findOne({
        where: {
          email
        }
      });

      if (!user) return Response.error(res, 400, 'Invalid email or password');
      const match = await bcrypt.compare(password, user.password);
      if (!match) return Response.error(res, 400, 'Invalid email or password');
      const payload = {
        id: user.id,
        email: user.email
      };
      const token = await Token.create(payload);
      return Response.success(res, 200, userExtractor(user, token), 'User successfully logged in');
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
 * Signuout user and blacklist tokens
 *
 * @static
 * @param {*} req
 * @param {*} res
 * @returns {json} returns json object
 * @memberof UserController logout
 */
  static async logout(req, res) {
    try {
      const token = await Token.getToken(req);
      await DroppedToken.create({ token });
      return Response.success(res, 201, {}, 'You are now logged out');
    } catch (error) {
      return Response.error(res, 401, 'You are not logged in');
    }
  }

  /**
   * Get users and their corresponding profiles
   * @async
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next The next middleware
   * @return {json} Returns json object
   * @static
   */
  static async getUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username'],
        where: {
          active: true
        },
        include: [
          {
            model: models.Profile,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'bio', 'avatar', 'location']
          }
        ]
      });

      return Response.success(res, 200, users, 'Users and corresponding profiles retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update token
   * @async
   * @param {object} user
   * @return {string} Returns token string
   * @static
   */
  static async createVerifyToken(user) {
    const { id } = user;
    const verifyToken = randomString({ length: 40 });
    const tokenExpiry = Date.now() + ((Number(process.env.RESET_TOKEN_EXPIRE)) || 75600000);

    const verifyDetails = {
      verifyToken, tokenExpiry, userId: id
    };

    const userDetails = await user.getVerifiedUser({
      where: {
        userId: id
      }
    });

    await userDetails
      .update(verifyDetails);

    return verifyToken;
  }

  /**
  * Sends mail to verify a new user
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async sendMailToVerifyAccount(req, res, next) {
    try {
      const {
        active, email, username
      } = req.user;

      const { user } = req;
      if (active === false) {
        const verifyToken = await UserController.createVerifyToken(user);
        sendVerifyMailToken(verifyToken, email, username);
        return Response.success(res, 200, 'Verification mail sent');
      }
      if (active) {
        return Response.error(res, 400, 'You are already verified');
      }
    } catch (err) {
      next(err);
    }
  }

  /**
* Verifies a new user
* @async
* @param  {object} req - Request object
* @param {object} res - Response object
* @param {object} next The next middleware
* @return {json} Returns json object
* @static
*/
  static async verifyAccount(req, res, next) {
    try {
      const { token, email } = req.query;

      if (!token || !email) return Response.error(res, 400, 'Please use a valid verification link');
      const user = await User.findOne({ where: { email } });
      if (!user) return Response.error(res, 401, 'Invalid Token');

      const tokenDetails = await user.getVerifiedUser({
        where: {
          tokenExpiry: {
            [Op.gt]: Date.now()
          }
        }
      });

      if (!tokenDetails) return Response.error(res, 401, 'Invalid Token');

      const { verifyToken } = tokenDetails.get();

      const match = await bcrypt.compare(token, verifyToken);
      if (!match) return Response.error(res, 401, 'Invalid Token');


      await user.update({ active: true });
      await tokenDetails.destroy();
      return Response.success(res, 200, 'You a now verified');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Forgot Password
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next
   * @return {json} Returns json object
   * @static
   */
  static async forgotPassword(req, res, next) {
    try {
      const { email } = await validateForgotPassword(req.body);

      const user = await User.findOne({ where: { email } });

      if (!user) return Response.error(res, 400, 'Please use a valid reset link');

      // Check if the account is active
      if (!user.active) return Response.error(res, 403, 'Your account is not verified');

      const token = await UserController.updateToken(user);

      sendForgotPasswordMail(token, email, user.get().username);

      return Response.success(res, 200, { }, 'A reset token has been sent to your email address');
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
   * Update token
   * @async
   * @param {object} user
   * @return {string} Returns token string
   * @static
   */
  static async updateToken(user) {
    const token = randomString({ length: 40 });
    const resetDetails = {
      resetPasswordToken: token,
      resetPasswordExpiry: Date.now() + Number(process.env.RESET_TOKEN_EXPIRE
        || 75600000) // 1 day from now
    };

    const userResetToken = await user.getResetToken();
    if (userResetToken) {
      await userResetToken.update(resetDetails);
    } else {
      await user.createResetToken(resetDetails);
    }
    return token;
  }

  /**
   * Reset Password
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {object} next
   * @return {json} Returns json object
   * @static
   */
  static async resetPassword(req, res, next) {
    try {
      // Verify the password and confirm password
      const newPassword = await validatePasswordReset(req.body);

      const { password } = newPassword;
      const { token, email } = req.query;

      if (!token || !email) return Response.error(res, 400, 'Please use a valid reset link');

      // Get the user
      const user = await User.findOne({ where: { email } });
      if (!user) return Response.error(res, 400, 'Please use a valid reset link');

      // Check if the token is in the database
      const tokenDetails = await user.getResetToken({
        where: {
          resetPasswordExpiry: {
            [Op.gt]: Date.now()
          }
        }
      });

      // Check if the token is valid
      if (!tokenDetails) return Response.error(res, 400, 'Please use a valid reset link');

      const match = await bcrypt.compare(token, tokenDetails.get().resetPasswordToken);
      if (!match) return Response.error(res, 400, 'Please use a valid reset link');


      // Update password
      await user.update({ password });
      await tokenDetails.destroy();

      // Send success email
      sendResetSuccessMail(email, user.get().username);

      return Response.success(res, 200, {}, 'Password reset successful');
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
 * @param {*} req Request Object
 * @param {*} res Response Object
 * @param {*} next Next middleware
 * @returns {json} Return JSON object
 * @memberof UserController
 */
  static async getReadHistory(req, res, next) {
    try {
      let histories = await req.user.getHistory({
        ...articleObject,
        group: ['Article.id', 'author.id', 'author->profile.id', 'ReadHistory.createdAt', 'ReadHistory.updatedAt', 'ReadHistory.userId', 'ReadHistory.articleId'],
      });

      histories = extractArticle(histories);

      return Response.success(res, 200, histories);
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
