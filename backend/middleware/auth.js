/**
 * Authentication and Authorization middleware
 * Validates JWT tokens and implements role-based access control
 */

import jwt from "jsonwebtoken";
import { User } from "../models/index.model.js";

const JWT_SECRET = process.env.JWT_SECRET;
import { ApiError } from "../utils/error.js";

/**
 * Middleware to authenticate a user based on JWT token
 * Attaches the user object to the request if authenticated
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Invalid token format');
    }

    try {
      console.log('Verifying token with JWT_SECRET:', process.env.JWT_SECRET); // Debug
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use env directly
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive) {
        throw new ApiError(401, 'User not found or inactive');
      }

      req.user = user;
      next();
    } catch (error) {
      console.log('JWT verification error:', error.name, error.message); // Debug
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Invalid or expired token');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize specific user roles
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Middleware function
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }

    // Check if user role is in the allowed roles array
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to access this resource'));
    }

    next();
  };
};

/**
 * Role constants for cleaner access control
 */
export const ROLES = {
  MANAGER: 'Manager',
  DELIVERER: 'Deliverer',
  CUSTOMER: 'Customer',
  ALL: ['Manager', 'Deliverer', 'Customer']
};