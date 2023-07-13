const ERROR_BAD_REQUEST = 400;
const MESSAGE_ERROR_BAD_REQUEST = { message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля.' };

const ERROR_NOT_FOUND = 404;
const MESSAGE_ERROR_NOT_FOUND = { message: 'Карточка или пользователь не найден или был запрошен несуществующий роут.' };

const ERROR_DEFAULT = 500;
const MESSAGE_ERROR_DEFAULT = { message: 'На сервере произошла ошибка.' };

const sendError = (res, err) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(ERROR_BAD_REQUEST).send(MESSAGE_ERROR_BAD_REQUEST);
    return;
  }
  if (err.name === 'Error') {
    res.status(ERROR_NOT_FOUND).send(MESSAGE_ERROR_NOT_FOUND);
    return;
  }
  res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
};

module.exports = {
  ERROR_DEFAULT,
  MESSAGE_ERROR_DEFAULT,
  sendError,
};
