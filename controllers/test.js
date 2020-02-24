const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.send("testing");
});

router.post("/test", (req, res) => {
    res.send("testing");
});

router.get("/:sweetParam", (req, res) => {
    res.send(req.params.sweetParam);
});

module.exports = router;