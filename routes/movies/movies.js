const moviesRouter = require('express').Router();
const { getUserMovies, createMovie, deleteMovie } = require('../../controllers/movies');
const auth = require('../../middlewares/auth');
const { validateCreateMovie, validateDeleteMovie } = require('../../middlewares/validation');

moviesRouter.get('/', auth, getUserMovies);
moviesRouter.post('/', auth, validateCreateMovie, createMovie);
moviesRouter.delete('/:movieId', auth, validateDeleteMovie, deleteMovie);

module.exports = moviesRouter;
