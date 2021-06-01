const express = require('express');
const bodyParser = require('body-parser');

const { PORT = 3001 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {

});
