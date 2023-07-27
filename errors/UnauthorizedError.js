const { ERR0R_UNAUTHORIZED } = require('./errors');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR0R_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
