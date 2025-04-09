/**
 * Custom error classes for the application
 */

/**
 * API Error - Base class for API-specific errors
 */
export class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     * @param {Array} errors - Optional array of validation errors
     */
    constructor(statusCode, message, errors = []) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
}
  
  /**
   * Validation Error - For input validation errors
   */
export class ValidationError extends ApiError {
  /**
   * @param {string} message - Error message
   * @param {Array} errors - Array of validation errors
   */
  constructor(message = 'Validation error', errors) {
    super(400, message, errors);
  }
}
  
  /**
   * Not Found Error - For resource not found errors
   */
export class NotFoundError extends ApiError {
  /**
   * @param {string} message - Error message
   * @param {string} resource - Resource type that wasn't found
   */
  constructor(message = 'Resource not found', resource = 'Resource') {
    super(404, message || `${resource} not found`);
    this.resource = resource;
  }
}
  
  /**
   * Unauthorized Error - For authentication errors
   */
export class UnauthorizedError extends ApiError {
  /**
   * @param {string} message - Error message
   */
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}
  
  /**
   * Forbidden Error - For authorization errors
   */
export class ForbiddenError extends ApiError {
  /**
   * @param {string} message - Error message
   */
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}
