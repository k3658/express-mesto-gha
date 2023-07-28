const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');
const { errorMessages } = require('../errors/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(errorMessages.MESSAGE_ERROR_UNAUTHORIZED));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError(errorMessages.MESSAGE_ERROR_UNAUTHORIZED));
    return;
  }

  req.user = payload;

  next();
};

module.exports = auth;
