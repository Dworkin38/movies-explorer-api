require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { DEFAULT_DATA_BASE_URL, DEFAULT_PORT } = require('./utils/config');
const handlerErrors = require('./errors/handlerErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routers = require('./routes/index');

const { PORT = DEFAULT_PORT, DATA_BASE_URL = DEFAULT_DATA_BASE_URL } = process.env;
const app = express();

mongoose.connect(DATA_BASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.use(helmet());

routers(app);

app.use(errorLogger);
app.use(errors());
app.use(handlerErrors);

app.listen(PORT);
