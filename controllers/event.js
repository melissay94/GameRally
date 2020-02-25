const express = require('express');
const db = require("../models");

const router = express.Router();

router.get("/new", (req, res) => {
    // Get the new event form
});

router.post("/new", (req, res) => {
    // Create a new event for the group
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