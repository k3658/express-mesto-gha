const User = require('../models/user');
const {
  ERROR_DEFAULT,
  MESSAGE_ERROR_DEFAULT,
  sendError,
} = require('../errors/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => sendError(res, err));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: MESSAGE_ERROR_DEFAULT }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => sendError(res, err));
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => sendError(res, err));
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => sendError(res, err));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
