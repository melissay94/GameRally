const express = require('express');
const moment = require('moment');
const passport = require("../config/ppConfig");
const loggedIn = require("../middleware/isLoggedIn");
const db = require("../models");

const router = express.Router();

// Render logged in home page here
router.get("/home", loggedIn, (req, res) => {
  db.user.findOne({
    where: { id: req.user.id },
    include: [db.group]
  }).then(user => {
    user.getGroups().then(groups => {
      let groupImages = groups.map(group => {
        return group.iconIdentifier;
      });
      let eventArray = [];
      groups.forEach(group => {
        eventArray.push(group.getEvents());
      });
      Promise.all(eventArray).then(values => {
        let results = values;
        let resultObjs = [];
        results.forEach(result => {
          result.forEach(event => {
            event.dateTimeStr = moment(event.dateTime).format("llll");
            resultObjs.push(event);
          });
        });
        if (resultObjs.length < 1) {
          res.render("home", { events: [] });
        } else {
          results = resultObjs.sort((a, b) => a.dateTime - b.dateTime);
          res.render("home", { events: resultObjs, groupIdentifiers: groupImages });
        }
      }).catch(err => {
        res.render("home", { events: [], groupIdentifiers: [] });
      });
    }).catch(err => {
      res.status(400).render("404");
    });
  }).catch(err => {
    res.status(400).render("404");
  });
});

router.post("/signup", (req, res) => {
  if (req.body.password === req.body.confirm) {
    db.user.findOrCreate({
      where: {
        email:req.body.email
      }, defaults: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
      }
    }).then(([user, created]) => {
      if (created) {
        passport.authenticate("local", {
          successRedirect: "/home"
        })(req, res);
      } else {
        req.flash("error", "Email is already in use");
        res.redirect("/");
      }
    }).catch(err => {
      req.flash("error", err.message);
      res.redirect("/");
    });
  } else {
    req.flash("Passwords do not match");
    res.redirect("/");
  }
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: "Invalid username or password"
}));

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have been successfully logged out!");
  res.redirect("/");
});

module.exports = router;
