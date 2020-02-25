"use strict";

module.exports = (req, res, next) => {
    if (!req.user) {
        req.flash("error", "Please log in to access this page.");
        res.redirect("/");
    } else {
        next();
    }
};