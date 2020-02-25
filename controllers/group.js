const express = require('express');
const db = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
    // Render group list
});

router.get("/new", (req, res) => {
   // Render new group form 
});

router.post("/new", (req, res) => {
    // Create new group if one doesn't already exist
});

router.get("/:id", (req, res) => {
    // Get a specific group
});

router.delete("/:id", (req, res) => {
    // Delete a specific group
});

router.get("/:id/edit", (req, res) => {
    // Get the edit form for a specific group
});

router.put("/:id/edit", (req, res) => {
    // Update a specific group
});

module.exports = router;