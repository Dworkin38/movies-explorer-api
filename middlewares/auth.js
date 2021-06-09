const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEFAULT_JWT_SECRET_KEY } = require('../utils/config');
const { MESSAGE_ERROR_AUTHENTICATION_REQUIRED } = require('../utils/messages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(MESSAGE_ERROR_AUTHENTICATION_REQUIRED));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEFAULT_JWT_SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError(MESSAGE_ERROR_AUTHENTICATION_REQUIRED));
  }

  req.user = payload;
  return next();
};
