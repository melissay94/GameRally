const express = require('express');
const db = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
    // Renders profile page for user
});

router.delete("/", (req, res) => {
    // Deletes user profile and logs user out
});

router.get("/edit", (req, res) => {
    // Renders form for updating user information
});

router.put("/edit", (req, res) => {
    // Updates user infomration
})


module.exports = router;