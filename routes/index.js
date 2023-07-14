const rootRouter = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

rootRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

rootRouter.use('/users', usersRouter);
rootRouter.use('/cards', cardsRouter);

module.exports = rootRouter;
