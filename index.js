require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressWinstom = require('express-winston');
const logger = require('./src/Logger/logger');


const app = express();

const port = process.env.PORT || 4000

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(expressWinstom.logger({
    winstonInstance: logger,
    statusLevels: true
}))

app.use(morgan('dev'));

app.listen(port, () => {
    console.log(`Node.js on port ${port}!`)
});

module.exports = { app };