const dbconfig = require("./config/db.config.js");

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var coursesRouter = require("./routes/courses");
var cors = require("cors");

process.env.PORT = 3001;

var app = express();

const cor = cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true
});
app.use(cor);
app.options("*", cor);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var mysql = require("mysql");
//Database connection
app.use(function(req, res, next) {
  res.locals.connection = mysql.createConnection({
    host: dbconfig.HOST,
    user: dbconfig.USER,
    password: dbconfig.PASSWORD,
    database: dbconfig.DB
  });
  res.locals.connection.connect();
  next();
});
app.use("/courseapi/", indexRouter);
app.use("/courseapi/courses", coursesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
