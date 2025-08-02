// exceptions.js
/**
 * @class RedixAPIError
 * @extends {Error}
 * @description Custom error for Redix API failures.
 */
class RedixAPIError extends Error {
  /**
     * @param {number} status_code The HTTP status code of the error response.
     * @param {string} message The error message from the API.
     */
  constructor(status_code, message) {
    super(`Redix API Error ${status_code}: ${message}`);
    this.name = 'RedixAPIError';
    this.status_code = status_code;
    this.message = message;
  }
}

module.exports = { RedixAPIError };
