const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const u = await User.findOne({ email });
  if (!u) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  // Add username (u.name) to the JWT payload
  const token = jwt.sign(
    { sub: String(u._id), role: u.role, username: u.name }, // Added username
    process.env.JWT_SECRET || 'dev_secret', 
    { expiresIn: '1h' }
  );

  res.json({ accessToken: token, user: { id: u._id, name: u.name, role: u.role, email: u.email } });
});

module.exports = router;
