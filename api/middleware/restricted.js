const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization; // Token should be sent in the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  const secret = process.env.JWT_SECRET || 'shh'; // Fallback secret

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalid' });
    } else {
      req.decodedJwt = decodedToken; // Save the decoded token for future use
      next();
    }
  });
};
