import bcrypt from 'bcrypt';
import models from '@models';
import { validateLogin, validateSignup } from '@validations/auth';
import Token from '@helpers/Token';
import userExtractor from '@helpers/userExtractor';
import { validationResponse, validateUniqueResponse } from '@helpers/validationResponse';
import Response from '@helpers/Response';

const {
  User, DroppedToken
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
      const user = await User.create({ ...userDetails, active: true });
      const payload = {
        id: user.id,
        email: user.email
      };

      await user.createProfile();

      const token = await Token.create(payload);
      return res.status(201).json({ status: 'success', message: 'User created successfully', user: userExtractor(user, token) });
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
          email,
          active: true
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
      return res.status(200).json({ status: 'success', message: 'User successfully logged in', user: userExtractor(user, token) });
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
      return res.status(201).json({
        status: 201, message: 'You are now logged out'
      });
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
          },
        ],
      });

      return res.status(200)
        .send({
          status: 'success',
          message: 'Users and corresponding profiles retrieved successfully',
          payload: users
        });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
