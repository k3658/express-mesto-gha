const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { errorMessages } = require('../errors/errors');

// AUTHORIZATION
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
        throw new ConflictError(errorMessages.MESSAGE_ERROR_CONFLICT);
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

// GET
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next, info) => {
  User.findById(info)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.MESSAGE_ERROR_NOT_FOUND);
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

// UPDATE
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

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
};
