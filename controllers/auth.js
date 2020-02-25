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
        group.getEvents().then(events => {
          eventArray.push(...events);
          if (eventArray.length < 1) {
            req.flash("error", "You have no upcoming events");
            res.send("home");
          } else {
            eventArray = eventArray.sort((a, b) => b.datetime - a.datetime);
            res.send(eventArray);
          }
        }).catch(err => {
            req.flash("error", `Could not get events ${err.message}`);
            res.send(`Events error: ${err}`);
        });
      });
    }).catch(err => {
        req.flash("error", `Could not get groups ${err.message}`);
        res.send(`Groups error: ${err}`);
    });
  }).catch(err => {
    req.flash("error", `Could not find user ${error.message}`);
    res.send(`User error: ${err}`);
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
