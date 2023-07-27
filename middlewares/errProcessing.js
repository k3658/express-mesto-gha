const { statusCodes, errorMessages } = require('../errors/errors');

const errProcessing = (err, req, res, next) => {
  const { statusCode = statusCodes.ERROR_DEFAULT, message } = err;

  if (err.code === 11000) {
    res.status(statusCodes.ERROR_CONFLICT).send({ message: errorMessages.MESSAGE_ERROR_CONFLICT });
    return;
  }
  if (statusCode === statusCodes.ERROR_DEFAULT) {
    res.status(statusCodes.ERROR_DEFAULT).send({ message: errorMessages.MESSAGE_ERROR_DEFAULT });
    return;
  }

  res.status(statusCode).send({ message });

  next();
};

module.exports = errProcessing;
