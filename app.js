const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const rootRouter = require('./routes/index');

const errProcessing = require('./middlewares/errProcessing');
const { NotFoundError } = require('./errors/NotFoundError');
const { errorMessages } = require('./errors/errors');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.use(helmet());
app.use(express.json());

app.use('/', rootRouter);
app.use((req, res) => {
  res.status(NotFoundError).send(errorMessages.MESSAGE_ERROR_NOT_FOUND);
});

app.use(errors());
app.use(errProcessing);

app.listen(PORT);
