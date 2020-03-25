const express = require("express");
const router = express.Router();


router.get("/", checkAuthenticated, (req, res) => {
    try {
        if (req.query.isLoggedIn)
            res.json(req.user && req.user.username ? { message: "Success", username: req.user.username, id: req.user.id } : { message: "Failed" });
        else res.json();
    } catch (e) {
        console.log(e.message)
        res.json({ message: "Error" });
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({ message: "Error", code: "REROUTE", value: "/signin" });
}

module.exports = router;