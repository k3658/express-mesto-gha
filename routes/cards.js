const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { linkRegex } = require('../utils/regex');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// POST
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkRegex),
  }),
}), createCard);

// GET
cardsRouter.get('/', getCards);

// PUT
cardsRouter.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

// DELETE
cardsRouter.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

cardsRouter.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

module.exports = cardsRouter;
