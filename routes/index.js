const rootRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./users');
const { createUser, login } = require('../controllers/users');
const cardsRouter = require('./cards');

const auth = require('../middlewares/auth');
const { linkRegex } = require('../utils/regex');

const NotFoundError = require('../errors/NotFoundError');
const { errorMessages } = require('../errors/errors');

rootRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

rootRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegex),
  }),
}), createUser);

rootRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

rootRouter.use('/users', auth, usersRouter);
rootRouter.use('/cards', auth, cardsRouter);

rootRouter.use((req, res) => {
  res.status(NotFoundError).send(errorMessages.MESSAGE_ERROR_NOT_FOUND);
});

module.exports = rootRouter;
