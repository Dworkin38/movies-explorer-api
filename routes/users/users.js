const usersRouter = require('express').Router();
const { getUserMe, updateUserMe } = require('../../controllers/users');
const auth = require('../../middlewares/auth');
const { validateUpdateUserMe } = require('../../middlewares/validation');

usersRouter.get('/me', auth, getUserMe);
usersRouter.patch('/me', auth, validateUpdateUserMe, updateUserMe);

module.exports = usersRouter;
