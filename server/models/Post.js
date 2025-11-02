const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorUsername: String, // Added field to store the author's name
}, { timestamps: true });

PostSchema.index({ authorId: 1 });

module.exports = mongoose.model('Post', PostSchema);
