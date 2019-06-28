import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import Response from '@helpers/Response';
import models from '../models';

const { User, DroppedToken } = models;

config();
const tokenSecret = process.env.SECRET || 'secret';
const tokenExpiration = process.env.TOKEN_EXPIRE || '1d';
/**
 * @class Token
 */
class Token {
  /**
   * @static
   * @param {payload} payload object
   * @returns {string} returns the token
   * @memberof Token
   */
  static async create(payload) {
    const token = await jwt.sign(payload, tokenSecret, {
      expiresIn: tokenExpiration
    });
    return token;
  }

  /**
  * Get token from req
  * @param  {object} req - Request object
  * @returns {string} token
  * @static
  */
  static getToken(req) {
    const bearerToken = req.headers.authorization;
    const token = bearerToken !== undefined && bearerToken.startsWith('Bearer ') && bearerToken.replace('Bearer ', '');

    return token;
  }

  /**
  * Handles authorization of users
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async authorize(req, res, next) {
    try {
      if (req.url === '/auth/login'
      || req.url === '/auth/forgot_password'
      || req.url.includes('/auth/reset_password')) return next();
      const token = await Token.getToken(req);
      if (token) {
        const decoded = jwt.verify(token, tokenSecret);
        const user = await User.findOne({ where: { id: decoded.id } });
        if (user) {
          const droppedToken = await DroppedToken.findOne({
            where: {
              token
            }
          });
          if (!droppedToken) {
            req.user = user;
            req.decoded = decoded;
          } else {
            const error = new Error('Invalid Token');
            error.name = 'DroppedToken';
            throw error;
          }
        }
      }
      next();
    } catch (error) {
      if (req.url === '/auth/logout') return Response.success(res, 200, {}, 'You are now logged out');
      if (error.name === 'JsonWebTokenError'
      || error.name === 'DroppedToken') return Response.error(res, 401, 'Invalid Token Provided');
      if (error.name === 'TokenExpiredError') return Response.error(res, 401, 'Token Expired');
      next(error);
    }
  }
}
export default Token;
