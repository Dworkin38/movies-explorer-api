const rateLimit = require('express-rate-limit');

module.exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: 'You are doing that too much requests. Please try again in 15 minutes.',
  },
});

module.exports.createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 1000, // start blocking after 5 requests
  message: {
    status: 429,
    error: 'Too many accounts created from this IP, please try again after an hour',
  },
});
