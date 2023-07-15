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
        res.send({ message: 'Card is deleted' });
      }
    })
    .catch((err) => sendError(res, err));
};

const updateCardData = (req, res, data, msg) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    data,
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error();
      } else {
        res.send({ message: msg });
      }
    })
    .catch((err) => sendError(res, err));
};

const likeCard = (req, res) => {
  updateCardData(
    req,
    res,
    { $addToSet: { likes: req.user._id } },
    'Card is liked',
  );
};

const dislikeCard = (req, res) => {
  updateCardData(
    req,
    res,
    { $pull: { likes: req.user._id } },
    'Card is disliked',
  );
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
