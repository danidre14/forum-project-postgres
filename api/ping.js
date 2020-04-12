const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("Ping Pong");
    res.json("Pong");
});

module.exports = router;