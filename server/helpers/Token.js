import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import Response from './Response';

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
   * @static
   * @param {*} req the request object
   * @param {*} res the response object
   * @param {*} next middleware
   * @returns {function} next
   * @memberof Token
   */
  static async verifyToken(req, res, next) {
    try {
      const { token } = req.headers;
      if (typeof token === 'undefined') {
        return Response.error(res, 400, 'No token provided!');
      }
      const verifiedToken = await jwt.verify(token, tokenSecret);
      if (!verifiedToken) {
        return Response.error(res, 401, 'Token cannot be verified!');
      }
      req.decoded = verifiedToken;
      return next();
    } catch (err) {
      next(err);
    }
  }
}
export default Token;
