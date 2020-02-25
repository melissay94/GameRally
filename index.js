require('dotenv').config();

const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require("express-session");
const passport = require("./config/ppConfig");
const flash = require("connect-flash");
const helmet = require("helmet");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const db = require("./models");
const loggedIn = require("./middleware/isLoggedIn");
const authController = require("./controllers/auth");

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

app.get('/', (req, res) => {
  res.render('index');
});

app.use("/", authController);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`I took a trip to the port ${port}`));

module.exports = server;
