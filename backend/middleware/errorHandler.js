/**
 * Global error handling middleware
 * Catches and formats all errors in a consistent way
 */

import { ApiError } from "../utils/error.js";

/**
 * Error handling middleware
 * Formats errors for consistent API responses
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Default status code and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = [];

  // Handle known error types
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    if (err.errors) {
      errors = err.errors;
    }
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  } else if (err.name === 'MongoError' && err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate Entry';
    const field = Object.keys(err.keyValue)[0];
    errors = [{
      field,
      message: `${field} already exists`
    }];
  } else if (err.name === 'CastError') {
    // Invalid MongoDB ObjectId
    statusCode = 400;
    message = 'Invalid ID Format';
  }

  // Build error response
  const errorResponse = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    stack: err.stack
  };
  res.status(statusCode).json(errorResponse);
};
