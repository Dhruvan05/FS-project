// Define role constants
export const Role = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
};

// Example user structure (for reference)
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {'ADMIN' | 'EDITOR' | 'VIEWER'} role
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} authorId
 * @property {string} authorUsername
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {(username: string, password: string) => Promise<void>} login
 * @property {() => void} logout
 */

// Available pages
export const Page = {
  DASHBOARD: 'dashboard',
  ADMIN: 'admin',
};
