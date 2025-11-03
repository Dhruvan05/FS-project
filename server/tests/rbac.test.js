const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { app, startServer } = require('../index'); // Import our app
const User = require('../models/User');
const Post = require('../models/Post');

// Use supertest to make requests to our app
const api = supertest(app);
let server;

// --- Test Data ---
let adminUser, editorUser, viewerUser;
let adminToken, editorToken, viewerToken;
let adminPost, editorPost;

// --- Setup & Teardown ---

beforeAll(async () => {
  // Set the MONGO_URI to the one Jest provides
  process.env.MONGO_URI = process.env.MONGO_URL;
  server = await startServer(); // Start the server
  
  // Clear the database and seed it
  await User.deleteMany({});
  await Post.deleteMany({});
  
  const pw = await bcrypt.hash('password123', 10);
  
  adminUser = new User({ name: 'Admin Test', email: 'admin.test@example.com', passwordHash: pw, role: 'Admin' });
  editorUser = new User({ name: 'Editor Test', email: 'editor.test@example.com', passwordHash: pw, role: 'Editor' });
  viewerUser = new User({ name: 'Viewer Test', email: 'viewer.test@example.com', passwordHash: pw, role: 'Viewer' });
  
  await adminUser.save();
  await editorUser.save();
  await viewerUser.save();

  adminPost = new Post({ title: 'Admin Post', body: 'By admin', authorId: adminUser._id, authorUsername: adminUser.name });
  editorPost = new Post({ title: 'Editor Post', body: 'By editor', authorId: editorUser._id, authorUsername: editorUser.name });
  
  await adminPost.save();
  await editorPost.save();

  // Log in each user to get their tokens
  const adminRes = await api.post('/api/auth/login').send({ email: 'admin.test@example.com', password: 'password123' });
  const editorRes = await api.post('/api/auth/login').send({ email: 'editor.test@example.com', password: 'password123' });
  const viewerRes = await api.post('/api/auth/login').send({ email: 'viewer.test@example.com', password: 'password123' });

  adminToken = adminRes.body.accessToken;
  editorToken = editorRes.body.accessToken;
  viewerToken = viewerRes.body.accessToken;
});

afterAll(async () => {
  // Disconnect from the database and close the server
  await mongoose.disconnect();
  await server.close();
});

// --- Test Suites ---

describe('RBAC Permissions: Posts', () => {

  it('Viewer SHOULD NOT be able to create a post (expect 403 Forbidden)', async () => {
    await api.post('/api/posts')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ title: 'Viewer Post', body: 'This should fail' })
      .expect(403);
  });

  it('Editor SHOULD be able to create a post (expect 201 Created)', async () => {
    const res = await api.post('/api/posts')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ title: 'Editor Post 2', body: 'This should work' })
      .expect(201);
      
    expect(res.body.title).toBe('Editor Post 2');
    expect(res.body.authorId).toBe(editorUser._id.toString());
  });

  it('Editor SHOULD NOT be able to delete another user\'s post (expect 403 Forbidden)', async () => {
    await api.delete(`/api/posts/${adminPost._id}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .expect(403);
  });
  
  it('Editor SHOULD be able to delete their own post (expect 204 No Content)', async () => {
    await api.delete(`/api/posts/${editorPost._id}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .expect(204);
  });
  
  it('Admin SHOULD be able to delete any user\'s post (expect 204 No Content)', async () => {
    // Re-create the editor's post just for this test
    const newEditorPost = new Post({ title: 'Temp Post', body: 'temp', authorId: editorUser._id, authorUsername: editorUser.name });
    await newEditorPost.save();
  
    await api.delete(`/api/posts/${newEditorPost._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });
});

describe('RBAC Permissions: Admin Panel', () => {

  it('Viewer SHOULD NOT be able to access the user list (expect 403 Forbidden)', async () => {
    await api.get('/api/users')
      .set('Authorization', `Bearer ${viewerToken}`)
      .expect(403);
  });

  it('Editor SHOULD NOT be able to access the user list (expect 403 Forbidden)', async () => {
    await api.get('/api/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .expect(403);
  });

  it('Admin SHOULD be able to access the user list (expect 200 OK)', async () => {
    const res = await api.get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
      
    // Should find the 3 users we created
    expect(res.body.length).toBe(3);
    expect(res.body[0].name).toBe('Admin Test');
  });

  it('Admin SHOULD be able to change another user\'s role (expect 200 OK)', async () => {
    const res = await api.put(`/api/users/${viewerUser._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'Editor' })
      .expect(200);
      
    expect(res.body.role).toBe('Editor');
  });

  it('Admin SHOULD NOT be able to change their own role (expect 403 Forbidden)', async () => {
    await api.put(`/api/users/${adminUser._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'Viewer' })
      .expect(403);
  });
});

