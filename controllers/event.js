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
        where: { id: req.params.eventId }
    }).then(event => {
        db.group.findOne({
            where: { id: event.groupId }
        }).then(group => {
            let games = [];
            if (req.query.game) {
                const gameQuery = `${gameAtlasURL}name=${(req.query.game).toLowerCase()}&client_id=${process.env.GAMEBOARD_ATLAS_API_KEY}`;
                axios.get(gameQuery).then(apiResponse => {
                    games = apiResponse.data.games;
                    res.render("event/games", { games: games, event: event, group: group });
                }).catch(err => {
                    req.flash("error", err.message);
                    res.redirect(`/games/${req.params.eventId}`);
                });
            } else {
                res.render("event/games", { games: games, event: event, group: group });
            }
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect("/group");
        })
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
    // Get a specific event page
});

router.delete("/:id", (req, res) => {
    // Delete a specific event page
})

router.get("/:id/edit", (req, res) => {
    // Get update form for a specific event
});

router.put("/:id/edit", (req, res) => {
    // Updates a specific event
});

module.exports = router;