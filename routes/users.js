const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { linkRegex } = require('../utils/regex');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

// GET
usersRouter.get('/', getUsers);

usersRouter.get('/me', getCurrentUser);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

// PATCH
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(linkRegex),
  }),
}), updateUserAvatar);

module.exports = usersRouter;
