// Define role constants
export const Role = {
  // Corrected to match server/database roles
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

// Example user structure (for reference)
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {'Admin' | 'Editor' | 'Viewer'} role // Corrected types
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
