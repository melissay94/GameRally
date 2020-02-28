const express = require('express');
const axios = require("axios");
const db = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
    // Render group list
    db.group.findAll().then(groups => {
        res.render("group/index", { groups: groups });
    }).catch(err => {
        req.flash("error", `Coudn't get groups`);
        res.redirect("/home"); // Need a 404 page at some point
    });
});

router.get("/new", (req, res) => {
   res.render("group/new");
});

router.post("/new", (req, res) => {
    // Create new group if one doesn't already exist
    let avatarIdentifier = req.body.name.replace(/\s/g,'');

    db.group.findOrCreate({
        where: {
            name: req.body.name
        }, defaults: {
            description: req.body.description,
            iconIdentifier: avatarIdentifier,
            maxPlayers: parseInt(req.body.maxPlayers)
        }
    }).then(([group, created]) => {
        if (created) {
            db.user.findOne({
                where: { id: req.user.id }
            }).then(user => {
                user.addGroup(group).then(usergroup => {
                    res.redirect(`/group/${group.id}`);
                }).catch(err => {
                    req.flash("error", `${err.message}`);
                    res.redirect("/group/new");
                });
            }).catch(err => {
                req.flash("error", `${err.message}`);
                res.redirect("/group/new");
            });
        } else {
            req.flash("error", "Group with that name already exists");
            res.redirect("/group/new");
        }
    }).catch(err => {
        req.flash("error", `${err.message}`);
        res.redirect("/group/new");
    });
});

router.get("/:id", (req, res) => {
    // Get a specific group
    db.group.findOne({
        where: { id: req.params.id }
    }).then(group => {
        group.getUsers({
            where: { id: req.user.id }
        }).then(user => {
            if (group) {
                if (user.length > 0) {
                    group.getEvents().then(events => {
                        res.render("group/show", { group: group, events: events, isMember: true });
                    }).catch(err => {
                        res.render("group/show", { group: group, events: [], isMember: true });
                    });
                } else {
                    res.render("group/show", { group: group, events: [], isMember: false });
                }
            } else {
                throw "Couldn't find group";
            }
        });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect("/group");
    });
});

// Add user to group
router.put("/:id", (req, res) => {
    db.group.findOne({
        where: { id: req.params.id}
    }).then(group => {
        db.user.findOne({
            where: { id: req.user.id }
        }).then(user => {
            user.addGroup(group).then(usergroup => {
                res.redirect(`/group/${group.id}`);
            }).catch(err => {
                req.flash("error", `Could not add group to user.`);
                res.redirect(`/group/${group.id}`);
            });
        }).catch(err => {
            req.flash("error", "Could not find user");
            res.redirect(`/group/${group.id}`);
        });
    }).catch(err => {
        req.flash("error", "Could not find group");
        res.redirect(`/group/${group.id}`);
    });
});

// Remove association from user to group and delete group if last user to leave
router.delete("/:id", (req, res) => {
    db.group.findOne({
        where: { id: req.params.id }
    }).then(group => {
        group.getUsers().then(users => {
            if (users.length > 1) {
                let currentUser = null;
                users.forEach(user => {
                    if (user.id === req.user.id) {
                        currentUser = user;
                    } 
                });
                if (!currentUser) {
                    req.flash("error", "No current user found");
                    res.redirect("/");
                } else {
                    currentUser.removeGroups(group);
                    res.redirect("/group");
                }
            } else {
                group.destroy({
                    where: {
                        id: req.params.id
                    }
                }).then(numDeleted => {
                    users[0].removeGroups(group);
                    db.event.destroy({
                        where: {
                            groupId: req.params.id
                        }
                    }).then(numDeleted => {
                        req.flash("success", "The group has been deleted");
                        res.redirect("/group");
                    }).catch(err => {
                        req.flash("error", err.message);
                        res.redirect("/group");
                    });
                }).catch(err => {
                    req.flash("error", err.message);
                    res.redirect("/group");
                });
            }
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect("/");
        });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect("/home");
    });
});

router.get("/:id/edit", (req, res) => {
    // Get the edit form for a specific group
    db.group.findOne({
        where: { id: req.params.id }
    }).then(group => {
        res.render("group/edit", { group: group });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect("/group");
    });
});

router.put("/:id/edit", (req, res) => {
    // Update a specific group
    db.group.findOne({
        where: { id: req.params.id }
    }).then(group => {
        db.group.update({
            name: req.body.name || group.name,
            description: req.body.description || group.description,
            maxPlayers: parseInt(req.body.maxPlayers) || group.maxPlayers
        }, { 
            where: { id: group.id }
        }).then(group => {
            res.redirect(`/group/${req.params.id}`);
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect(`/group/${req.params.id}`);
        });
    }).catch(err => {
        req.flash("error", "Unable to find group to update");
        res.redirect("/group");
    });
});

module.exports = router;
