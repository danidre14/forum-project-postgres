const express = require('express');
const router = express.Router();

const statusMessage = require("../util/statusMessage");

router.get('/*', (req, res) => {
    res.json({ hardReroute: "/" });
    // res.json(statusMessage({ code: "REROUTE", value: "/" }));
});

router.delete('/', checkAuthenticated, (req, res) => {
    const { id: qId, username: qUsername } = req.query;
    const { id, username } = req.user;
    if (id == qId && username == qUsername) {
        req.logOut();
        res.json(statusMessage({ message: "Success" }));
    } else {
        res.json(statusMessage({ message: "Fail" }));
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json({ hardReroute: "/" });
    // res.json(statusMessage({ code: "REROUTE", value: "/" }));
}

module.exports = router;