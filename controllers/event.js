require('dotenv').config();
const express = require("express");
const axios = require("axios");
const moment = require("moment");
const db = require("../models");

const router = express.Router();

const gameAtlasURL = "https://www.boardgameatlas.com/api/search?";

router.get("/new/:groupId", (req, res) => {
    db.group.findOne({
        where: { id: req.params.groupId }
    }).then(group => {
        eventMin = moment().format("YYYY-MM-DDTkk:mm");
        res.render("event/new", { groupId: req.params.groupId, group: group });
    }).catch(err => {
        res.status(400).render("404");
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
            groupId: req.params.groupId,
            userId: req.user.id
        }).then(event => {
            res.redirect(`/games/${event.get().id}`);
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect(`/event/new/${req.params.groupId}`);
        });
    }).catch(err => {
        res.status(400).render("404");
    });
});

router.get("/:id", (req, res) => {
    db.event.findOne({
        where: { id: req.params.id },
        include: 'group'
    }).then(event => {
        event.dateTimeStr = moment(event.dateTime).format("llll");
        event.getGames().then(games => {
            let gameIdArray = [];
            games.forEach(game => gameIdArray.push(game.link));
            if (gameIdArray.length >= 1) {
                let gameQuery = `${gameAtlasURL}ids=${gameIdArray.join(",")}&client_id=${process.env.GAMEBOARD_ATLAS_API_KEY}`;
                axios.get(gameQuery).then(apiResponse => {
                    res.render("event/show", { event: event, games: apiResponse.data.games, group: event.group, dbIds: games });
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
        res.status(400).render("404");
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
        res.status(400).render("404");
    })
})

router.get("/:id/edit", (req, res) => {
    // Get update form for a specific event
    db.event.findOne({
        where: { id: req.params.id }, 
        include: 'group'
    }).then(event => {
        event.dateTimeMin = moment().format("YYYY-MM-DDTkk:mm");
        event.dateTimeStr = moment(event.dateTime).format("YYYY-MM-DDTkk:mm:ss");
        res.render("event/edit", { event: event, group: event.group });
    }).catch(err => {
        res.status(400).render("404");
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
        res.status(400).render("404");
    });
});

module.exports = router;