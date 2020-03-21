const express = require('express');
const router = express.Router();

const statusMessage = require("../util/statusMessage");

router.get('/*', (req, res) =>
    res.json(statusMessage({ code: "REROUTE", value: "/" }))
);

router.delete('/', checkAuthenticated, (req, res) => {
    req.logOut();
    res.json(statusMessage({ message: "Success" }));
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json(statusMessage({ code: "REROUTE", value: "/" }));
}

module.exports = router;