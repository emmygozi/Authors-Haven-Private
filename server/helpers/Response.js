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
   * @returns {object} object
   * @memberof Response
   */
  static success(res, code, payload) {
    return res.status(code).json({
      status: code,
      payload
    });
  }
}

export default Response;
