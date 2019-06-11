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
   * @param {*} data
   * @returns {object} object
   * @memberof Response
   */
  static success(res, code, data) {
    return res.status(code).json({
      status: code,
      data
    });
  }
}

export default Response;
