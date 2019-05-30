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

    User.create({
      username,
      email,
      password,
    })
      .then(user => res.json({
        user
      }))
      .catch(next);
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
    User.findByPk(req.payload.id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(401);
        }

        // only update fields that were actually passed...
        if (typeof req.body.user.username !== 'undefined') {
          user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== 'undefined') {
          user.email = req.body.user.email;
        }
        if (typeof req.body.user.bio !== 'undefined') {
          user.bio = req.body.user.bio;
        }
        if (typeof req.body.user.image !== 'undefined') {
          user.image = req.body.user.image;
        }
        if (typeof req.body.user.password !== 'undefined') {
          user.setPassword(req.body.user.password);
        }

        return user.save().then(() => res.json({ user: user.toAuthJSON() }));
      })
      .catch(next);
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
    User.findByPk(req.payload.id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(401);
        }
        return res.json({
          user
        });
      })
      .catch(next);
  }
}

export default UserController;
