const RolePermissions = require('../config/permissions');

function authorize(action, opts = {}) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    const perms = RolePermissions[req.user.role] || {};
    const rule = perms[action];
    if (rule === true) return next();
    if (rule === 'own' && opts.ownership) {
      // route should have set req.resourceAuthorId
      if (!req.resourceAuthorId) return res.status(403).json({ error: 'Ownership required but not available' });
      if (String(req.user.id) === String(req.resourceAuthorId)) return next();
      return res.status(403).json({ error: 'Forbidden (ownership)' });
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
}

module.exports = authorize;
