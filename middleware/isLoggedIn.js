"use strict";

module.exports = (req, res, next) => {
    if (!req.user) {
        req.flash("error", "YOU CAN'T SIT WITH US (unless you log in).");
        res.redirect("/auth/login");
    } else {
        next();
    }
};