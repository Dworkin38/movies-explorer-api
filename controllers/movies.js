const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  MESSAGE_ERROR_BAD_REQUEST,
  MESSAGE_ERROR_MOVIE_NOT_FOUND_BY_ID,
  MESSAGE_ERROR_FORBIDDEN_DELETE_MOVIE,
  MESSAGE_MOVIE_DELETED,
} = require('../utils/messages');

module.exports.getUserMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id }).exec();
    return res.send({ data: movies });
  } catch (error) {
    return next(error);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const owner = req.user._id;

    let movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: owner,
    });
    movie = movie.toJSON();
    delete movie.__v;
    return res.send({ data: movie });
  } catch (error) {
    console.log(error);
    return error.name === 'ValidationError' ? next(new BadRequestError(MESSAGE_ERROR_BAD_REQUEST)) : next(error);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId).exec();

    if (!movie) {
      throw new NotFoundError(MESSAGE_ERROR_MOVIE_NOT_FOUND_BY_ID);
    }

    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError(MESSAGE_ERROR_FORBIDDEN_DELETE_MOVIE);
    }

    const deleteMovie = await Movie.findOneAndRemove({ _id: req.params.movieId }).exec();

    if (!deleteMovie) {
      throw new NotFoundError(MESSAGE_ERROR_MOVIE_NOT_FOUND_BY_ID);
    } else {
      return res.send({ message: MESSAGE_MOVIE_DELETED });
    }
  } catch (error) {
    return next(error);
  }
};
