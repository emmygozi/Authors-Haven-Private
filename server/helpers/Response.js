/**
 * @class Response
 */
class Response {
  /**
   * @static
   * @param {*} res
   * @param {*} code
   * @param {*} message
   * @returns {object} object
   * @memberof Response
   */
  static error(res, code, message) {
    return res.status(code).json({
      status: code,
      errors: {
        global: message,
      }
    });
  }

  /**
   * @static
   * @param {*} res
   * @param {*} code
   * @param {*} payload
   * @param {*} message
   * @returns {object} object
   * @memberof Response
   */
  static success(res, code, payload, message = 'Success') {
    return res.status(code).json({
      status: code,
      message,
      payload
    });
  }
}

export default Response;
