const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator: (url) => isURL(url, { require_protocol: true }),
      message: 'Неправильный формат ссылки',
    },
  },
  trailer: {
    type: String,
    require: true,
    validate: {
      validator: (url) => isURL(url, { require_protocol: true }),
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (url) => isURL(url, { require_protocol: true }),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  movieId: {
    type: String,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
  __v: {
    type: Number,
    select: false,
  },
});

module.exports = mongoose.model('movie', movieSchema);
