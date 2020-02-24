require('dotenv').config();

const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require("express-session");
const passport = require("./config/ppConfig");
const flash = require("connect-flash");
const helmet = require("helmet");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const db = require("./models");
const authController =  require('./controllers/auth');
const testController = require("./controllers/test");
const loggedIn = require("./middleware/isLoggedIn");

const app = express();

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30
});

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.use(helmet());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use(passport.initialize()); // Has to be after the session use 
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;

  next();
});

sessionStore.sync();

app.get('/', function(req, res) {
  console.log(`User is ${req.user ? req.user.name : "not logged in"}`);
  res.render('index');
});

app.get('/profile', loggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', authController);
app.use("/", loggedIn, testController);

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
