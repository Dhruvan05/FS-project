require('dotenv').config();
const connect = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');

async function seed() {
  await connect();
  await User.deleteMany({});
  await Post.deleteMany({});
  const pw = await bcrypt.hash('password123', 10);
  const admin = new User({ name: 'Admin User', email: 'admin@example.com', passwordHash: pw, role: 'Admin' });
  const editor = new User({ name: 'Editor User', email: 'editor@example.com', passwordHash: pw, role: 'Editor' });
  const viewer = new User({ name: 'Viewer User', email: 'viewer@example.com', passwordHash: pw, role: 'Viewer' });
  await admin.save();
  await editor.save();
  await viewer.save();

  await Post.create({ title: 'Admin post', body: 'By admin', authorId: admin._id });
  await Post.create({ title: 'Editor post', body: 'By editor', authorId: editor._id });

  console.log('Seed complete. Users: admin/editor/viewer (password: password123)');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
