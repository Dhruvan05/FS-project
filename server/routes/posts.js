const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User'); // Need this to populate
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// list posts
router.get('/', authorize('posts:read'), async (req, res) => {
  // We .populate() to get the author's details
  // We .lean() for faster, read-only operations
  const posts = await Post.find()
    // .populate('authorId', 'name email') // This is one way
    .lean(); 

  // Map _id to id for frontend consistency
  res.json(posts.map(p => ({ ...p, id: p._id })));
});

router.post('/', authorize('posts:create'), async (req, res) => {
  const p = new Post({ 
    title: req.body.title, 
    body: req.body.body, 
    authorId: req.user.id,
    authorUsername: req.user.username // Save the username
  });
  await p.save();
  res.status(201).json(p);
});

async function loadAuthor(req, res, next) {
  const p = await Post.findById(req.params.id).select('authorId').lean();
  if (!p) return res.status(404).json({ error: 'Not found' });
  req.resourceAuthorId = String(p.authorId);
  req.post = p;
  next();
}

router.put('/:id', loadAuthor, authorize('posts:update', { ownership: true }), async (req, res) => {
  const updated = await Post.findByIdAndUpdate(
    req.params.id, 
    { title: req.body.title, body: req.body.body }, 
    { new: true }
  ).lean();
  res.json({ ...updated, id: updated._id });
});

router.delete('/:id', loadAuthor, authorize('posts:delete', { ownership: true }), async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
