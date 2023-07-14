const express = require('express');
const mongoose = require('mongoose');

const rootRouter = require('./routes/index');

const { ERROR_NOT_FOUND, MESSAGE_ERROR_NOT_FOUND } = require('./errors/errors');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64af1b69423cf63cde581696',
  };

  next();
});

app.use('/', rootRouter);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send(MESSAGE_ERROR_NOT_FOUND);
});

app.listen(3000);
