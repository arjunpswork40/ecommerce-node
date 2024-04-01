/* eslint-disable no-undef */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multer = require("multer");
const { connectDb } = require("./database/mongoConnector");
const { makeJsonResponse } = require("./utils/response");
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const { isExcludedUrl } = require('./utils/urlMatchCheck');
const cors = require('cors');
const app = express();
app.use(cors());
app.use((req, res, next) => {
  let activeMenu = '';
  if (req.originalUrl.startsWith('/admin')) {
    res.locals.request = req;
    activeMenu = req.path;
    res.locals.activeMenu = activeMenu;
  }
  next();
});


//routes
const testRoute = require('./routes/test')

//user routes
const userAuthRoutes = require('./routes/User/Auth/userAuthRoutes')
const wishlist = require("./routes/User/wishlistRoute")

//user payment routes
const userPaymentRoutes = require('./routes/User/Payments/userPaymentRoutes')

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/alweena',
  collection: 'sessions'
});

store.on('error', function (error) {
  console.log(error);
});


// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true,
  store: store
}));
app.use(flash());


app.use(csrf());
app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});
app.use(function (err, req, res, next) {
  const url = req.url;
  const isExcludedUrlCheck = isExcludedUrl(url)
  if (!isExcludedUrlCheck) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static(__dirname + '/public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

connectDb();

app.use('/test',testRoute)

//user routes

app.use('/user/auth',userAuthRoutes)

app.use ('/user/wishlist',wishlist)

//user payment routes

app.use('/user/payment',userPaymentRoutes)

app.use(express.static('public'))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  const httpStatusCode = 403;
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page

  if (err instanceof multer.MulterError) {
    console.log("MULTER ERROR " + JSON.stringify(err));
  }

  // res.status(err.status || 500);
  // res.render('error');
  const response = makeJsonResponse(err?.message, {}, {}, httpStatusCode, false);
  res.status(httpStatusCode).json(response);
});

const port = process.env.APP_PORT || 3000;

// List all routes
const routes = [];
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    // Routes registered directly on the app object
    routes.push(middleware.route.path);
  } else if (middleware.name === 'router') {
    // Routes added using a router object
    middleware.handle.stack.forEach(handler => {
      const route = handler.route;
      routes.push(route.path);
    });
  }
});




console.log(routes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
