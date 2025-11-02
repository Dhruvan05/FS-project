This folder contains a minimal Express + MongoDB API for RBAC demo.

Quick start:

1. Copy `.env.example` to `.env` and adjust values.
2. Install dependencies: `npm install` inside `server`.
3. Start Mongo (e.g., `docker-compose up -d mongo`) or run a local MongoDB.
4. Run seed script: `npm run seed`.
5. Start server: `npm start` (or `npm run dev` during development).

Endpoints:
- POST /api/auth/login  -> { email, password }  returns { accessToken, user }
- GET /api/posts        -> list posts (requires auth)
- POST /api/posts       -> create post (Editor/Admin)
- PUT /api/posts/:id    -> update post (Admin or owner if Editor)
- DELETE /api/posts/:id -> delete post (Admin or owner if Editor)
