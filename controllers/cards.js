const Card = require('../models/card');
const {
  ERROR_DEFAULT,
  MESSAGE_ERROR_DEFAULT,
  sendError,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => sendError(res, err));
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error();
      } else {
        res.send({ message: 'Карточка удалена' });
      }
    })
    .catch((err) => sendError(res, err));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error();
      } else {
        res.send({ message: 'Карточка лайкнута' });
      }
    })
    .catch((err) => sendError(res, err));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error();
      } else {
        res.send({ message: 'Лайк убрали' });
      }
    })
    .catch((err) => sendError(res, err));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
