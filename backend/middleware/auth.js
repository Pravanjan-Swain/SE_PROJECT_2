import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authentication denied",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token is not valid",
        });
      }

      req.user = decoded.user;
      next();
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

export const authorize = (role) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (req.user.role !== role) {
        return res.status(403).json({
          success: false,
          message: "You do not have the permission to access this resource",
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Server error",
      });
    }
  };
};