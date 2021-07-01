const bodyParser = require('body-parser');
const { apiLimiter, createAccountLimiter } = require('../middlewares/limiter');
const { MESSAGE_ERROR_NOT_FOUNDED } = require('../utils/messages');
const { validateLogin, validateCreateUser } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const usersRouter = require('./users/users');
const moviesRouter = require('./movies/movies');
const auth = require('../middlewares/auth');
var cors = require('cors');

module.exports = function routers(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors())

  app.post('/signin', apiLimiter, validateLogin, login);
  app.post('/signup', createAccountLimiter, validateCreateUser, createUser);

  app.use('/users', apiLimiter, usersRouter);
  app.use('/movies', apiLimiter, moviesRouter);

  app.use('*', apiLimiter, auth, (req, res, next) => next(new NotFoundError(MESSAGE_ERROR_NOT_FOUNDED)));
};
