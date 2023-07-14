const User = require('../models/user');
const {
  ERROR_DEFAULT,
  MESSAGE_ERROR_DEFAULT,
  sendError,
} = require('../errors/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => sendError(res, err));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error();
      } else {
        res.send(user);
      }
    })
    .catch((err) => sendError(res, err));
};

const updateUserInfo = (req, res, info) => {
  User.findByIdAndUpdate(
    req.user._id,
    info,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new Error();
      } else {
        res.send(user);
      }
    })
    .catch((err) => sendError(res, err));
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
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
};
