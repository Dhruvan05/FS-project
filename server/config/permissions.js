// Define actions like 'posts:create', 'posts:read', 'posts:update', 'posts:delete', 'admin:manageUsers'
module.exports = {
  Admin: {
    'posts:create': true,
    'posts:read': true,
    'posts:update': true,
    'posts:delete': true,
    'admin:manageUsers': true
  },
  Editor: {
    'posts:create': true,
    'posts:read': true,
    // Editors can update/delete only their own posts
    'posts:update': 'own',
    'posts:delete': 'own',
    'admin:manageUsers': false
  },
  Viewer: {
    'posts:create': false,
    'posts:read': true,
    'posts:update': false,
    'posts:delete': false,
    'admin:manageUsers': false
  }
};
