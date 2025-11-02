const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// list posts
router.get('/', authorize('posts:read'), async (req, res) => {
  const posts = await Post.find().lean();
  res.json(posts);
});

router.post('/', authorize('posts:create'), async (req, res) => {
  const p = new Post({ title: req.body.title, body: req.body.body, authorId: req.user.id });
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
  const updated = await Post.findByIdAndUpdate(req.params.id, { title: req.body.title, body: req.body.body }, { new: true });
  res.json(updated);
});

router.delete('/:id', loadAuthor, authorize('posts:delete', { ownership: true }), async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
