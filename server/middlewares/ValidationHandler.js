/* eslint-disable no-param-reassign */
import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';


/**
 * @exports
 * @class ValidationHandler
 */
class ValidationHandler {
  /**
   * Function to check for empty request
   * @method isEmptyReq
   * @memberof ValidationHandler
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {(function|object)} Function next() or JSON object
   */
  static isEmptyReq(req, res, next) {
    if (!Object.values(req.body).length) {
      return res.status(400).json({
        error: 'Empty PUT Requests Are Not Allowed',
      });
    }

    next();
  }

  /**
   * Sends validation errors if existent, passes it on to the next middleware if not
   * @method validate
   * @memberof ValidationHandler
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {(function|object)} Function next() or JSON object
   */
  static validate(req, res, next) {
    const errors = validationResult(req);
    req = {
      ...req,
      ...matchedData(req),
    };

    if (!errors.isEmpty()) {
      const mappedErrors = errors.mapped();

      return res.status(422).json({
        status: 422,
        errors: mappedErrors,
      });
    }

    return next();
  }
}

export default ValidationHandler;
