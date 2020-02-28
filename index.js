require('dotenv').config();

const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require("express-session");
const passport = require("./config/ppConfig");
const flash = require("connect-flash");
const helmet = require("helmet");
const methodOverride = require("method-override");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const db = require("./models");
const loggedIn = require("./middleware/isLoggedIn");
const authController = require("./controllers/auth");
const groupController = require("./controllers/group");
const eventController = require("./controllers/event");
const gameController = require("./controllers/game");
const profileController = require("./controllers/profile");

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
app.use(methodOverride("_method"));
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

sessionStore.sync();

app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;

  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.use("/", authController);
app.use("/group", loggedIn, groupController);
app.use("/event", loggedIn, eventController);
app.use("/games", loggedIn, gameController);
app.use("/profile", loggedIn, profileController);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`I took a trip to the port ${port}`));

module.exports = server;
