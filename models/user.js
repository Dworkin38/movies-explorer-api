const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { MESSAGE_ERROR_UNAUTHORIZED_BAD_REQUEST } = require('../utils/messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 2,
    select: false,
  },
  __v: {
    type: Number,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  try {
    const user = await this.findOne({ email }).select('+password').exec();

    if (!user) {
      throw new UnauthorizedError(MESSAGE_ERROR_UNAUTHORIZED_BAD_REQUEST);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new UnauthorizedError(MESSAGE_ERROR_UNAUTHORIZED_BAD_REQUEST);
    }
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = mongoose.model('user', userSchema);
