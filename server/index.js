require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./config/db');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
// 1. Import the new middlewares
const { correlationId, logger } = require('./middleware/logging');

const app = express();

// 2. Add correlationId middleware FIRST
app.use(correlationId);

// 3. Add logger middleware SECOND
app.use(logger);

// --- Existing Middlewares ---
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 4000;

// --- This is the new part for testing ---

// 1. Create a function to start the server
const startServer = () => {
  return connect().then(() => {
    // 2. Return the server instance so we can close it in tests
    return app.listen(PORT, () => console.log(`API listening on ${PORT}`));
  }).catch(err => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
};

// 3. Only start the server if this file is run directly (e.g., `npm run dev`)
//    This check prevents the server from auto-starting when imported by Jest
if (require.main === module) {
  startServer();
}

// 4. Export the app and the start function for supertest
module.exports = { app, startServer };

