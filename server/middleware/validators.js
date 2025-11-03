const { body, param, validationResult } = require('express-validator');

// Middleware to handle the result of any validation chain
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validator for Mongo ObjectIDs passed in URL params
const validateMongoId = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];

// Validator for login
const validateLogin = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Validator for creating/updating a post
const validatePost = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('body').notEmpty().trim().withMessage('Body is required'),
  handleValidationErrors,
];

// Validator for updating a user's role
const validateRoleUpdate = [
  body('role')
    .isIn(['Admin', 'Editor', 'Viewer'])
    .withMessage('Role must be one of: Admin, Editor, or Viewer'),
  handleValidationErrors,
];

module.exports = {
  validateMongoId,
  validateLogin,
  validatePost,
  validateRoleUpdate,
};
