const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64af1b69423cf63cde581696',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(3000);
