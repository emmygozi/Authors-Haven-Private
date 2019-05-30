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
    const { username, email, password } = req.body;

    try {
      const user = await User.create({ username, email, password });
      return res.status(201).send({ user });
    } catch (error) {
      next(error);
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
    if (!req.body.email) {
      return res.status(422).json({ errors: { email: "can't be blank" } });
    }

    if (!req.body.password) {
      return res.status(422).json({ errors: { password: "can't be blank" } });
    }
    passport.authenticate('local', { session: false }, (
      err,
      user,
      info
    ) => {
      if (err) {
        return next(err);
      }

      if (user) {
        return res.json({ user: user.toAuthJSON() });
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
