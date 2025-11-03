const morgan = require('morgan');
const crypto = require('crypto');

/**
 * Middleware to generate a unique correlation ID for each request
 * and attach it to the request and response.
 */
const correlationId = (req, res, next) => {
  // Generate a unique ID
  const id = crypto.randomUUID();
  req.id = id;
  
  // Set it on the response header so the client/browser can see it
  res.setHeader('X-Correlation-ID', id);
  next();
};

// --- Structured Logger Setup ---

// 1. Define a token for morgan to get the correlation ID from the request
morgan.token('id', (req) => req.id);

// 2. Define a token to get the authenticated user ID (or 'anonymous')
morgan.token('user', (req) => (req.user ? req.user.id : 'anonymous'));

// 3. Define the structured JSON format for our logs
const jsonFormat = {
  corr_id: ':id',
  user_id: ':user',
  remote_addr: ':remote-addr',
  method: ':method',
  url: ':url',
  http_version: ':http-version',
  status: ':status',
  content_length: ':res[content-length]',
  referrer: ':referrer',
  user_agent: ':user-agent',
  response_time_ms: ':response-time',
};

/**
 * The logger middleware, configured to output structured JSON.
 */
const logger = morgan(JSON.stringify(jsonFormat), {
  stream: {
    // Use console.log (or console.info) to output to stdout
    write: (message) => {
      console.log(message.trim());
    },
  },
});

module.exports = {
  correlationId,
  logger,
};
