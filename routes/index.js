const bodyParser = require('body-parser');
const { apiLimiter, createAccountLimiter } = require('../middlewares/limiter');
const { MESSAGE_ERROR_NOT_FOUNDED } = require('../utils/messages');
const { validateLogin, validateCreateUser } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const usersRouter = require('./users/users');
const moviesRouter = require('./movies/movies');

module.exports = function routers(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/signin', apiLimiter, validateLogin, login);
  app.post('/signup', createAccountLimiter, validateCreateUser, createUser);

  app.use('/users', apiLimiter, usersRouter);
  app.use('/movies', apiLimiter, moviesRouter);

  app.use('*', (req, res, next) => next(new NotFoundError(MESSAGE_ERROR_NOT_FOUNDED)));
};
