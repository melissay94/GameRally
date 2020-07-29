require('dotenv').config();
const express = require("express");
const axios = require("axios");
const db = require("../models");

const router = express.Router();

const gameAtlasURL = "https://api.boardgameatlas.com/api/search?";

router.get("/:eventId", (req, res) => {
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
        res.status(400).render("404");
    });
});

router.post("/:eventId", (req, res) => {
    db.game.findOrCreate({
        where: { link: req.body.link }, 
        defaults: { name: req.body.name }
    }).then(([game, created]) => {
        db.event.findOne({
            where: { id: req.params.eventId }
        }).then(event => {
            event.addGame(game).then(eventgame => {
                db.group.findOne({
                    where: { id: event.groupId }
                }).then(group => {
                    group.addGame(game).then(groupgame => {
                        req.flash("success", `Added ${game.name} to ${event.name}`);
                        res.redirect(`/games/${event.id}`);
                    }).catch(err => {
                        req.flash("success", `Added ${game.name} to ${event.name}`);
                        res.redirect(`/games/${event.id}`);
                    });
                }).catch(err => {
                    req.flash("success", `Added ${game.name} to ${event.name}`);
                    res.redirect(`/games/${event.id}`);
                });
            }).catch(err => {
                req.flash("error", err.message);
                res.redirect(`/games/${req.params.eventId}`);
            });
        }).catch(err => {
            res.status(400).render("404");
        });
    }).catch(err => {
        req.flash("error", err.message);
        res.redirect(`/event/${req.params.eventId}`);
    });
});

router.put("/:eventId", (req, res) => {
    db.event.findOne({
        where: { id: req.params.eventId }
    }).then(event => {
        event.getGames({
            where: { id: req.body.id }
        }).then(game => {
            event.removeGames(game).then(numDeleted => {
                req.flash("success", `${game[0].name} was removed from ${event.name}`);
                res.redirect(`/event/${req.params.eventId}`);
            }).catch(err => {
                req.flash("error", err.message);
                res.redirect(`/event/${req.params.eventId}`);
            });
        }).catch(err => {
            req.flash("error", err.message);
            res.redirect(`/event/${req.params.eventId}`);
        });
    }).catch(err => {
        res.status(400).render("404");
    });
});

module.exports = router;
