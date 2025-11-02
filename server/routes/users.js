const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All user routes require authentication
router.use(authenticate);

// GET /api/users - Get all users (Admin only)
router.get('/', authorize('admin:manageUsers'), async (req, res) => {
  try {
    // .lean() for performance, .select() to exclude password hash
    const users = await User.find().select('-passwordHash').lean();
    
    // Map _id to id for frontend consistency
    res.json(users.map(u => ({ ...u, id: u._id })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id - Update a user's role (Admin only)
router.put('/:id', authorize('admin:manageUsers'), async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  if (!['Admin', 'Editor', 'Viewer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (userToUpdate._id.equals(req.user.id)) {
      return res.status(403).json({ error: 'Cannot change your own role' });
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    // Send back the updated user, excluding hash
    const updatedUser = userToUpdate.toObject();
    delete updatedUser.passwordHash;
    updatedUser.id = updatedUser._id;
    
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
