require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./config/db');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users'); // 1. Import new user routes

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes); // 2. Use the new user routes

const PORT = process.env.PORT || 4000;
connect().then(() => {
  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
}).catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});
