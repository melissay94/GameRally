const express = require('express');
const axios = require("axios");
const db = require("../models");

const router = express.Router();

const dicebearsURL = "https://avatars.dicebear.com/v2/identicon/";

router.get("/", (req, res) => {
    // Render group list
    db.group.findAll().then(groups => {
        res.send(groups);
    }).catch(err => {
        req.flash("error", `Coudn't get groups`);
        res.send(err);
    });
});

router.get("/new", (req, res) => {
   // Render new group form 
   res.send("Where my new group form will go");
});

router.post("/new", (req, res) => {
    // Create new group if one doesn't already exist
    let avatarIdentifier = req.body.name.replace(/\s/g,'');

    db.findOrCreate({
        where: {
            name: req.body.name
        }, defaults: {
            description: req.body.description,
            iconIdentifier: avatarIdentifier,
            maxPlayers: parseInt(req.body.maxPlayers)
        }
    }).then(([group, created]) => {
        if (created) {
            avatarIdentifier = dicebearsURL + avatarIdentifier;
            axios.get(avatarIdentifier).then(apiResponse => {
                continue;
            }).catch(err => {
                req.flash("error", "Could not generate group icon");
            });
            db.user.findOne({
                where: { id: req.user.id }
            }).then(user => {
                user.addGroup(group).then(group => {
                    res.redirect(`/group/${group.id}`);
                }).catch(err => {
                    req.flash("error", `Could not add group to user.`);
                    res.send(err);
                });
            }).catch(err => {
                req.flash("error", "Could not find user");
                res.send(err);
            });
        } else {
            req.flash("error", "Group with that name already exists");
            res.redirect("/group/new");
        }
    }).catch(err => {
        req.flash("error", "Was unable to create new group");
        res.send(err);
    });
});

router.get("/:id", (req, res) => {
    // Get a specific group
    db.group.findOne({
        where: { id: req.params.id }
    }).then(group => {
        if (group) {
            let groupIconURL = dicebearsURL + group.iconIdentifier;
            axios.get(groupIconURL).then(imgResponse => {
                res.send(`group: ${group}, ${imgResponse}`);
            }).catch(err => {
                req.flash("error", "Could not get group icon");
            })
        } else {
            throw "Couldn't find group";
        }
    }).catch(err => {
        req.flash("error", "Couldn't find group")
        res.send(err);
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
                    res.send("Could not find current user");
                } else {
                    currentUser.removeGroups(group)
                }
            } else {
                db.group.destroy({
                    where: {
                        id: req.params.id
                    }
                }).then(numDeleted => {
                    res.redirect("/group");
                }).catch(err => {
                    req.flash("error", "Could not delete group");
                });
            }
        }).catch(err => {
            req.flash("error", "Could not find user to leave group");
            res.send(err);
        });
    }).catch(err => {
        req.flash("error", "Could not find group");
        res.send(err);
    });
});

router.get("/:id/edit", (req, res) => {
    // Get the edit form for a specific group
    res.send("Where my group edit form will go", req.params.id);
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
            req.flash("error", "Unable to update group");
            res.send(err);
        });
    }).catch(err => {
        req.flash("error", "Unable to find group to update");
        res.send(err);
    });
});

module.exports = router;