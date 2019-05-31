import { Op } from 'sequelize';
import passport from 'passport';
import models from '../models';

const { User } = models;

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
      const { username, email, password } = req.body;
      const [user, created] = await User.findOrCreate({
        where: { email: { [Op.iLike]: email } },
        defaults: {
          email: email.toLowerCase(),
          username,
          password
        }
      });
      if (!created) return res.status(400).json({ status: 'fail', error: 'Email has already been taken' });

      return res.status(201).send({ status: 'success', user });
    } catch (err) {
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
    passport.authenticate('local', { session: false }, (
      err,
      user,
      info
    ) => {
      if (err) {
        return next(err);
      }

      if (user) {
        return res.json({ user });
      }
      return res.status(422).json(info);
    })(req, res, next);
  }

  /**
  * Update user details
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async updateUser(req, res, next) {
    const {
      username, email, bio, image, password
    } = req.body;

    try {
      const user = await User.findByPk(req.payload.id);

      if (!user) {
        return res.sendStatus(401);
      }

      const updatedUserDetails = await user.update({
        username: username || user.username,
        email: email || user.email,
        bio: bio || user.bio,
        image: image || user.image,
        password: password || user.password
      });

      return res.send({ updatedUserDetails });
    } catch (error) {
      next(error);
    }
  }

  /**
  * Get user details
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async getUserDetails(req, res, next) {
    try {
      const user = await User.findByPk(req.payload.id);

      if (!user) {
        return res.sendStatus(401);
      }

      return res.send({ user });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
