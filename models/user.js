const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { errorMessages } = require('../errors/errors');

const { linkRegex } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неверный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => linkRegex.test(v),
      message: 'Неверный формат ссылки',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(errorMessages.MESSAGE_ERROR_UNAUTHORIZED);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(errorMessages.MESSAGE_ERROR_UNAUTHORIZED);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
