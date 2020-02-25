const express = require('express');
const passport = require("../config/ppConfig");
const loggedIn = require("../middleware/isLoggedIn");
const db = require("../models");

const router = express.Router();

router.get("/home", loggedIn, (req, res) => {
  // Render logged in home page here
});

router.post("/signup", (req, res) => {
  db.user.findOrCreate({
    where: {
      email:req.body.email
    }, defaults: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }
  }).then(([user, created]) => {
    if (created) {
      passport.authenticate("local", {
        successRedirect: "/home",
        successFlash: "Thanks for signing up!"
      })(req, res);
    } else {
      req.flash("error", "Email is already in use");
      res.redirect("/");
    }
  }).catch(err => {
    req.flash("error", "Error occured creating user");
    res.redirect("/");
  })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  successFlash: "Welcome back",
  failureFlash: "Invalid username or password"
}));

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have been successfully logged out!");
  res.redirect("/");
});

module.exports = router;
