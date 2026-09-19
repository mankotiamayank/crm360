export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // If the user's role is not in the allowed list, reject them
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role (${req.user.role}) is not authorized to access this route`,
      });
    }
    
    next(); // Let them pass!
  };
};