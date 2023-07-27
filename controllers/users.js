const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { DefaultError } = require('../errors/DefaultError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');
const { errorMessages } = require('../errors/errors');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(errorMessages.MESSAGE_ERROR_CONFLICT));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DefaultError).send(errorMessages.MESSAGE_ERROR_DEFAULT));
};

const getUser = (req, res, next, info) => {
  User.findById(info)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(errorMessages.MESSAGE_ERROR_NOT_FOUND));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  getUser(req, res, next, req.params.userId);
};

const getCurrentUser = (req, res, next) => {
  getUser(req, res, next, req.user._id);
};

const updateUserInfo = (req, res, info, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    info,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(errorMessages.MESSAGE_ERROR_NOT_FOUND));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  updateUserInfo(req, res, { name, about });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  updateUserInfo(req, res, { avatar });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ message: 'Logged in' });
    })
    .catch(next);
};

module.exports = {
  login,
  createUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
};
