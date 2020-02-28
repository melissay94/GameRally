require('dotenv').config();
const express = require("express");
const axios = require("axios");
const db = require("../models");

const router = express.Router();

const gameAtlasURL = "https://www.boardgameatlas.com/api/search?";

router.get("/new/:groupId", (req, res) => {
    db.group.findOne({
        where: { id: req.params.groupId }
    }).then(group => {
        res.render("event/new", { groupId: req.params.groupId, group: group });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect(`/group/${req.params.groupId}`);
    });
});

router.post("/new/:groupId", (req, res) => {
    db.group.findOne({
        where: { id: req.params.groupId }
    }).then(group => {
        group.createEvent({
            dateTime: req.body.dateTime,
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            isVirtual: req.body.isVirtual,
            groupId: req.params.groupId
        }).then(event => {
            res.redirect(`/event/games/${event.get().id}`);
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect(`/event/new/${req.params.groupId}`);
        });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect(`/group`);
    })
});

router.get("/games/:eventId", (req, res) => {
    db.event.findOne({
        where: { id: req.params.eventId },
        include: 'group'
    }).then(event => {
        let games = [];
        if (req.query.game) {
            const gameQuery = `${gameAtlasURL}name=${(req.query.game).toLowerCase()}&client_id=${process.env.GAMEBOARD_ATLAS_API_KEY}`;
            axios.get(gameQuery).then(apiResponse => {
                games = apiResponse.data.games;
                res.render("event/games", { games: games, event: event, group: event.group });
            }).catch(err => {
                req.flash("error", err.message);
                res.redirect(`/games/${req.params.eventId}`);
            });
        } else {
            res.render("event/games", { games: games, event: event, group: event.group });
        }
    }).catch(err => {
        req.flash("error", err.message)
        res.redirect("/group");
    });
});

router.post("/games/:eventId", (req, res) => {
    db.game.findOrCreate({
        where: { link: req.body.link }, 
        defaults: { name: req.body.name }
    }).then(([game, created]) => {
        db.event.findOne({
            where: { id: req.params.eventId }
        }).then(event => {
            event.addGame(game).then(eventgame => {
                req.flash("success", `Added ${game.name} to ${event.name}`);
                res.redirect(`/event/games/${event.id}`);
            }).catch(err => {
                req.flash("error", err.message);
                res.redirect(`/games/${req.params.eventId}`);
            });
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect("/group");
        });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect(`/event/${req.params.eventId}`);
    });
});

router.get("/:id", (req, res) => {
    db.event.findOne({
        where: { id: req.params.id },
        include: 'group'
    }).then(event => {
        event.getGames().then(games => {
            let gameIdArray = [];
            games.forEach(game => gameIdArray.push(game.link));
            if (gameIdArray.length >= 1) {
                let gameQuery = `${gameAtlasURL}ids=${gameIdArray.join(",")}&client_id=${process.env.GAMEBOARD_ATLAS_API_KEY}`;
                axios.get(gameQuery).then(apiResponse => {
                    res.render("event/show", { event: event, games: apiResponse.data.games, group: event.group });
                }).catch(err => {
                    req.flash("error", err.message);
                    res.redirect("event/show", { event: event, games: [], group: event.group });
                });
            } else {
                res.render("event/show", { event: event, games: [], group: event.group });
            }
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect("event/show", { event: event, games: [], group: event.group });
        });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect("/group");
    });
});

router.delete("/:id", (req, res) => {
    // Delete a specific event page
    db.event.findOne({
        where: { id: req.params.id }
    }).then(event => {
        event.getGames().then(games => {
            event.removeGames(games);
            event.destroy().then(numDeleted => {
                req.flash("success", `Event ${event.name} has been removed.`);
                res.redirect(`/group/${event.groupId}`);
            }).catch(err => {
                req.flash("error", err.message);
                res.redirect(`/group/${event.groupId}`);
            });
        }).catch(err => {
            event.destroy().then(numDeleted => {
                req.flash("success", `Event ${event.name} has been removed.`);
                res.redirect(`/group/${event.groupId}`);
            }).catch(err => {
                req.flash("error", err.message);
                res.redirect(`/group/${event.groupId}`);
            });
        });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect("/group");
    })
})

router.get("/:id/edit", (req, res) => {
    // Get update form for a specific event
    db.event.findOne({
        where: { id: req.params.id }, 
        include: 'group'
    }).then(event => {
        res.render("event/edit", { event: event, group: event.group });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect(`/event/${req.params.id}`);
    });
});

router.put("/:id/edit", (req, res) => {
    // Updates a specific event
    db.event.findOne({
        where: { id: req.params.id }
    }).then(event => {
        event.update({
            dateTime: req.body.dateTime || event.dateTime,
            name: req.body.name || event.name,
            description: req.body.description || event.description,
            location: req.body.location || event.location,
            isVirtual: req.body.isVirtual || event.isVirtual
        }, {
            where: { id: req.params.id }
        }).then(event => {
            req.flash("success", `${event.name} has been updated`);
            res.redirect(`/event/${event.id}`);
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect(`/event/${event.id}`);
        });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect("/group");
    });
});

module.exports = router;