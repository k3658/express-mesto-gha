const rootRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const cardsRouter = require('./cards');

const auth = require('../middlewares/auth');
const { linkRegex } = require('../utils/regex');

rootRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

rootRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

rootRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegex),
  }),
}), createUser);

rootRouter.use('/users', auth, usersRouter);
rootRouter.use('/cards', auth, cardsRouter);

module.exports = rootRouter;
