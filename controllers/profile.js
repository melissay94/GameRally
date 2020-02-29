const express = require('express');
const db = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
    // Renders profile page for user
    db.user.findOne({
        where: { id: req.user.id }
    }).then(user => {
        res.render("profile/index", { user: user });
    }).catch(err => {
        req.logout();
        req.flash("error", err.message);
        res.redirect("/");
    });
});

router.delete("/", (req, res) => {
    db.group.findAll({
        include: [{
            model: db.user,
            where: { id: req.user.id }
        }]
    }).then(groups => {
        // foreach group if users.length === 1, then delete group
        let groupCalls = [];
        groupCalls.push(groups.forEach(group => {
            if (group.users.length === 1) {
                group.destroy();
            } else {
                group.removeUsers({
                    where: { id: req.user.id }
                });
            }
        }));

        Promise.all(groupCalls).then(values => {
            db.user.destroy({
                where: { id: req.user.id }
            }).then(numDeleted => {
                req.flash("success", "You have been deleted!");
                req.logout();
                res.redirect("/");
            }).catch(err => {
                req.flash("error", "Could not destroy user");
                res.redirect("/profile");
            })
        });
        // before we delete group, we have to make sure it deletes all events associated with 
        // else remove user association
    }).catch(err => {
        req.logout();
        req.flash("err", err.message);
        res.redirect("/");
    })

});

router.get("/edit", (req, res) => {
    // Renders form for updating user information
    res.send("edit profile");
});

router.put("/edit", (req, res) => {
    // Updates user infomration
})


module.exports = router;