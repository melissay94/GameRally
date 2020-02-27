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
        req.flash("error", "Could not find group")
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
            req.flash("error", "Event could not be created");
        });
    }).catch(err => {
        req.flash("error", "Could not get group");
    })
});

router.get("/games/:eventId", (req, res) => {
    db.event.findOne({
        where: { id: req.params.eventId }
    }).then(event => {
        let games = [];
        if (req.query.game) {
            const gameQuery = `${gameAtlasURL}name=${(req.query.game).toLowerCase()}&client_id=${process.env.GAMEBOARD_ATLAS_API_KEY}`;
            axios.get(gameQuery).then(apiResponse => {
                games = apiResponse.data.games;
                res.render("event/games", { games: games, eventId: event.id });
            }).catch(err => {
                req.flash("error", "Could not access Board Game Atlas");
            });
        } else {
            res.render("event/games", { games: games, eventId: event.id });
        }
    }).catch(err => {
        req.flash("error", "Could not get event");
    });
});

router.post("/games/:eventId", (req, res) => {

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