const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const indexRouter = require('./routes/index');

const app = express();

app.use(helmet());
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// Don't serve favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error message
  res.status(err.status || 500).json({err:res.locals.message} || {err:"General Service Error"});
});

module.exports = app;
