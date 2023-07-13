const usersRouter = require('express').Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', updateUserProfile);
usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
