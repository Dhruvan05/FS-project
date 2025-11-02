const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    
    // Add all relevant fields from token to req.user
    req.user = { 
      id: payload.sub, 
      role: payload.role, 
      username: payload.username // Added username
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authenticate;
