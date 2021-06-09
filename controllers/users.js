const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEFAULT_JWT_SECRET_KEY } = require('../utils/config');
const {
  MESSAGE_ERROR_BAD_REQUEST,
  MESSAGE_ERROR_USER_NOT_FOUND_BY_ID,
  MESSAGE_ERROR_ACCOUNT_ALREADY_EXISTS,
} = require('../utils/messages');

module.exports.getUserMe = async (req, res, next) => {
  try {
    const getUserById = await User.findById(req.user._id).exec();

    if (!getUserById) {
      throw new NotFoundError(MESSAGE_ERROR_USER_NOT_FOUND_BY_ID);
    } else {
      return res.send({
        data: getUserById,
      });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports.updateUserMe = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const updateUserMe = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

    if (!updateUserMe) {
      throw new NotFoundError(MESSAGE_ERROR_USER_NOT_FOUND_BY_ID);
    } else {
      return res.send({
        data: updateUserMe,
      });
    }
  } catch (error) {
    return error.name === 'ValidationError' ? next(new BadRequestError(MESSAGE_ERROR_BAD_REQUEST)) : next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    return res.send({ data: user });
  } catch (error) {
    if (error.code && error.code === 11000) {
      return next(new ConflictError(MESSAGE_ERROR_ACCOUNT_ALREADY_EXISTS));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequestError(MESSAGE_ERROR_BAD_REQUEST));
    }
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : DEFAULT_JWT_SECRET_KEY,
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch (error) {
    return next(error);
  }
};
