const mongoose = require('mongoose');

const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const { errorMessages } = require('../errors/errors');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(errorMessages.MESSAGE_ERROR_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errorMessages.MESSAGE_ERROR_NOT_FOUND);
      }
      if (String(card.owner) !== owner) {
        throw new ForbiddenError(errorMessages.MESSAGE_ERROR_FORBIDDEN);
      }
      return Card.deleteOne(card)
        .then(() => res.send({ message: 'Карточка удалена.' }))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(errorMessages.MESSAGE_ERROR_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const updateCardData = (req, res, next, data, msg) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    data,
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(errorMessages.MESSAGE_ERROR_NOT_FOUND));
      } else {
        res.send({ message: msg });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(errorMessages.MESSAGE_ERROR_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const data = { $addToSet: { likes: req.user._id } };

  updateCardData(
    req,
    res,
    next,
    data,
    'Карточка лайкнута.',
  );
};

const dislikeCard = (req, res, next) => {
  const data = { $pull: { likes: req.user._id } };

  updateCardData(
    req,
    res,
    next,
    data,
    'Лайк у карточки убран.',
  );
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
