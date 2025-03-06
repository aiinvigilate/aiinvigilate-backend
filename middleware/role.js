import jwt from 'jsonwebtoken';

const check =
  (...roles) =>
  (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
      return res.status(401).send('Unauthorized: No token provided');
    }

    try {
      // Verify and decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Attach user info to req

      // Check user role
      const hasRole = roles.includes(req.user.role);
      if (!hasRole) {
        return res.status(403).send('You are not allowed to make this request.');
      }

      next(); // Proceed if authorized
    } catch (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
  };

export const role = { check };
