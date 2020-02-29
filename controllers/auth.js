const express = require('express');
const passport = require("../config/ppConfig");
const loggedIn = require("../middleware/isLoggedIn");
const db = require("../models");

const router = express.Router();

// Render logged in home page here
router.get("/home", loggedIn, (req, res) => {
  db.user.findOne({
    where: { id: req.user.id }
  }).then(user => {
    user.getGroups().then(groups => {
      let eventArray = [];
      groups.forEach(group => {
        eventArray.push(group.getEvents());
      });
      Promise.all(eventArray).then(values => {
        let results= values[0];
        if (results.length < 1) {
          res.render("home", { events: [] });
        } else {
          results = results.sort((a, b) => b.dateTime - a.dateTime);
          res.render("home", { events: results });
        }
      }).catch(err => {
        res.render("home", { events: [] });
      });
    }).catch(err => {
        req.flash("error", `Could not get groups ${err}`);
        res.redirect("/");
    });
  }).catch(err => {
    req.flash("error", `Could not find user ${err}`);
    res.redirect("/");
  });
});

router.post("/signup", (req, res) => {
  db.user.findOrCreate({
    where: {
      email:req.body.email
    }, defaults: {
      firstname: req.body.firstName,
      lastname: req.body.lastName,
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
